
const { PrismaClient } = require('./prisma/generated/client');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@vsibl.com'; // Default admin email
    const password = 'any password'; // Default demo password or whatever the user used
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(`Checking admin: ${email}`);

    const user = await prisma.user.findUnique({
        where: { email },
        include: { identities: true }
    });

    if (!user) {
        console.log('Admin user record not found. Please run admin setup.');
        return;
    }

    console.log('Admin found. Adding/Updating PASSWORD identity...');

    await prisma.authIdentity.upsert({
        where: {
            userId_provider: {
                userId: user.id,
                provider: 'PASSWORD'
            }
        },
        update: {
            credential: hashedPassword,
            providerId: email
        },
        create: {
            userId: user.id,
            provider: 'PASSWORD',
            providerId: email,
            credential: hashedPassword
        }
    });

    console.log('Identity updated successfully. You can now login.');
}

main().finally(() => prisma.$disconnect());
鼓
鼓
