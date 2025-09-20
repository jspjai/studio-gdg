import ScanForm from '@/components/scan/scan-form';

export default function NewScanPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Vulnerability Scanner
        </h1>
        <p className="mt-4 text-md sm:text-lg leading-8 text-muted-foreground">
          Enter a URL to start a comprehensive, AI-powered vulnerability scan. Identify security weaknesses and get actionable remediation steps.
        </p>
        <div className="mt-8">
          <ScanForm />
        </div>
      </div>
    </div>
  );
}
