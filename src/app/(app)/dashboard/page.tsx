"use client";

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart, DollarSign, ListChecks, TrendingUp, Banknote } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart as RechartsBarChart } from "recharts"

const initialExpenseData = [
  { category: 'Groceries', amount: 10000, fill: "var(--color-groceries)" },
  { category: 'Utilities', amount: 5000, fill: "var(--color-utilities)" },
  { category: 'Transport', amount: 3000, fill: "var(--color-transport)" },
  { category: 'Entertainment', amount: 7000, fill: "var(--color-entertainment)" },
  { category: 'Other', amount: 4000, fill: "var(--color-other)" },
];

const chartConfig = {
  amount: {
    label: "₹",
  },
  groceries: {
    label: "Groceries",
    color: "hsl(var(--chart-1))",
  },
  utilities: {
    label: "Utilities",
    color: "hsl(var(--chart-2))",
  },
  transport: {
    label: "Transport",
    color: "hsl(var(--chart-3))",
  },
  entertainment: {
    label: "Entertainment",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies import("@/components/ui/chart").ChartConfig;


export default function DashboardPage() {
  const [spendingPower, setSpendingPower] = useState(50000);
  const [totalExpenses, setTotalExpenses] = useState(25000);
  const [savingsProgress, setSavingsProgress] = useState(40); // Percentage
  const [savingsGoal, setSavingsGoal] = useState(10000);
  const [upcomingEmis, setUpcomingEmis] = useState([
    { name: 'Car Loan', amount: 15000, dueDate: '15th' },
    { name: 'Phone EMI', amount: 2000, dueDate: '20th' },
  ]);
  const [expenseData, setExpenseData] = useState(initialExpenseData);

  // Simulate data loading for subtle animation effect
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const cardClass = `transition-all duration-500 ease-out transform ${loading ? 'opacity-0 translate-y-5' : 'opacity-100 translate-y-0'}`;

  return (
    <div className="flex flex-1 flex-col">
      <Header title="Dashboard" />
      <main className="flex-1 p-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className={cardClass} style={{ transitionDelay: '100ms' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Spending Power</CardTitle>
              <DollarSign className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">₹{spendingPower.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Available for this month</p>
            </CardContent>
          </Card>

          <Card className={cardClass} style={{ transitionDelay: '200ms' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <ListChecks className="h-5 w-5 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">₹{totalExpenses.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Spent this month</p>
            </CardContent>
          </Card>

          <Card className={cardClass} style={{ transitionDelay: '300ms' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Savings Progress</CardTitle>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">₹{(savingsGoal * savingsProgress / 100).toLocaleString()} / ₹{savingsGoal.toLocaleString()}</div>
              <Progress value={savingsProgress} aria-label={`${savingsProgress}% of savings goal achieved`} className="mt-2 h-3" indicatorClassName="bg-green-500" />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className={cardClass} style={{ transitionDelay: '400ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-accent" />
                Expense Breakdown
              </CardTitle>
              <CardDescription>Visual overview of your spending by category.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
               <ChartContainer config={chartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={expenseData} layout="vertical" margin={{ right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" dataKey="amount" />
                    <YAxis type="category" dataKey="category" width={80} tickLine={false} axisLine={false} />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="amount" radius={5} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className={cardClass} style={{ transitionDelay: '500ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Banknote className="h-5 w-5 text-muted-foreground" />
                Upcoming EMIs
              </CardTitle>
              <CardDescription>Your upcoming loan and installment payments.</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingEmis.length > 0 ? (
                <ul className="space-y-3">
                  {upcomingEmis.map((emi, index) => (
                    <li key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                      <div>
                        <p className="font-medium">{emi.name}</p>
                        <p className="text-xs text-muted-foreground">Due: {emi.dueDate}</p>
                      </div>
                      <p className="font-semibold text-primary">₹{emi.amount.toLocaleString()}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No upcoming EMIs.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
