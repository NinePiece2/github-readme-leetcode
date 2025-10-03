// Basic LeetCode API interfaces
export interface AcSubmissionNum { 
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'All'; 
  count: number; 
}

export interface UserProfile { 
  ranking: number; 
  userAvatar?: string; 
  realName?: string; 
}

export interface SubmitStatsGlobal { 
  acSubmissionNum: AcSubmissionNum[]; 
  totalSubmissionNum?: AcSubmissionNum[]; 
}

export interface MatchedUser { 
  username: string; 
  submitStatsGlobal: SubmitStatsGlobal; 
  profile: UserProfile; 
}

export interface AllQuestionsCount { 
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'All'; 
  count: number; 
}

export interface UserStatsData { 
  data: { 
    matchedUser: MatchedUser; 
    allQuestionsCount: AllQuestionsCount[]; 
  }; 
}

export interface RecentSubmission { 
  title: string; 
  difficulty?: 'Easy' | 'Medium' | 'Hard'; 
  timestamp: string; 
  titleSlug: string;
  statusDisplay?: string;
  lang?: string;
  question?: { difficulty?: 'Easy' | 'Medium' | 'Hard' };
}

export interface RecentSubmissionsData { 
  data: { 
    recentSubmissionList?: RecentSubmission[]; 
  }; 
}

export interface UserCalendarData { 
  data: { 
    matchedUser: { 
      userCalendar: { 
        submissionCalendar: string; 
      }; 
    }; 
  }; 
}

export interface QuestionStats { 
  solved: number; 
  total: number; 
}

export interface LeetCodeStats {
  username: string;
  rank: number;
  easyQuestions: QuestionStats;
  mediumQuestions: QuestionStats;
  hardQuestions: QuestionStats;
  contributionGraph?: number[];
  recentQuestions?: RecentSubmission[];
  totalSolved: number;
  avatar?: string;
  realName?: string;
}

export interface RawTheme { 
  title_color?: string; 
  icon_color?: string; 
  text_color?: string; 
  bg_color?: string; 
  border_color?: string;
  accent_color?: string;
}

export interface Theme { 
  titleColor: string; 
  iconColor: string; 
  textColor: string; 
  bgColor: string; 
  borderColor: string;
  accentColor: string;
}

export interface CardOptions {
  showGraph: boolean;
  showRecent: boolean;
  hideRank: boolean;
  hideBorder: boolean;
  includeAllCommits: boolean;
  cardWidth: number;
}

export type DifficultyType = 'Easy' | 'Medium' | 'Hard';
export type DifficultyColors = Record<DifficultyType, string>;