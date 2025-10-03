// src/lib/leetcode-api.ts

import { 
  LeetCodeStats, 
  UserStatsData, 
  UserCalendarData, 
  RecentSubmissionsData,
  RecentSubmission
} from '../types/leetcode';
import { userStatsQuery, userCalendarQuery, recentSubmissionsQuery, questionDetailQuery } from './queries';

const LEETCODE_API_ENDPOINT = 'https://leetcode.com/graphql';

/**
 * Makes a GraphQL request to LeetCode API
 * @param query - GraphQL query string
 * @param variables - Query variables
 * @returns Promise with response data
 */
async function makeGraphQLRequest<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const response = await fetch(LEETCODE_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      // provide Referer/Accept to mimic browser requests (prevents some 400s)
      'Referer': 'https://leetcode.com',
      'User-Agent': 'LeetCode-Stats-Card/1.0'
    },
    body: JSON.stringify({ query, variables })
  });

  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
  }

  if (!response.ok) {
    let graphqlMsg: string | null = null;
    if (body && typeof body === 'object' && 'errors' in body) {
      interface GraphQLError { message?: string }
      interface GraphQLErrorBody { errors?: GraphQLError[] }
      const maybe = body as GraphQLErrorBody;
      if (Array.isArray(maybe.errors) && maybe.errors[0] && maybe.errors[0].message) {
        graphqlMsg = maybe.errors[0].message as string;
      }
    }

    const message = graphqlMsg || response.statusText || `HTTP ${response.status}`;
    throw new Error(`LeetCode API returned ${response.status}: ${message}`);
  }

  if (body && typeof body === 'object' && 'errors' in body) {
    interface GraphQLError { message?: string }
    interface GraphQLErrorBody { errors?: GraphQLError[] }
    const maybe = body as GraphQLErrorBody;
    if (Array.isArray(maybe.errors) && maybe.errors.length) {
      const msg = maybe.errors[0]?.message || 'GraphQL error';
      throw new Error(`LeetCode GraphQL error: ${msg}`);
    }
  }

  return body as T;
}

/**
 * Fetches user's basic statistics from LeetCode
 * @param username - LeetCode username
 * @returns Promise with user stats data
 */
export async function fetchUserStats(username: string): Promise<UserStatsData> {
  return makeGraphQLRequest<UserStatsData>(userStatsQuery, { username });
}

/**
 * Fetches user's submission calendar data
 * @param username - LeetCode username
 * @returns Promise with calendar data
 */
export async function fetchUserCalendar(username: string): Promise<UserCalendarData> {
  return makeGraphQLRequest<UserCalendarData>(userCalendarQuery, { username });
}

/**
 * Fetches user's recent submissions
 * @param username - LeetCode username
 * @returns Promise with recent submissions data
 */
export async function fetchRecentSubmissions(username: string): Promise<RecentSubmissionsData> {
  return makeGraphQLRequest<RecentSubmissionsData>(recentSubmissionsQuery, { username });
}

/**
 * Processes raw LeetCode data into normalized stats
 * @param statsData - Raw user stats from API
 * @param calendarData - Optional calendar data
 * @param recentData - Optional recent submissions data
 * @returns Processed LeetCode stats
 */
