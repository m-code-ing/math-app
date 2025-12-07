import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

interface CollectionBoxesProps {
  tens: number;
  units: number;
}

const CollectionBoxes: React.FC<CollectionBoxesProps> = ({ tens, units }) => {
  return (
    <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', mt: 3 }}>
      <Paper elevation={2} sx={{ p: 3, minWidth: 120, bgcolor: 'warning.light' }}>
        <Typography variant="h6" gutterBottom>Tens</Typography>
        <Typography variant="h3" color="warning.dark">{tens}</Typography>
      </Paper>
      <Paper elevation={2} sx={{ p: 3, minWidth: 120, bgcolor: 'secondary.light' }}>
        <Typography variant="h6" gutterBottom>Units</Typography>
        <Typography variant="h3" color="secondary.dark">{units}</Typography>
      </Paper>
    </Box>
  );
};

export default CollectionBoxes;
