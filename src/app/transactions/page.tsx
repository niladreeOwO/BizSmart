'use client';
import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { categories, paymentMethods } from '@/lib/data';
import type { Transaction } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Calendar as CalendarIcon,
  Filter,
  X,
  PlusCircle,
  ArrowUpDown,
} from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { cn, formatCurrency } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import AddEntryDialog from '@/components/transactions/add-entry-dialog';
import { useTransactions } from '@/context/transactions-context';

// Mobile-first Transaction Card component
function TransactionCard({ transaction }: { transaction: Transaction }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-base break-words">
              {transaction.description}
            </CardTitle>
            <CardDescription>
              {format(new Date(transaction.date), 'MMM dd, yyyy')}
            </CardDescription>
          </div>
          <Badge
            variant={transaction.type === 'income' ? 'default' : 'secondary'}
            className={cn(
              'ml-4 text-xs',
              transaction.type === 'income'
                ? 'bg-primary/20 text-primary'
                : 'bg-destructive/20 text-destructive'
            )}
          >
            {transaction.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            'text-xl font-bold',
            transaction.type === 'income' ? 'text-primary' : 'text-destructive'
          )}
        >
          {transaction.type === 'income' ? '+' : '-'}
          {formatCurrency(transaction.amount)}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-muted-foreground">
        <Badge variant="outline">{transaction.category}</Badge>
        <span>{transaction.paymentMethod}</span>
      </CardFooter>
    </Card>
  );
}

export default function TransactionsPage() {
  const { transactions } = useTransactions();
  const [category, setCategory] = React.useState('all');
  const [paymentMethod, setPaymentMethod] = React.useState('all');
  const [date, setDate] = React.useState<DateRange | undefined>();
  const [sortConfig, setSortConfig] = React.useState('date-desc');
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const filteredTransactions = React.useMemo(() => {
    let filtered = [...transactions]; // Use a copy to avoid mutating state

    if (category !== 'all') {
      filtered = filtered.filter((t) => t.category === category);
    }
    if (paymentMethod !== 'all') {
      filtered = filtered.filter((t) => t.paymentMethod === paymentMethod);
    }
    if (date?.from) {
      const toDate = date.to ? new Date(date.to) : new Date(date.from);
      toDate.setHours(23, 59, 59, 999); // Ensure the end date is inclusive

      filtered = filtered.filter((t) => {
        const transactionDate = new Date(t.date);
        return transactionDate >= date.from! && transactionDate <= toDate;
      });
    }

    // Sorting logic
    switch (sortConfig) {
      case 'date-asc':
        filtered.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        break;
      case 'amount-desc':
        filtered.sort((a, b) => b.amount - a.amount);
        break;
      case 'amount-asc':
        filtered.sort((a, b) => a.amount - b.amount);
        break;
      case 'date-desc':
      default:
        filtered.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        break;
    }

    return filtered;
  }, [transactions, category, paymentMethod, date, sortConfig]);

  const clearFilters = () => {
    setCategory('all');
    setPaymentMethod('all');
    setDate(undefined);
  };

  const hasActiveFilters =
    category !== 'all' || paymentMethod !== 'all' || date !== undefined;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border rounded-lg bg-card">
        <div className="flex items-center gap-2 text-lg font-semibold">
           <Filter className="h-5 w-5" />
           <span>Filters & Controls</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={() => setIsDialogOpen(true)} className="w-full sm:w-auto">
              <PlusCircle className="mr-2" />
              Add Transaction
            </Button>
            <AddEntryDialog isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} />
             {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="w-full sm:w-auto"
            >
              <X className="mr-2 h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payment Methods</SelectItem>
                {paymentMethods.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={'outline'}
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, 'LLL dd, y')} -{' '}
                        {format(date.to, 'LLL dd, y')}
                      </>
                    ) : (
                      format(date.from, 'LLL dd, y')
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
             <div className="flex items-center gap-2">
              <Select value={sortConfig} onValueChange={setSortConfig}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Date (Newest first)</SelectItem>
                  <SelectItem value="date-asc">Date (Oldest first)</SelectItem>
                  <SelectItem value="amount-desc">
                    Amount (High to Low)
                  </SelectItem>
                  <SelectItem value="amount-asc">
                    Amount (Low to High)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
      </div>

      {/* Mobile View: Card List */}
      <div className="flex flex-col gap-4 md:hidden">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((t) => (
            <TransactionCard key={t.id} transaction={t} />
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No transactions found. Let's add one!
          </div>
        )}
      </div>

      {/* Desktop View: Table */}
      <div className="hidden md:block border rounded-lg overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">
                    {format(new Date(t.date), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell className="break-words">{t.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{t.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={t.type === 'income' ? 'default' : 'secondary'}
                      className={cn(
                        'text-xs',
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
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  No transactions found. Let's add one!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
