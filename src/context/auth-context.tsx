'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/lib/types';
import { BotMessageSquare } from 'lucide-react';

const mockUser: User = {
  uid: 'mock_user_123',
  email: 'sme.owner@example.com',
  displayName: 'SME Owner',
  photoURL: 'https://placehold.co/40x40.png',
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    // Simulate checking for a session
    const session = sessionStorage.getItem('isLoggedIn');
    if (session) {
      setUser(mockUser);
    }
    setLoading(false);
  }, []);

  const login = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUser(mockUser);
      sessionStorage.setItem('isLoggedIn', 'true');
      router.push('/dashboard');
      setLoading(false);
    }, 500);
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('isLoggedIn');
    router.push('/login');
  };

  const value = { user, loading, login, logout };

  if (loading && !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <BotMessageSquare className="h-12 w-12 text-primary animate-pulse" />
          <p className="text-muted-foreground">Loading BizSmart...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
