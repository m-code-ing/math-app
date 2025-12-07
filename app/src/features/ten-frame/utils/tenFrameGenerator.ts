import { TenFrameQuestion } from '../types/TenFrame';

export function generateRecognitionQuestions(count: number = 10): TenFrameQuestion[] {
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

export function generateMake10Questions(count: number = 10): TenFrameQuestion[] {
  const questions: TenFrameQuestion[] = [];
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  
  if (count <= 9) {
    // For counts <= 9, use unique numbers
    const shuffled = shuffle(numbers);
    for (let i = 0; i < count; i++) {
      questions.push({ 
        number: shuffled[i], 
        correctAnswer: 10 - shuffled[i] 
      });
    }
  } else {
    // For counts > 9, allow duplicates
    for (let i = 0; i < count; i++) {
      const number = Math.floor(Math.random() * 9) + 1;
      questions.push({ 
        number: number, 
        correctAnswer: 10 - number 
      });
    }
  }
  
  return questions;
}

export function generateAnswerChoices(correctAnswer: number, mode: 'recognition' | 'make10'): number[] {
  const choices = new Set<number>([correctAnswer]);
  const max = mode === 'recognition' ? 10 : 9;
  
  while (choices.size < 3) {
    const offset = Math.floor(Math.random() * 3) + 1;
    const sign = Math.random() < 0.5 ? 1 : -1;
    const candidate = correctAnswer + (offset * sign);
    
    if (candidate >= 1 && candidate <= max) {
      choices.add(candidate);
    }
  }
  
  return shuffle(Array.from(choices));
}

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
