/**
 * QuestionGenerationService - Handles generation of quiz questions
 * Centralizes all question generation logic for different quiz types
 */
import { MathProblem } from '../../features/addition-quiz/types/MathProblem';
import { TenFrameQuestion } from '../../features/ten-frame/types/TenFrame';

export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'expert';

export class QuestionGenerationService {
  /**
   * Generate addition problems with difficulty level
   * Difficulty determines the maximum sum (not the individual numbers)
   */
  generateAdditionProblems(count: number = 10, difficulty: DifficultyLevel = 'hard'): MathProblem[] {
    const problems: MathProblem[] = [];
    const used = new Set<string>();
    let attempts = 0;
    const maxAttempts = count * 100;

    const maxSums = {
      easy: 10,
      medium: 20,
      hard: 50,
      expert: 100,
    };

    const maxSum = maxSums[difficulty];

    while (problems.length < count && attempts < maxAttempts) {
      attempts++;
      
      // Generate num1 between 1 and maxSum-1 (to leave room for num2)
      const num1 = Math.floor(Math.random() * (maxSum - 1)) + 1;
      // Generate num2 such that num1 + num2 <= maxSum
      const maxNum2 = maxSum - num1;
      const num2 = Math.floor(Math.random() * maxNum2) + 1;
      
      const key = `${num1}+${num2}`;

      if (!used.has(key)) {
        used.add(key);
        problems.push({
          num1,
          num2,
          operation: '+',
          expectedAnswer: num1 + num2,
        });
      }
    }

    return problems;
  }

  /**
   * Generate ten frame recognition questions
   */
  generateRecognitionQuestions(count: number = 10): TenFrameQuestion[] {
    const questions: TenFrameQuestion[] = [];

    // For counts <= 10, ensure unique numbers
    if (count <= 10) {
      const used = new Set<number>();
      while (questions.length < count) {
        const number = Math.floor(Math.random() * 10) + 1;
        if (!used.has(number)) {
          used.add(number);
          questions.push({ number, correctAnswer: number });
        }
      }
    } else {
      // For counts > 10, allow duplicates
      for (let i = 0; i < count; i++) {
        const number = Math.floor(Math.random() * 10) + 1;
        questions.push({ number, correctAnswer: number });
      }
    }

    return questions;
  }

  /**
   * Generate ten frame "make 10" questions
   */
  generateMake10Questions(count: number = 10): TenFrameQuestion[] {
    const questions: TenFrameQuestion[] = [];
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    if (count <= 9) {
      // For counts <= 9, use unique numbers
      const shuffled = this.shuffle(numbers);
      for (let i = 0; i < count; i++) {
        questions.push({
          number: shuffled[i],
          correctAnswer: 10 - shuffled[i],
        });
      }
    } else {
      // For counts > 9, allow duplicates
      for (let i = 0; i < count; i++) {
        const number = Math.floor(Math.random() * 9) + 1;
        questions.push({
          number: number,
          correctAnswer: 10 - number,
        });
      }
    }

    return questions;
  }

  /**
   * Generate answer choices for ten frame questions
   */
  generateAnswerChoices(
    correctAnswer: number,
    mode: 'recognition' | 'make10'
  ): number[] {
    const choices = new Set<number>([correctAnswer]);
    const max = mode === 'recognition' ? 10 : 9;

    while (choices.size < 3) {
      const offset = Math.floor(Math.random() * 3) + 1;
      const sign = Math.random() < 0.5 ? 1 : -1;
      const candidate = correctAnswer + offset * sign;

      if (candidate >= 1 && candidate <= max) {
        choices.add(candidate);
      }
    }

    return this.shuffle(Array.from(choices));
  }

  /**
   * Fisher-Yates shuffle algorithm
   */
  private shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}
