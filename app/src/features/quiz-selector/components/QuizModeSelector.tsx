import React from 'react';
import { Box, Card, CardContent, Typography, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import GridOnIcon from '@mui/icons-material/GridOn';
import LooksOneIcon from '@mui/icons-material/LooksOne';

interface QuizModeSelectorProps {
  onSelect: (mode: 'addition' | 'recognition' | 'make10') => void;
}

export const QuizModeSelector: React.FC<QuizModeSelectorProps> = ({ onSelect }) => {
  return (
    <Box sx={{ p: { xs: 1.5, sm: 3 }, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" align="center" sx={{ mb: { xs: 2, sm: 4 }, fontSize: { xs: '1.25rem', sm: '2rem' } }}>
        Choose Your Math Practice
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 3 } }}>
        <Card
          elevation={3}
          sx={{
            cursor: 'pointer',
            transition: 'all 0.2s',
            '&:hover': { elevation: 6, transform: 'translateY(-4px)' },
          }}
          onClick={() => onSelect('addition')}
        >
          <CardContent sx={{ textAlign: 'center', py: { xs: 1.5, sm: 3 }, px: { xs: 2, sm: 3 } }}>
            <AddIcon sx={{ fontSize: { xs: 40, sm: 60 }, color: 'primary.main', mb: { xs: 0.5, sm: 2 } }} />
            <Typography variant="h5" sx={{ mb: { xs: 0.5, sm: 1 }, fontWeight: 'bold', fontSize: { xs: '1.1rem', sm: '1.5rem' } }}>
              Addition Quiz
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: { xs: 1, sm: 2 }, fontSize: { xs: '0.8rem', sm: '1rem' } }}>
              Break down and add numbers
            </Typography>
            <Chip label="10 Questions" color="primary" size="small" sx={{ fontSize: { xs: '0.7rem', sm: '0.8125rem' } }} />
          </CardContent>
        </Card>

        <Card
          elevation={3}
          sx={{
            cursor: 'pointer',
            transition: 'all 0.2s',
            '&:hover': { elevation: 6, transform: 'translateY(-4px)' },
          }}
          onClick={() => onSelect('recognition')}
        >
          <CardContent sx={{ textAlign: 'center', py: { xs: 1.5, sm: 3 }, px: { xs: 2, sm: 3 } }}>
            <GridOnIcon sx={{ fontSize: { xs: 40, sm: 60 }, color: 'primary.main', mb: { xs: 0.5, sm: 2 } }} />
            <Typography variant="h5" sx={{ mb: { xs: 0.5, sm: 1 }, fontWeight: 'bold', fontSize: { xs: '1.1rem', sm: '1.5rem' } }}>
              10-Frame: Number Recognition
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: { xs: 1, sm: 2 }, fontSize: { xs: '0.8rem', sm: '1rem' } }}>
              Identify numbers in a 10-frame
            </Typography>
            <Chip label="10 Questions" color="primary" size="small" sx={{ fontSize: { xs: '0.7rem', sm: '0.8125rem' } }} />
          </CardContent>
        </Card>

        <Card
          elevation={3}
          sx={{
            cursor: 'pointer',
            transition: 'all 0.2s',
            '&:hover': { elevation: 6, transform: 'translateY(-4px)' },
          }}
          onClick={() => onSelect('make10')}
        >
          <CardContent sx={{ textAlign: 'center', py: { xs: 1.5, sm: 3 }, px: { xs: 2, sm: 3 } }}>
            <LooksOneIcon sx={{ fontSize: { xs: 40, sm: 60 }, color: 'primary.main', mb: { xs: 0.5, sm: 2 } }} />
            <Typography variant="h5" sx={{ mb: { xs: 0.5, sm: 1 }, fontWeight: 'bold', fontSize: { xs: '1.1rem', sm: '1.5rem' } }}>
              10-Frame: Make 10
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: { xs: 1, sm: 2 }, fontSize: { xs: '0.8rem', sm: '1rem' } }}>
              Find how many more to make 10
            </Typography>
            <Chip label="10 Questions" color="primary" size="small" sx={{ fontSize: { xs: '0.7rem', sm: '0.8125rem' } }} />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
