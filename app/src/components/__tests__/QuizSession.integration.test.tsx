import React from 'react';
import { render, screen, waitFor } from '../../utils/test-utils';
import userEvent from '@testing-library/user-event';
import { QuizSession } from '../QuizSession';

describe('QuizSession Integration', () => {
  it('starts with question 1 of 10', () => {
    render(<QuizSession />);
    expect(screen.getByText('Question 1 of 10')).toBeInTheDocument();
  });

  it('shows quiz header and problem', () => {
    render(<QuizSession />);
    expect(screen.getByText('Question 1 of 10')).toBeInTheDocument();
    // Should show a math problem (format: "X + Y = ?")
    const problemText = screen.getByText(/\d+ \+ \d+ = \?/);
    expect(problemText).toBeInTheDocument();
  });
});
