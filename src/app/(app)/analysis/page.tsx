"use client";

import { useState, FormEvent } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BarChartBig, Percent, BadgeDollarSign, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface AnalysisResults {
  totalMonthlyEmis: number;
  incomeToDebtRatio: number;
  minimumSalary: number;
}

export default function AnalysisPage() {
  const { toast } = useToast();
  const [monthlyIncome, setMonthlyIncome] = useState<number | ''>('');
  const [totalEmis, setTotalEmis] = useState<number | ''>('');
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [showResult, setShowResult] = useState(false);

  const calculateAnalysis = (e: FormEvent) => {
    e.preventDefault();
    const numIncome = Number(monthlyIncome);
    const numTotalEmis = Number(totalEmis);

    if (isNaN(numIncome) || isNaN(numTotalEmis) || numIncome <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid positive numbers for income and EMIs.",
        variant: "destructive",
      });
      return;
    }
     if (numTotalEmis < 0) {
      toast({
        title: "Invalid Input",
        description: "Total EMIs cannot be negative.",
        variant: "destructive",
      });
      return;
    }


    const incomeToDebtRatio = numTotalEmis > 0 ? (numTotalEmis / numIncome) : 0;
    // Assuming a comfortable DTI is around 33% (1/3), so minimum salary is 3x EMIs.
    // Or if no EMIs, it implies no specific minimum salary constraint from debt.
    const minimumSalary = numTotalEmis > 0 ? numTotalEmis * 3 : 0; 

    setResults({
      totalMonthlyEmis: numTotalEmis,
      incomeToDebtRatio: parseFloat(incomeToDebtRatio.toFixed(2)),
      minimumSalary: parseFloat(minimumSalary.toFixed(2)),
    });
    setShowResult(false);
    setTimeout(() => setShowResult(true), 10);
    toast({
      title: "Analysis Complete",
      description: "Your financial analysis is ready.",
    });
  };

  const getRatioMessage = (ratio: number) => {
    if (ratio === 0) return { message: "No debt payments, excellent!", icon: <CheckCircle2 className="h-5 w-5 text-green-500" />, color: "text-green-500" };
    if (ratio <= 0.36) return { message: "Healthy debt level.", icon: <CheckCircle2 className="h-5 w-5 text-green-500" />, color: "text-green-500" };
    if (ratio <= 0.43) return { message: "Manageable, but be cautious.", icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />, color: "text-yellow-500" };
    return { message: "High debt level, consider reducing.", icon: <AlertTriangle className="h-5 w-5 text-destructive" />, color: "text-destructive" };
  };

  return (
    <div className="flex flex-1 flex-col">
      <Header title="Financial Analysis" />
      <main className="flex-1 p-6 space-y-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChartBig className="h-6 w-6 text-primary" />
              EMI & Salary Analysis
            </CardTitle>
            <CardDescription>
              Understand your debt burden and the minimum salary required to manage your EMIs comfortably.
            </CardDescription>
          </CardHeader>
          <form onSubmit={calculateAnalysis}>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="monthlyIncome">Total Net Monthly Income (₹)</Label>
                <Input id="monthlyIncome" type="number" placeholder="e.g., 75000" value={monthlyIncome} onChange={(e) => setMonthlyIncome(e.target.value === '' ? '' : parseFloat(e.target.value))} required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="totalEmis">Total Monthly EMI Payments (₹)</Label>
                <Input id="totalEmis" type="number" placeholder="e.g., 15000" value={totalEmis} onChange={(e) => setTotalEmis(e.target.value === '' ? '' : parseFloat(e.target.value))} required className="mt-1" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" size="lg">
                Analyze
              </Button>
            </CardFooter>
          </form>
        </Card>

        {results && (
          <Card 
            className={`max-w-2xl mx-auto mt-6 transition-all duration-500 ease-out transform ${showResult ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
          >
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-md">
                <div className="flex items-center gap-3">
                  <BadgeDollarSign className="h-7 w-7 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Monthly EMI Payments</p>
                    <p className="text-2xl font-semibold">₹{results.totalMonthlyEmis.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-md">
                <div className="flex items-center gap-3">
                  <Percent className={`h-7 w-7 ${getRatioMessage(results.incomeToDebtRatio).color}`} />
                  <div>
                    <p className="text-sm text-muted-foreground">Income-to-Debt Ratio</p>
                    <p className={`text-2xl font-semibold ${getRatioMessage(results.incomeToDebtRatio).color}`}>
                      {(results.incomeToDebtRatio * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>
                <div className={`flex items-center gap-1 text-xs ${getRatioMessage(results.incomeToDebtRatio).color}`}>
                  {getRatioMessage(results.incomeToDebtRatio).icon}
                  <span>{getRatioMessage(results.incomeToDebtRatio).message}</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-md">
                <div className="flex items-center gap-3">
                   <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary lucide lucide-user-check"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="17.5 8 19 9.5 22.5 6"/></svg>
                  <div>
                    <p className="text-sm text-muted-foreground">Min. Recommended Monthly Salary</p>
                    <p className="text-2xl font-semibold">₹{results.minimumSalary.toLocaleString()}</p>
                  </div>
                </div>
                {results.minimumSalary > 0 && (
                  <p className="text-xs text-muted-foreground text-right">To comfortably service current EMIs (based on ~33% DTI).</p>
                )}
                 {results.minimumSalary === 0 && (
                  <p className="text-xs text-muted-foreground text-right">No EMI payments, so no specific minimum salary constraint from debt.</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
