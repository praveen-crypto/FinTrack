"use client";

import { useState, useEffect, FormEvent } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, Calculator } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export default function SpendingPowerPage() {
  const { toast } = useToast();
  const [income, setIncome] = useState<number | ''>('');
  const [fixedExpenses, setFixedExpenses] = useState<number | ''>('');
  const [savingsGoal, setSavingsGoal] = useState<number | ''>('');
  const [totalEmis, setTotalEmis] = useState<number | ''>('');
  const [spendingPower, setSpendingPower] = useState<number | null>(null);

  // Animation state
  const [showResult, setShowResult] = useState(false);

  const calculateSpendingPower = (e: FormEvent) => {
    e.preventDefault();
    const numIncome = Number(income);
    const numFixedExpenses = Number(fixedExpenses);
    const numSavingsGoal = Number(savingsGoal);
    const numTotalEmis = Number(totalEmis);

    if (isNaN(numIncome) || isNaN(numFixedExpenses) || isNaN(numSavingsGoal) || isNaN(numTotalEmis)) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid numbers for all fields.",
        variant: "destructive",
      });
      return;
    }

    const result = numIncome - numFixedExpenses - numSavingsGoal - numTotalEmis;
    setSpendingPower(result);
    setShowResult(false); // Reset animation
    setTimeout(() => setShowResult(true), 10); // Trigger animation
     toast({
      title: "Calculation Complete",
      description: `Your estimated spending power is ₹${result.toLocaleString()}.`,
    });
  };

  return (
    <div className="flex flex-1 flex-col">
      <Header title="Spending Power" />
      <main className="flex-1 p-6 space-y-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-6 w-6 text-primary" />
              Calculate Your Spending Power
            </CardTitle>
            <CardDescription>
              Enter your financial details to determine your available spending power for the month.
              Spending Power = Income - Fixed Expenses - Savings Goal - Total EMIs.
            </CardDescription>
          </CardHeader>
          <form onSubmit={calculateSpendingPower}>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="income">Total Net Monthly Income (₹)</Label>
                <Input id="income" type="number" placeholder="e.g., 75000" value={income} onChange={(e) => setIncome(e.target.value === '' ? '' : parseFloat(e.target.value))} required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="fixedExpenses">Total Fixed Expenses (₹)</Label>
                <Input id="fixedExpenses" type="number" placeholder="e.g., 30000" value={fixedExpenses} onChange={(e) => setFixedExpenses(e.target.value === '' ? '' : parseFloat(e.target.value))} required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="savingsGoal">Monthly Savings Goal (₹)</Label>
                <Input id="savingsGoal" type="number" placeholder="e.g., 10000" value={savingsGoal} onChange={(e) => setSavingsGoal(e.target.value === '' ? '' : parseFloat(e.target.value))} required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="totalEmis">Total Monthly EMI Payments (₹)</Label>
                <Input id="totalEmis" type="number" placeholder="e.g., 5000" value={totalEmis} onChange={(e) => setTotalEmis(e.target.value === '' ? '' : parseFloat(e.target.value))} required className="mt-1" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" size="lg">
                <TrendingUp className="mr-2 h-5 w-5" /> Calculate
              </Button>
            </CardFooter>
          </form>
        </Card>

        {spendingPower !== null && (
          <Card 
            className={`max-w-2xl mx-auto mt-6 transition-all duration-500 ease-out transform ${showResult ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-7 w-7 text-primary" />
                Your Estimated Spending Power
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-bold text-primary text-center py-6">
                ₹{spendingPower.toLocaleString()}
              </p>
              <p className="text-center text-muted-foreground">This is the amount you can spend this month after all deductions.</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
