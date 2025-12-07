import { MathProblem } from './MathProblem';

export interface QuestionResult {
  questionIndex: number;
  problem: MathProblem;
  correct: boolean;
  interactions: number;
  timeSpent: number;
}

export interface QuizSessionState {
  sessionId: string;
  questions: MathProblem[];
  currentQuestionIndex: number;
  sessionResults: QuestionResult[];
  sessionPhase: 'active' | 'transition' | 'summary';
  startTime: Date;
}
