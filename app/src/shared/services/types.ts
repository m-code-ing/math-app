/**
 * Shared types used by service layer
 */

export type QuizType = 'addition' | 'recognition' | 'make10';
export type SessionPhase = 'active' | 'transition' | 'summary';

/**
 * Record of a completed quiz session
 */
export interface QuizSessionRecord {
  sessionId: string;
  quizType: QuizType;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  totalQuestions: number;
  correctAnswers: number;
  score: number;        // percentage (0-100)
  starRating: number;   // 1-5
}

/**
 * Aggregated user statistics
 */
export interface UserStats {
  totalQuizzesCompleted: number;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  overallAccuracy: number; // percentage (0-100)
  averageStarRating: number;
  lastActivityDate: string; // ISO string
  quizTypeStats: {
    addition: QuizTypeStats;
    recognition: QuizTypeStats;
    make10: QuizTypeStats;
  };
}

/**
 * Statistics for a specific quiz type
 */
export interface QuizTypeStats {
  quizzesCompleted: number;
  averageScore: number;
  averageStarRating: number;
  bestScore: number;
  totalTimeSpent: number; // milliseconds
}

/**
 * User preferences
 */
export interface UserPreferences {
  soundEnabled: boolean;
  animationsEnabled: boolean;
  theme: 'light' | 'dark';
}

/**
 * Default values
 */
export const DEFAULT_USER_STATS: UserStats = {
  totalQuizzesCompleted: 0,
  totalQuestionsAnswered: 0,
  totalCorrectAnswers: 0,
  overallAccuracy: 0,
  averageStarRating: 0,
  lastActivityDate: new Date().toISOString(),
  quizTypeStats: {
    addition: {
      quizzesCompleted: 0,
      averageScore: 0,
      averageStarRating: 0,
      bestScore: 0,
      totalTimeSpent: 0,
    },
    recognition: {
      quizzesCompleted: 0,
      averageScore: 0,
      averageStarRating: 0,
      bestScore: 0,
      totalTimeSpent: 0,
    },
    make10: {
      quizzesCompleted: 0,
      averageScore: 0,
      averageStarRating: 0,
      bestScore: 0,
      totalTimeSpent: 0,
    },
  },
};

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  soundEnabled: true,
  animationsEnabled: true,
  theme: 'light',
};
