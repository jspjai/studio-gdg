'use client';

import { useState, useEffect } from 'react';
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
import { performPenetrationTest } from '@/lib/actions';
import { Target } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Terminal } from 'lucide-react';

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
});

export default function PenTestForm() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [report, setReport] = useState<any>(null); // Using any for now
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
    },
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loading && progress < 95) {
      // Slower progress for pen test simulation
      timer = setTimeout(() => setProgress(prev => prev + 2), 600);
    }
    return () => clearTimeout(timer);
  }, [loading, progress]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setReport(null);
    setProgress(5);

    const result = await performPenetrationTest(values.url);
    
    setProgress(100);

    if (result.error || !result.report) {
      toast({
        variant: 'destructive',
        title: 'Penetration Test Failed',
        description: result.error || 'An unexpected error occurred.',
      });
      setLoading(false);
      setProgress(0);
      return;
    }
    
    setReport(result.report);
    
    // Keep loading true to show report, but stop progress
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-2">
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
          <Button type="submit" disabled={loading} className="h-12 text-base px-6">
            <Target className="mr-2 h-5 w-5" />
            {loading ? 'Testing...' : 'Start Test'}
          </Button>
        </form>
      </Form>
      {loading && (
        <div className="w-full text-left">
          <Progress value={progress} className="w-full [&>div]:bg-accent" />
          <p className="text-center text-sm text-accent mt-2">{progress}% - Simulating attack vectors...</p>
        </div>
      )}

      {report && (
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>Penetration Test Complete!</AlertTitle>
          <AlertDescription>
             The simulation has finished. Review the executive summary below. A full report would be available in a real-world scenario.
             <p className="mt-4 font-semibold">Executive Summary:</p>
             <p className="text-muted-foreground">{report.executiveSummary}</p>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
