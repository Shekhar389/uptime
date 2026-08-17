import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export const defaultHttpTimeoutMs = 5000;

export function createHttpClient(config?: AxiosRequestConfig): AxiosInstance {
  return axios.create({
    timeout: defaultHttpTimeoutMs,
    headers: {
      'User-Agent': 'UptimeMonitor-Agent/1.0',
      ...config?.headers,
    },
    ...config,
  });
}

export const httpClient = createHttpClient();
