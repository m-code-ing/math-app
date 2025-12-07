import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { TenFrame } from './TenFrame';
import { TenFrameQuestion as TenFrameQuestionType, TenFrameMode } from '../types/TenFrame';
import { generateAnswerChoices } from '../utils/tenFrameGenerator';

interface TenFrameQuestionProps {
  question: TenFrameQuestionType;
  mode: TenFrameMode;
  onComplete: (correct: boolean, interactions: number) => void;
}

export const TenFrameQuestion: React.FC<TenFrameQuestionProps> = ({
  question,
  mode,
  onComplete,
}) => {
  console.log('### TenFrameQuestion render:', { question, mode });
  
  const [choices, setChoices] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [wrongAnswers, setWrongAnswers] = useState<Set<number>>(new Set());
  const [interactions, setInteractions] = useState(0);

  useEffect(() => {
    console.log('### TenFrameQuestion useEffect triggered');
    const newChoices = generateAnswerChoices(question.correctAnswer, mode);
    console.log('### Generated choices:', newChoices);
    setChoices(newChoices);
    setSelectedAnswer(null);
    setWrongAnswers(new Set());
    setInteractions(0);
  }, [question, mode]);

  const handleAnswerClick = (answer: number) => {
    console.log('### Answer clicked:', answer);
    if (wrongAnswers.has(answer) || selectedAnswer !== null) {
      console.log('### Answer click ignored (already selected or wrong)');
      return;
    }

    setSelectedAnswer(answer);
    setInteractions(prev => prev + 1);

    if (answer === question.correctAnswer) {
      console.log('### Correct answer! Calling onComplete');
      setTimeout(() => onComplete(true, interactions + 1), 500);
    } else {
      console.log('### Wrong answer');
      setWrongAnswers(prev => new Set(prev).add(answer));
      setTimeout(() => setSelectedAnswer(null), 500);
    }
  };

  const questionText = mode === 'recognition' 
    ? 'What number is this?' 
    : 'How many more to make 10?';

  console.log('### Rendering with choices:', choices);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <TenFrame filledCount={question.number} />
      
      <Typography variant="h6">{questionText}</Typography>
      
      <Box sx={{ display: 'flex', gap: 2 }}>
        {choices.map(choice => {
          const isSelected = selectedAnswer === choice;
          const isWrong = wrongAnswers.has(choice);
          const isCorrect = isSelected && choice === question.correctAnswer;

          return (
            <Button
              key={choice}
              variant="contained"
              onClick={() => handleAnswerClick(choice)}
              disabled={isWrong}
              sx={{
                minWidth: 80,
                height: 50,
                fontSize: '1.2rem',
                bgcolor: isCorrect ? 'success.main' : isWrong ? 'error.main' : 'primary.main',
                '&:hover': {
                  bgcolor: isCorrect ? 'success.dark' : isWrong ? 'error.dark' : 'primary.dark',
                },
                '&.Mui-disabled': {
                  bgcolor: 'error.main',
                  color: 'white',
                },
              }}
            >
              {choice}
              {isCorrect && <CheckIcon sx={{ ml: 1 }} />}
              {isWrong && <CloseIcon sx={{ ml: 1 }} />}
            </Button>
          );
        })}
      </Box>
    </Box>
  );
};
