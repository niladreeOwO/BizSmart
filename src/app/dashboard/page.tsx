import {
  ArrowDownCircle,
  ArrowUpCircle,
  Landmark,
  Banknote,
} from 'lucide-react';
import StatCard from '@/components/dashboard/stat-card';
import { transactions } from '@/lib/data';
import { cn, formatCurrency } from '@/lib/utils';
import LinkBankCard from '@/components/dashboard/link-bank-card';
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
import { format } from 'date-fns';

const BkashIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    viewBox="0 0 256 256"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
  >
    <path d="M152.2,26.35c-20.8,4.7-39.7,16.3-54,32.8-14.3-16.5-33.2-28.1-54-32.8-1-.2-1.8.6-1.6,1.6,4.2,20.4,4.2,42.2,0,62.6-.2,1,.6,1.8,1.6,1.6,20.8-4.7,39.7-16.3,54-32.8,14.3,16.5,33.2,28.1,54,32.8,1,.2,1.8-.6,1.6-1.6-4.2-20.4-4.2-42.2,0-62.6.2-1-.6-1.8-1.6-1.6Z" />
  </svg>
);

export default function DashboardPage() {
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpenses;

  // Mock data for new widgets
  const bankBalance = 54200.75;
  const bkashBalance = 1250.25;

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="flex flex-col gap-6 motion-safe:animate-fade-in">
      <div className="grid gap-6 md:grid-cols-2">
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
        <StatCard
          title="Bank Balance"
          value={formatCurrency(bankBalance)}
          icon={Banknote}
          description="Total balance across all linked banks"
          color="text-primary"
        />
        <StatCard
          title="bKash Balance"
          value={formatCurrency(bkashBalance)}
          icon={BkashIcon}
          description="Total balance in your bKash account"
          color="text-destructive"
        />
        <LinkBankCard />
      </div>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            Showing the last 5 transactions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.length > 0 ? (
                recentTransactions.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">
                      {format(new Date(t.date), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>{t.description}</TableCell>
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
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No transactions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
