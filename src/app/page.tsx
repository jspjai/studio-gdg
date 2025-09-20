import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ScanSearch, Shield, Target } from 'lucide-react';
import Link from 'next/link';

const features = [
  'AI-Powered Vulnerability Analysis',
  'Autonomous Penetration Testing',
  'Detailed, Actionable Reporting',
  'Proof of Concept Generation',
  'Step-by-Step Remediation Guides',
  'Safe & Sandboxed Scanning',
];

export default function RootPage() {
  return (
    <div className="flex flex-col min-h-screen">
       <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="flex items-center gap-2 mr-6">
            <Shield className="w-6 h-6 text-accent" />
            <span className="font-bold">AegisAI</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="#features" className="text-muted-foreground transition-colors hover:text-foreground">
              Features
            </Link>
            <Link href="#services" className="text-muted-foreground transition-colors hover:text-foreground">
              Services
            </Link>
          </nav>
          <div className="flex flex-1 items-center justify-end gap-2">
            <Button asChild>
              <Link href="/dashboard">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
          {/* Hero Section */}
          <section className="py-20 md:py-32">
            <div className="container text-center">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
                Proactive Cybersecurity, Powered by AI
              </h1>
              <p className="mt-6 max-w-3xl mx-auto text-lg leading-8 text-muted-foreground">
                AegisAI leverages cutting-edge AI to provide comprehensive vulnerability scanning and autonomous penetration testing. Secure your web applications before attackers strike.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button asChild size="lg">
                  <Link href="/dashboard">Start Your First Scan</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="#features">Learn More</Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Services Section */}
          <section id="services" className="py-20 bg-card">
            <div className="container">
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our Services</h2>
                <p className="mt-4 text-lg text-muted-foreground">Two powerful tools to fortify your digital assets.</p>
              </div>
              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <ScanSearch className="w-10 h-10 text-accent" />
                      <div>
                        <CardTitle className="text-2xl">Vulnerability Scanner</CardTitle>
                        <CardDescription>Automated AI-driven analysis</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-muted-foreground">
                      Our AI-powered scanner meticulously analyzes your web application to identify a wide range of security vulnerabilities. Get a detailed report with risk scores and clear remediation steps.
                    </p>
                  </CardContent>
                  <div className="p-6 pt-0">
                    <Button asChild className="w-full">
                      <Link href="/new-scan">Scan Your Website</Link>
                    </Button>
                  </div>
                </Card>
                <Card className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <Target className="w-10 h-10 text-accent" />
                      <div>
                        <CardTitle className="text-2xl">Autonomous Pen Test</CardTitle>
                        <CardDescription>Simulated real-world attacks</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-muted-foreground">
                      Go beyond scanning. Our autonomous penetration test simulates sophisticated attacks in a safe environment, uncovering complex vulnerabilities with detailed POCs.
                    </p>
                  </CardContent>
                  <div className="p-6 pt-0">
                    <Button asChild className="w-full">
                      <Link href="/pen-test">Perform a Pen Test</Link>
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="py-20 md:py-32">
            <div className="container">
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Why Choose AegisAI?</h2>
                <p className="mt-4 text-lg text-muted-foreground">Comprehensive features designed for developers and security professionals.</p>
              </div>
              <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold">{feature}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Leverage advanced AI to uncover and fix security flaws efficiently.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
      </main>
      <footer className="border-t">
        <div className="container py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent" />
            <span className="text-sm">AegisAI &copy; {new Date().getFullYear()}</span>
          </div>
          <nav className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/terms" className="hover:text-foreground">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
