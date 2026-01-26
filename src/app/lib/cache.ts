import { unstable_cache } from "next/cache";

export function cacheByKey<T extends (...args: any[]) => any>(
  fn: T,
  key: string,
  revalidate = 60,
) {
  return unstable_cache(fn, [key], { revalidate });
}
