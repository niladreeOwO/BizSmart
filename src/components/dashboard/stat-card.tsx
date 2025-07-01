import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
}

export default function StatCard({ title, value, change }: StatCardProps) {
  const isPositive = change.startsWith('+');

  return (
    <Card className="transition-all hover:shadow-md p-4 sm:p-6">
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold md:text-3xl">{value}</p>
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
}
