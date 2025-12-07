import { QuizService } from '../QuizService';
import { StorageService } from '../StorageService';
import { QuizSessionRecord } from '../types';

describe('QuizService', () => {
  let service: QuizService;
  let storage: StorageService;

  beforeEach(() => {
    localStorage.clear();
    storage = new StorageService();
    service = new QuizService(storage);
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('calculateStarRating', () => {
    it('returns 5 stars for perfect score', () => {
      expect(service.calculateStarRating(10, 10)).toBe(5);
    });

    it('returns 4 stars for 80-99%', () => {
      expect(service.calculateStarRating(8, 10)).toBe(4);
      expect(service.calculateStarRating(9, 10)).toBe(4);
    });

    it('returns 3 stars for 60-79%', () => {
      expect(service.calculateStarRating(6, 10)).toBe(3);
      expect(service.calculateStarRating(7, 10)).toBe(3);
    });

    it('returns 2 stars for 40-59%', () => {
      expect(service.calculateStarRating(4, 10)).toBe(2);
      expect(service.calculateStarRating(5, 10)).toBe(2);
    });

    it('returns 1 star for below 40%', () => {
      expect(service.calculateStarRating(0, 10)).toBe(1);
      expect(service.calculateStarRating(3, 10)).toBe(1);
    });
  });

  describe('calculateScore', () => {
    it('calculates percentage correctly', () => {
      expect(service.calculateScore(10, 10)).toBe(100);
      expect(service.calculateScore(8, 10)).toBe(80);
      expect(service.calculateScore(5, 10)).toBe(50);
      expect(service.calculateScore(0, 10)).toBe(0);
    });

    it('rounds to nearest integer', () => {
      expect(service.calculateScore(7, 9)).toBe(78); // 77.77... rounded
    });
  });

  describe('session history', () => {
    const createMockSession = (quizType: 'addition' | 'recognition' | 'make10', correctAnswers: number): QuizSessionRecord => ({
      sessionId: `session-${Date.now()}`,
      quizType,
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      totalQuestions: 10,
      correctAnswers,
      score: (correctAnswers / 10) * 100,
      starRating: service.calculateStarRating(correctAnswers, 10),
    });

    it('saves completed session to history', () => {
      const session = createMockSession('addition', 8);
      service.saveCompletedSession(session);
      
      const history = service.getSessionHistory();
      expect(history).toHaveLength(1);
      expect(history[0]).toEqual(session);
    });

    it('adds new sessions to beginning of history', () => {
      const session1 = createMockSession('addition', 8);
      const session2 = createMockSession('recognition', 9);
      
      service.saveCompletedSession(session1);
      service.saveCompletedSession(session2);
      
      const history = service.getSessionHistory();
      expect(history[0]).toEqual(session2);
      expect(history[1]).toEqual(session1);
    });

    it('limits history to 50 sessions', () => {
      // Add 60 sessions
      for (let i = 0; i < 60; i++) {
        service.saveCompletedSession(createMockSession('addition', 8));
      }
      
      const history = service.getSessionHistory();
      expect(history).toHaveLength(50);
    });

    it('returns limited history when limit specified', () => {
      for (let i = 0; i < 20; i++) {
        service.saveCompletedSession(createMockSession('addition', 8));
      }
      
      const history = service.getSessionHistory(5);
      expect(history).toHaveLength(5);
    });

    it('returns empty array when no history exists', () => {
      const history = service.getSessionHistory();
      expect(history).toEqual([]);
    });
  });

  describe('user statistics', () => {
    it('returns default stats when none exist', () => {
      const stats = service.getUserStats();
      expect(stats.totalQuizzesCompleted).toBe(0);
      expect(stats.totalQuestionsAnswered).toBe(0);
      expect(stats.totalCorrectAnswers).toBe(0);
    });

    it('updates stats after completing session', () => {
      const session: QuizSessionRecord = {
        sessionId: 'test-session',
        quizType: 'addition',
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        totalQuestions: 10,
        correctAnswers: 8,
        score: 80,
        starRating: 4,
      };
      
      service.saveCompletedSession(session);
      
      const stats = service.getUserStats();
      expect(stats.totalQuizzesCompleted).toBe(1);
      expect(stats.totalQuestionsAnswered).toBe(10);
      expect(stats.totalCorrectAnswers).toBe(8);
      expect(stats.overallAccuracy).toBe(80);
    });

    it('updates quiz type specific stats', () => {
      const session: QuizSessionRecord = {
        sessionId: 'test-session',
        quizType: 'addition',
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        totalQuestions: 10,
        correctAnswers: 8,
        score: 80,
        starRating: 4,
      };
      
      service.saveCompletedSession(session);
      
      const stats = service.getUserStats();
      expect(stats.quizTypeStats.addition.quizzesCompleted).toBe(1);
      expect(stats.quizTypeStats.addition.averageScore).toBe(80);
      expect(stats.quizTypeStats.addition.bestScore).toBe(80);
    });

    it('calculates average correctly across multiple sessions', () => {
      const session1: QuizSessionRecord = {
        sessionId: 'session-1',
        quizType: 'addition',
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        totalQuestions: 10,
        correctAnswers: 8,
        score: 80,
        starRating: 4,
      };
      
      const session2: QuizSessionRecord = {
        sessionId: 'session-2',
        quizType: 'addition',
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        totalQuestions: 10,
        correctAnswers: 10,
        score: 100,
        starRating: 5,
      };
      
      service.saveCompletedSession(session1);
      service.saveCompletedSession(session2);
      
      const stats = service.getUserStats();
      expect(stats.overallAccuracy).toBe(90); // (8+10)/(10+10) * 100
      expect(stats.quizTypeStats.addition.averageScore).toBe(90); // (80+100)/2
    });
  });

  describe('preferences', () => {
    it('returns default preferences when none exist', () => {
      const prefs = service.getPreferences();
      expect(prefs.soundEnabled).toBe(true);
      expect(prefs.animationsEnabled).toBe(true);
      expect(prefs.theme).toBe('light');
    });

    it('saves and loads preferences', () => {
      const prefs = {
        soundEnabled: false,
        animationsEnabled: false,
        theme: 'dark' as const,
      };
      
      service.savePreferences(prefs);
      const loaded = service.getPreferences();
      
      expect(loaded).toEqual(prefs);
    });
  });

  describe('clearAllData', () => {
    it('clears all service data', () => {
      const session: QuizSessionRecord = {
        sessionId: 'test',
        quizType: 'addition',
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        totalQuestions: 10,
        correctAnswers: 8,
        score: 80,
        starRating: 4,
      };
      
      service.saveCompletedSession(session);
      service.savePreferences({ soundEnabled: false, animationsEnabled: false, theme: 'dark' });
      
      service.clearAllData();
      
      expect(service.getSessionHistory()).toEqual([]);
      expect(service.getUserStats().totalQuizzesCompleted).toBe(0);
      expect(service.getPreferences().soundEnabled).toBe(true); // back to default
    });
  });
});
