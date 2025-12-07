import React, { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { InteractiveState, MathProblem } from '../types/InteractiveMath';
import ClickableNumber from './ClickableNumber';
import MultipleChoiceAnswer from './MultipleChoiceAnswer';
import NumberDecomposition from './NumberDecomposition';
import CollectionBoxes from './CollectionBoxes';

interface InteractiveMathProblemProps {
  problem: MathProblem;
  onComplete: (correct: boolean, interactions: number) => void;
}

const InteractiveMathProblem: React.FC<InteractiveMathProblemProps> = ({ 
  problem, 
  onComplete 
}) => {
  const [state, setState] = useState<InteractiveState>({
    currentPhase: 'number1',
    currentNumber: null,
    number1: { 
      value: problem.num1, 
      isDecomposed: false, 
      isSelectable: true,
      tens: 0,
      units: 0
    },
    number2: { 
      value: problem.num2, 
      isDecomposed: false, 
      isSelectable: false,
      tens: 0,
      units: 0
    },
    collectedPieces: [],
    splitClickedPieces: {
      tensClicked: false,
      unitsClicked: false,
    },
    showFinalChoices: false,
    selectedAnswer: null,
    isCorrect: null,
  });

  const [interactionCount, setInteractionCount] = useState(0);

  const handleNumberClick = (numberKey: 'number1' | 'number2') => {
    if (!state[numberKey].isSelectable || state[numberKey].isDecomposed) return;

    const value = state[numberKey].value;
    const tens = Math.floor(value / 10) * 10;
    const units = value % 10;

    setState(prev => ({
      ...prev,
      [numberKey]: {
        ...prev[numberKey],
        isDecomposed: true,
        tens,
        units,
      },
      currentPhase: numberKey === 'number1' ? 'number2' : 'collection',
      number2: numberKey === 'number1' ? { ...prev.number2, isSelectable: true } : prev.number2,
    }));
    setInteractionCount(c => c + 1);
  };

  const handlePieceClick = (type: 'tens' | 'units', numberKey: 'number1' | 'number2') => {
    const piece = { type, value: state[numberKey][type], from: numberKey };
    setState(prev => ({
      ...prev,
      collectedPieces: [...prev.collectedPieces, piece],
      splitClickedPieces: {
        ...prev.splitClickedPieces,
        [`${type}Clicked`]: true,
      },
    }));
    setInteractionCount(c => c + 1);

    if (state.collectedPieces.length === 3) {
      setTimeout(() => {
        setState(prev => ({ ...prev, showFinalChoices: true }));
      }, 500);
    }
  };

  const handleAnswerSelected = (isCorrect: boolean) => {
    setState(prev => ({ ...prev, isCorrect }));
    setTimeout(() => onComplete(isCorrect, interactionCount + 1), 500);
  };

  const totalTens = state.number1.tens + state.number2.tens;
  const totalUnits = state.number1.units + state.number2.units;

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h3" gutterBottom textAlign="center">
        {problem.num1} + {problem.num2} = ?
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', my: 4 }}>
        <ClickableNumber
          number={problem.num1}
          isSelectable={state.number1.isSelectable}
          isDecomposed={state.number1.isDecomposed}
          onClick={() => handleNumberClick('number1')}
        />
        <Typography variant="h3" sx={{ alignSelf: 'center' }}>+</Typography>
        <ClickableNumber
          number={problem.num2}
          isSelectable={state.number2.isSelectable}
          isDecomposed={state.number2.isDecomposed}
          onClick={() => handleNumberClick('number2')}
        />
      </Box>

      {state.number1.isDecomposed && (
        <Box sx={{ mb: 3 }}>
          <NumberDecomposition
            number={problem.num1}
            tens={state.number1.tens}
            units={state.number1.units}
          />
        </Box>
      )}

      {state.number2.isDecomposed && (
        <Box sx={{ mb: 3 }}>
          <NumberDecomposition
            number={problem.num2}
            tens={state.number2.tens}
            units={state.number2.units}
          />
        </Box>
      )}

      {state.currentPhase === 'collection' && (
        <CollectionBoxes tens={totalTens} units={totalUnits} />
      )}

      {state.showFinalChoices && (
        <MultipleChoiceAnswer
          correctAnswer={problem.expectedAnswer}
          onAnswerSelected={handleAnswerSelected}
        />
      )}
    </Paper>
  );
};

export default InteractiveMathProblem;
