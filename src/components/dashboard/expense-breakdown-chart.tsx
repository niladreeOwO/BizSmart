'use client';

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
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
  { name: 'Rent', value: 1200 },
  { name: 'Utilities', value: 2100 },
  { name: 'Marketing', value: 900 },
  { name: 'Salaries', value: 1500 },
  { name: 'Supplies', value: 2300 },
  { name: 'Other', value: 200 },
];

export default function ExpenseBreakdownChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Breakdown</CardTitle>
        <div className="flex items-baseline gap-2 pt-2">
          <span className="text-3xl font-bold">{formatCurrency(8200)}</span>
        </div>
        <CardDescription>
          This Month <span className="text-destructive font-semibold">-10%</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
          >
            <XAxis type="number" hide />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              axisLine={false}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              width={60}
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
              dataKey="value"
              fill="hsl(var(--muted))"
              background={{ fill: 'hsl(var(--secondary))' }}
              radius={4}
              name="Expense"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
