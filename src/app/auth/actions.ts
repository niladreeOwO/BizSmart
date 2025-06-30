'use server';

import { cookies } from 'next/headers';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth as clientAuth } from '@/lib/firebase'; // This is the client auth
import { createSessionCookie, revokeSessionCookie } from '@/lib/firebase-admin';

export async function login(data: any) {
  try {
    const auth = getAuth(clientAuth.app);
    const userCredential = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );
    const idToken = await userCredential.user.getIdToken();
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

    const sessionCookie = await createSessionCookie(idToken, { expiresIn });
    cookies().set('session', sessionCookie, { maxAge: expiresIn, httpOnly: true, secure: true });

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

    // After signup, automatically log the user in
    const idToken = await userCredential.user.getIdToken();
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    
    const sessionCookie = await createSessionCookie(idToken, { expiresIn });
    cookies().set('session', sessionCookie, { maxAge: expiresIn, httpOnly: true, secure: true });
    
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
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
