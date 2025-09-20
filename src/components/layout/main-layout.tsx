
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, ScanLine, LayoutDashboard, Target, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/new-scan', label: 'New Scan', icon: ScanLine },
  { href: '/pen-test', label: 'Pen Test', icon: Target },
];

function NavContent() {
  const pathname = usePathname();
  const getIsActive = (href: string) => {
    if (href === '/dashboard' && pathname === '/') return true;
    return pathname.startsWith(href);
  };

  return (
    <>
      <Link href="/" className="flex items-center gap-2 mb-8 px-2">
        <Shield className="w-8 h-8 text-accent" />
        <h1 className="text-xl font-bold text-foreground">AegisAI</h1>
      </Link>
      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  getIsActive(item.href)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

export default function MainLayout({ children }: { children: ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Desktop Sidebar */}
      <aside className="w-60 flex-shrink-0 border-r border-border/50 hidden md:flex flex-col p-4 bg-card">
        <NavContent />
      </aside>

      {/* Mobile Header and Sidebar */}
      <header className="md:hidden sticky top-0 z-40 w-full border-b bg-card">
        <div className="container flex h-14 items-center">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-4 bg-card w-60">
              <NavContent />
            </SheetContent>
          </Sheet>
          <div className="flex flex-1 justify-center">
             <Link href="/" className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-accent" />
                <span className="font-bold">AegisAI</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
