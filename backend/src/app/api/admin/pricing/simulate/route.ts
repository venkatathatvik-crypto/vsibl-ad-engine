import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAccessToken } from '@/lib/auth';
import { computePricing, PricingConfig, PricingInput, FactorKey } from '@/lib/pricingEngine';
import { Role } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyAccessToken(token) as { role?: Role } | null;
    if (!decoded || decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = (await req.json()) as {
      versionId?: string;
      version?: number;
      input: PricingInput;
    };

    if (!body || !body.input) {
      return NextResponse.json({ error: 'Missing pricing input' }, { status: 400 });
    }

    let pricingVersion;

    if (body.versionId) {
      pricingVersion = await prisma.pricingVersion.findUnique({ where: { id: body.versionId } });
    } else if (typeof body.version === 'number') {
      pricingVersion = await prisma.pricingVersion.findUnique({ where: { version: body.version } });
    } else {
      // latest published version
      pricingVersion = await prisma.pricingVersion.findFirst({
        where: { status: 'PUBLISHED' },
        orderBy: { version: 'desc' },
      });
    }

    if (!pricingVersion) {
      return NextResponse.json({ error: 'No pricing version found' }, { status: 404 });
    }

    const config: PricingConfig = {
      basePrice: Number(pricingVersion.basePrice),
      screenSlabs: pricingVersion.screenSlabs as any,
      timeSlots: pricingVersion.timeSlots as any,
      formatMultipliers: pricingVersion.formatMultipliers as any,
      durationSlabs: pricingVersion.durationSlabs as any,
      factorPriorities: pricingVersion.factorPriorities as any,
    };

    const breakdown = computePricing(config, body.input);

    return NextResponse.json({
      versionId: pricingVersion.id,
      version: pricingVersion.version,
      breakdown,
    });
  } catch (error) {
    console.error('Admin pricing simulate error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
