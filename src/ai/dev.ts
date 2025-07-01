'use server';
import { config } from 'dotenv';
config();

// The main entry point for Genkit dev server.
// The `genkit:dev` script in package.json will run this file.

// Import all the flow files you want to be available in the dev server.
import '@/ai/flows/generate-financial-insights.ts';
import '@/ai/flows/assistant-flow.ts';

    