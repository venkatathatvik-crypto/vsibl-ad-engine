import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { comparePassword, generateAccessToken, generateRefreshToken } from '@/lib/auth';

export const runtime = "nodejs";

const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:5173';

function getCorsHeaders(req: Request) {
    const origin = req.headers.get('origin') || allowedOrigin;
    return {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
    };
}

export async function OPTIONS(req: Request) {
    return NextResponse.json({}, { status: 200, headers: getCorsHeaders(req) });
}

export async function POST(req: Request) {
    try {
        const corsHeaders = getCorsHeaders(req);
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400, headers: corsHeaders }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email },
            include: { identities: true }
        });

        // 1️⃣ Signup-first rule: Reject if user does not exist
        if (!user) {
            return NextResponse.json(
                { error: 'Account does not exist. Please sign up first.' },
                { status: 404, headers: corsHeaders }
            );
        }

        // 2️⃣ Find the PASSWORD identity
        const passwordIdentity = user.identities.find(id => id.provider === 'PASSWORD');

        if (!passwordIdentity || !passwordIdentity.credential) {
            return NextResponse.json(
                { error: 'This account uses a different login method. Please sign in with Google or recovery.' },
                { status: 400, headers: corsHeaders }
            );
        }

        const isValid = await comparePassword(password, passwordIdentity.credential);

        // 3️⃣ Login failure behavior: Invalid credentials
        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401, headers: corsHeaders }
            );
        }

        // 4️⃣ Login success behavior
        const accessToken = generateAccessToken({
            userId: user.id,
            email: user.email,
            role: user.role,
            tokenVersion: user.tokenVersion
        });

        const { token: refreshToken, hashedToken, expiresAt } = generateRefreshToken();

        await prisma.refreshToken.create({
            data: {
                hashedToken,
                userId: user.id,
                expiresAt,
            },
        });

        return NextResponse.json({
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            },
            token: accessToken,
            refreshToken,
        }, { status: 200, headers: corsHeaders });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500, headers: getCorsHeaders(req) }
        );
    }
}
