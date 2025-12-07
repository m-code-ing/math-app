import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate, useLocation } from 'react-router-dom';

export const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const showBackButton = location.pathname !== '/';

  return (
    <AppBar position="static" elevation={1} sx={{ height: 48 }}>
      <Toolbar variant="dense" sx={{ minHeight: 48 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Math Practice
        </Typography>
        {showBackButton && (
          <IconButton color="inherit" onClick={() => navigate('/')} aria-label="home">
            <HomeIcon />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
};
