import ScanForm from '@/components/scan/scan-form';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          AegisAI Vulnerability Scanner
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          Enter a web application URL to begin an AI-powered security scan. Identify weaknesses and get actionable remediation steps.
        </p>
        <div className="mt-10">
          <ScanForm />
        </div>
      </div>
    </div>
  );
}
