/**
 * Service layer exports
 * Singleton instances for use throughout the app
 */
import { StorageService } from './StorageService';
import { QuizService } from './QuizService';
import { QuestionGenerationService } from './QuestionGenerationService';

// Create singleton instances
export const storageService = new StorageService();
export const quizService = new QuizService(storageService);
export const questionGenerationService = new QuestionGenerationService();

// Export classes for testing
export { StorageService } from './StorageService';
export { QuizService } from './QuizService';
export { QuestionGenerationService } from './QuestionGenerationService';

// Export types
export * from './types';
export type { DifficultyLevel } from './QuestionGenerationService';
