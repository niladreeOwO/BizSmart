import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/auth-context';
import { TransactionsProvider } from '@/context/transactions-context';
import AIAssistantWidget from '@/components/chat/ai-assistant-widget';
import { cn } from '@/lib/utils';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'BizSmart Dashboard',
  description: 'AI-powered finance dashboard for small businesses.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'font-body antialiased',
          poppins.variable
        )}
        suppressHydrationWarning
      >
        <AuthProvider>
          <TransactionsProvider>
            {children}
            <AIAssistantWidget />
            <Toaster />
          </TransactionsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
