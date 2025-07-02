'use client';

import * as React from 'react';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

const data = [
  { name: 'Jan', income: 4000 },
  { name: 'Feb', income: 3000 },
  { name: 'Mar', income: 5000 },
  { name: 'Apr', income: 4780 },
  { name: 'May', income: 6890 },
  { name: 'Jun', income: 7390 },
];

const IncomeExpenseChart = React.memo(function IncomeExpenseChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Income vs. Expense</CardTitle>
        <div className="flex items-baseline gap-2 pt-2">
          <span className="text-3xl font-bold">{formatCurrency(12500)}</span>
        </div>
        <CardDescription>
            This Month <span className="text-green-600 font-semibold">+15%</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[250px] w-full pl-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={(value) => `$${value / 1000}K`}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 'var(--radius)',
                border: '1px solid hsl(var(--border))',
                background: 'hsl(var(--background))',
              }}
              cursor={{ fill: 'hsl(var(--accent))', radius: 'var(--radius)' }}
            />
            <Bar
              dataKey="income"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
              name="Income"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
});

export default IncomeExpenseChart;
