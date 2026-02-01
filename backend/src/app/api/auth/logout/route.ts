import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashToken } from '@/lib/auth';

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
            return NextResponse.json({ message: 'Logged out' }, { status: 200, headers: CORS_HEADERS });
        }

        const hashedToken = hashToken(refreshToken);

        // Find and revoke if exists
        // We use updateMany to avoid error if not found (idempotent)
        await prisma.refreshToken.update({
            where: { hashedToken },
            data: { revoked: true },
        }).catch(() => {
            // If not found, ignore
        });

        return NextResponse.json({ message: 'Logged out successfully' }, { status: 200, headers: CORS_HEADERS });

    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: CORS_HEADERS });
    }
}
