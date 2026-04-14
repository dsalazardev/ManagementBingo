
'use server';
/**
 * @fileOverview Flujo de validación de Bingo utilizando Genkit.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { CONCEPT_DEFINITIONS } from '@/lib/game-constants';

const ValidateBingoClaimInputSchema = z.object({
  winningLineConcepts: z.array(z.string()).describe('Conceptos marcados por el estudiante.'),
  readDefinitions: z.array(z.string()).describe('Definiciones leídas por el profesor.'),
});
export type ValidateBingoClaimInput = z.infer<typeof ValidateBingoClaimInputSchema>;

const ValidateBingoClaimOutputSchema = z.object({
  isValid: z.boolean().describe('Si la reclamación es válida.'),
  reason: z.string().describe('Explicación detallada.'),
});
export type ValidateBingoClaimOutput = z.infer<typeof ValidateBingoClaimOutputSchema>;

const validateBingoClaimPrompt = ai.definePrompt({
  name: 'validateBingoClaimPrompt',
  input: { 
    schema: ValidateBingoClaimInputSchema.extend({
      dictionary: z.record(z.string())
    })
  },
  output: { schema: ValidateBingoClaimOutputSchema },
  prompt: `Eres un validador estricto de Bingo.
  
Conceptos del alumno:
{{#each winningLineConcepts}}
- {{this}}
{{/each}}

Definiciones leídas por el profesor:
{{#each readDefinitions}}
- {{this}}
{{/each}}

Diccionario Maestro (Concepto -> Definición):
{{json dictionary}}

REGLA: El Bingo es VÁLIDO solo si para CADA concepto del alumno, su definición exacta del diccionario está en la lista de definiciones leídas.
Responde en español indicando si es válido y por qué.`,
});

export async function validateBingoClaim(input: ValidateBingoClaimInput): Promise<ValidateBingoClaimOutput> {
  const { output } = await validateBingoClaimPrompt({
    ...input,
    dictionary: CONCEPT_DEFINITIONS
  });
  
  if (!output) {
    return { isValid: false, reason: "Error interno al validar con IA." };
  }
  return output;
}
