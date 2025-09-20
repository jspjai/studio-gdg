import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { VulnerabilityReport } from '@/lib/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateRiskScore(vulnerabilities: VulnerabilityReport['vulnerabilities']): number {
  if (!vulnerabilities || vulnerabilities.length === 0) {
    return 0;
  }

  const score = vulnerabilities.reduce((acc, v) => {
    switch (v.severity) {
      case 'Critical':
        return acc + 10;
      case 'High':
        return acc + 7;
      case 'Medium':
        return acc + 4;
      case 'Low':
        return acc + 1;
      default:
        return acc;
    }
  }, 0);

  return Math.min(score, 100);
}

export function getSeverityBadgeClass(severity: 'Critical' | 'High' | 'Medium' | 'Low'): string {
    switch (severity) {
        case 'Critical':
            return 'bg-destructive text-destructive-foreground hover:bg-destructive/80';
        case 'High':
            return 'bg-orange-600 text-white hover:bg-orange-600/80';
        case 'Medium':
            return 'bg-yellow-500 text-black hover:bg-yellow-500/80';
        case 'Low':
            return 'bg-blue-500 text-white hover:bg-blue-500/80';
        default:
            return 'bg-secondary text-secondary-foreground hover:bg-secondary/80';
    }
}
