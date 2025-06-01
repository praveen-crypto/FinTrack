"use client";

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Trash2, PlusCircle } from 'lucide-react';
import type { FixedExpenseItem, SavingsGoalItem, EmiItem } from '@/types';
import { useToast } from "@/hooks/use-toast";

export default function DataInputPage() {
  const { toast } = useToast();
  const [monthlyIncome, setMonthlyIncome] = useState<number | ''>('');
  
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpenseItem[]>([]);
  const [currentFixedExpense, setCurrentFixedExpense] = useState({ name: '', amount: '' });

  const [savingsGoals, setSavingsGoals] = useState<SavingsGoalItem[]>([]);
  const [currentSavingsGoal, setCurrentSavingsGoal] = useState({ name: '', amount: '' });

  const [emis, setEmis] = useState<EmiItem[]>([]);
  const [currentEmi, setCurrentEmi] = useState({
    loanType: '', principal: '', interestRate: '', tenure: '', monthlyInstallment: '', startDate: '', endDate: ''
  });

  const handleAddFixedExpense = () => {
    if (currentFixedExpense.name && currentFixedExpense.amount) {
      setFixedExpenses([...fixedExpenses, { ...currentFixedExpense, id: uuidv4(), amount: parseFloat(currentFixedExpense.amount) }]);
      setCurrentFixedExpense({ name: '', amount: '' });
    }
  };
  const handleRemoveFixedExpense = (id: string) => setFixedExpenses(fixedExpenses.filter(fe => fe.id !== id));

  const handleAddSavingsGoal = () => {
    if (currentSavingsGoal.name && currentSavingsGoal.amount) {
      setSavingsGoals([...savingsGoals, { ...currentSavingsGoal, id: uuidv4(), amount: parseFloat(currentSavingsGoal.amount) }]);
      setCurrentSavingsGoal({ name: '', amount: '' });
    }
  };
  const handleRemoveSavingsGoal = (id: string) => setSavingsGoals(savingsGoals.filter(sg => sg.id !== id));

  const handleAddEmi = () => {
    if (currentEmi.loanType && currentEmi.principal && currentEmi.interestRate && currentEmi.tenure && currentEmi.monthlyInstallment && currentEmi.startDate && currentEmi.endDate) {
      setEmis([...emis, { 
        ...currentEmi, 
        id: uuidv4(), 
        principal: parseFloat(currentEmi.principal),
        interestRate: parseFloat(currentEmi.interestRate),
        tenure: parseInt(currentEmi.tenure),
        monthlyInstallment: parseFloat(currentEmi.monthlyInstallment),
      }]);
      setCurrentEmi({ loanType: '', principal: '', interestRate: '', tenure: '', monthlyInstallment: '', startDate: '', endDate: '' });
    }
  };
  const handleRemoveEmi = (id: string) => setEmis(emis.filter(e => e.id !== id));

  const handleSaveAllData = () => {
    // In a real app, this would send data to a backend.
    console.log({ monthlyIncome, fixedExpenses, savingsGoals, emis });
    toast({
      title: "Data Saved (Simulated)",
      description: "Your financial data has been 'saved'. Check console for output.",
      variant: "default",
    });
  };

  return (
    <div className="flex flex-1 flex-col">
      <Header title="Manual Data Input" />
      <main className="flex-1 p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Income</CardTitle>
            <CardDescription>Enter your total net monthly income from all sources.</CardDescription>
          </CardHeader>
          <CardContent>
            <Label htmlFor="monthlyIncome">Net Monthly Income (₹)</Label>
            <Input 
              id="monthlyIncome" 
              type="number" 
              placeholder="e.g., 75000" 
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value === '' ? '' : parseFloat(e.target.value))} 
              className="mt-1"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fixed Expenses</CardTitle>
            <CardDescription>Add your recurring fixed monthly expenses (rent, utilities, etc.).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {fixedExpenses.map(fe => (
              <div key={fe.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                <span>{fe.name}: ₹{fe.amount.toLocaleString()}</span>
                <Button variant="ghost" size="icon" onClick={() => handleRemoveFixedExpense(fe.id)} aria-label="Remove fixed expense">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <Label htmlFor="feName">Expense Name</Label>
                <Input id="feName" placeholder="e.g., Rent" value={currentFixedExpense.name} onChange={e => setCurrentFixedExpense({...currentFixedExpense, name: e.target.value})} className="mt-1"/>
              </div>
              <div>
                <Label htmlFor="feAmount">Amount (₹)</Label>
                <Input id="feAmount" type="number" placeholder="e.g., 15000" value={currentFixedExpense.amount} onChange={e => setCurrentFixedExpense({...currentFixedExpense, amount: e.target.value})} className="mt-1"/>
              </div>
              <Button onClick={handleAddFixedExpense} className="w-full md:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Expense
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Savings Goals</CardTitle>
            <CardDescription>Define your monthly savings goals.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {savingsGoals.map(sg => (
              <div key={sg.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                <span>{sg.name}: ₹{sg.amount.toLocaleString()}</span>
                <Button variant="ghost" size="icon" onClick={() => handleRemoveSavingsGoal(sg.id)} aria-label="Remove savings goal">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <Label htmlFor="sgName">Goal Name</Label>
                <Input id="sgName" placeholder="e.g., Emergency Fund" value={currentSavingsGoal.name} onChange={e => setCurrentSavingsGoal({...currentSavingsGoal, name: e.target.value})} className="mt-1"/>
              </div>
              <div>
                <Label htmlFor="sgAmount">Amount (₹)</Label>
                <Input id="sgAmount" type="number" placeholder="e.g., 10000" value={currentSavingsGoal.amount} onChange={e => setCurrentSavingsGoal({...currentSavingsGoal, amount: e.target.value})} className="mt-1"/>
              </div>
              <Button onClick={handleAddSavingsGoal} className="w-full md:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Goal
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>EMI Details</CardTitle>
            <CardDescription>Add details of your ongoing EMIs.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {emis.map(emi => (
              <div key={emi.id} className="p-3 bg-muted/50 rounded-md space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{emi.loanType} - ₹{emi.monthlyInstallment.toLocaleString()}/month</span>
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveEmi(emi.id)} aria-label="Remove EMI">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Principal: ₹{emi.principal.toLocaleString()} | Rate: {emi.interestRate}% | Tenure: {emi.tenure} months</p>
                <p className="text-xs text-muted-foreground">Dates: {emi.startDate} to {emi.endDate}</p>
              </div>
            ))}
            <Separator />
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label htmlFor="emiLoanType">Loan Type</Label><Input id="emiLoanType" placeholder="e.g., Car Loan" value={currentEmi.loanType} onChange={e => setCurrentEmi({...currentEmi, loanType: e.target.value})} className="mt-1"/></div>
                <div><Label htmlFor="emiPrincipal">Principal (₹)</Label><Input id="emiPrincipal" type="number" placeholder="e.g., 500000" value={currentEmi.principal} onChange={e => setCurrentEmi({...currentEmi, principal: e.target.value})} className="mt-1"/></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><Label htmlFor="emiInterestRate">Interest Rate (%)</Label><Input id="emiInterestRate" type="number" placeholder="e.g., 8.5" value={currentEmi.interestRate} onChange={e => setCurrentEmi({...currentEmi, interestRate: e.target.value})} className="mt-1"/></div>
                <div><Label htmlFor="emiTenure">Tenure (months)</Label><Input id="emiTenure" type="number" placeholder="e.g., 36" value={currentEmi.tenure} onChange={e => setCurrentEmi({...currentEmi, tenure: e.target.value})} className="mt-1"/></div>
                <div><Label htmlFor="emiMonthlyInstallment">Monthly Installment (₹)</Label><Input id="emiMonthlyInstallment" type="number" placeholder="e.g., 15000" value={currentEmi.monthlyInstallment} onChange={e => setCurrentEmi({...currentEmi, monthlyInstallment: e.target.value})} className="mt-1"/></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label htmlFor="emiStartDate">Start Date</Label><Input id="emiStartDate" type="date" value={currentEmi.startDate} onChange={e => setCurrentEmi({...currentEmi, startDate: e.target.value})} className="mt-1"/></div>
                <div><Label htmlFor="emiEndDate">End Date</Label><Input id="emiEndDate" type="date" value={currentEmi.endDate} onChange={e => setCurrentEmi({...currentEmi, endDate: e.target.value})} className="mt-1"/></div>
              </div>
              <Button onClick={handleAddEmi} className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" /> Add EMI
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end pt-4">
          <Button size="lg" onClick={handleSaveAllData} className="bg-primary hover:bg-primary/90">
            Save All Data
          </Button>
        </div>
      </main>
    </div>
  );
}
