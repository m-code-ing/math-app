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
    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
      <Paper elevation={2} sx={{ p: 2, minWidth: 80, bgcolor: 'warning.light' }}>
        <Typography variant="caption" display="block" gutterBottom>Tens</Typography>
        <Typography variant="h4" color="warning.dark">{tens}</Typography>
      </Paper>
      <Paper elevation={2} sx={{ p: 2, minWidth: 80, bgcolor: 'secondary.light' }}>
        <Typography variant="caption" display="block" gutterBottom>Units</Typography>
        <Typography variant="h4" color="secondary.dark">{units}</Typography>
      </Paper>
    </Box>
  );
};

export default NumberDecomposition;
