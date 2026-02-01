import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendMail, generateOTP } from '@/lib/mail';
import { hashPassword } from '@/lib/auth'; // Using hashPassword for OTP storage too

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
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400, headers: CORS_HEADERS });
        }

        // 1. Check if user exists (Security: Don't reveal if user exists in the response)
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // Return success even if user doesn't exist to prevent enumeration
            return NextResponse.json({ message: 'If this email is registered, you will receive an OTP shortly.' }, { status: 200, headers: CORS_HEADERS });
        }

        // 2. Generate OTP
        const otp = generateOTP();
        const hashedOtp = await hashPassword(otp);
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // 3. Store Recovery Request
        // Scoped to the request, not the user
        await prisma.verificationRequest.create({
            data: {
                email,
                code: hashedOtp,
                type: user.role === 'ADMIN' ? 'ADMIN_RECOVERY' : 'PASSWORD_RESET',
                expiresAt,
            },
        });

        // 4. Send Email
        await sendMail({
            to: email,
            subject: 'VSIBL Security: Your One-Time Password',
            text: `Your VSIBL verification code is ${otp}. It will expire in 10 minutes.`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #4A0025;">VSIBL Security</h2>
                    <p>You requested a password reset for your VSIBL account.</p>
                    <div style="background: #f9f9f9; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4A0025;">${otp}</span>
                    </div>
                    <p style="color: #666; font-size: 14px;">This code expires in 10 minutes. If you did not request this, please ignore this email.</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #999;">© 2026 VSIBL Ad Engine. All rights reserved.</p>
                </div>
            `,
        });

        return NextResponse.json({
            message: 'If this email is registered, you will receive an OTP shortly.'
        }, { status: 200, headers: CORS_HEADERS });

    } catch (error: any) {
        console.error('Recovery Request Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: CORS_HEADERS });
    }
}
鼓
鼓
鼓
鼓
