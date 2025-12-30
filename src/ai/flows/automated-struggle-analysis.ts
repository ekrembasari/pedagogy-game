'use server';

/**
 * @fileOverview Implements a Genkit flow to provide automated struggle analysis for students. When the
 * system detects a student is struggling with a problem, it offers helpful advice and resources.
 *
 * @interface StruggleAnalysisInput - Defines the input schema for the struggle analysis flow.
 * @interface StruggleAnalysisOutput - Defines the output schema for the struggle analysis flow.
 * @function analyzeStudentStruggle - The main function to analyze student struggle and provide guidance.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StruggleAnalysisInputSchema = z.object({
  problemDescription: z.string().describe('The description of the problem the student is working on.'),
  attempts: z.number().describe('The number of attempts the student has made on the problem.'),
  timeSpent: z.number().describe('The time spent on the problem in seconds.'),
  hintUsed: z.boolean().describe('Whether the student has used a hint or not.'),
});
export type StruggleAnalysisInput = z.infer<typeof StruggleAnalysisInputSchema>;

const StruggleAnalysisOutputSchema = z.object({
  advice: z.string().describe('Helpful advice for the student to guide them towards a solution.'),
  resourceLinks: z.array(z.string()).describe('Links to helpful resources.'),
});
export type StruggleAnalysisOutput = z.infer<typeof StruggleAnalysisOutputSchema>;

export async function analyzeStudentStruggle(input: StruggleAnalysisInput): Promise<StruggleAnalysisOutput> {
  return analyzeStudentStruggleFlow(input);
}

const struggleAnalysisPrompt = ai.definePrompt({
  name: 'struggleAnalysisPrompt',
  input: {schema: StruggleAnalysisInputSchema},
  output: {schema: StruggleAnalysisOutputSchema},
  prompt: `You are an AI assistant designed to help students who are struggling with math problems.

  Based on the following information about the student's attempt, provide helpful advice and resources.

  Problem Description: {{{problemDescription}}}
  Attempts: {{{attempts}}}
  Time Spent: {{{timeSpent}}} seconds
  Hint Used: {{{hintUsed}}}

  Consider the number of attempts, time spent, and whether a hint was used to determine if the student is struggling.

  If the student is struggling, provide specific, actionable advice to help them solve the problem. Also, provide a list of relevant resource links.

  Format the output as a JSON object with "advice" and "resourceLinks" fields. The resourceLinks field should be an array of strings.
  `,
});

const analyzeStudentStruggleFlow = ai.defineFlow(
  {
    name: 'analyzeStudentStruggleFlow',
    inputSchema: StruggleAnalysisInputSchema,
    outputSchema: StruggleAnalysisOutputSchema,
  },
  async input => {
    const {output} = await struggleAnalysisPrompt(input);
    return output!;
  }
);
