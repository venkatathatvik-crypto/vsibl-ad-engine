import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:8081';

function getCorsHeaders(req: Request) {
    const origin = req.headers.get('origin') || allowedOrigin;
    return {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
}

export async function OPTIONS(req: Request) {
    return NextResponse.json({}, { status: 200, headers: getCorsHeaders(req) });
}

export async function POST(req: Request) {
    const corsHeaders = getCorsHeaders(req);
    try {
        const { basePrice, tokenUsdPrice, factors, timeSlots, name, description } = await req.json();

        // 1. Get or create PricingConfig
        let config = await prisma.pricingConfig.findFirst();
        if (!config) {
            config = await prisma.pricingConfig.create({
                data: {
                    name: name || 'Default Config',
                    description: description || 'Master pricing configuration'
                }
            });
        }

        // 2. Determine new version
        const lastVersion = await prisma.pricingVersion.findFirst({
            where: { pricingConfigId: config.id },
            orderBy: { version: 'desc' }
        });
        const newVersionNumber = (lastVersion?.version || 0) + 1;

        // 3. Create PricingVersion with factors and timeSlots
        const newVersion = await prisma.pricingVersion.create({
            data: {
                pricingConfigId: config.id,
                version: newVersionNumber,
                basePrice: Number(basePrice) || 10,
                tokenUsdPrice: Number(tokenUsdPrice) || 0.04,
                status: 'DRAFT',
                factorEntries: {
                    create: (factors || []).map((f: any) => ({
                        name: String(f.name),
                        key: String(f.key),
                        enabled: Boolean(f.enabled),
                        priority: Number(f.priority) || 1,
                        type: String(f.type),
                        value: Number(f.value) || 1,
                        config: f.config || {}
                    }))
                },
                timeSlotEntries: {
                    create: (timeSlots || []).map((ts: any) => ({
                        name: String(ts.name),
                        startTime: String(ts.startTime),
                        endTime: String(ts.endTime),
                        multiplier: Number(ts.multiplier) || 1,
                        priority: Number(ts.priority) || 1
                    }))
                }
            },
            include: {
                factorEntries: true,
                timeSlotEntries: true
            }
        });

        return NextResponse.json(newVersion, { status: 201, headers: corsHeaders });
    } catch (error) {
        console.error('Error creating pricing version:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: corsHeaders });
    }
}
