'use server';

/**
 * @fileOverview This file defines a Genkit tool for retrieving user transactions.
 * This tool allows the AI assistant to access financial data to answer queries.
 */

import { ai } from '@/ai/genkit';
import { transactions } from '@/lib/data';
import { z } from 'zod';

// Define a Zod schema that matches the structure of a Transaction.
// This is crucial for the LLM to understand the data format.
const TransactionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  amount: z.number(),
  type: z.enum(['income', 'expense']),
  category: z.string(),
  date: z.string().describe('The date of the transaction in ISO 8601 format.'),
  paymentMethod: z.string(),
  description: z.string(),
});

// Define the tool using `ai.defineTool`.
export const getTransactionsTool = ai.defineTool(
  {
    name: 'getTransactionsTool',
    description:
      "Retrieves the user's list of financial transactions. Use this tool to answer any questions about their income, expenses, or specific transaction details.",
    // This tool doesn't require any input from the LLM.
    inputSchema: z.object({}),
    // The tool will output an array of transactions.
    outputSchema: z.array(TransactionSchema),
  },
  async () => {
    // In a real application, you would fetch this data from a database
    // based on the logged-in user's ID.
    console.log('Tool executed: getTransactionsTool');
    return transactions;
  }
);

    