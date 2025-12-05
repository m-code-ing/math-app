export interface InteractiveState {
  currentPhase: 'number1' | 'number2' | 'finalAnswer' | 'complete';
  currentNumber: number | null; // Which number is being split
  number1: { 
    value: number; 
    isDecomposed: boolean; 
    isSelectable: boolean;
    tens: number;
    units: number;
  };
  number2: { 
    value: number; 
    isDecomposed: boolean; 
    isSelectable: boolean;
    tens: number;
    units: number;
  };
  collectedPieces: number[];
  splitClickedPieces: {
    tensClicked: boolean;
    unitsClicked: boolean;
  };
  showFinalChoices: boolean;
  selectedAnswer: number | null;
  isCorrect: boolean | null;
}

export interface MathProblem {
  num1: number;
  num2: number;
  operation: '+';
  expectedAnswer: number;
}

export interface PieceAnimation {
  id: string;
  type: 'ten' | 'unit';
  startPosition: { x: number; y: number };
  endPosition: { x: number; y: number };
  isAnimating: boolean;
}