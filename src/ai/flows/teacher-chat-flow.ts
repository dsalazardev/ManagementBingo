
'use server';
/**
 * @fileOverview Un flujo de Genkit para asistir al Director de Juego con dudas sobre los conceptos.
 *
 * - teacherChat - Función para procesar consultas del profesor.
 * - TeacherChatInput - Interfaz de entrada.
 * - TeacherChatOutput - Interfaz de salida.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TeacherChatInputSchema = z.object({
  message: z.string().describe('La consulta del profesor sobre un término o concepto.'),
  gameContext: z.string().describe('El contexto de definiciones actuales del juego para referencia.'),
});
export type TeacherChatInput = z.infer<typeof TeacherChatInputSchema>;

const TeacherChatOutputSchema = z.object({
  answer: z.string().describe('La respuesta pedagógica y técnica del asistente.'),
});
export type TeacherChatOutput = z.infer<typeof TeacherChatOutputSchema>;

const teacherChatPrompt = ai.definePrompt({
  name: 'teacherChatPrompt',
  input: { schema: TeacherChatInputSchema },
  output: { schema: TeacherChatOutputSchema },
  prompt: `Eres un asistente experto en Gestión Técnica, Recursos Humanos y Estrategia Ambiental. 
Tu misión es ayudar al Director de Juego (profesor) a explicar mejor los conceptos a sus alumnos.

Contexto del Juego (Definiciones actuales):
"""
{{{gameContext}}}
"""

Consulta del Profesor:
"{{{message}}}"

Responde de forma concisa, profesional y pedagógica. Si te preguntan por un término que no está en el contexto, usa tu conocimiento general para dar una definición alineada con la gestión técnica profesional.`,
});

export async function teacherChat(input: TeacherChatInput): Promise<TeacherChatOutput> {
  const { output } = await teacherChatPrompt(input);
  if (!output) {
    return { answer: "Lo siento, tuve un problema al procesar tu respuesta. Por favor, intenta de nuevo." };
  }
  return output;
}
