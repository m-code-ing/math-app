import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';

export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'expert';

interface DifficultySelectorProps {
  onSelect: (difficulty: DifficultyLevel) => void;
}

const difficulties = [
  { level: 'easy' as DifficultyLevel, label: 'Up to 10', description: 'Sums up to 10' },
  { level: 'medium' as DifficultyLevel, label: 'Up to 20', description: 'Sums up to 20' },
  { level: 'hard' as DifficultyLevel, label: 'Up to 50', description: 'Sums up to 50' },
  { level: 'expert' as DifficultyLevel, label: 'Up to 100', description: 'Sums up to 100' },
];

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({ onSelect }) => {
  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" align="center" sx={{ mb: 4 }}>
        Choose Difficulty
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {difficulties.map(({ level, label, description }) => (
          <Card
            key={level}
            elevation={3}
            sx={{
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': { elevation: 6, transform: 'translateY(-4px)' },
            }}
            onClick={() => onSelect(level)}
          >
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 3 }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {description}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};
