import React from 'react';
import { Box } from '@mui/material';

interface TenFrameProps {
  filledCount: number;
}

export const TenFrame: React.FC<TenFrameProps> = ({ filledCount }) => {
  const boxes = Array.from({ length: 10 }, (_, i) => i < filledCount);

  return (
    <Box sx={{ display: 'inline-block' }} data-testid="ten-frame">
      {[0, 1].map(row => (
        <Box key={row} sx={{ display: 'flex', gap: 0.5 }}>
          {boxes.slice(row * 5, row * 5 + 5).map((filled, col) => (
            <Box
              key={col}
              data-testid={filled ? 'ten-frame-filled' : 'ten-frame-empty'}
              sx={{
                width: 60,
                height: 60,
                border: '2px solid #ccc',
                bgcolor: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 1,
              }}
            >
              {filled && (
                <Box
                  data-testid="ten-frame-dot"
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                  }}
                />
              )}
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
};
