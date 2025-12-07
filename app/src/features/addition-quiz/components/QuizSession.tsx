import React, { useState, useCallback } from 'react';
import { Box, Container } from '@mui/material';
import { QuizSessionState, QuestionResult } from '../types/Quiz';
import { questionGenerationService, DifficultyLevel } from '../../../shared/services';
import { QuizHeader } from '../../../shared/components/QuizHeader';
import { SummaryScreen } from '../../../shared/components/SummaryScreen';
import InteractiveMathProblem from './InteractiveMathProblem';

interface QuizSessionProps {
  questionCount?: number;
  difficulty?: DifficultyLevel;
}

export const QuizSession: React.FC<QuizSessionProps> = ({ questionCount = 10, difficulty = 'hard' }) => {
  const maxAnswerValues = {
    easy: 10,
    medium: 20,
    hard: 50,
    expert: 100,
  };

  const [session, setSession] = useState<QuizSessionState>(() => {
    const questions = questionGenerationService.generateAdditionProblems(questionCount, difficulty);
    return {
      sessionId: Date.now().toString(),
      questions,
      currentQuestionIndex: 0,
      sessionResults: [],
      sessionPhase: 'active',
      startTime: new Date(),
    };
  });

  const handleQuestionComplete = useCallback((correct: boolean, interactions: number) => {
    if (!correct) return; // Don't advance on wrong answer

    const result: QuestionResult = {
      questionIndex: session.currentQuestionIndex,
      problem: session.questions[session.currentQuestionIndex],
      correct,
      interactions,
      timeSpent: 0,
    };

    const newResults = [...session.sessionResults, result];

    // Check if this was the last question
    if (session.currentQuestionIndex === session.questions.length - 1) {
      setSession(prev => ({
        ...prev,
        sessionResults: newResults,
        sessionPhase: 'summary',
      }));
    } else {
      // Move to next question after a brief delay for feedback
      setTimeout(() => {
        setSession(prev => ({
          ...prev,
          sessionResults: newResults,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
          sessionPhase: 'active',
        }));
      }, 500);
    }
  }, [session.currentQuestionIndex, session.questions, session.sessionResults]);

  const handleTryAgain = useCallback(() => {
    setSession({
      sessionId: Date.now().toString(),
      questions: questionGenerationService.generateAdditionProblems(questionCount, difficulty),
      currentQuestionIndex: 0,
      sessionResults: [],
      sessionPhase: 'active',
      startTime: new Date(),
    });
  }, [questionCount, difficulty]);

  const correctCount = session.sessionResults.filter(r => r.correct).length;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {session.sessionPhase === 'active' && (
        <Box>
          <QuizHeader
            currentQuestion={session.currentQuestionIndex + 1}
            totalQuestions={session.questions.length}
            correctCount={correctCount}
          />
          <InteractiveMathProblem
            problem={session.questions[session.currentQuestionIndex]}
            onComplete={handleQuestionComplete}
            showDecomposition={difficulty !== 'easy'}
            maxAnswerValue={maxAnswerValues[difficulty]}
          />
        </Box>
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
