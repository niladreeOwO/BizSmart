'use server';

import {
  generateFinancialInsights,
  GenerateFinancialInsightsInput,
} from '@/ai/flows/generate-financial-insights';
import { transactions } from '@/lib/data';
import type { FinancialInsight } from '@/lib/types';
import { format } from 'date-fns';

export async function getFinancialInsights(): Promise<FinancialInsight> {
  try {
    const input: GenerateFinancialInsightsInput = {
      userId: 'user_123',
      transactions: transactions.map(({ id, description, ...rest }) => rest), // Remove fields not in schema
      month: format(new Date(), 'yyyy-MM'),
    };
    
    // Adding a delay to simulate network latency for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const insights = await generateFinancialInsights(input);
    return insights;
  } catch (error) {
    console.error('Error generating financial insights:', error);
    throw new Error('Failed to generate insights. Please try again later.');
  }
}
