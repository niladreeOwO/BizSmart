// Since we are removing Firebase, we define a simple User type.
// When re-integrating Firebase, this should be aliased back to the original FirebaseUser.
export type User = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
};

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

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

    