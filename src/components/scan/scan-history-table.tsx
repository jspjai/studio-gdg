'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import type { ScanHistoryItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, FileWarning } from 'lucide-react';

interface ScanHistoryTableProps {
  history: ScanHistoryItem[];
}

export default function ScanHistoryTable({ history }: ScanHistoryTableProps) {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card p-12 text-center">
        <FileWarning className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No Scans Found</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          You have not performed any scans yet. Start a new scan to see the results here.
        </p>
        <Button asChild className="mt-4">
          <Link href="/new-scan">Start New Scan</Link>
        </Button>
      </div>
    );
  }

  const getRiskBadgeVariant = (score: number) => {
    if (score > 70) return 'bg-destructive text-destructive-foreground';
    if (score > 40) return 'bg-orange-600 text-white';
    if (score > 10) return 'bg-yellow-500 text-black';
    return 'bg-blue-500 text-white';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Past Scans</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Target URL</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-center">Risk Score</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((scan) => (
              <TableRow key={scan.id}>
                <TableCell className="font-medium">{scan.targetUrl}</TableCell>
                <TableCell>{format(new Date(scan.scanDate), 'PPP p')}</TableCell>
                <TableCell className="text-center">
                   <Badge className={getRiskBadgeVariant(scan.riskScore)}>{scan.riskScore}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/scan/${scan.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Report
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
