import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authorizeUser, createErrorResponse } from '@/lib/rbac';

export const runtime = "nodejs";

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || 'http://localhost:5173',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
    return NextResponse.json({}, { status: 200, headers: CORS_HEADERS });
}

export async function GET(req: Request) {
    const authResult = await authorizeUser(req, 'ADMIN');
    if (!authResult || authResult === 'FORBIDDEN') {
        return createErrorResponse(authResult === 'FORBIDDEN' ? 'FORBIDDEN' : 'UNAUTHORIZED');
    }

    try {
        const locations = await prisma.adLocation.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(locations, { status: 200, headers: CORS_HEADERS });
    } catch (error) {
        console.error('Error fetching locations:', error);
        return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500, headers: CORS_HEADERS });
    }
}

export async function POST(req: Request) {
    const authResult = await authorizeUser(req, 'ADMIN');
    if (!authResult || authResult === 'FORBIDDEN') {
        return createErrorResponse(authResult === 'FORBIDDEN' ? 'FORBIDDEN' : 'UNAUTHORIZED');
    }

    try {
        const body = await req.json();
        const { name, locationString, tokensPerHour, status } = body;

        const location = await prisma.adLocation.create({
            data: {
                name,
                locationString,
                tokensPerHour: parseInt(tokensPerHour),
                status: status || 'Available'
            }
        });

        return NextResponse.json(location, { status: 201, headers: CORS_HEADERS });
    } catch (error) {
        console.error('Error creating location:', error);
        return NextResponse.json({ error: 'Failed to create location' }, { status: 500, headers: CORS_HEADERS });
    }
}
