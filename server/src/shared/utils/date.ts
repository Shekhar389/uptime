export function getDaysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

export function formatISO(date: Date): string {
  return date.toISOString();
}
