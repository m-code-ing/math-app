import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';

interface MultipleChoiceAnswerProps {
  correctAnswer: number;
  onAnswerSelected: (isCorrect: boolean) => void;
}

const MultipleChoiceAnswer: React.FC<MultipleChoiceAnswerProps> = ({
  correctAnswer,
  onAnswerSelected,
}) => {
  const [choices, setChoices] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

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
    setSelectedAnswer(answer);
    const isCorrect = answer === correctAnswer;
    setTimeout(() => onAnswerSelected(isCorrect), 1000);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        What's the answer?
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, maxWidth: 400 }}>
        {choices.map((choice) => (
          <Button
            key={choice}
            onClick={() => handleAnswerClick(choice)}
            disabled={selectedAnswer !== null}
            variant="contained"
            sx={{
              minHeight: 60,
              fontSize: '1.5rem',
              bgcolor: selectedAnswer !== null && choice === selectedAnswer
                ? choice === correctAnswer
                  ? 'success.main'
                  : 'error.main'
                : 'primary.main',
              '&:hover': {
                bgcolor: selectedAnswer !== null ? undefined : 'primary.dark',
              },
            }}
          >
            {choice}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default MultipleChoiceAnswer;
