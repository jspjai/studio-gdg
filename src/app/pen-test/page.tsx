import PenTestForm from '@/components/pen-test/pen-test-form';

export default function PenTestPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Autonomous Penetration Test
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          Enter a URL to begin a simulated, AI-driven penetration test. This process will probe for advanced exploits in a safe, sandboxed environment.
        </p>
        <div className="mt-10">
          <PenTestForm />
        </div>
      </div>
    </div>
  );
}
