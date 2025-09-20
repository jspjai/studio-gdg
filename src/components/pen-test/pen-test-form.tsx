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
import { Target, Terminal, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import type { PerformPenTestOutput } from '@/ai/flows/perform-pen-test';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
});

type AttackVectorStatus = 'pending' | 'running' | 'completed';
type AttackVectorItem = {
  vector: string;
  status: AttackVectorStatus;
  exploited?: boolean;
};

// Based on the prompt in perform-pen-test.ts
const initialChecklist: AttackVectorItem[] = [
  { vector: 'Reconnaissance', status: 'pending' },
  { vector: 'Scanning & Enumeration', status: 'pending' },
  { vector: 'SQL Injection', status: 'pending' },
  { vector: 'Cross-Site Scripting (XSS)', status: 'pending' },
  { vector: 'Brute-force Authentication', status: 'pending' },
  { vector: 'Common Misconfigurations', status: 'pending' },
  { vector: 'Advanced Exploit Simulation', status: 'pending' },
];

export default function PenTestForm() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [report, setReport] = useState<PerformPenTestOutput | null>(null);
  const [checklist, setChecklist] = useState<AttackVectorItem[]>(initialChecklist);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
    },
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loading && progress < 100) {
      const totalSteps = checklist.length;
      const currentStep = Math.floor((progress / 100) * totalSteps);
      
      timer = setTimeout(() => {
        setProgress(prev => Math.min(prev + 4, 100)); // Slower progress
        setChecklist(prev =>
          prev.map((item, index) => {
            if (index < currentStep) return { ...item, status: 'completed' };
            if (index === currentStep) return { ...item, status: 'running' };
            return item;
          })
        );
      }, 500);
    }
    return () => clearTimeout(timer);
  }, [loading, progress, checklist.length]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setReport(null);
    setProgress(0);
    setChecklist(initialChecklist.map(item => ({...item, status: 'pending'})));

    const result = await performPenetrationTest(values.url);
    
    setProgress(100);

    if (result.error || !result.report) {
      toast({
        variant: 'destructive',
        title: 'Penetration Test Failed',
        description: result.error || 'An unexpected error occurred.',
      });
      setChecklist(prev => prev.map(item => ({ ...item, status: item.status === 'pending' ? 'pending' : 'completed' })));
      setLoading(false);
      return;
    }
    
    setReport(result.report);

    // Update checklist based on report
    setChecklist(prev => prev.map(item => {
        const reportedVector = result.report?.simulatedAttackVectors.find(v => v.vector.includes(item.vector));
        return {
            ...item,
            status: 'completed',
            exploited: reportedVector?.exploited,
        }
    }));
    
    setLoading(false);
  }
  
  const getStatusIcon = (status: AttackVectorStatus, exploited?: boolean) => {
    switch (status) {
      case 'running':
        return <Loader2 className="h-4 w-4 animate-spin text-accent" />;
      case 'completed':
        if(exploited === true) return <XCircle className="h-4 w-4 text-destructive" />;
        if(exploited === false) return <CheckCircle2 className="h-4 w-4 text-green-500" />;
        return <CheckCircle2 className="h-4 w-4 text-muted-foreground" />; // Default if exploited is undefined
      case 'pending':
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />;
    }
  };


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
      
      {(loading || report) && (
        <Card>
          <CardHeader>
            <CardTitle>Penetration Test Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading && (
              <div className="w-full text-left">
                <Progress value={progress} className="w-full [&>div]:bg-accent" />
                <p className="text-center text-sm text-accent mt-2">{progress}% - Simulating attack vectors...</p>
              </div>
            )}
            <ul className="space-y-2">
              {checklist.map((item, index) => (
                <li key={index} className={cn("flex items-center gap-3 transition-colors", item.status === 'pending' ? 'text-muted-foreground' : 'text-foreground')}>
                   {getStatusIcon(item.status, item.exploited)}
                  <span>{item.vector}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
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
