'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, ScanLine, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

const navItems = [
  { href: '/', label: 'New Scan', icon: ScanLine },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

export default function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="w-60 flex-shrink-0 border-r border-border/50 flex flex-col p-4 bg-card">
        <div className="flex items-center gap-2 mb-8 px-2">
          <Shield className="w-8 h-8 text-accent" />
          <h1 className="text-xl font-bold text-foreground">AegisAI</h1>
        </div>
        <nav className="flex-1">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    pathname === item.href
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
      </aside>
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
