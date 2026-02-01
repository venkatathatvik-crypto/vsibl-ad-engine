import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { PricingSnapshotManager } from '@/modules/pricing/pricing.snapshot';

const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:8081';

function getCorsHeaders(req: Request) {
    const origin = req.headers.get('origin') || allowedOrigin;
    return {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
}

export async function OPTIONS(req: Request) {
    return NextResponse.json({}, { status: 200, headers: getCorsHeaders(req) });
}

export async function GET(req: Request) {
    const corsHeaders = getCorsHeaders(req);
    try {
        const snapshotManager = new PricingSnapshotManager(prisma);
        const config = await snapshotManager.getCurrentConfig();

        if (!config) {
            return NextResponse.json({ error: 'No active pricing configuration found' }, { status: 404, headers: corsHeaders });
        }

        return NextResponse.json(config, { status: 200, headers: corsHeaders });
    } catch (error) {
        console.error('Error fetching pricing config:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: corsHeaders });
    }
}
