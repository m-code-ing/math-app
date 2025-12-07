import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

interface MultipleChoiceAnswerProps {
  correctAnswer: number;
  onAnswerSelected: (isCorrect: boolean) => void;
  maxValue?: number;
}

const MultipleChoiceAnswer: React.FC<MultipleChoiceAnswerProps> = ({
  correctAnswer,
  onAnswerSelected,
  maxValue,
}) => {
  const [choices, setChoices] = useState<number[]>([]);
  const [wrongAnswers, setWrongAnswers] = useState<Set<number>>(new Set());
  const [correctClicked, setCorrectClicked] = useState(false);

  useEffect(() => {
    const generateChoices = () => {
      const options = new Set<number>([correctAnswer]);
      while (options.size < 3) {
        const offset = Math.floor(Math.random() * 20) - 10;
        const choice = correctAnswer + offset;
        // Ensure choice is positive and within maxValue if specified
        if (choice > 0 && choice !== correctAnswer && (!maxValue || choice <= maxValue)) {
          options.add(choice);
        }
      }
      const arr = Array.from(options);
      // Shuffle array
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    };
    setChoices(generateChoices());
  }, [correctAnswer, maxValue]);

  const handleAnswerClick = (answer: number) => {
    const isCorrect = answer === correctAnswer;
    
    if (isCorrect) {
      setCorrectClicked(true);
      setTimeout(() => onAnswerSelected(true), 500);
    } else {
      setWrongAnswers(prev => new Set(prev).add(answer));
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="body1" gutterBottom>
        What's the answer?
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', maxWidth: 500, mx: 'auto' }}>
        {choices.map((choice) => {
          const isWrong = wrongAnswers.has(choice);
          const isCorrect = choice === correctAnswer && correctClicked;
          const isDisabled = isWrong || correctClicked;
          
          return (
            <Button
              key={choice}
              onClick={() => handleAnswerClick(choice)}
              disabled={isDisabled}
              variant="contained"
              sx={{
                flex: 1,
                minHeight: 50,
                fontSize: '1.25rem',
                position: 'relative',
                bgcolor: isCorrect ? 'success.main' : isWrong ? 'error.main' : 'primary.main',
                '&:hover': {
                  bgcolor: isDisabled ? undefined : 'primary.dark',
                },
                '&.Mui-disabled': {
                  bgcolor: isCorrect ? 'success.main' : isWrong ? 'error.main' : 'primary.main',
                  color: 'white',
                  opacity: isCorrect || isWrong ? 1 : 0.7,
                },
              }}
            >
              {choice}
              {isWrong && (
                <CloseIcon sx={{ position: 'absolute', top: 3, right: 3, fontSize: 18 }} />
              )}
              {isCorrect && (
                <CheckIcon sx={{ position: 'absolute', top: 3, right: 3, fontSize: 18 }} />
              )}
            </Button>
          );
        })}
      </Box>
    </Box>
  );
};

export default MultipleChoiceAnswer;
