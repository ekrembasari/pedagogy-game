'use server';
/**
 * @fileOverview Generates a skill summary report for parents based on their child's performance data.
 *
 * - generateProgressReport - A function that generates a report about student challenges and strengths.
 * - ProgressReportInput - The input type for the generateProgressReport function.
 * - ProgressReportOutput - The return type for the generateProgressReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProgressReportInputSchema = z.object({
  studentName: z.string().describe('The name of the student.'),
  challengesCompleted: z.number().describe('The number of challenges the student has completed.'),
  patienceScore: z.number().describe('A score representing the student\'s patience during problem-solving.'),
  strategyAdaptationScore: z.number().describe('A score representing the student\'s ability to adapt strategies.'),
  focusScore: z.number().describe('A score representing the student\'s focus during problem-solving.'),
  strengths: z.string().describe('A comma separated list of student strengths.'),
  struggles: z.string().describe('A comma separated list of student struggles.'),
});
export type ProgressReportInput = z.infer<typeof ProgressReportInputSchema>;

const ProgressReportOutputSchema = z.object({
  report: z.string().describe('A summary report of the student\'s skills and areas for improvement.'),
});
export type ProgressReportOutput = z.infer<typeof ProgressReportOutputSchema>;

export async function generateProgressReport(input: ProgressReportInput): Promise<ProgressReportOutput> {
  return progressReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'progressReportPrompt',
  input: {schema: ProgressReportInputSchema},
  output: {schema: ProgressReportOutputSchema},
  prompt: `You are an AI assistant that generates progress reports for parents about their child\'s problem-solving skills.

  Based on the student\'s performance data, provide a summary report highlighting their strengths and areas for improvement.

  Student Name: {{{studentName}}}
  Challenges Completed: {{{challengesCompleted}}}
  Patience Score: {{{patienceScore}}}
  Strategy Adaptation Score: {{{strategyAdaptationScore}}}
  Focus Score: {{{focusScore}}}
  Strengths: {{{strengths}}}
  Struggles: {{{struggles}}}

  Generate a concise and informative report for the parent.
  `,
});

const progressReportFlow = ai.defineFlow(
  {
    name: 'progressReportFlow',
    inputSchema: ProgressReportInputSchema,
    outputSchema: ProgressReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
