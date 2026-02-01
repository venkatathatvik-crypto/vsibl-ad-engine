import 'dotenv/config';
import { PrismaClient } from '../prisma/generated/client/index.js';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const CLIENTS = [
    { email: 'client_nike@vsibl.com', name: 'Nike Marketing', password: 'password123' },
    { email: 'client_coke@vsibl.com', name: 'Coca Cola Ad Team', password: 'password123' },
    { email: 'local_bakery@gmail.com', name: 'Joe\'s Bakery', password: 'password123' },
    { email: 'tech_startup@vsibl.com', name: 'Nexus AI', password: 'password123' },
    { email: 'city_events@vsibl.com', name: 'Metro Events', password: 'password123' },
];

const CAMPAIGN_STATUSES = ['DRAFT', 'PENDING_APPROVAL', 'CONFIRMED', 'REJECTED', 'EXPIRED', 'CONFIRMED', 'CONFIRMED']; // Weight CONFIRMED higher
const LOCATIONS = [
    { name: "Marina Beach Front", locationString: "Chennai, Kamarajar Salai", tokensPerHour: 50, status: "Available" },
    { name: "T-Nagar Shopping Hub", locationString: "Chennai, Pondy Bazaar", tokensPerHour: 45, status: "Available" },
    { name: "OMR Tech Corridor", locationString: "Chennai, Sholinganallur", tokensPerHour: 60, status: "Busy" },
    { name: "Velachery Junction", locationString: "Chennai, Grand Mall", tokensPerHour: 55, status: "Available" },
    { name: "Anna Nagar Central", locationString: "Chennai, 2nd Avenue", tokensPerHour: 40, status: "Available" },
];

async function main() {
    console.log('🌱 Starting EXTENDED dummy data seed...');

    // 0. Seed Locations
    console.log('📍 Seeding Locations...');
    for (const loc of LOCATIONS) {
        await prisma.adLocation.upsert({
            where: { name: loc.name },
            update: {
                locationString: loc.locationString,
                tokensPerHour: loc.tokensPerHour,
                status: loc.status
            },
            create: loc,
        });
    }
    console.log('✅ Locations seeded.');
    const createdUsers = [];
    for (const client of CLIENTS) {
        const user = await prisma.user.upsert({
            where: { email: client.email },
            update: {},
            create: {
                email: client.email,
                name: client.name,
                role: 'CLIENT',
                wallet: {
                    create: {
                        balance: Math.floor(Math.random() * 50000) + 1000
                    }
                },
                identities: {
                    create: {
                        provider: 'PASSWORD',
                        providerId: client.email,
                        credential: '$2a$10$YourHashedPasswordHere' // Initial hashed password
                    }
                }
            },
            include: { wallet: true }
        });
        createdUsers.push(user);
        console.log(`👤 Client ready: ${user.name}`);
    }

    // 2. Create Campaigns & Ads
    for (const user of createdUsers) {
        const campaignCount = Math.floor(Math.random() * 5) + 3; // 3-8 campaigns per user

        for (let i = 0; i < campaignCount; i++) {
            const status = CAMPAIGN_STATUSES[Math.floor(Math.random() * CAMPAIGN_STATUSES.length)];
            const budget = (Math.random() * 5000) + 500;
            const isVideo = Math.random() > 0.3;

            const campaign = await prisma.campaign.create({
                data: {
                    name: `${user.name} - ${status === 'CONFIRMED' ? 'Active' : status} Campaign ${i + 1}`,
                    userId: user.id,
                    status: status,
                    budget: budget,
                    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * Math.floor(Math.random() * 30)), // Started up to 30 days ago
                    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // Ends in 30 days
                    playbackPriority: Math.ceil(Math.random() * 3),
                    ads: {
                        create: [
                            {
                                name: `${user.name} Creative ${i + 1}`,
                                type: isVideo ? 'VIDEO' : 'IMAGE',
                                contentUrl: isVideo
                                    ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
                                    : 'https://via.placeholder.com/1920x1080.png?text=Ad+Creative'
                            }
                        ]
                    }
                },
                include: { ads: true }
            });

            // 3. Transactions
            if (status === 'CONFIRMED') {
                await prisma.transaction.create({
                    data: {
                        userId: user.id,
                        type: 'DEBIT',
                        amount: budget,
                        description: `Budget allocation: ${campaign.name}`,
                        campaignId: campaign.id,
                        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * Math.floor(Math.random() * 5))
                    }
                });
            }

            // 4. Analytics (Impressions/Clicks)
            // Generate robust data for the past 14 days
            const ad = campaign.ads[0];
            if (status === 'CONFIRMED') {
                const dailyImpressions = Math.floor(Math.random() * 20) + 5; // 5-25 impressions per day
                const daysActive = 14;

                const impressionPromises = [];
                for (let d = 0; d < daysActive; d++) {
                    for (let k = 0; k < dailyImpressions; k++) {
                        const timeOffset = (d * 24 * 60 * 60 * 1000) + Math.random() * 86400000;
                        const timestamp = new Date(Date.now() - timeOffset);

                        impressionPromises.push(prisma.adImpression.create({
                            data: {
                                adId: ad.id,
                                timestamp: timestamp,
                                cost: 0.5,
                                viewerId: `anon_${Math.random().toString(36).substr(2, 5)}`,
                                region: Math.random() > 0.5 ? 'NYC-01' : 'LA-02'
                            }
                        }));
                    }
                }

                // Batch insert better for performance but loop is fine for seed script of this size
                await Promise.all(impressionPromises);
                console.log(`   📊 Generated stats for: ${campaign.name}`);
            }
        }
    }

    console.log('✅ EXTENDED Dummy data seeded successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
