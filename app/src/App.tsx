import React, { useState } from 'react';
import './App.css';
import { QuizSession } from './components/QuizSession';
import { TenFrameQuiz } from './components/TenFrameQuiz';
import { QuizModeSelector } from './components/QuizModeSelector';

type QuizMode = 'selector' | 'addition' | 'recognition' | 'make10';

function App() {
  const [quizMode, setQuizMode] = useState<QuizMode>('selector');

  return (
    <div className="App">
      {quizMode === 'selector' && <QuizModeSelector onSelect={setQuizMode} />}
      {quizMode === 'addition' && <QuizSession />}
      {quizMode === 'recognition' && <TenFrameQuiz mode="recognition" />}
      {quizMode === 'make10' && <TenFrameQuiz mode="make10" />}
    </div>
  );
}

export default App;
