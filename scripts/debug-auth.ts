import { PrismaClient } from '../backend/prisma/generated/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Checking User and Identities ---');
    const users = await prisma.user.findMany({
        include: { identities: true }
    });

    console.log(`Total Users: ${users.length}`);
    users.forEach(u => {
        console.log(`User: ${u.email} (Role: ${u.role})`);
        console.log(`  Identities: ${u.identities.map(id => id.provider).join(', ') || 'NONE'}`);
    });

    console.log('--- Done ---');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
