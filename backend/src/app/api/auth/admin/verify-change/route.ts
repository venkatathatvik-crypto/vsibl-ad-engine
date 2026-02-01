import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

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
        const { token, newEmail, newPassword } = await req.json();

        // 1. Find and validate token
        const vt = await prisma.verificationToken.findUnique({
            where: { token },
        });

        if (!vt || vt.expiresAt < new Date()) {
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400, headers: CORS_HEADERS });
        }

        if (vt.type !== 'ADMIN_CREDENTIAL_CHANGE') {
            return NextResponse.json({ error: 'Invalid token type' }, { status: 400, headers: CORS_HEADERS });
        }

        // 2. Locate the unique admin
        const admin = await prisma.user.findFirst({
            where: { role: 'ADMIN' },
        });

        if (!admin) {
            return NextResponse.json({ error: 'Admin not found' }, { status: 404, headers: CORS_HEADERS });
        }

        // 3. Update admin credentials
        const updateData: any = {};
        if (newEmail) updateData.email = newEmail;
        if (newPassword) {
            updateData.password = await bcrypt.hash(newPassword, 10);
        }

        await prisma.user.update({
            where: { id: admin.id },
            data: updateData,
        });

        // 4. Cleanup token
        await prisma.verificationToken.delete({
            where: { id: vt.id },
        });

        // 5. Revoke all existing sessions for safety after credential change
        await prisma.refreshToken.deleteMany({
            where: { userId: admin.id },
        });

        return NextResponse.json({ message: 'Admin credentials updated successfully' }, { status: 200, headers: CORS_HEADERS });

    } catch (error) {
        console.error('Verify change error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: CORS_HEADERS });
    }
}
