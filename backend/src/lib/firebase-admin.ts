import * as admin from 'firebase-admin';

if (!admin.apps.length) {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    // Handle escaped newlines in private key if provided via env
    const formattedPrivateKey = privateKey ? privateKey.replace(/\\n/g, '\n') : undefined;

    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
        console.error('[Firebase Admin] Missing required environment variables:');
        if (!process.env.FIREBASE_PROJECT_ID) console.error(' - FIREBASE_PROJECT_ID is missing');
        if (!process.env.FIREBASE_CLIENT_EMAIL) console.error(' - FIREBASE_CLIENT_EMAIL is missing');
        if (!process.env.FIREBASE_PRIVATE_KEY) console.error(' - FIREBASE_PRIVATE_KEY is missing');
    }

    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: formattedPrivateKey,
            }),
        });
        console.log('[Firebase Admin] Initialized successfully');
    } catch (error) {
        console.error('[Firebase Admin] Initialization error:', error);
    }
}

export const firebaseAdmin = admin;
