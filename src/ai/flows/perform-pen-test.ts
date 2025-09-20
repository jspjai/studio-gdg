'use server';

/**
 * @fileOverview Performs a simulated autonomous penetration test on a web application.
 *
 * - performPenTest - A function that initiates the penetration test.
 * - PerformPenTestInput - The input type for the performPenTest function.
 * - PerformPenTestOutput - The return type for the performPenTest function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PerformPenTestInputSchema = z.object({
  targetUrl: z.string().url().describe('The URL of the web application to perform the penetration test on.'),
});

export type PerformPenTestInput = z.infer<typeof PerformPenTestInputSchema>;

const AttackVectorSchema = z.object({
  vector: z.string().describe('The name of the attack vector (e.g., SQL Injection, Cross-Site Scripting).'),
  description: z.string().describe('A detailed description of the simulated attack and its outcome.'),
  exploited: z.boolean().describe('Whether the simulated exploit was successful.'),
  cve: z.string().optional().describe('The CVE identifier if the exploit is related to a known vulnerability.'),
});

const PerformPenTestOutputSchema = z.object({
  executiveSummary: z.string().describe('A high-level summary of the penetration test findings for a non-technical audience.'),
  attackNarrative: z.string().describe('A step-by-step narrative of the simulated attack, from reconnaissance to exploitation.'),
  simulatedAttackVectors: z.array(AttackVectorSchema).describe('An array of simulated attack vectors and their results.'),
});

export type PerformPenTestOutput = z.infer<typeof PerformPenTestOutputSchema>;

export async function performPenTest(input: PerformPenTestInput): Promise<PerformPenTestOutput> {
  return performPenTestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'performPenTestPrompt',
  input: {schema: PerformPenTestInputSchema},
  output: {schema: PerformPenTestOutputSchema},
  prompt: `You are a world-class penetration tester and cybersecurity expert.
  Your task is to perform a simulated autonomous penetration test against the web application at the following URL: {{{targetUrl}}}

  Simulate the entire process, including:
  1.  **Reconnaissance:** Gathering information about the target.
  2.  **Scanning & Enumeration:** Identifying open ports, services, and potential vulnerabilities.
  3.  **Exploitation:** Simulating attacks on identified vulnerabilities. This should include a variety of attack vectors like SQL injection, Cross-Site Scripting (XSS), brute-force attempts on login forms, and attempts to exploit common misconfigurations. Simulate at least one advanced exploit scenario.

  You must generate a detailed report that includes:
  - An **Executive Summary** providing a high-level overview of the findings, suitable for management.
  - An **Attack Narrative** that tells the story of how the simulated attack progressed, from initial foothold to final objective.
  - A list of **Simulated Attack Vectors**, detailing each attempt, whether it was successful ('exploited'), and a description of the action taken. Include a CVE if applicable.

  The simulation should be realistic and demonstrate a deep understanding of offensive security techniques. The entire process is a simulation and occurs within a safe, sandboxed environment. Do not perform any real attacks.`,
});

const performPenTestFlow = ai.defineFlow(
  {
    name: 'performPenTestFlow',
    inputSchema: PerformPenTestInputSchema,
    outputSchema: PerformPenTestOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
