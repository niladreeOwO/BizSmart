'use client';

import * as React from 'react';
import StatCard from '@/components/dashboard/stat-card';
import IncomeExpenseChart from '@/components/dashboard/income-expense-chart';
import ExpenseBreakdownChart from '@/components/dashboard/expense-breakdown-chart';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import AddEntryDialog from '@/components/transactions/add-entry-dialog';

export default function DashboardPage() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  return (
    <>
      <div className="flex flex-col gap-8 motion-safe:animate-fade-in">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Income"
            value={formatCurrency(12500)}
            change="+15%"
          />
          <StatCard
            title="Expense"
            value={formatCurrency(8200)}
            change="-10%"
          />
          <StatCard
            title="Profit"
            value={formatCurrency(4300)}
            change="+5%"
          />
          <StatCard
            title="Cash on Hand"
            value={formatCurrency(15000)}
            change="+8%"
          />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Financial Overview</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <IncomeExpenseChart />
            </div>
            <div className="lg:col-span-1">
              <ExpenseBreakdownChart />
            </div>
          </div>
        </div>
      </div>

      <AddEntryDialog isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} />

      <Button
        onClick={() => setIsDialogOpen(true)}
        className="fixed bottom-28 right-8 h-16 w-16 rounded-full shadow-lg"
        size="icon"
        aria-label="Add Quick Entry"
      >
        <Plus className="h-8 w-8" />
      </Button>
    </>
  );
}
