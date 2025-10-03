// src/lib/queries.ts

/**
 * GraphQL query to fetch user's main statistics including solved problems and ranking
 */
export const userStatsQuery = `
query userStats($username: String!) {
  matchedUser(username: $username) {
    username
    submitStatsGlobal {
      acSubmissionNum { difficulty count }
    }
    profile { 
      ranking
      userAvatar
      realName
    }
  }
  allQuestionsCount { difficulty count }
}`;

/**
 * GraphQL query to fetch user's submission calendar data
 */
export const userCalendarQuery = `
query userProfileCalendar($username: String!) {
  matchedUser(username: $username) { 
    userCalendar { 
      submissionCalendar 
    } 
  }
}`;

/**
 * GraphQL query to fetch user's recent submissions
 * Note: Recent submissions require additional context and may not be available via public API
 * Using submission stats as fallback
 */
export const recentSubmissionsQuery = `
query recentSubmissions($username: String!) {
  recentSubmissionList(username: $username) {
    title
    titleSlug
    timestamp
    statusDisplay
    lang
  }
}`;
 

export const questionDetailQuery = `
query questionDetail($titleSlug: String!) {
  question(titleSlug: $titleSlug) {
    difficulty
  }
}`;

/**
 * Query configuration object for better organization
 */
export const queries = {
  userStats: userStatsQuery,
  userCalendar: userCalendarQuery,
  recentSubmissions: recentSubmissionsQuery,
  questionDetail: questionDetailQuery
} as const;

/**
 * GraphQL query variables interface
 */
export interface QueryVariables {
  username: string;
}

/**
 * Available query types
 */
export type QueryType = keyof typeof queries;