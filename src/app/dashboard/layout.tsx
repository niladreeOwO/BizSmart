import MainLayout from "@/components/layout/main-layout";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth as adminAuth } from '@/lib/firebase-admin';

async function verifySessionCookie(session: string | undefined) {
    if (!session) return null;
    try {
        // Verify the session cookie. In this case an additional check is added to detect
        // if the user's Firebase session was revoked, user deleted/disabled, etc.
        return await adminAuth.verifySessionCookie(session, true /** checkRevoked */);
    } catch (error) {
        // Session cookie is invalid.
        return null;
    }
}

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = cookies().get('session')?.value;
  const decodedToken = await verifySessionCookie(session);

  if (!decodedToken) {
    redirect('/login');
  }

  return <MainLayout>{children}</MainLayout>;
}
