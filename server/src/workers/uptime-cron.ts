import { runMonitoringBatch } from '../modules/uptime/index.js';
import { logger } from '../infrastructure/logger/index.js';

export async function tickUptimeCron(): Promise<number> {
  try {
    const checkedCount = await runMonitoringBatch(15);
    logger.info(`[UptimeCron] Tick completed. Checked ${checkedCount} monitors.`);
    return checkedCount;
  } catch (err) {
    logger.error({ err }, '[UptimeCron] Error during monitoring tick');
    return 0;
  }
}

export function startUptimeCron(intervalMs: number = 60000): NodeJS.Timeout {
  logger.info(`[UptimeCron] Starting monitoring cron runner with interval ${intervalMs}ms...`);
  
  // Run an immediate tick on startup
  void tickUptimeCron();

  // Schedule recurring 1-minute ticks
  const timer = setInterval(() => {
    void tickUptimeCron();
  }, intervalMs);

  return timer;
}

if (process.argv[1]?.endsWith('uptime-cron.js') || process.argv[1]?.endsWith('uptime-cron.ts')) {
  startUptimeCron();
}
