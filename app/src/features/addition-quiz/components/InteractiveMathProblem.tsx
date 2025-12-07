import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import { InteractiveState } from '../types/InteractiveMath';
import { MathProblem } from '../types/MathProblem';
import ClickableNumber from './ClickableNumber';
import MultipleChoiceAnswer from './MultipleChoiceAnswer';
import NumberDecomposition from './NumberDecomposition';
import { TenFrame } from '../../../shared/components/TenFrame';

interface InteractiveMathProblemProps {
  problem: MathProblem;
  onComplete: (correct: boolean, interactions: number) => void;
  showDecomposition?: boolean;
  maxAnswerValue?: number;
}

const InteractiveMathProblem: React.FC<InteractiveMathProblemProps> = ({ 
  problem, 
  onComplete,
  showDecomposition = true,
  maxAnswerValue
}) => {
  const [state, setState] = useState<InteractiveState>(() => {
    // For easy difficulty (no decomposition), skip directly to answer selection
    if (!showDecomposition) {
      return {
        currentPhase: 'finalAnswer',
        currentNumber: null,
        number1: { 
          value: problem.num1, 
          isDecomposed: false, 
          isSelectable: false,
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
        showFinalChoices: true,
        selectedAnswer: null,
        isCorrect: null,
      };
    }
    
    // Normal flow with decomposition
    return {
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
    };
  });

  const [interactionCount, setInteractionCount] = useState(0);

  useEffect(() => {
    if (state.number1.isDecomposed && state.number2.isDecomposed && !state.showFinalChoices) {
      const timer = setTimeout(() => {
        setState((prev: InteractiveState) => ({ ...prev, showFinalChoices: true, currentPhase: 'finalAnswer' }));
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
      setState((prev: InteractiveState) => ({
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
      setState((prev: InteractiveState) => ({
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
    setState((prev: InteractiveState) => ({ ...prev, isCorrect, currentPhase: 'complete' }));
    setTimeout(() => onComplete(isCorrect, interactionCount + 1), 500);
  };

  return (
    <Paper elevation={3} sx={{ p: 2, maxWidth: 800, mx: 'auto' }}>
      {/* Layer 1: Question */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {showDecomposition ? 'Layer 1: Question' : 'Question'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 1 }}>
          {showDecomposition ? (
            <>
              <ClickableNumber
                number={problem.num1}
                isSelectable={state.number1.isSelectable}
                isDecomposed={state.number1.isDecomposed}
                onClick={() => handleNumberClick('number1')}
              />
              <Typography variant="h4" sx={{ alignSelf: 'center' }}>+</Typography>
              <ClickableNumber
                number={problem.num2}
                isSelectable={state.number2.isSelectable}
                isDecomposed={state.number2.isDecomposed}
                onClick={() => handleNumberClick('number2')}
              />
            </>
          ) : (
            <>
              <Typography variant="h4" sx={{ alignSelf: 'center' }}>{problem.num1}</Typography>
              <Typography variant="h4" sx={{ alignSelf: 'center' }}>+</Typography>
              <Typography variant="h4" sx={{ alignSelf: 'center' }}>{problem.num2}</Typography>
            </>
          )}
        </Box>
      </Box>

      {showDecomposition && <Divider sx={{ my: 2 }} />}

      {/* Layer 2: Ten-Frames for Easy Difficulty */}
      {!showDecomposition && (
        <Box sx={{ mb: 2 }}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Visual Helper
          </Typography>
          <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center', alignItems: 'center', mt: 2 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ mb: 1 }}>{problem.num1}</Typography>
              <TenFrame filledCount={problem.num1} />
            </Box>
            <Typography variant="h4">+</Typography>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ mb: 1 }}>{problem.num2}</Typography>
              <TenFrame filledCount={problem.num2} />
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} />
        </Box>
      )}

      {/* Layer 2: Decomposition */}
      {showDecomposition && (state.number1.isDecomposed || state.number2.isDecomposed) && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Layer 2: Break Down Numbers
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', mt: 1 }}>
            {state.number1.isDecomposed && (
              <Box sx={{ flex: 1, maxWidth: 250 }}>
                <Typography variant="body2" textAlign="center" gutterBottom>
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
              <Box sx={{ flex: 1, maxWidth: 250 }}>
                <Typography variant="body2" textAlign="center" gutterBottom>
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

      {showDecomposition && (state.number1.isDecomposed || state.number2.isDecomposed) && <Divider sx={{ my: 2 }} />}

      {/* Layer 3: Answer Choices */}
      {state.showFinalChoices && (
        <Box>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            {showDecomposition ? 'Layer 3: Choose Answer' : 'Choose Answer'}
          </Typography>
          <MultipleChoiceAnswer
            correctAnswer={problem.expectedAnswer}
            onAnswerSelected={handleAnswerSelected}
            maxValue={maxAnswerValue}
          />
        </Box>
      )}
    </Paper>
  );
};

export default InteractiveMathProblem;
