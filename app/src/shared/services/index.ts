/**
 * Service layer exports
 * Singleton instances for use throughout the app
 */
import { StorageService } from './StorageService';
import { QuizService } from './QuizService';

// Create singleton instances
export const storageService = new StorageService();
export const quizService = new QuizService(storageService);

// Export classes for testing
export { StorageService } from './StorageService';
export { QuizService } from './QuizService';

// Export types
export * from './types';
