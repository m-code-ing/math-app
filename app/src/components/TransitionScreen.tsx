import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

interface TransitionScreenProps {
  onTransitionComplete: () => void;
  correct: boolean;
}

const correctMessages = ['Awesome!', 'Great job!', 'Perfect!', 'You did it!', 'Excellent!'];
const incorrectMessages = ['Try again!', 'Keep trying!', 'Almost!', 'Next time!'];

export const TransitionScreen: React.FC<TransitionScreenProps> = ({ onTransitionComplete, correct }) => {
  useEffect(() => {
    const timer = setTimeout(onTransitionComplete, 1500);
    return () => clearTimeout(timer);
  }, [onTransitionComplete]);

  const messages = correct ? correctMessages : incorrectMessages;
  const message = messages[Math.floor(Math.random() * messages.length)];

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '400px' 
    }}>
      {correct ? (
        <CheckCircleIcon sx={{ fontSize: 100, color: 'success.main', mb: 2 }} />
      ) : (
        <CancelIcon sx={{ fontSize: 100, color: 'error.main', mb: 2 }} />
      )}
      <Typography variant="h3">
        {message}
      </Typography>
    </Box>
  );
};
