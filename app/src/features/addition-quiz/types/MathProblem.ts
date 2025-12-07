export interface NumberBreakdown {
  value: number;
  tens: number;
  units: number;
}

export interface ProblemState {
  currentStep: number;
  number1: NumberBreakdown;
  number2: NumberBreakdown;
  tensResult: number;
  unitsResult: number;
  finalAnswer: number;
  needsRegrouping: boolean;
  isComplete: boolean;
}

export enum ProblemStep {
  DECOMPOSE_FIRST = 1,
  DECOMPOSE_SECOND = 2,
  ADD_TENS = 3,
  ADD_UNITS = 4,
  REGROUP = 5,
  FINAL_ANSWER = 6,
}

export interface MathProblem {
  num1: number;
  num2: number;
  operation: '+';
  expectedAnswer: number;
}