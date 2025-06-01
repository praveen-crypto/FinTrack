'use server';

/**
 * @fileOverview AI-powered lifestyle guide that provides advice on maintaining lifestyle quality based on spending power and tips on avoiding over-leveraging.
 *
 * - getLifestyleGuide - A function that provides personalized lifestyle and financial advice.
 * - LifestyleGuideInput - The input type for the getLifestyleGuide function.
 * - LifestyleGuideOutput - The return type for the getLifestyleGuide function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LifestyleGuideInputSchema = z.object({
  spendingPower: z
    .number()
    .describe(
      'The amount of money the user has available to spend after fixed expenses, savings, and EMIs.'
    ),
  totalMonthlyExpenses: z.number().describe('The total monthly expenses of the user.'),
  incomeToDebtRatio: z
    .number()
    .describe(
      'The ratio of the user’s income to their total debt, which is their total monthly EMI payments divided by their total monthly income.'
    ),
});
export type LifestyleGuideInput = z.infer<typeof LifestyleGuideInputSchema>;

const LifestyleGuideOutputSchema = z.object({
  lifestyleAdvice: z
    .string()
    .describe(
      'Personalized advice on maintaining lifestyle quality based on spending power.'
    ),
  overLeveragingTips: z
    .string()
    .describe('Tips on avoiding over-leveraging and responsible spending.'),
});
export type LifestyleGuideOutput = z.infer<typeof LifestyleGuideOutputSchema>;

export async function getLifestyleGuide(input: LifestyleGuideInput): Promise<LifestyleGuideOutput> {
  return lifestyleGuideFlow(input);
}

const prompt = ai.definePrompt({
  name: 'lifestyleGuidePrompt',
  input: {schema: LifestyleGuideInputSchema},
  output: {schema: LifestyleGuideOutputSchema},
  prompt: `You are a personal finance advisor providing advice to users based on their financial situation.

  Provide lifestyle advice based on the user's spending power, and give tips on avoiding over-leveraging.

  Spending Power: {{{spendingPower}}}
  Total Monthly Expenses: {{{totalMonthlyExpenses}}}
  Income to Debt Ratio: {{{incomeToDebtRatio}}}
  `,
});

const lifestyleGuideFlow = ai.defineFlow(
  {
    name: 'lifestyleGuideFlow',
    inputSchema: LifestyleGuideInputSchema,
    outputSchema: LifestyleGuideOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
