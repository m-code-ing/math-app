import React, { useState, useCallback } from 'react';
import { Box, Container } from '@mui/material';
import { QuizSessionState, QuestionResult } from '../types/Quiz';
import { generateQuizProblems } from '../utils/problemGenerator';
import { QuizHeader } from './QuizHeader';
import { TransitionScreen } from './TransitionScreen';
import { SummaryScreen } from './SummaryScreen';
import InteractiveMathProblem from './InteractiveMathProblem';

export const QuizSession: React.FC = () => {
  const [session, setSession] = useState<QuizSessionState>(() => ({
    sessionId: Date.now().toString(),
    questions: generateQuizProblems(10),
    currentQuestionIndex: 0,
    sessionResults: [],
    sessionPhase: 'active',
    startTime: new Date(),
  }));

  const handleQuestionComplete = useCallback((correct: boolean, interactions: number) => {
    const result: QuestionResult = {
      questionIndex: session.currentQuestionIndex,
      problem: session.questions[session.currentQuestionIndex],
      correct,
      interactions,
      timeSpent: 0,
    };

    setSession(prev => ({
      ...prev,
      sessionResults: [...prev.sessionResults, result],
      sessionPhase: 'transition',
    }));
  }, [session.currentQuestionIndex, session.questions]);

  const handleTransitionComplete = useCallback(() => {
    if (session.currentQuestionIndex < 9) {
      setSession(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        sessionPhase: 'active',
      }));
    } else {
      setSession(prev => ({ ...prev, sessionPhase: 'summary' }));
    }
  }, [session.currentQuestionIndex]);

  const handleTryAgain = useCallback(() => {
    setSession({
      sessionId: Date.now().toString(),
      questions: generateQuizProblems(10),
      currentQuestionIndex: 0,
      sessionResults: [],
      sessionPhase: 'active',
      startTime: new Date(),
    });
  }, []);

  const correctCount = session.sessionResults.filter(r => r.correct).length;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {session.sessionPhase === 'active' && (
        <Box>
          <QuizHeader
            currentQuestion={session.currentQuestionIndex + 1}
            totalQuestions={10}
            correctCount={correctCount}
          />
          <InteractiveMathProblem
            problem={session.questions[session.currentQuestionIndex]}
            onComplete={handleQuestionComplete}
          />
        </Box>
      )}

      {session.sessionPhase === 'transition' && (
        <TransitionScreen onTransitionComplete={handleTransitionComplete} />
      )}

      {session.sessionPhase === 'summary' && (
        <SummaryScreen
          totalQuestions={10}
          correctCount={correctCount}
          sessionResults={session.sessionResults}
          onTryAgain={handleTryAgain}
        />
      )}
    </Container>
  );
};
