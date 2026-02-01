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
        const { versionId } = await req.json();

        // 1. Fetch the version
        const version = await prisma.pricingVersion.findUnique({
            where: { id: versionId }
        });

        if (!version) {
            return NextResponse.json({ error: 'Version not found' }, { status: 404, headers: corsHeaders });
        }

        // 2. Update PricingConfig to set this as activeVersion
        await prisma.pricingConfig.update({
            where: { id: version.pricingConfigId },
            data: {
                activeVersionId: version.id
            }
        });

        // 3. Mark version as PUBLISHED
        const updatedVersion = await prisma.pricingVersion.update({
            where: { id: versionId },
            data: {
                status: 'PUBLISHED',
                publishedAt: new Date()
            }
        });

        return NextResponse.json({ message: 'Version published successfully', version: updatedVersion }, { status: 200, headers: corsHeaders });
    } catch (error) {
        console.error('Error publishing pricing version:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: corsHeaders });
    }
}
