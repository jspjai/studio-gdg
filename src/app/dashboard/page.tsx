'use client';

import ScanHistoryTable from '@/components/scan/scan-history-table';
import { useScanHistory } from '@/hooks/use-scan-history';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { history, loading } = useScanHistory();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Scan History</h1>
        <p className="text-muted-foreground">Review your past vulnerability scans.</p>
      </div>
      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : (
        <ScanHistoryTable history={history} />
      )}
    </div>
  );
}
