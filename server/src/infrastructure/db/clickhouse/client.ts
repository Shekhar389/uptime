import { createClient } from '@clickhouse/client';
import { env } from '../../../config/env.js';
import { createComponentLogger } from '../../logger/index.js';

const log = createComponentLogger('clickhouse');

export const clickhouseClient = createClient({
  url: env.CLICKHOUSE_URL,
  database: env.CLICKHOUSE_DATABASE,
  username: env.CLICKHOUSE_USER,
  password: env.CLICKHOUSE_PASSWORD,
  request_timeout: 10000,
});

export const checkClickHouseHealth = async (): Promise<boolean> => {
  try {
    const result = await clickhouseClient.ping();
    return result.success;
  } catch (err) {
    log.error({ err }, 'ClickHouse health check failed');
    return false;
  }
};
