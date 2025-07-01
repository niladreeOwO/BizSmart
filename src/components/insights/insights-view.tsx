'use client';

import * as React from 'react';
import { getFinancialInsights } from '@/app/insights/actions';
import type { FinancialInsight } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Flame, Target, WandSparkles, BrainCircuit } from 'lucide-react';
import InsightCard from './insight-card';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';

export default function InsightsView() {
  const [insights, setInsights] = React.useState<FinancialInsight | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const { toast } = useToast();

  const fetchInsights = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getFinancialInsights();
      setInsights(result);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Insight Generation Failed',
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-36 rounded-lg" />
          <Skeleton className="h-36 rounded-lg" />
          <Skeleton className="h-36 rounded-lg" />
        </div>
        <Skeleton className="h-48 rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Oops, something went wrong!</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
        <Button onClick={fetchInsights} variant="secondary" className="mt-4">
          Retry
        </Button>
      </Alert>
    );
  }

  if (!insights) {
    return (
      <div className="text-center text-muted-foreground">
        <p>No insights available yet. Let's generate your first report!</p>
        <Button onClick={fetchInsights} className="mt-4">
          Generate Insights
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 motion-safe:animate-fade-in">
      <Button onClick={fetchInsights} disabled={loading}>
        {loading ? 'Generating...' : 'Refresh Insights'}
      </Button>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <InsightCard
          title="Monthly Burn Rate 🔥"
          value={formatCurrency(insights.burnRate)}
          icon={Flame}
          color="text-orange-500"
        />
        <InsightCard
          title="Top Expense Category 🎯"
          value={insights.topExpenseCategory}
          icon={Target}
          color="text-red-500"
        />
        <InsightCard
          title="Financial Summary 📊"
          value={insights.summary}
          icon={WandSparkles}
          color="text-blue-500"
          isSummary
        />
      </div>
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <BrainCircuit className="text-primary"/>
            <span>AI Suggestions</span>
          </CardTitle>
          <CardDescription>
            Actionable advice to improve your financial health.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ul className="space-y-3 list-disc list-inside text-muted-foreground">
            {insights.suggestions.map((suggestion, index) => (
              <li key={index} className="break-words">{suggestion}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
