import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-remediation-steps.ts';
import '@/ai/flows/check-authentication.ts';
import '@/ai/flows/generate-vulnerability-report.ts';
import '@/ai/flows/perform-pen-test.ts';
