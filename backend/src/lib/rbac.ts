import { NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth';

/**
 * Validates the request for a valid JWT and optional role requirement.
 * Returns the decoded token payload if valid.
 * Returns null if invalid or unauthorized (callers should return 401/403).
 */
export async function authorizeUser(req: Request, requiredRole?: 'ADMIN' | 'CLIENT') {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token) as any;

    if (!decoded) {
        return null; // Invalid or expired token
    }

    if (requiredRole && decoded.role !== requiredRole) {
        return 'FORBIDDEN'; // Distinguish between invalid token and wrong role
    }

    return decoded;
}

export function createErrorResponse(type: 'UNAUTHORIZED' | 'FORBIDDEN') {
    const CORS_HEADERS = {
        'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || 'http://localhost:5173',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (type === 'FORBIDDEN') {
        return NextResponse.json(
            { error: 'Access denied: Insufficient permissions' },
            { status: 403, headers: CORS_HEADERS }
        );
    }

    return NextResponse.json(
        { error: 'Unauthorized: Please log in' },
        { status: 401, headers: CORS_HEADERS }
    );
}
