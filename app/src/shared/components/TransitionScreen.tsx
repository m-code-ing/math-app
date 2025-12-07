import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";

interface TransitionScreenProps {
  onTransitionComplete: () => void;
  correct: boolean;
}

export const TransitionScreen: React.FC<TransitionScreenProps> = ({ onTransitionComplete, correct }) => {
  useEffect(() => {
    const timer = setTimeout(onTransitionComplete, 500);
    return () => clearTimeout(timer);
  }, [onTransitionComplete]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "400px",
      }}
    >
      <Typography variant="h1" sx={{ fontSize: "6rem", mb: 2 }}>
        🎉
      </Typography>
      <Typography variant="h3">Good!</Typography>
    </Box>
  );
};
