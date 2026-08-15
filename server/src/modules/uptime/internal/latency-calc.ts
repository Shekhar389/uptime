export function calculateSLA(totalChecks: number, failedChecks: number): number {
  if (totalChecks === 0) return 100.0;
  const uptime = ((totalChecks - failedChecks) / totalChecks) * 100;
  return Number(uptime.toFixed(3));
}
