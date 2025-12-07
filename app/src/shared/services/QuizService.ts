/**
 * QuizService - Business logic layer
 * Handles quiz operations, scoring, and statistics
 */
import { StorageService } from './StorageService';
import {
  QuizSessionRecord,
  UserStats,
  UserPreferences,
  QuizType,
  DEFAULT_USER_STATS,
  DEFAULT_USER_PREFERENCES,
} from './types';

export class QuizService {
  private readonly STORAGE_KEYS = {
    SESSION_HISTORY: 'session-history',
    USER_STATS: 'user-stats',
    PREFERENCES: 'preferences',
  };

  private readonly MAX_HISTORY_SIZE = 50;

  constructor(private storage: StorageService) {}

  /**
   * Save completed quiz session to history
   */
  saveCompletedSession(session: QuizSessionRecord): void {
    const history = this.getSessionHistory();
    history.unshift(session); // Add to beginning
    
    // Keep only last MAX_HISTORY_SIZE sessions
    const trimmedHistory = history.slice(0, this.MAX_HISTORY_SIZE);
    
    this.storage.save(this.STORAGE_KEYS.SESSION_HISTORY, trimmedHistory);
    this.updateStats(session);
  }

  /**
   * Get session history (most recent first)
   */
  getSessionHistory(limit?: number): QuizSessionRecord[] {
    const history = this.storage.load<QuizSessionRecord[]>(this.STORAGE_KEYS.SESSION_HISTORY) || [];
    return limit ? history.slice(0, limit) : history;
  }

  /**
   * Get user statistics
   */
  getUserStats(): UserStats {
    return this.storage.load<UserStats>(this.STORAGE_KEYS.USER_STATS) || DEFAULT_USER_STATS;
  }

  /**
   * Update user statistics with new session data
   */
  private updateStats(session: QuizSessionRecord): void {
    const stats = this.getUserStats();
    
    // Update overall stats
    stats.totalQuizzesCompleted += 1;
    stats.totalQuestionsAnswered += session.totalQuestions;
    stats.totalCorrectAnswers += session.correctAnswers;
    stats.overallAccuracy = (stats.totalCorrectAnswers / stats.totalQuestionsAnswered) * 100;
    stats.averageStarRating = this.calculateAverageStarRating(stats, session);
    stats.lastActivityDate = session.endTime;
    
    // Update quiz type specific stats
    const typeStats = stats.quizTypeStats[session.quizType];
    typeStats.quizzesCompleted += 1;
    typeStats.averageScore = this.calculateAverageScore(typeStats, session);
    typeStats.averageStarRating = this.calculateAverageStarRatingForType(typeStats, session);
    typeStats.bestScore = Math.max(typeStats.bestScore, session.score);
    
    const sessionDuration = new Date(session.endTime).getTime() - new Date(session.startTime).getTime();
    typeStats.totalTimeSpent += sessionDuration;
    
    this.storage.save(this.STORAGE_KEYS.USER_STATS, stats);
  }

  /**
   * Calculate star rating based on correct answers
   */
  calculateStarRating(correct: number, total: number): number {
    if (correct === total) return 5;
    if (correct >= total * 0.8) return 4;
    if (correct >= total * 0.6) return 3;
    if (correct >= total * 0.4) return 2;
    return 1;
  }

  /**
   * Calculate score percentage
   */
  calculateScore(correct: number, total: number): number {
    return Math.round((correct / total) * 100);
  }

  /**
   * Get user preferences
   */
  getPreferences(): UserPreferences {
    return this.storage.load<UserPreferences>(this.STORAGE_KEYS.PREFERENCES) || DEFAULT_USER_PREFERENCES;
  }

  /**
   * Save user preferences
   */
  savePreferences(preferences: UserPreferences): void {
    this.storage.save(this.STORAGE_KEYS.PREFERENCES, preferences);
  }

  /**
   * Clear all data
   */
  clearAllData(): void {
    this.storage.clear();
  }

  /**
   * Calculate new average star rating
   */
  private calculateAverageStarRating(stats: UserStats, newSession: QuizSessionRecord): number {
    const totalRating = stats.averageStarRating * (stats.totalQuizzesCompleted - 1) + newSession.starRating;
    return totalRating / stats.totalQuizzesCompleted;
  }

  /**
   * Calculate new average score for quiz type
   */
  private calculateAverageScore(typeStats: any, newSession: QuizSessionRecord): number {
    const totalScore = typeStats.averageScore * (typeStats.quizzesCompleted - 1) + newSession.score;
    return totalScore / typeStats.quizzesCompleted;
  }

  /**
   * Calculate new average star rating for quiz type
   */
  private calculateAverageStarRatingForType(typeStats: any, newSession: QuizSessionRecord): number {
    const totalRating = typeStats.averageStarRating * (typeStats.quizzesCompleted - 1) + newSession.starRating;
    return totalRating / typeStats.quizzesCompleted;
  }
}
