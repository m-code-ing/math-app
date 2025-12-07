import React, { useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import './App.css';
import { QuizSession } from './features/addition-quiz/components/QuizSession';
import { TenFrameQuiz } from './features/ten-frame/components/TenFrameQuiz';
import { QuizModeSelector } from './features/quiz-selector/components/QuizModeSelector';
import { QuestionCountSelector } from './features/quiz-selector/components/QuestionCountSelector';
import { NavBar } from './shared/components/NavBar';

function QuestionCountRoute() {
  const navigate = useNavigate();
  const { mode } = useParams<{ mode: string }>();

  const handleCountSelect = (count: number) => {
    navigate(`/${mode}/quiz/${count}`);
  };

  return <QuestionCountSelector onSelect={handleCountSelect} />;
}

function AdditionQuizRoute() {
  const { count } = useParams<{ count: string }>();
  const questionCount = useMemo(() => parseInt(count || '10'), [count]);
  return <QuizSession key={`addition-${count}`} questionCount={questionCount} />;
}

function RecognitionQuizRoute() {
  const { count } = useParams<{ count: string }>();
  const questionCount = useMemo(() => parseInt(count || '10'), [count]);
  return <TenFrameQuiz key={`recognition-${count}`} mode="recognition" questionCount={questionCount} />;
}

function Make10QuizRoute() {
  const { count } = useParams<{ count: string }>();
  const questionCount = useMemo(() => parseInt(count || '10'), [count]);
  return <TenFrameQuiz key={`make10-${count}`} mode="make10" questionCount={questionCount} />;
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Track URL changes if needed
  }, [location.pathname]);

  const handleModeSelect = (mode: 'addition' | 'recognition' | 'make10') => {
    navigate(`/${mode}/count`);
  };

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<QuizModeSelector onSelect={handleModeSelect} />} />
        <Route path="/:mode/count" element={<QuestionCountRoute />} />
        <Route path="/addition/quiz/:count" element={<AdditionQuizRoute />} />
        <Route path="/recognition/quiz/:count" element={<RecognitionQuizRoute />} />
        <Route path="/make10/quiz/:count" element={<Make10QuizRoute />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter basename="/math-app">
        <AppContent />
      </BrowserRouter>
    </div>
  );
}

export default App;
