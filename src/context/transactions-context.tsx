'use client';
import * as React from 'react';
import type { Transaction } from '@/lib/types';
import { transactions as initialTransactions } from '@/lib/data';

type NewTransaction = Omit<Transaction, 'id' | 'userId'>;

interface TransactionsContextType {
  transactions: Transaction[];
  addTransaction: (transaction: NewTransaction | NewTransaction[]) => void;
}

const TransactionsContext = React.createContext<TransactionsContextType | undefined>(undefined);

export function TransactionsProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = React.useState<Transaction[]>(initialTransactions);

  const addTransaction = (newEntries: NewTransaction | NewTransaction[]) => {
    const entriesArray = Array.isArray(newEntries) ? newEntries : [newEntries];
    
    const newTransactions: Transaction[] = entriesArray.map(entry => ({
      ...entry,
      id: `txn_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      userId: 'user_123', // Mock user ID
    }));

    setTransactions(prev => [...newTransactions, ...prev]);
  };

  return (
    <TransactionsContext.Provider value={{ transactions, addTransaction }}>
      {children}
    </TransactionsContext.Provider>
  );
}

export const useTransactions = () => {
  const context = React.useContext(TransactionsContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionsProvider');
  }
  return context;
};
