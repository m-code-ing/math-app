import { MathProblem } from '../types/MathProblem';

export const generateQuizProblems = (count: number = 10): MathProblem[] => {
  const problems: MathProblem[] = [];
  const used = new Set<string>();
  let attempts = 0;
  const maxAttempts = count * 100; // Prevent infinite loops

  while (problems.length < count && attempts < maxAttempts) {
    attempts++;
    const num1 = Math.floor(Math.random() * 40) + 10;
    const num2 = Math.floor(Math.random() * 40) + 10;
    const key = `${num1}+${num2}`;
    
    if (!used.has(key)) {
      used.add(key);
      problems.push({ 
        num1, 
        num2, 
        operation: '+',
        expectedAnswer: num1 + num2
      });
    }
  }
  
  return problems;
};
