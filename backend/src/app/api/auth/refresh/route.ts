import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateAccessToken, generateRefreshToken, hashToken } from '@/lib/auth';

export const runtime = "nodejs";

const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:5173';

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
    return NextResponse.json({}, { status: 200, headers: CORS_HEADERS });
}

export async function POST(req: Request) {
    try {
        const { refreshToken } = await req.json();

        if (!refreshToken) {
            return NextResponse.json({ error: 'Refresh token required' }, { status: 400, headers: CORS_HEADERS });
        }

        const hashedToken = hashToken(refreshToken);

        const tokenRecord = await prisma.refreshToken.findUnique({
            where: { hashedToken },
            include: { user: true },
        });

        if (!tokenRecord) {
            return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401, headers: CORS_HEADERS });
        }

        // 3️⃣ Token Rotation & Reuse Detection
        if (tokenRecord.revoked) {
            // CRITICAL: Reuse detected! Revoke ALL tokens for this user.
            await prisma.refreshToken.updateMany({
                where: { userId: tokenRecord.userId },
                data: { revoked: true },
            });
            console.warn(`Token reuse detected for user ${tokenRecord.userId}. All tokens revoked.`);
            return NextResponse.json({ error: 'Token reused - access denied' }, { status: 401, headers: CORS_HEADERS });
        }

        if (new Date() > tokenRecord.expiresAt) {
            return NextResponse.json({ error: 'Refresh token expired' }, { status: 401, headers: CORS_HEADERS });
        }

        // Rotate: Revoke old, Issue new
        const newAccessToken = generateAccessToken({
            userId: tokenRecord.user.id,
            email: tokenRecord.user.email,
            role: tokenRecord.user.role
        });

        const { token: newRefreshToken, hashedToken: newHashedToken, expiresAt } = generateRefreshToken();

        // Transaction: Revoke old and create new
        await prisma.$transaction([
            prisma.refreshToken.update({
                where: { id: tokenRecord.id },
                data: { revoked: true },
            }),
            prisma.refreshToken.create({
                data: {
                    hashedToken: newHashedToken,
                    userId: tokenRecord.userId,
                    expiresAt,
                },
            }),
        ]);

        return NextResponse.json({
            token: newAccessToken,
            refreshToken: newRefreshToken,
        }, { status: 200, headers: CORS_HEADERS });

    } catch (error) {
        console.error('Refresh error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: CORS_HEADERS });
    }
}
