import { NextResponse } from 'next/server';
import { authorizeUser, createErrorResponse } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';

export const runtime = "nodejs";

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || 'http://localhost:5173',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
    return NextResponse.json({}, { status: 200, headers: CORS_HEADERS });
}

export async function GET(req: Request) {
    const authResult = await authorizeUser(req, 'ADMIN');

    if (!authResult) return createErrorResponse('UNAUTHORIZED');
    if (authResult === 'FORBIDDEN') return createErrorResponse('FORBIDDEN');

    try {
        const [userCount, screenCount, pendingAds, totalRevenue] = await Promise.all([
            prisma.user.count({ where: { role: 'CLIENT' } }),
            prisma.adLocation.count(),
            prisma.campaign.count({ where: { status: 'PENDING_APPROVAL' } }),
            prisma.transaction.aggregate({
                where: { type: 'DEBIT' },
                _sum: { amount: true }
            })
        ]);

        const recentActivity = [
            { id: "1", action: "System Live", details: "All nodes operational", time: "Now", type: "success" },
            { id: "2", action: "Database Sync", details: "Seeds verified", time: "5 min ago", type: "info" },
        ];

        return NextResponse.json({
            stats: {
                totalClients: userCount,
                activeScreens: screenCount,
                pendingApprovals: pendingAds,
                revenue: totalRevenue._sum.amount || 0,
            },
            recentActivity,
            user: authResult
        }, { status: 200, headers: CORS_HEADERS });
    } catch (error) {
        console.error('Error fetching admin dashboard stats:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500, headers: CORS_HEADERS });
    }
}
