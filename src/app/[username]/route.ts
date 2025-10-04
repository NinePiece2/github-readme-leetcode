import { NextResponse } from 'next/server';
import { CardOptions, LeetCodeStats } from '../../types/leetcode';
import { getTheme } from '../../config/themes';
import { fetchLeetCodeStats, fetchUserStats } from '../../lib/leetcode-api';
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
    let cacheStatus = 'MISS';
    let stats: LeetCodeStats;

    const cached = await persistentCache.getCache<LeetCodeStats>(cacheKey);

    if (cached) {
      // cached is fresh (getCache returns null if expired)
      const cachedStats = cached.value as LeetCodeStats;

      // Try a lightweight validation: fetch minimal stats and compare counts + rank.
      // If any core field changed, fetch the full dataset and update cache.
      try {
        const liteResp = await fetchUserStats(username).catch(() => null);
        const matchedUser = liteResp?.data?.matchedUser;
        if (matchedUser) {
          const ac = matchedUser.submitStatsGlobal?.acSubmissionNum || [];
          const easyLive = ac.find((d: any) => d.difficulty === 'Easy')?.count || 0;
          const mediumLive = ac.find((d: any) => d.difficulty === 'Medium')?.count || 0;
          const hardLive = ac.find((d: any) => d.difficulty === 'Hard')?.count || 0;
          const rankLive = matchedUser.profile?.ranking || 0;
          const totalLive = easyLive + mediumLive + hardLive;

          const coreChanged =
            easyLive !== cachedStats.easyQuestions.solved ||
            mediumLive !== cachedStats.mediumQuestions.solved ||
            hardLive !== cachedStats.hardQuestions.solved ||
            rankLive !== cachedStats.rank ||
            totalLive !== cachedStats.totalSolved;

          if (coreChanged) {
            // Refresh fully and update cache
            stats = await fetchLeetCodeStats(username, showGraph, showRecent);
            await persistentCache.setCache(cacheKey, stats, LEETCODE_CACHE_TTL);
            cacheStatus = 'UPDATED';
          } else {
            // Reuse cached, refresh TTL
            stats = cachedStats;
            await persistentCache.setCache(cacheKey, stats, LEETCODE_CACHE_TTL).catch(() => { /* ignore */ });
            cacheStatus = 'HIT';
          }
        } else {
          // Couldn't validate — fall back to cached entry
          stats = cachedStats;
          cacheStatus = 'HIT';
        }
      } catch (e) {
        // On any validation error, safely use cached value
        stats = cachedStats;
        cacheStatus = 'HIT';
      }
    } else {
      // No cache, fetch full data and store
      stats = await fetchLeetCodeStats(username, showGraph, showRecent);
      await persistentCache.setCache(cacheKey, stats, LEETCODE_CACHE_TTL);
      cacheStatus = 'MISS';
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
        'X-Cache': cacheStatus
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