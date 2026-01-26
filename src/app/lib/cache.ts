type CacheEntry<T> = {
  data: T;
  expires: number;
};

const cache = new Map<string, CacheEntry<any>>();

export async function withCache<T>(
  key: string,
  ttl: number,
  fn: () => Promise<T>,
): Promise<T> {
  const now = Date.now();
  const cached = cache.get(key);

  if (cached && cached.expires > now) {
    return cached.data;
  }

  const data = await fn();

  cache.set(key, {
    data,
    expires: now + ttl,
  });

  return data;
}
