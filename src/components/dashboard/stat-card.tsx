import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  description: string;
  color?: string;
  valueColor?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  description,
  color = 'text-foreground',
  valueColor = 'text-foreground',
}: StatCardProps) {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn('h-5 w-5 text-muted-foreground', color)} />
      </CardHeader>
      <CardContent>
        <div className={cn('text-3xl font-bold', valueColor)}>{value}</div>
        <p className="text-xs text-muted-foreground pt-1">{description}</p>
      </CardContent>
    </Card>
  );
}
