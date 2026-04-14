'use server';
/**
 * @fileOverview This file implements a Genkit flow to validate a student's Bingo claim in a technical management game.
 *
 * - validateBingoClaim - A function that handles the validation of a student's Bingo claim.
 * - ValidateBingoClaimInput - The input type for the validateBingoClaim function.
 * - ValidateBingoClaimOutput - The return type for the validateBingoClaim function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Define the comprehensive Concept-Definition mapping based on the game's data dictionary.
// This map serves as the ground truth for concept definitions.
const CONCEPT_DEFINITION_MAP: Record<string, string> = {
  "Gestión Técnica": "Es la encargada de aportar las habilidades y los recursos necesarios para dar soporte a la fase de Operación del servicio, participando también en el diseño y mejora de los servicios TI.",
  "Fase de Operación": "Es la fase más crítica entre todas, donde la percepción de los clientes depende de una correcta organización y coordinación de los agentes involucrados.",
  "Conocimiento TI": "Debe ser identificado, distribuido y perfeccionado para diseñar, probar y mejorar la infraestructura técnica de la empresa.",
  "Recursos Humanos": "Área más relevante en una empresa, responsable de desarrollar, movilizar y motivar al personal empleado.",
  "Instrumentos Administrativos": "El apoyo necesario y obligatorio para conseguir, desarrollar y conservar los recursos de una empresa; sin ellos no se pueden ejecutar las políticas del personal.",
  "Políticas de Personal": "Normativas utilizadas para que el personal pueda ponerse en funcionamiento, articulando las funciones sociales con las metas que posee la empresa.",
  "Mejora Continua": "Principio bajo el cual deben trabajar industrias con problemas ambientales desarrollados durante décadas, disminuyendo costos y eliminando impactos negativos.",
  "Factor Ambiental": "Elemento cuya inclusión es exigida imperativamente para garantizar la competitividad de una empresa y su supervivencia a mediano y largo plazo.",
  "Manejo Ambiental Seguro": "Ingrediente esencial para alcanzar la sustentabilidad, minimizando residuales y teniendo en cuenta técnicas modernas en operaciones industriales.",
  "Residuales": "Desechos que deben ser minimizados obligatoriamente logrando un equilibrio entre desarrollo y medio ambiente.",
  "Necesidad": "Sensación de carencia indispensable para la conservación y desarrollo de un ser vivo, asociada al esfuerzo por suprimir esta falta (ej. la sed).",
  "Deseo": "Es una necesidad que ha tomado la forma específica de un producto, marca o empresa.",
  "Satisfactor": "Producto o servicio desarrollado por la empresa con el fin de cubrir una carencia y despertar el deseo del consumidor.",
  "Oportunidad de Negocio": "Situación que ocurre cuando el marketing detecta necesidades existentes y las transforma en beneficios para la empresa.",
  "Gestión de Company Cars": "Evaluación técnica que consiste en verificar el estado físico, kilometraje y daños de vehículos devueltos a la flota de la empresa."
};

const ValidateBingoClaimInputSchema = z.object({
  winningLineConcepts: z.array(z.string()).length(5).describe('An array of 5 concepts that the student marked as their winning Bingo line. For example: ["Recursos Humanos", "Mejora Continua", "Necesidad", "Deseo", "Satisfactor"].'),
  readDefinitions: z.array(z.string()).describe('A list of all definitions that the teacher explicitly read during the game session. Each string is a full definition text.'),
});
export type ValidateBingoClaimInput = z.infer<typeof ValidateBingoClaimInputSchema>;

const ValidateBingoClaimOutputSchema = z.object({
  isValid: z.boolean().describe('True if the Bingo claim is valid, meaning all 5 concepts in the winning line correspond to definitions that were read by the teacher.'),
  reason: z.string().describe('A detailed explanation in Spanish of the validation result, including which concepts were valid/invalid and why.'),
});
export type ValidateBingoClaimOutput = z.infer<typeof ValidateBingoClaimOutputSchema>;

/**
 * Validates a student's Bingo claim by checking if all concepts in their winning line
 * have had their corresponding definitions read by the teacher during the game.
 * @param input - The student's claimed winning line concepts and the list of definitions read by the teacher.
 * @returns An object indicating if the claim is valid and a reason for the decision.
 */
export async function validateBingoClaim(input: ValidateBingoClaimInput): Promise<ValidateBingoClaimOutput> {
  return validateBingoClaimFlow(input);
}

const validateBingoClaimPrompt = ai.definePrompt({
  name: 'validateBingoClaimPrompt',
  input: { schema: ValidateBingoClaimInputSchema },
  output: { schema: ValidateBingoClaimOutputSchema },
  prompt: `You are an AI assistant whose sole purpose is to validate a student's Bingo claim for a technical management game. You must be precise and strict with the validation rules.\n\nHere are the 5 concepts the student marked as their winning line ("Línea Ganadora"):
{{#each winningLineConcepts}}
- "{{{this}}}"
{{/each}}
\nHere are ALL the definitions that the teacher read during this game session ("Definiciones Leídas por el Profesor"):
{{#each readDefinitions}}
- "{{{this}}}"
{{/each}}
\nBelow is the complete dictionary of all possible concepts and their *correct and unique* definitions for this game ("Diccionario de Conceptos y Definiciones"). You MUST use this dictionary as the ground truth to verify each concept.
--- Diccionario de Conceptos y Definiciones ---
{{json conceptToDefinitionMap}}
--- Fin del Diccionario ---
\nFor each of the 5 concepts in the student's "Línea Ganadora":
1. Find its correct definition in the "Diccionario de Conceptos y Definiciones".
2. Check if that *exact* correct definition is present in the "Definiciones Leídas por el Profesor" list.
\nThe student's Bingo claim is 'isValid: true' ONLY IF ALL 5 concepts in their "Línea Ganadora" meet both criteria. Otherwise, 'isValid: false'.
\nProvide a detailed 'reason' for your decision IN SPANISH, explaining for each of the 5 concepts whether its definition was found and if it was among the definitions read by the teacher. If the claim is invalid, clearly state which concept(s) caused the failure.
\nExample of expected output 'reason' for a valid claim:
"La reclamación de Bingo es válida. Todos los conceptos en la línea ganadora ('Concepto A', 'Concepto B', 'Concepto C', 'Concepto D', 'Concepto E') fueron correctamente asociados a sus definiciones y todas esas definiciones fueron leídas por el profesor."
\nExample of expected output 'reason' for an invalid claim:
"La reclamación de Bingo es inválida. El concepto 'Concepto X' fue marcado en la línea ganadora, pero su definición correcta ('Definición de X') no fue encontrada entre las definiciones leídas por el profesor. Los demás conceptos ('Concepto A', 'Concepto B', 'Concepto C', 'Concepto D') fueron válidos."`,
});

const validateBingoClaimFlow = ai.defineFlow(
  {
    name: 'validateBingoClaimFlow',
    inputSchema: ValidateBingoClaimInputSchema,
    outputSchema: ValidateBingoClaimOutputSchema,
  },
  async (input) => {
    // Call the prompt with the student's input and the comprehensive concept-definition map.
    const { output } = await validateBingoClaimPrompt({
      ...input,
      // Pass the static map to the prompt context. It will be stringified as JSON.
      conceptToDefinitionMap: CONCEPT_DEFINITION_MAP,
    });
    return output!;
  }
);
