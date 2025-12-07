import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import { QuizSession } from './components/QuizSession';
import { TenFrameQuiz } from './components/TenFrameQuiz';
import { QuizModeSelector } from './components/QuizModeSelector';

function AppContent() {
  const navigate = useNavigate();

  const handleModeSelect = (mode: 'addition' | 'recognition' | 'make10') => {
    navigate(`/${mode}`);
  };

  return (
    <Routes>
      <Route path="/" element={<QuizModeSelector onSelect={handleModeSelect} />} />
      <Route path="/addition" element={<QuizSession />} />
      <Route path="/recognition" element={<TenFrameQuiz mode="recognition" />} />
      <Route path="/make10" element={<TenFrameQuiz mode="make10" />} />
    </Routes>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </div>
  );
}

export default App;
