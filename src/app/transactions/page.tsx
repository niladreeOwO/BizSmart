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
import {
  transactions as allTransactions,
  categories,
  paymentMethods,
} from '@/lib/data';
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
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { cn, formatCurrency } from '@/lib/utils';

export default function TransactionsPage() {
  const [category, setCategory] = React.useState('all');
  const [paymentMethod, setPaymentMethod] = React.useState('all');
  const [date, setDate] = React.useState<DateRange | undefined>();

  const filteredTransactions = React.useMemo(() => {
    let filtered = allTransactions;

    if (category !== 'all') {
      filtered = filtered.filter((t) => t.category === category);
    }
    if (paymentMethod !== 'all') {
      filtered = filtered.filter((t) => t.paymentMethod === paymentMethod);
    }
    if (date?.from && date?.to) {
      const toDate = new Date(date.to);
      toDate.setHours(23, 59, 59, 999); // Ensure the end date is inclusive

      filtered = filtered.filter((t) => {
        const transactionDate = new Date(t.date);
        return transactionDate >= date.from! && transactionDate <= toDate;
      });
    }

    return filtered;
  }, [category, paymentMethod, date]);

  const clearFilters = () => {
    setCategory('all');
    setPaymentMethod('all');
    setDate(undefined);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
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
        </div>
        <Button variant="ghost" onClick={clearFilters}>
          Clear Filters
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden bg-card">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/6">Date</TableHead>
              <TableHead className="w-2/6">Description</TableHead>
              <TableHead className="w-1/6">Category</TableHead>
              <TableHead className="w-1/6">Type</TableHead>
              <TableHead className="text-right w-1/6">Amount</TableHead>
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
                  <TableCell>{t.category}</TableCell>
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
                <TableCell colSpan={5} className="h-24 text-center">
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
