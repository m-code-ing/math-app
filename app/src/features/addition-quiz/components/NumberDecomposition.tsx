import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

interface NumberDecompositionProps {
  number: number;
  tens: number;
  units: number;
}

const NumberDecomposition: React.FC<NumberDecompositionProps> = ({
  tens,
  units,
}) => {
  return (
    <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center' }}>
      <Paper elevation={2} sx={{ p: 1.5, minWidth: 60, bgcolor: '#E3F2FD' }}>
        <Typography variant="caption" display="block" gutterBottom>Tens</Typography>
        <Typography variant="h5" color="primary.dark">{tens}</Typography>
      </Paper>
      <Paper elevation={2} sx={{ p: 1.5, minWidth: 60, bgcolor: '#F3E5F5' }}>
        <Typography variant="caption" display="block" gutterBottom>Units</Typography>
        <Typography variant="h5" color="secondary.dark">{units}</Typography>
      </Paper>
    </Box>
  );
};

export default NumberDecomposition;
