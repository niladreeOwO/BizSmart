import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface InsightCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  color?: string;
  isSummary?: boolean;
}

const InsightCard = React.memo(function InsightCard({
  title,
  value,
  icon: Icon,
  color,
  isSummary = false,
}: InsightCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn('h-5 w-5 text-muted-foreground', color)} />
      </CardHeader>
      <CardContent className="flex-1">
        <div
          className={cn(
            'font-bold break-words',
            isSummary ? 'text-base' : 'text-2xl'
          )}
        >
          {value}
        </div>
      </CardContent>
    </Card>
  );
});

export default InsightCard;
