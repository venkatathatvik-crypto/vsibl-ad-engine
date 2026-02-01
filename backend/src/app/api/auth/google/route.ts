import { NextResponse } from 'next/server';
import { firebaseAdmin } from '@/lib/firebase-admin';
import prisma from '@/lib/prisma';
import { generateAccessToken, generateRefreshToken } from '@/lib/auth';

const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:8080';

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

        const { idToken } = await req.json();

        if (!idToken) {
            return NextResponse.json({ error: 'ID Token is required' }, { status: 400, headers: corsHeaders });
        }

        // 1. Verify Firebase ID Token
        const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);

        if (!decodedToken || !decodedToken.email) {
            return NextResponse.json({ error: 'Invalid token payload' }, { status: 400, headers: corsHeaders });
        }

        const { email, uid: firebaseUid, name } = decodedToken;
        const googleId = firebaseUid; // Use Firebase UID as the provider ID

        // 2. Resolve User Identity
        let user = await prisma.user.findUnique({
            where: { email },
            include: { identities: true }
        });

        if (user) {
            // Check if Google identity is already linked
            const hasGoogle = user.identities.some(id => id.provider === 'GOOGLE');

            if (!hasGoogle) {
                // Link account
                await prisma.authIdentity.create({
                    data: {
                        userId: user.id,
                        provider: 'GOOGLE',
                        providerId: googleId
                    }
                });
            }
        } else {
            // Account creation rule: Google OAuth may auto-create CLIENT accounts
            // But NOT ADMIN accounts. (Constraint: Admins must exist before OAuth login is permitted)
            // If the user's role was supposed to be ADMIN, they would have been found above.
            user = await prisma.user.create({
                data: {
                    email,
                    name: name || null,
                    role: 'CLIENT',
                    identities: {
                        create: {
                            provider: 'GOOGLE',
                            providerId: googleId
                        }
                    }
                },
                include: { identities: true }
            });
        }

        // 3. Issue VSIBL Token
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
            message: 'Google login successful',
            user: { id: user.id, email: user.email, name: user.name, role: user.role },
            token: accessToken,
            refreshToken,
        }, { status: 200, headers: corsHeaders });

    } catch (error: any) {
        console.error('Google Auth Error:', error);
        return NextResponse.json({
            error: 'Authentication failed',
            details: error.message
        }, { status: 401, headers: getCorsHeaders(req) });
    }
}
