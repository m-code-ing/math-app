import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';

interface QuestionCountSelectorProps {
  onSelect: (count: number) => void;
}

export const QuestionCountSelector: React.FC<QuestionCountSelectorProps> = ({ onSelect }) => {
  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" align="center" sx={{ mb: 4 }}>
        How Many Questions?
      </Typography>

      <Box sx={{ display: 'flex', gap: 3 }}>
        <Card
          elevation={3}
          sx={{
            flex: 1,
            cursor: 'pointer',
            transition: 'all 0.2s',
            '&:hover': { elevation: 6, transform: 'translateY(-4px)' },
          }}
          onClick={() => onSelect(10)}
        >
          <CardContent sx={{ textAlign: 'center', py: 5 }}>
            <Typography variant="h2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              10
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Questions
            </Typography>
          </CardContent>
        </Card>

        <Card
          elevation={3}
          sx={{
            flex: 1,
            cursor: 'pointer',
            transition: 'all 0.2s',
            '&:hover': { elevation: 6, transform: 'translateY(-4px)' },
          }}
          onClick={() => onSelect(20)}
        >
          <CardContent sx={{ textAlign: 'center', py: 5 }}>
            <Typography variant="h2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              20
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Questions
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
