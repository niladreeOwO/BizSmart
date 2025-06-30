import admin from 'firebase-admin';

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error: any) {
    console.error('Firebase admin initialization error', error.stack);
  }
}

export const auth = admin.auth();

export const createSessionCookie = async (idToken: string, options: { expiresIn: number }) => {
    return auth.createSessionCookie(idToken, options);
}

export const revokeSessionCookie = async (sessionCookie: string) => {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie);
    return await auth.revokeRefreshTokens(decodedClaims.sub);
}

export default admin;
