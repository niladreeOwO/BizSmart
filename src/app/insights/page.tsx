import InsightsView from '@/components/insights/insights-view';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function InsightsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">AI Financial Insights</h1>
          <p className="text-muted-foreground">
            Get smart suggestions based on your monthly financial activity.
          </p>
        </div>
      </div>
      <Suspense fallback={<InsightsLoading />}>
        <InsightsView />
      </Suspense>
    </div>
  );
}

function InsightsLoading() {
    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-36 rounded-lg" />
                <Skeleton className="h-36 rounded-lg" />
                <Skeleton className="h-36 rounded-lg" />
            </div>
            <Skeleton className="h-48 rounded-lg" />
        </div>
    )
}
