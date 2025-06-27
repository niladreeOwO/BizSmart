'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating financial insights for a user.
 *
 * The flow analyzes a user's transactions to provide insights such as burn rate and top expense categories.
 * It exports:
 * - `generateFinancialInsights` - The function to trigger the flow.
 * - `GenerateFinancialInsightsInput` - The input type for the function.
 * - `GenerateFinancialInsightsOutput` - The output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFinancialInsightsInputSchema = z.object({
  userId: z.string().describe('The ID of the user for whom to generate insights.'),
  transactions: z.array(
    z.object({
      amount: z.number(),
      type: z.enum(['income', 'expense']),
      category: z.string(),
      date: z.string().datetime(),
      paymentMethod: z.string(),
    })
  ).describe('The list of transactions for the user.'),
  month: z.string().describe('The month for which to generate insights (YYYY-MM).'),
});
export type GenerateFinancialInsightsInput = z.infer<typeof GenerateFinancialInsightsInputSchema>;

const GenerateFinancialInsightsOutputSchema = z.object({
  summary: z.string().describe('A summary of the user\'s financial performance for the month.'),
  burnRate: z.number().describe('The user\'s burn rate for the month.'),
  topExpenseCategory: z.string().describe('The category with the highest expenses for the month.'),
  suggestions: z.array(z.string()).describe('AI-powered financial suggestions for the user.'),
});
export type GenerateFinancialInsightsOutput = z.infer<typeof GenerateFinancialInsightsOutputSchema>;

export async function generateFinancialInsights(input: GenerateFinancialInsightsInput): Promise<GenerateFinancialInsightsOutput> {
  return generateFinancialInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFinancialInsightsPrompt',
  input: {schema: GenerateFinancialInsightsInputSchema},
  output: {schema: GenerateFinancialInsightsOutputSchema},
  prompt: `You are an AI financial advisor providing insights to small business owners.

  Analyze the following transaction data for the month of {{month}} and provide a financial summary, burn rate, top expense category, and suggestions for the user.

  Transactions:
  {{#each transactions}}
  - Amount: {{amount}}, Type: {{type}}, Category: {{category}}, Date: {{date}}, Payment Method: {{paymentMethod}}
  {{/each}}

  Constraints:
  *   The summary should be concise and easy to understand.
  *   The burn rate should be calculated as total expenses minus total income.
  *   Suggestions should be actionable and relevant to the user's situation.
  *   All monetary values in USD.

  Output in JSON format:
  { 
   "summary": "",
   "burnRate": 0,
   "topExpenseCategory": "",
   "suggestions": [ ]
  }
  `,
});

const generateFinancialInsightsFlow = ai.defineFlow(
  {
    name: 'generateFinancialInsightsFlow',
    inputSchema: GenerateFinancialInsightsInputSchema,
    outputSchema: GenerateFinancialInsightsOutputSchema,
  },
  async input => {
    const {
      transactions,
    } = input;

    // Calculate burn rate
    const totalIncome = transactions
      .filter(transaction => transaction.type === 'income')
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const totalExpenses = transactions
      .filter(transaction => transaction.type === 'expense')
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const burnRate = totalExpenses - totalIncome;

    // Determine top expense category
    const categoryExpenses: { [category: string]: number } = {};
    transactions
      .filter(transaction => transaction.type === 'expense')
      .forEach(transaction => {
        const category = transaction.category;
        categoryExpenses[category] = (categoryExpenses[category] || 0) + transaction.amount;
      });

    let topExpenseCategory = '';
    let maxExpense = 0;
    for (const category in categoryExpenses) {
      if (categoryExpenses[category] > maxExpense) {
        maxExpense = categoryExpenses[category];
        topExpenseCategory = category;
      }
    }

    const {
      output
    } = await prompt({
      ...input,
      burnRate,
      topExpenseCategory,
    });
    return output!;
  }
);
