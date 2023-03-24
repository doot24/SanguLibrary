import * as admin from 'firebase-admin';

export const initializeFirebase = async (): Promise<admin.app.App> => {
    try {
        const serviceAccount = JSON.parse(String(process.env.FIREBASE_CREDENTIALS));

        const app = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        return app;
    } catch (error) {
        console.error('Failed to initialize Firebase Admin SDK:', error);
        throw error;
    }
};