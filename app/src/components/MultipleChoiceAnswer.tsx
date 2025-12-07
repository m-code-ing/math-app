import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface MultipleChoiceAnswerProps {
  correctAnswer: number;
  onAnswerSelected: (isCorrect: boolean) => void;
}

const MultipleChoiceAnswer: React.FC<MultipleChoiceAnswerProps> = ({
  correctAnswer,
  onAnswerSelected,
}) => {
  const [choices, setChoices] = useState<number[]>([]);
  const [wrongAnswers, setWrongAnswers] = useState<Set<number>>(new Set());

  useEffect(() => {
    const generateChoices = () => {
      const options = new Set<number>([correctAnswer]);
      while (options.size < 4) {
        const offset = Math.floor(Math.random() * 20) - 10;
        const choice = correctAnswer + offset;
        if (choice > 0 && choice !== correctAnswer) {
          options.add(choice);
        }
      }
      return Array.from(options).sort((a, b) => a - b);
    };
    setChoices(generateChoices());
  }, [correctAnswer]);

  const handleAnswerClick = (answer: number) => {
    const isCorrect = answer === correctAnswer;
    
    if (isCorrect) {
      setTimeout(() => onAnswerSelected(true), 500);
    } else {
      setWrongAnswers(prev => new Set(prev).add(answer));
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        What's the answer?
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, maxWidth: 400 }}>
        {choices.map((choice) => {
          const isWrong = wrongAnswers.has(choice);
          return (
            <Button
              key={choice}
              onClick={() => handleAnswerClick(choice)}
              disabled={isWrong}
              variant="contained"
              sx={{
                minHeight: 60,
                fontSize: '1.5rem',
                position: 'relative',
                bgcolor: isWrong ? 'error.main' : 'primary.main',
                '&:hover': {
                  bgcolor: isWrong ? 'error.main' : 'primary.dark',
                },
                '&.Mui-disabled': {
                  bgcolor: 'error.main',
                  color: 'white',
                },
              }}
            >
              {choice}
              {isWrong && (
                <CloseIcon sx={{ position: 'absolute', top: 5, right: 5, fontSize: 20 }} />
              )}
            </Button>
          );
        })}
      </Box>
    </Box>
  );
};

export default MultipleChoiceAnswer;
