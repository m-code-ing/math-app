import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface TransitionScreenProps {
  onTransitionComplete: () => void;
}

const messages = ['Awesome!', 'Great job!', 'Perfect!', 'You did it!', 'Excellent!'];

export const TransitionScreen: React.FC<TransitionScreenProps> = ({ onTransitionComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onTransitionComplete, 1500);
    return () => clearTimeout(timer);
  }, [onTransitionComplete]);

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '400px' 
    }}>
      <CheckCircleIcon sx={{ fontSize: 100, color: 'success.main', mb: 2 }} />
      <Typography variant="h3">
        {messages[Math.floor(Math.random() * messages.length)]}
      </Typography>
    </Box>
  );
};
