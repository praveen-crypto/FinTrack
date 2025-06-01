"use client";

import { useState, FormEvent } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { getSpendingAdvice, SpendingAdvisorInput } from '@/ai/flows/spending-advisor';
import { useToast } from "@/hooks/use-toast";

export default function SpendingAdvisorPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<SpendingAdvisorInput>({
    spendingData: '',
    income: 0,
    fixedExpenses: 0,
    savingsGoal: 0,
    emiPayments: 0,
  });
  const [advice, setAdvice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'spendingData' ? value : parseFloat(value) || 0 }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAdvice(null);
    setShowResult(false);

    try {
      const result = await getSpendingAdvice(formData);
      setAdvice(result.advice);
      setShowResult(true);
       toast({
        title: "Advice Generated!",
        description: "Your personalized spending advice is ready.",
      });
    } catch (error) {
      console.error("Error getting spending advice:", error);
      toast({
        title: "Error",
        description: "Failed to generate spending advice. Please try again.",
        variant: "destructive",
      });
      setAdvice("Sorry, I couldn't generate advice at this time. Please try again later.");
      setShowResult(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <Header title="AI Spending Advisor" />
      <main className="flex-1 p-6 space-y-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              Get Personalized Spending Advice
            </CardTitle>
            <CardDescription>
              Provide your financial details, and our AI will give you suggestions to reduce spending.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="spendingData">Spending Data (Describe your spending habits)</Label>
                <Textarea
                  id="spendingData"
                  name="spendingData"
                  placeholder="e.g., Groceries: ₹10000, Dining out: ₹5000, Subscriptions: ₹1000, Shopping: ₹4000..."
                  value={formData.spendingData}
                  onChange={handleChange}
                  className="mt-1 min-h-[100px]"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="income">Monthly Income (₹)</Label>
                  <Input id="income" name="income" type="number" placeholder="e.g., 75000" value={formData.income || ''} onChange={handleChange} required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="fixedExpenses">Fixed Expenses (₹)</Label>
                  <Input id="fixedExpenses" name="fixedExpenses" type="number" placeholder="e.g., 30000" value={formData.fixedExpenses || ''} onChange={handleChange} required className="mt-1" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="savingsGoal">Savings Goal (₹)</Label>
                  <Input id="savingsGoal" name="savingsGoal" type="number" placeholder="e.g., 10000" value={formData.savingsGoal || ''} onChange={handleChange} required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="emiPayments">EMI Payments (₹)</Label>
                  <Input id="emiPayments" name="emiPayments" type="number" placeholder="e.g., 5000" value={formData.emiPayments || ''} onChange={handleChange} required className="mt-1" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" size="lg" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
                Get Advice
              </Button>
            </CardFooter>
          </form>
        </Card>

        {advice && (
          <Card 
            className={`max-w-2xl mx-auto mt-6 transition-all duration-500 ease-out transform ${showResult ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
          >
            <CardHeader>
              <CardTitle>Your Personalized Advice</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{advice}</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
