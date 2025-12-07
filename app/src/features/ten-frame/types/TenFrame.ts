export interface TenFrameQuestion {
  number: number;
  correctAnswer: number;
}

export interface TenFrameResult {
  questionIndex: number;
  tenFrameQuestion: TenFrameQuestion;
  correct: boolean;
  interactions: number;
  timeSpent: number;
}

export interface TenFrameQuizState {
  sessionId: string;
  questions: TenFrameQuestion[];
  currentQuestionIndex: number;
  sessionResults: TenFrameResult[];
  sessionPhase: 'active' | 'transition' | 'summary';
  startTime: Date;
}

export type TenFrameMode = 'recognition' | 'make10';
