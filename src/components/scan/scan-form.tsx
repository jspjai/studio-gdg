'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { performScan } from '@/lib/actions';
import { useScanHistory } from '@/hooks/use-scan-history';
import { calculateRiskScore } from '@/lib/utils';
import { ScanSearch } from 'lucide-react';

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
});

export default function ScanForm() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();
  const { toast } = useToast();
  const { addScan } = useScanHistory();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
    },
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loading && progress < 95) {
      timer = setTimeout(() => setProgress(prev => prev + 5), 300);
    }
    return () => clearTimeout(timer);
  }, [loading, progress]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setProgress(5);

    const result = await performScan(values.url);
    
    setProgress(100);

    if (result.error || !result.report) {
      toast({
        variant: 'destructive',
        title: 'Scan Failed',
        description: result.error || 'An unexpected error occurred.',
      });
      setLoading(false);
      setProgress(0);
      return;
    }

    const newScanItem = {
      id: crypto.randomUUID(),
      targetUrl: values.url,
      scanDate: new Date().toISOString(),
      report: result.report,
      riskScore: calculateRiskScore(result.report.vulnerabilities),
    };

    addScan(newScanItem);

    setTimeout(() => {
      router.push(`/scan/${newScanItem.id}`);
    }, 500);
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row items-start gap-2">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input placeholder="https://example.com" {...field} className="h-12 text-base" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading} className="h-12 text-base px-6 w-full sm:w-auto">
            <ScanSearch className="mr-2 h-5 w-5" />
            {loading ? 'Scanning...' : 'Scan Now'}
          </Button>
        </form>
      </Form>
      {loading && (
        <div className="w-full">
          <Progress value={progress} className="w-full [&>div]:bg-accent" />
          <p className="text-center text-sm text-accent mt-2">{progress}% - Analyzing target...</p>
        </div>
      )}
    </div>
  );
}
