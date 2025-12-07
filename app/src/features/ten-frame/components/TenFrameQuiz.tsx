import React, { useState, useCallback } from 'react';
import { Box, Paper } from '@mui/material';
import { TenFrameQuestion } from './TenFrameQuestion';
import { QuizHeader } from '../../../shared/components/QuizHeader';
import { TransitionScreen } from '../../../shared/components/TransitionScreen';
import { SummaryScreen } from '../../../shared/components/SummaryScreen';
import { TenFrameMode, TenFrameQuizState, TenFrameResult } from '../types/TenFrame';
import { generateRecognitionQuestions, generateMake10Questions } from '../utils/tenFrameGenerator';

interface TenFrameQuizProps {
  mode: TenFrameMode;
}

export const TenFrameQuiz: React.FC<TenFrameQuizProps> = ({ mode }) => {
  const [quizState, setQuizState] = useState<TenFrameQuizState>(() => {
    const questions = mode === 'recognition' 
      ? generateRecognitionQuestions(10)
      : generateMake10Questions(10);
    
    return {
      sessionId: `${mode}-${Date.now()}`,
      questions,
      currentQuestionIndex: 0,
      sessionResults: [],
      sessionPhase: 'active',
      startTime: new Date(),
    };
  });

  const handleQuestionComplete = useCallback((correct: boolean, interactions: number) => {
    if (!correct) return;

    setQuizState(prev => {
      const result: TenFrameResult = {
        questionIndex: prev.currentQuestionIndex,
        tenFrameQuestion: prev.questions[prev.currentQuestionIndex],
        correct: true,
        interactions,
        timeSpent: Date.now() - prev.startTime.getTime(),
      };

      const newResults = [...prev.sessionResults, result];

      if (prev.currentQuestionIndex === prev.questions.length - 1) {
        return {
          ...prev,
          sessionResults: newResults,
          sessionPhase: 'summary',
        };
      } else {
        return {
          ...prev,
          sessionResults: newResults,
          sessionPhase: 'transition',
        };
      }
    });
  }, []);

  const handleTransitionComplete = useCallback(() => {
    setQuizState(prev => ({
      ...prev,
      currentQuestionIndex: prev.currentQuestionIndex + 1,
      sessionPhase: 'active',
    }));
  }, []);

  const handleTryAgain = useCallback(() => {
    const questions = mode === 'recognition' 
      ? generateRecognitionQuestions(10)
      : generateMake10Questions(10);
    
    setQuizState({
      sessionId: `${mode}-${Date.now()}`,
      questions,
      currentQuestionIndex: 0,
      sessionResults: [],
      sessionPhase: 'active',
      startTime: new Date(),
    });
  }, [mode]);

  const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
  const correctCount = quizState.sessionResults.filter(r => r.correct).length;

  return (
    <Box sx={{ p: 2, maxWidth: 600, mx: 'auto' }}>
      {quizState.sessionPhase !== 'summary' && (
        <QuizHeader
          currentQuestion={quizState.currentQuestionIndex + 1}
          totalQuestions={quizState.questions.length}
          correctCount={correctCount}
        />
      )}

      <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
        {quizState.sessionPhase === 'active' && (
          <TenFrameQuestion
            question={currentQuestion}
            mode={mode}
            onComplete={handleQuestionComplete}
          />
        )}

        {quizState.sessionPhase === 'transition' && (
          <TransitionScreen 
            onTransitionComplete={handleTransitionComplete}
            correct={true}
          />
        )}

        {quizState.sessionPhase === 'summary' && (
          <SummaryScreen
            totalQuestions={quizState.questions.length}
            correctCount={correctCount}
            sessionResults={[]}
            onTryAgain={handleTryAgain}
          />
        )}
      </Paper>
    </Box>
  );
};
