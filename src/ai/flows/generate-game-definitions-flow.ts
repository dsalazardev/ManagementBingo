'use server';
/**
 * @fileOverview A Genkit flow for generating detailed definitions for theoretical concepts based on provided study material.
 *
 * - generateGameDefinitions - A function that handles the generation of game definitions.
 * - GenerateGameDefinitionsInput - The input type for the generateGameDefinitions function.
 * - GenerateGameDefinitionsOutput - The return type for the generateGameDefinitions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateGameDefinitionsInputSchema = z.object({
  studyMaterial: z
    .string()
    .describe('The comprehensive study material from which definitions should be extracted or synthesized.'),
  concepts: z
    .array(z.string())
    .describe('A list of theoretical concepts for which definitions need to be generated.'),
});
export type GenerateGameDefinitionsInput = z.infer<typeof GenerateGameDefinitionsInputSchema>;

const DefinitionSchema = z.object({
  concept: z.string().describe('The theoretical concept.'),
  definition: z
    .string()
    .describe(
      'A detailed, pedagogically sound definition for the concept, extracted or synthesized from the study material.'
    ),
});

const GenerateGameDefinitionsOutputSchema = z.object({
  definitions: z
    .array(DefinitionSchema)
    .describe('An array of concepts and their generated definitions.'),
});
export type GenerateGameDefinitionsOutput = z.infer<typeof GenerateGameDefinitionsOutputSchema>;

export async function generateGameDefinitions(
  input: GenerateGameDefinitionsInput
): Promise<GenerateGameDefinitionsOutput> {
  return generateGameDefinitionsFlow(input);
}

const generateGameDefinitionsPrompt = ai.definePrompt({
  name: 'generateGameDefinitionsPrompt',
  input: {schema: GenerateGameDefinitionsInputSchema},
  output: {schema: GenerateGameDefinitionsOutputSchema},
  prompt: `You are a helpful and knowledgeable pedagogic assistant specialized in technical management, human resources, and environmental topics. Your task is to generate accurate and pedagogically sound definitions for a list of theoretical concepts, based strictly on the provided study material.

For each concept provided in the 'concepts' array, find or synthesize a detailed definition from the 'studyMaterial'. Ensure the definitions are clear, concise, and directly relevant to the study material provided. If a concept is not explicitly covered or cannot be reasonably inferred from the material, provide a concise explanation that it's not found.

Study Material:
"""
{{{studyMaterial}}}
"""

Concepts to define:
{{#each concepts}}
- {{this}}
{{/each}}

Generate the definitions in a structured JSON format matching the output schema.`,
});

const generateGameDefinitionsFlow = ai.defineFlow(
  {
    name: 'generateGameDefinitionsFlow',
    inputSchema: GenerateGameDefinitionsInputSchema,
    outputSchema: GenerateGameDefinitionsOutputSchema,
  },
  async input => {
    const {output} = await generateGameDefinitionsPrompt(input);
    return output!;
  }
);
