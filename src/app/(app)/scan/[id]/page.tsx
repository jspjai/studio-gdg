
'use client';

import { useParams } from 'next/navigation';
import { useScanHistory } from '@/hooks/use-scan-history';
import VulnerabilityReport from '@/components/scan/vulnerability-report';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

export default function ScanReportPage() {
  const params = useParams();
  const { getScanById, loading } = useScanHistory();
  const id = typeof params.id === 'string' ? params.id : '';
  const scanItem = getScanById(id);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!scanItem) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold">Scan Report Not Found</h2>
        <p className="mt-2 text-muted-foreground">
          The scan you are looking for does not exist or could not be loaded.
        </p>
        <Link href="/dashboard" className="mt-4 inline-block text-accent hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return <VulnerabilityReport scanItem={scanItem} />;
}
