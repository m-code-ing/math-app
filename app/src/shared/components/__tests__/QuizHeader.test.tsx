import React from 'react';
import { render, screen } from '../../utils/test-utils';
import { QuizHeader } from '../../../shared/components/QuizHeader';

describe('QuizHeader', () => {
  it('displays current question number', () => {
    render(<QuizHeader currentQuestion={3} totalQuestions={10} correctCount={2} />);
    expect(screen.getByText('Question 3 of 10')).toBeInTheDocument();
  });

  it('shows correct number of filled stars', () => {
    render(<QuizHeader currentQuestion={5} totalQuestions={10} correctCount={3} />);
    const filledStars = screen.getAllByTestId('StarIcon');
    expect(filledStars).toHaveLength(3);
  });

  it('shows correct number of empty stars', () => {
    render(<QuizHeader currentQuestion={5} totalQuestions={10} correctCount={3} />);
    const emptyStars = screen.getAllByTestId('StarOutlineIcon');
    expect(emptyStars).toHaveLength(7);
  });
});
