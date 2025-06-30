import type { User as FirebaseUser } from 'firebase/auth';

export type Transaction = {
  id: string;
  userId: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string; // ISO string
  paymentMethod: string;
  description: string;
};

export type FinancialInsight = {
  summary: string;
  burnRate: number;
  topExpenseCategory: string;
  suggestions: string[];
};

export type User = FirebaseUser;
