import { describe, it, expect, beforeEach } from 'vitest';
import { setAuthToken, setTeamId, apiClient } from '../axios';

describe('Axios Interceptor Seam', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('injects Auth Token and Team ID headers when set', async () => {
    setAuthToken('test-bearer-token');
    setTeamId('team-uuid-123');

    const handlers = (apiClient.interceptors.request as any).handlers;
    const requestHandler = handlers[0].fulfilled;
    const config = await requestHandler({ headers: {} });

    expect(config.headers.Authorization).toBe('Bearer test-bearer-token');
    expect(config.headers['X-Team-ID']).toBe('team-uuid-123');
  });

  it('clears headers when tokens are set to null', async () => {
    setAuthToken(null);
    setTeamId(null);

    const handlers = (apiClient.interceptors.request as any).handlers;
    const requestHandler = handlers[0].fulfilled;
    const config = await requestHandler({ headers: {} });

    expect(config.headers.Authorization).toBeUndefined();
    expect(config.headers['X-Team-ID']).toBeUndefined();
  });
});
