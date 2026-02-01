import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendVerificationEmail } from '@/lib/mail';
import crypto from 'crypto';

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
        const { email } = await req.json();

        // 1. Verify this is the admin's current email
        const admin = await prisma.user.findFirst({
            where: { email, role: 'ADMIN' },
        });

        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized: Admin email not found' }, { status: 403, headers: CORS_HEADERS });
        }

        // 2. Generate a 6-digit numeric token
        const token = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        // 3. Save to database
        await prisma.verificationToken.upsert({
            where: { token },
            update: {
                token,
                expiresAt,
                type: 'ADMIN_CREDENTIAL_CHANGE'
            },
            create: {
                email,
                token,
                expiresAt,
                type: 'ADMIN_CREDENTIAL_CHANGE'
            }
        });

        // 4. Send email
        await sendVerificationEmail(email, token);

        return NextResponse.json({ message: 'Verification code sent to existing admin email' }, { status: 200, headers: CORS_HEADERS });

    } catch (error) {
        console.error('Request change error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: CORS_HEADERS });
    }
}
