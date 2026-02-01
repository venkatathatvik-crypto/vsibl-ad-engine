import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { comparePassword, hashPassword } from '@/lib/auth';

const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:8080';
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
        const { email, otp, newPassword } = await req.json();

        if (!email || !otp || !newPassword) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400, headers: CORS_HEADERS });
        }

        // 1. Find recent verification request
        const request = await prisma.verificationRequest.findFirst({
            where: {
                email,
                verifiedAt: null,
                expiresAt: { gt: new Date() },
            },
            orderBy: { createdAt: 'desc' },
        });

        if (!request) {
            return NextResponse.json({ error: 'Verification request expired or invalid' }, { status: 400, headers: CORS_HEADERS });
        }

        // 2. Check Attempts
        if (request.attempts >= 5) {
            return NextResponse.json({ error: 'Too many failed attempts. Please request a new code.' }, { status: 429, headers: CORS_HEADERS });
        }

        // 3. Verify OTP
        const isValid = await comparePassword(otp, request.code);

        if (!isValid) {
            await prisma.verificationRequest.update({
                where: { id: request.id },
                data: { attempts: { increment: 1 } }
            });
            return NextResponse.json({ error: 'Invalid verification code' }, { status: 400, headers: CORS_HEADERS });
        }

        // 4. Verification Successful - Perform Reset
        const hashedPassword = await hashPassword(newPassword);

        await prisma.$transaction(async (tx) => {
            // Find User
            const user = await tx.user.findUnique({
                where: { email },
                include: { identities: true }
            });

            if (!user) throw new Error('User not found during reset');

            // a. Update or Create PASSWORD identity
            const passwordId = user.identities.find(id => id.provider === 'PASSWORD');
            if (passwordId) {
                await tx.authIdentity.update({
                    where: { id: passwordId.id },
                    data: { credential: hashedPassword }
                });
            } else {
                await tx.authIdentity.create({
                    data: {
                        userId: user.id,
                        provider: 'PASSWORD',
                        providerId: email,
                        credential: hashedPassword
                    }
                });
            }

            // b. Mark request as verified
            await tx.verificationRequest.update({
                where: { id: request.id },
                data: { verifiedAt: new Date() }
            });

            // c. GLOBAL TOKEN REVOCATION (Constraint: Invalidate all existing sessions)
            await tx.user.update({
                where: { id: user.id },
                data: { tokenVersion: { increment: 1 } }
            });

            await tx.refreshToken.deleteMany({
                where: { userId: user.id }
            });
        });

        return NextResponse.json({
            message: 'Password reset successful. You can now log in with your new credentials.'
        }, { status: 200, headers: CORS_HEADERS });

    } catch (error: any) {
        console.error('Recovery Verification Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: CORS_HEADERS });
    }
}
鼓
鼓
鼓
鼓
