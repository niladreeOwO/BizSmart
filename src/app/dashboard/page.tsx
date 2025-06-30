'use client';

import * as React from 'react';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Landmark,
  Banknote,
  Upload,
  Lightbulb,
} from 'lucide-react';
import StatCard from '@/components/dashboard/stat-card';
import { transactions as allTransactions } from '@/lib/data';
import type { Transaction } from '@/lib/types';
import { cn, formatCurrency } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const [filter, setFilter] = React.useState('month');

  const filteredTransactions = React.useMemo(() => {
    const now = new Date();
    if (filter === 'today') {
        const todayStr = now.toDateString();
        return allTransactions.filter(
            (t) => new Date(t.date).toDateString() === todayStr
        );
    }
    if (filter === 'week') {
      const start = startOfWeek(now);
      const end = endOfWeek(now);
      return allTransactions.filter((t) => {
        const transactionDate = new Date(t.date);
        return transactionDate >= start && transactionDate <= end;
      });
    }
    // Default to 'month'
    const start = startOfMonth(now);
    const end = endOfMonth(now);
    return allTransactions.filter((t) => {
        const transactionDate = new Date(t.date);
        return transactionDate >= start && transactionDate <= end;
    });
  }, [filter]);

  const totalIncome = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpenses;

  // Mock data for new widgets
  const cashOnHand = 54200.75;

  return (
    <div className="flex flex-col gap-6 motion-safe:animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <Tabs defaultValue={filter} onValueChange={setFilter} className="w-full sm:w-auto">
                <TabsList className="w-full">
                    <TabsTrigger value="today" className="flex-1">Today</TabsTrigger>
                    <TabsTrigger value="week" className="flex-1">This Week</TabsTrigger>
                    <TabsTrigger value="month" className="flex-1">This Month</TabsTrigger>
                </TabsList>
            </Tabs>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
            title="Total Income"
            value={formatCurrency(totalIncome)}
            icon={ArrowUpCircle}
            description="Income for the selected period"
            color="text-primary"
            />
            <StatCard
            title="Total Expense"
            value={formatCurrency(totalExpenses)}
            icon={ArrowDownCircle}
            description="Expenses for the selected period"
            color="text-destructive"
            />
            <StatCard
            title="Profit"
            value={formatCurrency(netProfit)}
            icon={Landmark}
            description="Net profit for the selected period"
            valueColor={netProfit >= 0 ? 'text-primary' : 'text-destructive'}
            />
            <StatCard
            title="Cash on Hand"
            value={formatCurrency(cashOnHand)}
            icon={Banknote}
            description="Total balance across all accounts"
            color="text-accent-foreground"
            />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader className="border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <CardTitle>Transactions</CardTitle>
                            <CardDescription>
                            Transactions for the selected period.
                            </CardDescription>
                        </div>
                        <Button variant="outline" className="w-full sm:w-auto">
                            <Upload className="mr-2 h-4 w-4" />
                            Upload CSV or Receipt
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                    <Table className="table-fixed">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-1/5">Date</TableHead>
                                <TableHead className="w-1/5">Type</TableHead>
                                <TableHead className="text-right w-1/5">Amount</TableHead>
                                <TableHead className="w-1/5">Category</TableHead>
                                <TableHead className="w-1/5">Notes</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                        {filteredTransactions.length > 0 ? (
                            filteredTransactions.map((t) => (
                                <TableRow key={t.id}>
                                <TableCell className="font-medium">
                                    {format(new Date(t.date), 'MMM dd, yyyy')}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                    variant={t.type === 'income' ? 'default' : 'secondary'}
                                    className={cn(
                                        t.type === 'income'
                                        ? 'bg-primary/20 text-primary'
                                        : 'bg-destructive/20 text-destructive'
                                    )}
                                    >
                                    {t.type}
                                    </Badge>
                                </TableCell>
                                <TableCell
                                    className={cn(
                                    'text-right font-semibold',
                                    t.type === 'income' ? 'text-primary' : 'text-destructive'
                                    )}
                                >
                                    {t.type === 'income' ? '+' : '-'}
                                    {formatCurrency(t.amount)}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">{t.category}</Badge>
                                </TableCell>
                                <TableCell className="break-words">{t.description}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                No transactions found for this period.
                            </TableCell>
                            </TableRow>
                        )}
                        </TableBody>
                    </Table>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-1">
                 <Card className="bg-secondary h-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lightbulb className="text-yellow-500" />
                            BizSmart Says...
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-secondary-foreground mb-2 break-words">
                            You're spending more on supplies this week. Consider buying in bulk to save costs.
                        </p>
                        <Button variant="link" className="px-0 h-auto text-primary font-semibold">
                            How to fix this?
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
