'use server';

/**
 * @fileOverview This file defines the Genkit flow for the AI assistant.
 *
 * It includes a flow that uses a tool to fetch transaction data, enabling the AI
 * to answer user questions about their finances.
 *
 * It exports:
 * - `assistantFlow` - The function to trigger the flow.
 */

import { ai } from '@/ai/genkit';
import { getTransactionsTool } from '@/ai/tools/get-transactions';
import type { ChatMessage } from '@/lib/types';
import { z } from 'zod';

// Define the schema for chat messages, which will be part of the flow's input.
const ChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
});

// Define the input schema for the assistant flow.
const AssistantFlowInputSchema = z.object({
  history: z.array(ChatMessageSchema),
  message: z.string(),
});
export type AssistantFlowInput = z.infer<typeof AssistantFlowInputSchema>;

export async function getAssistantResponse(
  input: AssistantFlowInput
): Promise<string> {
  const response = await assistantFlow(input);
  return response;
}

const assistantPrompt = ai.definePrompt({
  name: 'assistantPrompt',
  // Provide the getTransactionsTool to the LLM.
  tools: [getTransactionsTool],
  // The system prompt defines the AI's persona, capabilities, and instructions.
  system: `You are BizSmart AI, a friendly and expert financial assistant for small business owners.
Your goal is to provide helpful answers about the user's finances and guide them through the app.

## Application Features:
- **Dashboard**: The main overview of finances, showing total income, expenses, profit, and cash on hand.
- **Transactions**: A page to view and filter all financial transactions.
- **AI Insights**: A page that provides AI-generated financial summaries, burn rate, and suggestions.
- **Settings**: A page to manage company info, finance settings, and notifications.

## Your Capabilities:
- You can answer questions about the app's features.
- You can analyze the user's financial data to answer specific questions.
- **IMPORTANT**: When the user asks a question about their transactions, income, expenses, or any financial calculation, you MUST use the \`getTransactionsTool\` to fetch their data. Do not make up financial information. Base your answers on the data returned by the tool.

## Response Style:
- Be concise, friendly, and professional.
- Use markdown for formatting when it improves readability (e.g., lists, bold text).
`,
  // The main prompt content will be built from the chat history and the new message.
  prompt: `{{#each history}}
### {{role}}
{{content}}
{{/each}}

### user
{{message}}
`,
});

const assistantFlow = ai.defineFlow(
  {
    name: 'assistantFlow',
    inputSchema: AssistantFlowInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    // Generate a response using the prompt and the provided tools.
    // Genkit automatically handles the tool-calling loop.
    const response = await assistantPrompt(input);
    return response.text;
  }
);

    