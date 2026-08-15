import { CheckResult } from '../types.js';

export async function pingUrl(url: string): Promise<CheckResult> {
  const start = Date.now();
  try {
    const response = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(10000) });
    const responseTimeMs = Date.now() - start;
    return {
      isUp: response.ok,
      statusCode: response.status,
      responseTimeMs,
    };
  } catch (err: any) {
    return {
      isUp: false,
      statusCode: 0,
      responseTimeMs: Date.now() - start,
      error: err.message || 'Ping failed',
    };
  }
}
