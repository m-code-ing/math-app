import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { TenFrame } from '../../../shared/components/TenFrame';
import { TenFrameQuestion as TenFrameQuestionType, TenFrameMode } from '../types/TenFrame';
import { questionGenerationService } from '../../../shared/services';

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
  const [choices, setChoices] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [wrongAnswers, setWrongAnswers] = useState<Set<number>>(new Set());
  const [interactions, setInteractions] = useState(0);

  useEffect(() => {
    setChoices(questionGenerationService.generateAnswerChoices(question.correctAnswer, mode));
    setSelectedAnswer(null);
    setWrongAnswers(new Set());
    setInteractions(0);
  }, [question, mode]);

  const handleAnswerClick = (answer: number) => {
    if (wrongAnswers.has(answer) || selectedAnswer !== null) return;

    setSelectedAnswer(answer);
    setInteractions(prev => prev + 1);

    if (answer === question.correctAnswer) {
      setTimeout(() => onComplete(true, interactions + 1), 500);
    } else {
      setWrongAnswers(prev => new Set(prev).add(answer));
      setTimeout(() => setSelectedAnswer(null), 500);
    }
  };

  const questionText = mode === 'recognition' 
    ? 'What number is this?' 
    : 'How many more to make 10?';

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
