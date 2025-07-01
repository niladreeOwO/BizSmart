'use server';

import {
  getAssistantResponse as getAssistantResponseFlow,
  AssistantFlowInput,
} from '@/ai/flows/assistant-flow';

/**
 * Server action to get a response from the AI assistant flow.
 * @param input The user's message and chat history.
 * @returns The assistant's text response.
 */
export async function getAssistantResponse(
  input: AssistantFlowInput
): Promise<string> {
  try {
    const response = await getAssistantResponseFlow(input);
    return response;
  } catch (error) {
    console.error('Error getting assistant response:', error);
    return 'Sorry, I encountered an error. Please try again.';
  }
}

    