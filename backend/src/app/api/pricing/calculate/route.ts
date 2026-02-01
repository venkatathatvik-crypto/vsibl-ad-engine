import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { PricingSnapshotManager } from '@/modules/pricing/pricing.snapshot';
import { PricingEngine } from '@/modules/pricing/pricing.engine';
import { PricingValidator } from '@/modules/pricing/pricing.validator';

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
        const input = await req.json();

        // 1. Validate Input
        const inputErrors = PricingValidator.validateCampaignInput(input);
        if (inputErrors.length > 0) {
            return NextResponse.json({ errors: inputErrors }, { status: 400, headers: corsHeaders });
        }

        // 2. Get Config
        const snapshotManager = new PricingSnapshotManager(prisma);
        const config = await snapshotManager.getCurrentConfig();

        if (!config) {
            return NextResponse.json({ error: 'No active pricing configuration found' }, { status: 404, headers: corsHeaders });
        }

        // 3. Calculate
        const result = PricingEngine.calculate(config, input);

        return NextResponse.json(result, { status: 200, headers: corsHeaders });
    } catch (error) {
        console.error('Pricing calculation error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: corsHeaders });
    }
}
