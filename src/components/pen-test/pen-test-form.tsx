'use client';

import { useState, useEffect, useRef } from 'react';
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
import { Target, Loader2, CheckCircle2, XCircle, Download, ShieldX, Code2, Wrench } from 'lucide-react';
import type { PerformPenTestOutput } from '@/ai/flows/perform-pen-test';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Separator } from '../ui/separator';

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
});

type AttackVectorStatus = 'pending' | 'running' | 'completed';
type AttackVectorItem = {
  vector: string;
  status: AttackVectorStatus;
  exploited?: boolean;
};

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
  const reportRef = useRef<HTMLDivElement>(null);

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
  
  const handleDownloadPdf = async () => {
    const element = reportRef.current;
    if (!element) return;

    // Dynamically import jspdf and html2canvas only when needed
    const { default: jsPDF } = await import('jspdf');
    const { default: html2canvas } = await import('html2canvas');

    const canvas = await html2canvas(element, { scale: 2 });
    const data = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 10;

    pdf.addImage(data, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    pdf.save(`pentest-report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

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
        const reportedVector = result.report?.simulatedAttackVectors.find(v => v.vector.includes(item.vector) || item.vector.includes(v.vector));
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
        return <CheckCircle2 className="h-4 w-4 text-muted-foreground" />;
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
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
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
        <div ref={reportRef} className="p-4 bg-card rounded-lg">
          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle className="text-2xl">Penetration Test Report</CardTitle>
              <CardDescription>
                This report details the findings of the simulated penetration test.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold">Executive Summary</h3>
                <p className="text-muted-foreground">{report.executiveSummary}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Attack Narrative</h3>
                <p className="text-muted-foreground">{report.attackNarrative}</p>
              </div>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-2">Simulated Attack Vectors</h3>
                <Accordion type="single" collapsible className="w-full">
                  {report.simulatedAttackVectors.map((vector, index) => (
                    <AccordionItem value={`vector-${index}`} key={index}>
                      <AccordionTrigger>
                        <div className="flex items-center gap-4 flex-1 text-left">
                           {vector.exploited ? <ShieldX className="h-5 w-5 text-destructive" /> : <CheckCircle2 className="h-5 w-5 text-green-500" />}
                          <span className="font-semibold">{vector.vector}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 px-2">
                        <div>
                            <h4 className="font-semibold text-foreground mb-1">Description</h4>
                            <p className="text-muted-foreground">{vector.description}</p>
                        </div>
                        <Separator />
                        <div>
                            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2"><Code2 className="h-4 w-4" /> Proof of Concept (POC)</h4>
                            <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto text-muted-foreground whitespace-pre-wrap font-code">
                                <code>{vector.poc}</code>
                            </pre>
                        </div>
                        <Separator />
                        <div>
                           <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2"><Wrench className="h-4 w-4" /> Remediation</h4>
                            <p className="text-muted-foreground whitespace-pre-wrap">{vector.remediation}</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleDownloadPdf} className="ml-auto">
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
