import 'dotenv/config';
import { PrismaClient } from '../prisma/generated/client/index.js';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const userCount = await prisma.user.count();
    const campaignCount = await prisma.campaign.count();
    const adCount = await prisma.ad.count();
    const txCount = await prisma.transaction.count();
    const impressionCount = await prisma.adImpression.count();

    console.log('--- Database Stats ---');
    console.log(`Users: ${userCount}`);
    console.log(`Campaigns: ${campaignCount}`);
    console.log(`Ads: ${adCount}`);
    console.log(`Transactions: ${txCount}`);
    console.log(`Impressions: ${impressionCount}`);
    console.log('----------------------');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
