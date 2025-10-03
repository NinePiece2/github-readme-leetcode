type CacheRecord<T> = { value: T; expiresAt: number };

// The cache attempts to use a file-backed store when running in Node.js. On edge
// runtimes (Cloudflare Workers, Vercel Edge, etc.) the filesystem isn't available.
// To avoid throwing at module-import time, we dynamically import fs/path and fall
// back to an in-memory-only cache when those modules are unavailable.
let inMemory: Record<string, CacheRecord<unknown>> | null = null;
let fileBackingEnabled = true;
let CACHE_DIR = '';
let CACHE_FILE = '';

async function ensureLoaded() {
  if (inMemory) return;

  // Try to dynamically load fs/path. If unavailable, fall back to memory-only cache.
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    CACHE_DIR = path.join(process.cwd(), '.cache');
    CACHE_FILE = path.join(CACHE_DIR, 'leetcode-cache.json');

    try {
      await fs.mkdir(CACHE_DIR, { recursive: true });
      const raw = await fs.readFile(CACHE_FILE, 'utf8').catch(() => '{}');
      inMemory = JSON.parse(raw || '{}');
    } catch {
      // If reading/writing fails for any reason, fall back to memory-only but keep fileBackingEnabled=false
      inMemory = {};
      fileBackingEnabled = false;
    }
  } catch {
    // Dynamic import failed (likely running on an edge runtime) — use memory-only cache
    inMemory = {};
    fileBackingEnabled = false;
  }
}

async function persist() {
  if (!inMemory) return;
  if (!fileBackingEnabled) return; // skip on edge runtimes

  // we know dynamic import succeeded previously; import fs here
  const fs = await import('fs/promises');
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
