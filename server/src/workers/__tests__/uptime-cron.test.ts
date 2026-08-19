import { tickUptimeCron, startUptimeCron } from '../uptime-cron.js';
import * as uptimeModule from '../../modules/uptime/index.js';

jest.mock('../../modules/uptime/index.js', () => ({
  runMonitoringBatch: jest.fn(),
}));

describe('uptime-cron worker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should run batch check on tick', async () => {
    (uptimeModule.runMonitoringBatch as jest.Mock).mockResolvedValue(5);

    const count = await tickUptimeCron();

    expect(uptimeModule.runMonitoringBatch).toHaveBeenCalledWith(15);
    expect(count).toBe(5);
  });

  it('should start cron timer and execute ticks', () => {
    (uptimeModule.runMonitoringBatch as jest.Mock).mockResolvedValue(2);

    const timer = startUptimeCron(60000);

    expect(uptimeModule.runMonitoringBatch).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(60000);

    expect(uptimeModule.runMonitoringBatch).toHaveBeenCalledTimes(2);

    clearInterval(timer);
  });
});
