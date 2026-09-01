const store = new Map<string, { count: number; resetTime: number }>();
const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 10;

export function rateLimit(ip: string): boolean {
  const now = Date.now();
  const record = store.get(ip);
  if (!record || now > record.resetTime) {
    store.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return true;
  }
  if (record.count >= MAX_REQUESTS) return false;
  record.count++;
  store.set(ip, record);
  return true;
}
