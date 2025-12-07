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
        <Box key={row} sx={{ display: 'flex', gap: { xs: 0.2, sm: 0.5 } }}>
          {boxes.slice(row * 5, row * 5 + 5).map((filled, col) => (
            <Box
              key={col}
              data-testid={filled ? 'ten-frame-filled' : 'ten-frame-empty'}
              sx={{
                width: { xs: 32, sm: 50, md: 60 },
                height: { xs: 32, sm: 50, md: 60 },
                border: { xs: '1.5px solid #ccc', sm: '2px solid #ccc' },
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
                    width: { xs: 22, sm: 35, md: 40 },
                    height: { xs: 22, sm: 35, md: 40 },
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
