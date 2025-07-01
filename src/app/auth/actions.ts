'use server';

import { cookies } from 'next/headers';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth as clientAuth } from '@/lib/firebase'; // This is the client auth
import { createSessionCookie, revokeSessionCookie } from '@/lib/firebase-admin';
import { redirect } from 'next/navigation';

const FIVE_DAYS_IN_MS = 60 * 60 * 24 * 5 * 1000;

async function createSession(idToken: string) {
  const sessionCookie = await createSessionCookie(idToken, { expiresIn: FIVE_DAYS_IN_MS });
  cookies().set('session', sessionCookie, { maxAge: FIVE_DAYS_IN_MS, httpOnly: true, secure: true });
}

export async function login(data: any) {
  try {
    const auth = getAuth(clientAuth.app);
    const userCredential = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );
    const idToken = await userCredential.user.getIdToken();
    
    await createSession(idToken);

    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function signup(data: any) {
  try {
    const auth = getAuth(clientAuth.app);
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    const idToken = await userCredential.user.getIdToken();
    await createSession(idToken);
    
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function logout() {
  try {
    const sessionCookie = cookies().get('session')?.value;
    if (sessionCookie) {
      await revokeSessionCookie(sessionCookie);
      cookies().delete('session');
    }
  } catch (error: any) {
    return { error: error.message };
  }
  redirect('/login');
}
