import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { QuestionResult } from '../../features/addition-quiz/types/Quiz';

interface SummaryScreenProps {
  totalQuestions: number;
  correctCount: number;
  sessionResults: QuestionResult[];
  onTryAgain: () => void;
}

export const SummaryScreen: React.FC<SummaryScreenProps> = ({
  totalQuestions,
  correctCount,
  onTryAgain,
}) => {
  const getStarRating = () => {
    if (correctCount === 10) return { stars: 5, message: 'Perfect!' };
    if (correctCount >= 8) return { stars: 4, message: 'Great!' };
    if (correctCount >= 6) return { stars: 3, message: 'Good job!' };
    if (correctCount >= 4) return { stars: 2, message: 'Keep practicing!' };
    return { stars: 1, message: 'Try again!' };
  };

  const { stars, message } = getStarRating();

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '400px',
      p: 3
    }}>
      <Typography variant="h2" gutterBottom>
        🎉 Quiz Complete! 🎉
      </Typography>
      <Typography variant="h4" sx={{ mb: 3 }}>
        You got {correctCount} out of {totalQuestions} correct!
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        {Array.from({ length: stars }).map((_, i) => (
          <StarIcon key={i} sx={{ fontSize: 60, color: 'warning.main' }} />
        ))}
      </Box>
      <Typography variant="h5" sx={{ mb: 4 }}>
        {message}
      </Typography>
      <Button 
        variant="contained" 
        size="large" 
        onClick={onTryAgain}
        sx={{ minWidth: 200 }}
      >
        Try Again
      </Button>
    </Box>
  );
};
