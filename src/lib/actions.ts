"use server";

import { generateVulnerabilityReport } from '@/ai/flows/generate-vulnerability-report';
import type { VulnerabilityReport } from '@/lib/types';

export async function performScan(
  targetUrl: string
): Promise<{ report?: VulnerabilityReport; error?: string }> {
  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    return { error: 'Invalid URL. Please include http:// or https://' };
  }

  try {
    const report = await generateVulnerabilityReport({ targetUrl });
    return { report };
  } catch (e) {
    console.error('Scan failed:', e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred';
    return { error: `Failed to scan the URL. ${errorMessage}` };
  }
}
