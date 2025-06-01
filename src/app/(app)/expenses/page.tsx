"use client";

import { useState, FormEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Trash2, PieChartIcon } from 'lucide-react';
import type { ExpenseItem } from '@/types';
import { useToast } from "@/hooks/use-toast";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const EXPENSE_CATEGORIES = ["Groceries", "Utilities", "Transport", "Entertainment", "Healthcare", "Education", "Dining Out", "Shopping", "Travel", "Other"];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658', '#a4de6c', '#d0ed57', '#ff7300'];

export default function ExpensesPage() {
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [currentExpense, setCurrentExpense] = useState<{ description: string; amount: string; category: string; date: string }>({
    description: '', amount: '', category: '', date: new Date().toISOString().split('T')[0]
  });

  const handleAddExpense = (e: FormEvent) => {
    e.preventDefault();
    if (currentExpense.description && currentExpense.amount && currentExpense.category && currentExpense.date) {
      const newExpense: ExpenseItem = {
        id: uuidv4(),
        description: currentExpense.description,
        amount: parseFloat(currentExpense.amount),
        category: currentExpense.category,
        date: currentExpense.date,
      };
      setExpenses([...expenses, newExpense]);
      setCurrentExpense({ description: '', amount: '', category: '', date: new Date().toISOString().split('T')[0] });
      toast({ title: "Expense Added", description: `${newExpense.description} added successfully.` });
    } else {
      toast({ title: "Missing Information", description: "Please fill all fields to add an expense.", variant: "destructive" });
    }
  };

  const handleRemoveExpense = (id: string) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
    toast({ title: "Expense Removed", description: "Selected expense has been removed." });
  };

  const getExpenseBreakdown = () => {
    const breakdown: { [key: string]: number } = {};
    expenses.forEach(expense => {
      breakdown[expense.category] = (breakdown[expense.category] || 0) + expense.amount;
    });
    return Object.entries(breakdown).map(([name, value]) => ({ name, value }));
  };

  const expenseBreakdownData = getExpenseBreakdown();

  return (
    <div className="flex flex-1 flex-col">
      <Header title="Track Expenses" />
      <main className="flex-1 p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Add New Expense</CardTitle>
            <CardDescription>Manually add your expenses here.</CardDescription>
          </CardHeader>
          <form onSubmit={handleAddExpense}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expDescription">Description</Label>
                  <Input id="expDescription" placeholder="e.g., Weekly groceries" value={currentExpense.description} onChange={e => setCurrentExpense({...currentExpense, description: e.target.value})} className="mt-1" required />
                </div>
                <div>
                  <Label htmlFor="expAmount">Amount ($)</Label>
                  <Input id="expAmount" type="number" placeholder="e.g., 75.50" value={currentExpense.amount} onChange={e => setCurrentExpense({...currentExpense, amount: e.target.value})} className="mt-1" required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expCategory">Category</Label>
                  <Select value={currentExpense.category} onValueChange={value => setCurrentExpense({...currentExpense, category: value})}>
                    <SelectTrigger id="expCategory" className="mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPENSE_CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="expDate">Date</Label>
                  <Input id="expDate" type="date" value={currentExpense.date} onChange={e => setCurrentExpense({...currentExpense, date: e.target.value})} className="mt-1" required />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Expense
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Expense List</CardTitle>
              <CardDescription>Your recorded expenses.</CardDescription>
            </CardHeader>
            <CardContent>
              {expenses.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.map(exp => (
                      <TableRow key={exp.id}>
                        <TableCell className="font-medium">{exp.description}</TableCell>
                        <TableCell>{exp.category}</TableCell>
                        <TableCell>{exp.date}</TableCell>
                        <TableCell className="text-right">${exp.amount.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveExpense(exp.id)} aria-label="Remove expense">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground text-center py-4">No expenses recorded yet.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5 text-primary" />
                Expense Breakdown
              </CardTitle>
              <CardDescription>Visual representation of your spending.</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              {expenseBreakdownData.length > 0 ? (
                <ChartContainer config={{}} className="h-full w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                      <Pie
                        data={expenseBreakdownData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {expenseBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Add expenses to see the breakdown.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
