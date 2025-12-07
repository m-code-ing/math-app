import React from 'react';
import { render, screen } from '../../utils/test-utils';
import { QuizSession } from '../QuizSession';

describe('QuizSession Integration', () => {
  it('starts with question 1 of 10', () => {
    render(<QuizSession />);
    expect(screen.getByText('Question 1 of 10')).toBeInTheDocument();
  });

  it('shows quiz header and clickable numbers', () => {
    render(<QuizSession />);
    expect(screen.getByText('Question 1 of 10')).toBeInTheDocument();
    // Should show clickable number buttons
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});
