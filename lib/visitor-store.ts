import { Redis } from '@upstash/redis';

const KEY = 'portfolio:last-visitor';

export type StoredVisitor = {
  label: string;
  city: string;
  region?: string;
  country: string;
  visitedAt: string;
};

let memoryStore: StoredVisitor | null = null;

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  return new Redis({ url, token });
}

export async function getLastVisitor() {
  const redis = getRedis();

  if (redis) {
    return redis.get<StoredVisitor>(KEY);
  }

  return memoryStore;
}

export async function setLastVisitor(visitor: StoredVisitor) {
  const redis = getRedis();

  if (redis) {
    await redis.set(KEY, visitor);
    return;
  }

  memoryStore = visitor;
}
