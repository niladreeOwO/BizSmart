import * as React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
}

const StatCard = React.memo(function StatCard({
  title,
  value,
  change,
}: StatCardProps) {
  const isPositive = change.startsWith('+');

  return (
    <Card className="transition-all hover:shadow-md p-4 sm:p-6">
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-xl font-bold sm:text-2xl lg:text-3xl">{value}</p>
        <p
          className={cn(
            'text-sm font-semibold',
            isPositive ? 'text-green-600' : 'text-destructive'
          )}
        >
          {change}
        </p>
      </div>
    </Card>
  );
});

export default StatCard;
