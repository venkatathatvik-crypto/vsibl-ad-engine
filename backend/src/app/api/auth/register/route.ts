import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, generateAccessToken, generateRefreshToken } from '@/lib/auth';

export const runtime = "nodejs";

const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:8081';

function getCorsHeaders(req: Request) {
    const origin = req.headers.get('origin') || allowedOrigin;
    return {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
}

export async function OPTIONS(req: Request) {
    return NextResponse.json({}, { status: 200, headers: getCorsHeaders(req) });
}

export async function POST(req: Request) {
    const corsHeaders = getCorsHeaders(req);
    try {
        const { email, password, name, role } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400, headers: corsHeaders });
        }

        if (role && role !== 'CLIENT') {
            return NextResponse.json({ error: 'Invalid role for signup' }, { status: 400, headers: corsHeaders });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400, headers: corsHeaders });
        }

        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                email,
                name,
                role: 'CLIENT',
                identities: {
                    create: {
                        provider: 'PASSWORD',
                        providerId: email,
                        credential: hashedPassword
                    }
                }
            },
        });

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
            message: 'User created successfully',
            user: { id: user.id, email: user.email, name: user.name, role: user.role },
            token: accessToken,
            refreshToken,
        }, { status: 201, headers: corsHeaders });

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: corsHeaders });
    }
}
