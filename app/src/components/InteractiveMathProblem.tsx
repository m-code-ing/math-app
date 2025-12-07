import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import { InteractiveState, MathProblem } from '../types/InteractiveMath';
import ClickableNumber from './ClickableNumber';
import MultipleChoiceAnswer from './MultipleChoiceAnswer';
import NumberDecomposition from './NumberDecomposition';

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

  useEffect(() => {
    if (state.number1.isDecomposed && state.number2.isDecomposed && !state.showFinalChoices) {
      const timer = setTimeout(() => {
        setState(prev => ({ ...prev, showFinalChoices: true, currentPhase: 'finalAnswer' }));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [state.number1.isDecomposed, state.number2.isDecomposed, state.showFinalChoices]);

  const handleNumberClick = (numberKey: 'number1' | 'number2') => {
    if (!state[numberKey].isSelectable || state[numberKey].isDecomposed) return;

    const value = state[numberKey].value;
    const tens = Math.floor(value / 10) * 10;
    const units = value % 10;

    if (numberKey === 'number1') {
      setState(prev => ({
        ...prev,
        number1: {
          ...prev.number1,
          isDecomposed: true,
          tens,
          units,
        },
        currentPhase: 'number2',
        number2: { ...prev.number2, isSelectable: true },
      }));
    } else {
      setState(prev => ({
        ...prev,
        number2: {
          ...prev.number2,
          isDecomposed: true,
          tens,
          units,
        },
        currentPhase: 'finalAnswer',
      }));
    }
    setInteractionCount(c => c + 1);
  };

  const handleAnswerSelected = (isCorrect: boolean) => {
    setState(prev => ({ ...prev, isCorrect, currentPhase: 'complete' }));
    setTimeout(() => onComplete(isCorrect, interactionCount + 1), 500);
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      {/* Layer 1: Question with Clickable Numbers */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Layer 1: Question
        </Typography>
        <Typography variant="h3" textAlign="center" gutterBottom>
          {problem.num1} + {problem.num2} = ?
        </Typography>
        <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', mt: 3 }}>
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
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Layer 2: Decomposition */}
      {(state.number1.isDecomposed || state.number2.isDecomposed) && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Layer 2: Break Down Numbers
          </Typography>
          <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center', mt: 2 }}>
            {state.number1.isDecomposed && (
              <Box sx={{ flex: 1, maxWidth: 300 }}>
                <Typography variant="subtitle1" textAlign="center" gutterBottom>
                  {problem.num1}
                </Typography>
                <NumberDecomposition
                  number={problem.num1}
                  tens={state.number1.tens}
                  units={state.number1.units}
                />
              </Box>
            )}
            {state.number2.isDecomposed && (
              <Box sx={{ flex: 1, maxWidth: 300 }}>
                <Typography variant="subtitle1" textAlign="center" gutterBottom>
                  {problem.num2}
                </Typography>
                <NumberDecomposition
                  number={problem.num2}
                  tens={state.number2.tens}
                  units={state.number2.units}
                />
              </Box>
            )}
          </Box>
        </Box>
      )}

      {(state.number1.isDecomposed || state.number2.isDecomposed) && <Divider sx={{ my: 3 }} />}

      {/* Layer 3: Answer Choices */}
      {state.showFinalChoices && (
        <Box>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Layer 3: Choose Answer
          </Typography>
          <MultipleChoiceAnswer
            correctAnswer={problem.expectedAnswer}
            onAnswerSelected={handleAnswerSelected}
          />
        </Box>
      )}
    </Paper>
  );
};

export default InteractiveMathProblem;
