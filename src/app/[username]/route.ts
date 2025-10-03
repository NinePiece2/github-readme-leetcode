import { NextResponse } from 'next/server';
import { CardOptions, LeetCodeStats } from '../../types/leetcode';
import { getTheme } from '../../config/themes';
import { fetchLeetCodeStats } from '../../lib/leetcode-api';
import { generateLeetCodeCard } from '../../lib/svg-generators';
import { createErrorResponse } from '../../lib/error-utils';
import persistentCache from '../../lib/persistent-cache';

const LEETCODE_CACHE_TTL = parseInt(process.env.LEETCODE_CACHE_TTL || '900', 10); // seconds (default 15m)

export async function GET(request: Request, { params }: { params: Promise<{ username: string }> }) {
  try {
  let { username } = await params;
  username = String(username || '').trim();
    const url = new URL(request.url);
    
    const theme = url.searchParams.get('theme') || 'default';
    const show = url.searchParams.get('show') || '';
    const hideRank = url.searchParams.get('hide_rank') === 'true';
    const hideBorder = url.searchParams.get('hide_border') === 'true';
    const includeAllCommits = url.searchParams.get('include_all_commits') === 'true';
    const cardWidth = parseInt(url.searchParams.get('card_width') || '500');
    
    // Determine what additional data to fetch
    const showGraph = show.includes('graph');
    const showRecent = show.includes('recent');
    
    // Validate username
    if (!username || username === '') {
      const errResp = createErrorResponse(new Error('Username is required'), theme);
      return new NextResponse(errResp.svg, { headers: errResp.headers, status: 400 });
    }

    const cacheKey = `${username}|g:${showGraph ? 1 : 0}|r:${showRecent ? 1 : 0}`;
    const now = Date.now();
    let cacheHit = false;
    let stats: LeetCodeStats;

    const cached = await persistentCache.getCache<LeetCodeStats>(cacheKey);
    if (cached && cached.expiresAt > now) {
      // validate cached payload matches requested username to avoid serving the wrong user's
      // cached card (can happen if cache was populated incorrectly).
      const cachedUsername = (cached.value as LeetCodeStats)?.username;
      if (String(cachedUsername || '').trim().toLowerCase() === username.toLowerCase()) {
        stats = cached.value as LeetCodeStats;
        cacheHit = true;
      } else {
        // mismatch: drop the stale entry and fetch fresh
        try { await persistentCache.clearCache(); } catch {
          /* ignore */
        }
        stats = await fetchLeetCodeStats(username, showGraph, showRecent);
        await persistentCache.setCache(cacheKey, stats, LEETCODE_CACHE_TTL);
      }
    } else {
      stats = await fetchLeetCodeStats(username, showGraph, showRecent);
      await persistentCache.setCache(cacheKey, stats, LEETCODE_CACHE_TTL);
    }
    
    const themeConfig = getTheme(theme);
    
    const options: CardOptions = {
      showGraph,
      showRecent,
      hideRank,
      hideBorder,
      includeAllCommits,
      cardWidth
    };
    
    const svg = generateLeetCodeCard(stats, themeConfig, options);

    return new NextResponse(svg, {
      headers: { 
        'Content-Type': 'image/svg+xml', 
        'Cache-Control': 's-maxage=1800, stale-while-revalidate=3600',
        'Access-Control-Allow-Origin': '*',
        'X-Cache': cacheHit ? 'HIT' : 'MISS'
      }
    });
  } catch (err) {
    console.error('LeetCode Stats Error:', err);
    
    // Handle errors with proper theming
    const url = new URL(request.url);
    const theme = url.searchParams.get('theme') || 'default';
    const errorResponse = createErrorResponse(err, theme);
    
    return new NextResponse(errorResponse.svg, {
      headers: errorResponse.headers,
      status: errorResponse.status
    });
  }
}