'use server';

/**
 * @fileOverview AI-powered spending advisor to provide personalized suggestions on how to reduce spending.
 *
 * - getSpendingAdvice - A function that returns personalized spending advice.
 * - SpendingAdvisorInput - The input type for the getSpendingAdvice function.
 * - SpendingAdvisorOutput - The return type for the getSpendingAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SpendingAdvisorInputSchema = z.object({
  spendingData: z
    .string()
    .describe(
      'A detailed breakdown of the user\'s spending habits, including categories and amounts spent in each category (e.g., Groceries: ₹10000, Dining out: ₹5000).'
    ),
  income: z.number().describe('The user\'s monthly income in their local currency (e.g., ₹).'),
  fixedExpenses: z.number().describe('The user\'s total fixed monthly expenses in their local currency (e.g., ₹).'),
  savingsGoal: z.number().describe('The user\'s monthly savings goal in their local currency (e.g., ₹).'),
  emiPayments: z.number().describe('The user\'s total monthly EMI payments in their local currency (e.g., ₹).'),
});

export type SpendingAdvisorInput = z.infer<typeof SpendingAdvisorInputSchema>;

const SpendingAdvisorOutputSchema = z.object({
  advice: z.string().describe('Personalized advice on how to reduce spending.'),
});

export type SpendingAdvisorOutput = z.infer<typeof SpendingAdvisorOutputSchema>;

export async function getSpendingAdvice(input: SpendingAdvisorInput): Promise<SpendingAdvisorOutput> {
  return spendingAdvisorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'spendingAdvisorPrompt',
  input: {schema: SpendingAdvisorInputSchema},
  output: {schema: SpendingAdvisorOutputSchema},
  prompt: `You are a personal finance advisor. Analyze the user's spending data and provide personalized advice on how to reduce spending. Assume all monetary values are in the user's local currency (e.g., ₹).

  Here's the user's financial situation:
  Monthly Income: {{{income}}}
  Fixed Expenses: {{{fixedExpenses}}}
  Savings Goal: {{{savingsGoal}}}
  EMI Payments: {{{emiPayments}}}

  Spending Data:
  {{#if spendingData}}
    {{{spendingData}}}
  {{else}}
    No spending data available.
  {{/if}}

  Based on this information, provide specific and actionable advice on how the user can reduce their spending. Focus on areas where they are spending the most money and suggest alternative options or strategies.
  Avoid generic advice; make the suggestions tailored to the user's individual spending patterns.
  Limit the response to 200 words.
  `,
});

const spendingAdvisorFlow = ai.defineFlow(
  {
    name: 'spendingAdvisorFlow',
    inputSchema: SpendingAdvisorInputSchema,
    outputSchema: SpendingAdvisorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
