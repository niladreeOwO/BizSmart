'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { categories, paymentMethods as accounts } from '@/lib/data';
import { useTransactions } from '@/context/transactions-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

const entryFormSchema = z
  .object({
    entryType: z.enum(['income', 'expense', 'transfer']),
    amount: z.coerce.number().positive({ message: 'Amount must be positive.' }),
    date: z.date({ required_error: 'A date is required.' }),
    description: z
      .string()
      .min(2, { message: 'Description must be at least 2 characters.' })
      .max(100, {
        message: 'Description must not be longer than 100 characters.',
      }),
    // Income/Expense fields
    category: z.string().optional(),
    account: z.string().optional(),
    // Transfer fields
    fromAccount: z.string().optional(),
    toAccount: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.entryType === 'income' || data.entryType === 'expense') {
        return !!data.category && !!data.account;
      }
      return true;
    },
    {
      message: 'Category and Account are required for this entry type.',
      path: ['category'], // Show error on one of the fields
    }
  )
  .refine(
    (data) => {
      if (data.entryType === 'transfer') {
        return !!data.fromAccount && !!data.toAccount;
      }
      return true;
    },
    {
      message: 'Both From and To accounts are required for a transfer.',
      path: ['fromAccount'],
    }
  )
  .refine(
    (data) => {
      if (data.entryType === 'transfer') {
        return data.fromAccount !== data.toAccount;
      }
      return true;
    },
    {
      message: 'From and To accounts cannot be the same.',
      path: ['toAccount'],
    }
  );

type AddEntryDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export default function AddEntryDialog({
  isOpen,
  setIsOpen,
}: AddEntryDialogProps) {
  const { addTransaction } = useTransactions();
  const [activeTab, setActiveTab] = React.useState<'income'|'expense'|'transfer'>('income');

  const form = useForm<z.infer<typeof entryFormSchema>>({
    resolver: zodResolver(entryFormSchema),
    defaultValues: {
      entryType: activeTab,
      date: new Date(),
      description: '',
    },
  });
  
  React.useEffect(() => {
    form.setValue('entryType', activeTab);
  }, [activeTab, form])

  function onSubmit(data: z.infer<typeof entryFormSchema>) {
    if (data.entryType === 'income') {
      addTransaction({
        type: 'income',
        amount: data.amount,
        category: data.category!,
        paymentMethod: data.account!,
        date: data.date.toISOString(),
        description: data.description,
      });
    } else if (data.entryType === 'expense') {
      addTransaction({
        type: 'expense',
        amount: data.amount,
        category: data.category!,
        paymentMethod: data.account!,
        date: data.date.toISOString(),
        description: data.description,
      });
    } else if (data.entryType === 'transfer') {
      // Create two transactions for a transfer
      addTransaction([
        {
          type: 'expense',
          amount: data.amount,
          category: 'Transfer',
          paymentMethod: data.fromAccount!,
          date: data.date.toISOString(),
          description: `Transfer to ${data.toAccount!}: ${data.description}`,
        },
        {
          type: 'income',
          amount: data.amount,
          category: 'Transfer',
          paymentMethod: data.toAccount!,
          date: data.date.toISOString(),
          description: `Transfer from ${data.fromAccount!}: ${data.description}`,
        },
      ]);
    }
    form.reset({
      entryType: activeTab,
      date: new Date(),
      description: '',
      amount: undefined,
      category: undefined,
      account: undefined,
      fromAccount: undefined,
      toAccount: undefined,
    });
    setIsOpen(false);
  }

  const availableCategories = categories.filter((c) => c !== 'Transfer');
  const availableAccounts = accounts;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a New Entry</DialogTitle>
          <DialogDescription>
            Record your income, expenses, or transfers.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="income">Income</TabsTrigger>
                <TabsTrigger value="expense">Expense</TabsTrigger>
                <TabsTrigger value="transfer">Transfer</TabsTrigger>
              </TabsList>
              <div className="pt-4 space-y-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <TabsContent value="income" className="space-y-4 m-0">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>{availableCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="account"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account</FormLabel>
                           <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger><SelectValue placeholder="Select an account" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>{availableAccounts.map(acc => <SelectItem key={acc} value={acc}>{acc}</SelectItem>)}</SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </TabsContent>
                <TabsContent value="expense" className="space-y-4 m-0">
                     <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>{availableCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent>
                          </Select>
                           <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="account"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account</FormLabel>
                           <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger><SelectValue placeholder="Select an account" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>{availableAccounts.map(acc => <SelectItem key={acc} value={acc}>{acc}</SelectItem>)}</SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </TabsContent>
                 <TabsContent value="transfer" className="space-y-4 m-0">
                    <FormField
                      control={form.control}
                      name="fromAccount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>From Account</FormLabel>
                           <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger><SelectValue placeholder="Select source account" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>{availableAccounts.map(acc => <SelectItem key={acc} value={acc}>{acc}</SelectItem>)}</SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="toAccount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>To Account</FormLabel>
                           <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger><SelectValue placeholder="Select destination account" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>{availableAccounts.map(acc => <SelectItem key={acc} value={acc}>{acc}</SelectItem>)}</SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                 </TabsContent>
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Notes)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g. Coffee for team meeting" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Tabs>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Save Entry</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
