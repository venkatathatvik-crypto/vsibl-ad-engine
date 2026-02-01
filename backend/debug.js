
const { PrismaClient } = require('./prisma/generated/client');

const prisma = new PrismaClient();

async function main() {
    console.log('--- AUTH DEBUG ---');
    try {
        const users = await prisma.user.findMany({
            include: { identities: true }
        });
        console.log(`Users found: ${users.length}`);
        users.forEach(u => {
            console.log(`User: ${u.email}`);
            console.log(`  Identities: ${u.identities.length}`);
            u.identities.forEach(id => console.log(`    - ${id.provider}`));
        });
    } catch (err) {
        console.error('Prisma Error:', err.message);
    }
}

main().finally(() => prisma.$disconnect());
鼓
鼓
