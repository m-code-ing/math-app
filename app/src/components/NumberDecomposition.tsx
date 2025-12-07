import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

interface NumberDecompositionProps {
  number: number;
  tens: number;
  units: number;
}

const NumberDecomposition: React.FC<NumberDecompositionProps> = ({
  number,
  tens,
  units,
}) => {
  return (
    <Paper elevation={3} sx={{ p: 3, bgcolor: 'info.light', color: 'white' }}>
      <Typography variant="h4" gutterBottom>
        {number} = {tens} + {units}
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
        <Paper sx={{ p: 2, bgcolor: 'warning.main', minWidth: 80 }}>
          <Typography variant="h5">{tens}</Typography>
          <Typography variant="caption">tens</Typography>
        </Paper>
        <Paper sx={{ p: 2, bgcolor: 'secondary.main', minWidth: 80 }}>
          <Typography variant="h5">{units}</Typography>
          <Typography variant="caption">units</Typography>
        </Paper>
      </Box>
    </Paper>
  );
};

export default NumberDecomposition;
