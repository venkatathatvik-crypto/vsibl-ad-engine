import 'dotenv/config';
import { PrismaClient } from '../prisma/generated/client/index.js';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('--- Auth Identity Check ---');
    const users = await prisma.user.findMany({
        include: { identities: true }
    });

    if (users.length === 0) {
        console.log('No users found in database.');
    }

    for (const user of users) {
        console.log(`User: ${user.email} (Role: ${user.role})`);
        if (user.identities.length === 0) {
            console.log('  ❌ NO IDENTITIES (Authentication will fail)');
        } else {
            user.identities.forEach(id => {
                console.log(`  ✅ Identity: ${id.provider} (ID: ${id.providerId})`);
            });
        }
    }
    console.log('-------------------------');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
