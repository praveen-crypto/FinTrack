"use client";

import { useState, FormEvent } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Palette, Loader2 } from 'lucide-react';
import { getLifestyleGuide, LifestyleGuideInput } from '@/ai/flows/lifestyle-guide';
import { useToast } from "@/hooks/use-toast";

export default function LifestyleGuidePage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<LifestyleGuideInput>({
    spendingPower: 0,
    totalMonthlyExpenses: 0,
    incomeToDebtRatio: 0,
  });
  const [guide, setGuide] = useState<{ lifestyleAdvice: string; overLeveragingTips: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setGuide(null);
    setShowResult(false);

    try {
      const result = await getLifestyleGuide(formData);
      setGuide(result);
      setShowResult(true);
      toast({
        title: "Lifestyle Guide Generated!",
        description: "Your personalized lifestyle guide is ready.",
      });
    } catch (error) {
      console.error("Error getting lifestyle guide:", error);
      toast({
        title: "Error",
        description: "Failed to generate lifestyle guide. Please try again.",
        variant: "destructive",
      });
      setGuide({ lifestyleAdvice: "Could not fetch advice.", overLeveragingTips: "Please check your connection and try again." });
      setShowResult(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <Header title="AI Lifestyle Guide" />
      <main className="flex-1 p-6 space-y-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-6 w-6 text-primary" />
              Get Lifestyle & Financial Advice
            </CardTitle>
            <CardDescription>
              Input your financial summary to receive AI-powered advice on maintaining your lifestyle and managing debt.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="spendingPower">Spending Power ($)</Label>
                <Input id="spendingPower" name="spendingPower" type="number" placeholder="e.g., 1500" value={formData.spendingPower || ''} onChange={handleChange} required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="totalMonthlyExpenses">Total Monthly Expenses ($)</Label>
                <Input id="totalMonthlyExpenses" name="totalMonthlyExpenses" type="number" placeholder="e.g., 3000" value={formData.totalMonthlyExpenses || ''} onChange={handleChange} required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="incomeToDebtRatio">Income to Debt Ratio (e.g., 0.3 for 30%)</Label>
                <Input id="incomeToDebtRatio" name="incomeToDebtRatio" type="number" step="0.01" placeholder="e.g., 0.3" value={formData.incomeToDebtRatio || ''} onChange={handleChange} required className="mt-1" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" size="lg" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Palette className="mr-2 h-5 w-5" />}
                Get Guide
              </Button>
            </CardFooter>
          </form>
        </Card>

        {guide && (
          <div className={`max-w-2xl mx-auto mt-6 space-y-6 transition-all duration-500 ease-out transform ${showResult ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <Card>
              <CardHeader>
                <CardTitle>Lifestyle Advice</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{guide.lifestyleAdvice}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Tips on Avoiding Over-Leveraging</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{guide.overLeveragingTips}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
