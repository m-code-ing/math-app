import React from 'react';
import { Button, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface ClickableNumberProps {
  number: number;
  isSelectable: boolean;
  isDecomposed: boolean;
  onClick: () => void;
}

const ClickableNumber: React.FC<ClickableNumberProps> = ({
  number,
  isSelectable,
  isDecomposed,
  onClick
}) => {
  return (
    <Button
      onClick={onClick}
      disabled={!isSelectable}
      variant="contained"
      sx={{
        position: 'relative',
        minWidth: 120,
        minHeight: 80,
        fontSize: '2rem',
        fontWeight: 'bold',
        borderRadius: 3,
        bgcolor: isDecomposed ? 'info.main' : 'success.main',
        '&:hover': {
          bgcolor: isDecomposed ? 'info.dark' : 'success.dark',
        },
        '&.Mui-disabled': {
          bgcolor: 'grey.400',
          color: 'white',
          opacity: 0.6,
        },
      }}
    >
      {number}
      {isDecomposed && (
        <Box sx={{ position: 'absolute', top: 5, right: 5 }}>
          <CheckCircleIcon sx={{ color: 'success.light', fontSize: 25 }} />
        </Box>
      )}
    </Button>
  );
};

export default ClickableNumber;
