import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline';

interface QuizHeaderProps {
  currentQuestion: number;
  totalQuestions: number;
  correctCount: number;
}

export const QuizHeader: React.FC<QuizHeaderProps> = ({
  currentQuestion,
  totalQuestions,
  correctCount,
}) => {
  return (
    <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>
        Question {currentQuestion} of {totalQuestions}
      </Typography>
      <Box sx={{ display: 'flex', gap: 0.5, mb: 1 }}>
        {Array.from({ length: totalQuestions }).map((_, i) => (
          i < correctCount ? (
            <StarIcon key={i} sx={{ color: 'success.main' }} />
          ) : (
            <StarOutlineIcon key={i} sx={{ color: 'grey.400' }} />
          )
        ))}
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={(currentQuestion / totalQuestions) * 100} 
        sx={{ height: 8, borderRadius: 1 }}
      />
    </Box>
  );
};
