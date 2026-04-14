
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// Inicialización de Genkit optimizada para Next.js 15
export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_GENAI_API_KEY || process.env.GEMINI_API_KEY,
    }),
  ],
  model: 'googleai/gemini-1.5-flash',
});
