import { ReactNode } from 'react';
import { Shield } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LandingLayout({ children }: { children: ReactNode }) {
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
      <main className="flex-1">{children}</main>
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
