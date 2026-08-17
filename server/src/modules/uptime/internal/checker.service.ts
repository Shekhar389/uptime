import { CheckResult } from '../types.js';
import { createHttpClient } from '../../../shared/http/axios-client.js';

export async function pingUrl(url: string, timeoutMs: number = 5000): Promise<CheckResult> {
  const start = Date.now();
  const client = createHttpClient({ timeout: timeoutMs });
  try {
    const response = await client.request({
      url,
      method: 'GET',
      validateStatus: () => true, // resolve promise for any status code
    });
    const responseTimeMs = Date.now() - start;
    const isUp = response.status >= 200 && response.status < 400;
    return {
      isUp,
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

