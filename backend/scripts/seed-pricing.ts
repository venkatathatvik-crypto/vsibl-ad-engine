import 'dotenv/config';
import { PrismaClient } from '../prisma/generated/client';

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    // 1. Create the PricingConfig container
    const config = await prisma.pricingConfig.upsert({
        where: { id: 'default-config' },
        update: {},
        create: {
            id: 'default-config',
            name: 'Global VSIBL Pricing',
            description: 'Standard pricing rules for all regional screens'
        }
    });

    // 2. Create an initial Version
    const version = await prisma.pricingVersion.create({
        data: {
            version: 1,
            pricingConfigId: config.id,
            basePrice: 100, // 100 tokens base
            status: 'PUBLISHED',
            publishedAt: new Date(),
            factors: {
                create: [
                    { name: 'Screen Count', key: 'screen_count', type: 'MULTIPLIER', value: 1.0, priority: 1, enabled: true },
                    { name: 'Ad Format: Video', key: 'format_video', type: 'MULTIPLIER', value: 1.5, priority: 2, enabled: true },
                    { name: 'Slot Priority: High', key: 'priority_high', type: 'MULTIPLIER', value: 1.25, priority: 3, enabled: true },
                    { name: 'Slot Priority: Premium', key: 'priority_premium', type: 'MULTIPLIER', value: 2.0, priority: 4, enabled: true }
                ]
            },
            timeSlots: {
                create: [
                    { name: 'Morning Peak', startTime: '08:00', endTime: '11:00', multiplier: 1.2, priority: 1 },
                    { name: 'Evening Peak', startTime: '17:00', endTime: '21:00', multiplier: 1.5, priority: 2 },
                    { name: 'Late Night', startTime: '00:00', endTime: '04:00', multiplier: 0.8, priority: 3 }
                ]
            }
        }
    });

    // 3. Set as active
    await prisma.pricingConfig.update({
        where: { id: config.id },
        data: { activeVersionId: version.id }
    });

    console.log('Initial pricing configuration seeded successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
