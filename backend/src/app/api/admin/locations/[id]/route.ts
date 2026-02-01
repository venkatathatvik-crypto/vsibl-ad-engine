import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authorizeUser, createErrorResponse } from '@/lib/rbac';

export const runtime = "nodejs";


const CORS_HEADERS = {
    'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || 'http://localhost:5173',
    'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
    return NextResponse.json({}, { status: 200, headers: CORS_HEADERS });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const authResult = await authorizeUser(req, 'ADMIN');
    if (!authResult || authResult === 'FORBIDDEN') {
        return createErrorResponse(authResult === 'FORBIDDEN' ? 'FORBIDDEN' : 'UNAUTHORIZED');
    }

    try {
        const body = await req.json();
        const { name, locationString, tokensPerHour, status } = body;

        const location = await prisma.adLocation.update({
            where: { id },
            data: {
                name,
                locationString,
                tokensPerHour: parseInt(tokensPerHour),
                status
            }
        });

        return NextResponse.json(location, { status: 200, headers: CORS_HEADERS });
    } catch (error) {
        console.error('Error updating location:', error);
        return NextResponse.json({ error: 'Failed to update location' }, { status: 500, headers: CORS_HEADERS });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const authResult = await authorizeUser(req, 'ADMIN');
    if (!authResult || authResult === 'FORBIDDEN') {
        return createErrorResponse(authResult === 'FORBIDDEN' ? 'FORBIDDEN' : 'UNAUTHORIZED');
    }

    try {
        await prisma.adLocation.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Location deleted successfully' }, { status: 200, headers: CORS_HEADERS });
    } catch (error) {
        console.error('Error deleting location:', error);
        return NextResponse.json({ error: 'Failed to delete location' }, { status: 500, headers: CORS_HEADERS });
    }
}
