import type { GenerateVulnerabilityReportOutput } from '@/ai/flows/generate-vulnerability-report';

export type VulnerabilityReport = GenerateVulnerabilityReportOutput;

export type ScanHistoryItem = {
  id: string;
  targetUrl: string;
  scanDate: string; // ISO string
  riskScore: number;
  report: VulnerabilityReport;
};
