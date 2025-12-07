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

  console.log('### QuestionCountRoute - mode:', mode);

  const handleCountSelect = (count: number) => {
    console.log('### handleCountSelect - mode:', mode, 'count:', count);
    navigate(`/${mode}/quiz/${count}`);
  };

  return <QuestionCountSelector onSelect={handleCountSelect} />;
}

function AdditionQuizRoute() {
  const { count } = useParams<{ count: string }>();
  const questionCount = useMemo(() => parseInt(count || '10'), [count]);
  console.log('### AdditionQuizRoute - count:', count, 'parsed:', questionCount);
  return <QuizSession key={`addition-${count}`} questionCount={questionCount} />;
}

function RecognitionQuizRoute() {
  const { count } = useParams<{ count: string }>();
  const questionCount = useMemo(() => parseInt(count || '10'), [count]);
  console.log('### RecognitionQuizRoute - count:', count, 'parsed:', questionCount);
  return <TenFrameQuiz key={`recognition-${count}`} mode="recognition" questionCount={questionCount} />;
}

function Make10QuizRoute() {
  const { count } = useParams<{ count: string }>();
  const questionCount = useMemo(() => parseInt(count || '10'), [count]);
  console.log('### Make10QuizRoute - count:', count, 'parsed:', questionCount);
  return <TenFrameQuiz key={`make10-${count}`} mode="make10" questionCount={questionCount} />;
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('### Current URL:', location.pathname);
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
