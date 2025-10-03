import fs from 'fs/promises';
import path from 'path';

type CacheRecord<T> = { value: T; expiresAt: number };

const CACHE_DIR = path.join(process.cwd(), '.cache');
const CACHE_FILE = path.join(CACHE_DIR, 'leetcode-cache.json');

let inMemory: Record<string, CacheRecord<unknown>> | null = null;

async function ensureLoaded() {
  if (inMemory) return;
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
    const raw = await fs.readFile(CACHE_FILE, 'utf8').catch(() => '{}');
    inMemory = JSON.parse(raw || '{}');
  } catch {
    inMemory = {};
  }
}

async function persist() {
  if (!inMemory) return;
  const tmp = CACHE_FILE + '.tmp';
  await fs.writeFile(tmp, JSON.stringify(inMemory), 'utf8');
  await fs.rename(tmp, CACHE_FILE);
}

export async function getCache<T>(key: string): Promise<CacheRecord<T> | null> {
  await ensureLoaded();
  const rec = inMemory ? (inMemory[key] as CacheRecord<T> | undefined) : undefined;
  if (!rec) return null;
  if (rec.expiresAt <= Date.now()) {
    // expired
  if (inMemory) delete inMemory[key];
    await persist();
    return null;
  }
  return rec;
}

export async function setCache<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
  await ensureLoaded();
  const expiresAt = Date.now() + ttlSeconds * 1000;
  if (inMemory) inMemory[key] = { value, expiresAt } as CacheRecord<unknown>;
  await persist();
}

export async function clearCache(): Promise<void> {
  inMemory = {};
  await persist();
}

const persistentCache = { getCache, setCache, clearCache };
export default persistentCache;
