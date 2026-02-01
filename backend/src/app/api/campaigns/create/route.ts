import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { PricingSnapshotManager } from '@/modules/pricing/pricing.snapshot';
import { PricingEngine } from '@/modules/pricing/pricing.engine';

const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:5173';
const CORS_HEADERS = {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export function OPTIONS() {
    return NextResponse.json({}, { status: 200, headers: CORS_HEADERS });
}

export async function POST(req: Request) {
    try {
        const { userId, name, startDate, endDate, budget, pricingInput } = await req.json();

        // 1. Get current pricing config
        const snapshotManager = new PricingSnapshotManager(prisma);
        const config = await snapshotManager.getCurrentConfig();

        if (!config) {
            return NextResponse.json({ error: 'No active pricing configuration found' }, { status: 404, headers: CORS_HEADERS });
        }

        // 2. Perform final calculation to ensure price is fresh
        const pricingResult = PricingEngine.calculate(config, pricingInput);

        // 3. Create campaign and snapshot in a transaction
        const playbackPriorityMap: Record<string, number> = {
            'NORMAL': 1,
            'HIGH': 2,
            'PREMIUM': 3
        };

        const campaign = await prisma.$transaction(async (tx) => {
            const newCampaign = await tx.campaign.create({
                data: {
                    userId,
                    name,
                    status: 'PENDING_PAYMENT',
                    budget: pricingResult.finalPrice, // Price is locked to result
                    startDate: new Date(startDate),
                    endDate: endDate ? new Date(endDate) : null,
                    pricingVersionId: pricingResult.pricingVersionId,
                    playbackPriority: playbackPriorityMap[pricingInput.slotPriority] || 1,
                }
            });

            // Save the snapshot
            await tx.campaignPricingSnapshot.create({
                data: {
                    campaignId: newCampaign.id,
                    pricingVersionId: pricingResult.pricingVersionId,
                    basePrice: pricingResult.basePrice,
                    finalPrice: pricingResult.finalPrice,
                    breakdown: JSON.parse(JSON.stringify(pricingResult.breakdown))
                }
            });

            return newCampaign;
        });

        return NextResponse.json(campaign, { status: 201, headers: CORS_HEADERS });
    } catch (error) {
        console.error('Error creating campaign:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: CORS_HEADERS });
    }
}
