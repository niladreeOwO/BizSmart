'use client';

import * as React from 'react';
import type { User } from '@/lib/types';
import { BotMessageSquare } from 'lucide-react';

// Create a mock user for display purposes
const mockUser: User = {
  uid: 'mock_user_123',
  email: 'sme.owner@example.com',
  displayName: 'SME Owner',
  photoURL: 'https://placehold.co/40x40.png',
};


interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // In this mock setup, loading is always false and we have a static user.
  const loading = false;
  
  const logout = async () => {
    // In a real app, this would clear the session. Here, it does nothing.
    console.log("Mock logout initiated. In a real app, you would be redirected.");
  };

  const value = {
    user: mockUser,
    loading,
    logout,
  };

  // The loading screen is kept for visual consistency, even though it's instant.
  if (loading) {
     return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <BotMessageSquare className="h-12 w-12 text-primary animate-pulse" />
                <p className="text-muted-foreground">Loading BizSmart...</p>
            </div>
        </div>
     )
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
