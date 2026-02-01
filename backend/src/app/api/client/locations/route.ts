import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = "nodejs";

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || 'http://localhost:5173',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
    return NextResponse.json({}, { status: 200, headers: CORS_HEADERS });
}

export async function GET() {
    try {
        const locations = await prisma.adLocation.findMany({
            orderBy: { name: 'asc' }
        });
        return NextResponse.json(locations, { status: 200, headers: CORS_HEADERS });
    } catch (error) {
        console.error('Error fetching locations:', error);
        return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500, headers: CORS_HEADERS });
    }
}
