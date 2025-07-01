import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth as adminAuth } from '@/lib/firebase-admin';
import MainLayout from "@/components/layout/main-layout";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionCookie = cookies().get('session')?.value;

  if (!sessionCookie) {
    return redirect('/login');
  }

  try {
    // Verify the session cookie. This will throw an error if it's invalid.
    await adminAuth.verifySessionCookie(sessionCookie, true);
  } catch (error) {
    // Session cookie is invalid or expired.
    // Redirecting to login will allow the user to re-authenticate.
    return redirect('/login');
  }
  
  return <MainLayout>{children}</MainLayout>;
}
