import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

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
        // 1. Extract Setup Key from Headers or Body
        const authHeader = req.headers.get('x-admin-setup-key');

        let body: any = {};
        try {
            body = await req.json();
        } catch (e) {
            // Body might be empty or not JSON, which is fine if header is used
        }

        const setupKey = authHeader || body.setupKey;
        const { email, password, name } = body;

        // 2. Validate Setup Key
        const envSetupKey = process.env.ADMIN_SETUP_KEY;
        if (!envSetupKey || setupKey !== envSetupKey) {
            console.warn(`[Admin Setup] Unauthorized attempt with key: ${setupKey}`);
            return NextResponse.json(
                { error: 'Unauthorized: Invalid or missing setup key' },
                { status: 401, headers: CORS_HEADERS }
            );
        }

        // 3. Validate Inputs
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Missing required fields: email and password' },
                { status: 400, headers: CORS_HEADERS }
            );
        }

        // 4. Check if admin already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
            include: { identities: true }
        });

        // Only block if an admin with a password already exists
        if (existingUser && existingUser.role === 'ADMIN' && existingUser.identities.some(id => id.provider === 'PASSWORD')) {
            return NextResponse.json(
                { error: 'Conflict: Admin already exists' },
                { status: 409, headers: CORS_HEADERS }
            );
        }

        const hashedPassword = await hashPassword(password);

        // 5. Create or Repair admin
        console.log(`[Admin Setup] Processing super-admin: ${email}`);

        const admin = await prisma.user.upsert({
            where: { email },
            update: {
                role: 'ADMIN',
                identities: {
                    upsert: {
                        where: {
                            userId_provider: {
                                userId: existingUser?.id || '',
                                provider: 'PASSWORD'
                            }
                        },
                        update: {
                            credential: hashedPassword,
                            providerId: email
                        },
                        create: {
                            provider: 'PASSWORD',
                            providerId: email,
                            credential: hashedPassword
                        }
                    }
                }
            },
            create: {
                email,
                name: name || 'System Admin',
                role: 'ADMIN',
                identities: {
                    create: {
                        provider: 'PASSWORD',
                        providerId: email,
                        credential: hashedPassword
                    }
                }
            }
        });

        return NextResponse.json({
            message: existingUser ? 'Admin updated successfully' : 'Admin created successfully',
            admin: { id: admin.id, email: admin.email, role: admin.role }
        }, { status: existingUser ? 200 : 201, headers: CORS_HEADERS });

    } catch (error: any) {
        console.error('[Admin Setup] Fatal Error:', error);

        // Handle specific Prisma errors if needed
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'User with this email already exists' }, { status: 409, headers: CORS_HEADERS });
        }

        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500, headers: CORS_HEADERS }
        );
    }
}
