import { ArrowDownCircle, ArrowUpCircle, Landmark } from 'lucide-react';
import StatCard from '@/components/dashboard/stat-card';
import { transactions } from '@/lib/data';
import { formatCurrency } from '@/lib/utils';

export default function DashboardPage() {
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpenses;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Income"
          value={formatCurrency(totalIncome)}
          icon={ArrowUpCircle}
          description="Total income received this month"
          color="text-primary"
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(totalExpenses)}
          icon={ArrowDownCircle}
          description="Total expenses paid this month"
          color="text-destructive"
        />
        <StatCard
          title="Net Profit"
          value={formatCurrency(netProfit)}
          icon={Landmark}
          description="Net profit after all expenses"
          color="text-accent-foreground"
          valueColor={netProfit >= 0 ? 'text-primary' : 'text-destructive'}
        />
      </div>
      <div className="text-center">
        <p className="text-muted-foreground">
          This is a simplified dashboard. More widgets and charts coming soon!
        </p>
      </div>
    </div>
  );
}
