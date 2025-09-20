'use server';

import { generateVulnerabilityReport } from '@/ai/flows/generate-vulnerability-report';
import { performPenTest } from '@/ai/flows/perform-pen-test';
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

export async function performPenetrationTest(
  targetUrl: string
): Promise<{ report?: any; error?: string }> {
  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    return { error: 'Invalid URL. Please include http:// or https://' };
  }

  try {
    // Check if the endpoint is valid before starting the pen test
    const response = await fetch(targetUrl, { method: 'HEAD', redirect: 'follow' });
    if (!response.ok) {
      return { error: `Endpoint validation failed. The URL returned a status of ${response.status}. Please provide a valid, accessible URL.` };
    }
  } catch (networkError) {
    console.error('Endpoint validation failed:', networkError);
    return { error: 'Endpoint is not reachable. Please check the URL and your network connection.' };
  }

  try {
    const report = await performPenTest({ targetUrl });
    return { report };
  } catch (e) {
    console.error('Pen test failed:', e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred';
    return { error: `Failed to perform pen test on the URL. ${errorMessage}` };
  }
}
