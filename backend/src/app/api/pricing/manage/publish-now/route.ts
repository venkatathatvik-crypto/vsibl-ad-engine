import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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
        const body = await req.json();
        const { basePrice, tokenUsdPrice, factors = [], timeSlots = [] } = body;

        // 1. Get or create PricingConfig
        let config = await prisma.pricingConfig.findFirst();
        if (!config) {
            config = await prisma.pricingConfig.create({
                data: {
                    name: 'VSIBL Global Pricing',
                    description: 'Live master pricing configuration'
                }
            });
        }

        // 2. Determine new version number
        const lastVersion = await prisma.pricingVersion.findFirst({
            where: { pricingConfigId: config.id },
            orderBy: { versionNumber: 'desc' }
        });
        const newVersionNumber = (lastVersion?.versionNumber || 0) + 1;

        // 3. Create PricingVersion and set as PUBLISHED immediately
        const newVersion = await prisma.pricingVersion.create({
            data: {
                pricingConfigId: config.id,
                versionNumber: newVersionNumber,
                basePrice: Number(basePrice) || 10,
                tokenUsdPrice: Number(tokenUsdPrice) || 0.04,
                status: 'PUBLISHED',
                publishedAt: new Date(),
                factors: {
                    create: factors.map((f: any) => ({
                        name: String(f.name),
                        key: String(f.key),
                        enabled: Boolean(f.enabled),
                        priority: Number(f.priority) || 1,
                        type: String(f.type),
                        value: Number(f.value) || 1,
                        config: f.config || {}
                    }))
                },
                timeSlots: {
                    create: timeSlots.map((ts: any) => ({
                        name: String(ts.name),
                        startTime: String(ts.startTime),
                        endTime: String(ts.endTime),
                        multiplier: Number(ts.multiplier) || 1,
                        priority: Number(ts.priority) || 1
                    }))
                }
            }
        });

        // 4. Update the Master Config to point to this new active version
        await prisma.pricingConfig.update({
            where: { id: config.id },
            data: {
                activeVersionId: newVersion.id
            }
        });

        return NextResponse.json({
            message: 'Pricing updated and published live',
            version: newVersion
        }, { status: 200, headers: corsHeaders });

    } catch (error) {
        console.error('Error publishing live pricing:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: corsHeaders });
    }
}
