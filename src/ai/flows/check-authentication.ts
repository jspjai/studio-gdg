'use server';
/**
 * @fileOverview AI flow for checking if the application can test areas requiring authentication.
 *
 * - checkAuthentication - A function that checks authentication capability and provides feedback.
 * - CheckAuthenticationInput - The input type for the checkAuthentication function.
 * - CheckAuthenticationOutput - The return type for the checkAuthentication function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CheckAuthenticationInputSchema = z.object({
  targetUrl: z
    .string()
    .url()
    .describe('The URL of the target web application to be scanned.'),
});
export type CheckAuthenticationInput = z.infer<typeof CheckAuthenticationInputSchema>;

const CheckAuthenticationOutputSchema = z.object({
  canAccessAuthenticatedAreas: z
    .boolean()
    .describe(
      'Whether the application can access areas of the web application that require authentication.'
    ),
  feedback: z
    .string()
    .describe(
      'Feedback on whether the application can access authenticated areas and any related information.'
    ),
});
export type CheckAuthenticationOutput = z.infer<typeof CheckAuthenticationOutputSchema>;

export async function checkAuthentication(input: CheckAuthenticationInput): Promise<CheckAuthenticationOutput> {
  return checkAuthenticationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'checkAuthenticationPrompt',
  input: {schema: CheckAuthenticationInputSchema},
  output: {schema: CheckAuthenticationOutputSchema},
  prompt: `You are a security expert assessing whether a web application scanner can access authenticated areas of a website.

  Determine if the provided web application scanner can access authenticated areas of the target web application.
  Provide feedback in the "feedback" field about the scan's ability to access authenticated areas and include any relevant information.

  Target URL: {{{targetUrl}}}
`,
});

const checkAuthenticationFlow = ai.defineFlow(
  {
    name: 'checkAuthenticationFlow',
    inputSchema: CheckAuthenticationInputSchema,
    outputSchema: CheckAuthenticationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