export async function processLeetCodeData(
  statsData: UserStatsData,
  calendarData?: UserCalendarData,
  recentData?: RecentSubmissionsData
): Promise<LeetCodeStats> {
  const { matchedUser, allQuestionsCount } = statsData.data;

  if (!matchedUser) {
    throw new Error('User not found');
  }

  // Extract solved counts for each difficulty
  const easySolved = matchedUser.submitStatsGlobal.acSubmissionNum.find(d => d.difficulty === 'Easy')?.count || 0;
  const mediumSolved = matchedUser.submitStatsGlobal.acSubmissionNum.find(d => d.difficulty === 'Medium')?.count || 0;
  const hardSolved = matchedUser.submitStatsGlobal.acSubmissionNum.find(d => d.difficulty === 'Hard')?.count || 0;

  // Extract total questions for each difficulty
  const easyTotal = allQuestionsCount.find(d => d.difficulty === 'Easy')?.count || 0;
  const mediumTotal = allQuestionsCount.find(d => d.difficulty === 'Medium')?.count || 0;
  const hardTotal = allQuestionsCount.find(d => d.difficulty === 'Hard')?.count || 0;

  const totalSolved = easySolved + mediumSolved + hardSolved;


  const result: LeetCodeStats = {
    username: matchedUser.username,
    rank: matchedUser.profile.ranking,
    easyQuestions: { solved: easySolved, total: easyTotal },
    mediumQuestions: { solved: mediumSolved, total: mediumTotal },
    hardQuestions: { solved: hardSolved, total: hardTotal },
    totalSolved,
    avatar: matchedUser.profile.userAvatar,
    realName: matchedUser.profile.realName
  };

  if (calendarData?.data?.matchedUser?.userCalendar?.submissionCalendar) {
    try {
      const calendar = calendarData.data.matchedUser.userCalendar.submissionCalendar;
      result.contributionGraph = Object.values(JSON.parse(calendar));
    } catch (e) {
      console.warn('Failed to parse calendar data:', e);
    }
  }

  if (recentData?.data?.recentSubmissionList) {
    const acceptedSubmissions = recentData.data.recentSubmissionList
      .filter(sub => sub.statusDisplay === 'Accepted')
      .slice(0, 5)
      .map<RecentSubmission>(sub => ({
        title: sub.title,
        titleSlug: sub.titleSlug,
        timestamp: sub.timestamp,
        statusDisplay: sub.statusDisplay,
        lang: sub.lang,
        difficulty: sub.question?.difficulty || sub.difficulty
      } as RecentSubmission));
    
    const needFetch = acceptedSubmissions.filter(s => !s.difficulty).map(s => s.titleSlug).filter(Boolean);
    const uniqueSlugs = Array.from(new Set(needFetch)).slice(0, 3);
    if (uniqueSlugs.length > 0) {
      type QuestionDetailResp = { data?: { question?: { difficulty?: string } } } | null;
      const detailPromises = uniqueSlugs.map(slug =>
        makeGraphQLRequest<QuestionDetailResp>(questionDetailQuery, { titleSlug: slug }).catch(() => null)
      );
      const details = await Promise.all(detailPromises) as (QuestionDetailResp | null)[];
      for (let i = 0; i < uniqueSlugs.length; i++) {
        const slug = uniqueSlugs[i];
        const res = details[i];
        const diff = res && res.data && res.data.question && res.data.question.difficulty;
        if (diff) {
          acceptedSubmissions.forEach(s => {
            if (!s.difficulty && s.titleSlug === slug) s.difficulty = diff as 'Easy' | 'Medium' | 'Hard';
          });
        }
      }
    }

    if (acceptedSubmissions.length > 0) {
      result.recentQuestions = acceptedSubmissions;
    }
  }

  return result;
}

/**
 * Main function to fetch comprehensive LeetCode statistics
 * @param username - LeetCode username
 * @param showGraph - Whether to fetch contribution graph data
 * @param showRecent - Whether to fetch recent submissions
 * @returns Promise with processed LeetCode stats
 */
export async function fetchLeetCodeStats(
  username: string, 
  showGraph: boolean = false, 
  showRecent: boolean = false
): Promise<LeetCodeStats> {
  try {
    const statsData = await fetchUserStats(username);
    
    const optionalRequests: Promise<UserCalendarData | RecentSubmissionsData | null>[] = [];
    
    if (showGraph) {
      optionalRequests.push(
        fetchUserCalendar(username).catch(err => {
          console.warn('Failed to fetch calendar data:', err.message);
          return null;
        })
      );
    }
    
    if (showRecent) {
      optionalRequests.push(
        fetchRecentSubmissions(username).catch(err => {
          console.warn('Failed to fetch recent submissions:', err.message);
          return null;
        })
      );
    }

    const optionalResponses = await Promise.all(optionalRequests);
    
    let calendarData: UserCalendarData | undefined;
    let recentData: RecentSubmissionsData | undefined;
    
    let responseIndex = 0;
    if (showGraph) {
      const response = optionalResponses[responseIndex];
      calendarData = response ? response as UserCalendarData : undefined;
      responseIndex++;
    }
    if (showRecent) {
      const response = optionalResponses[responseIndex];
      recentData = response ? response as RecentSubmissionsData : undefined;
    }

  return await processLeetCodeData(statsData, calendarData, recentData);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('User not found')) {
        throw new Error(`User "${username}" not found on LeetCode`);
      }
      throw error;
    }
    throw new Error('Failed to fetch LeetCode statistics');
  }
}