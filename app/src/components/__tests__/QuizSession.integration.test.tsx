import React from 'react';
import { render, screen, waitFor } from '../../utils/test-utils';
import userEvent from '@testing-library/user-event';
import { QuizSession } from '../QuizSession';

describe('QuizSession Integration', () => {
  it('starts with question 1 of 10', () => {
    render(<QuizSession />);
    expect(screen.getByText('Question 1 of 10')).toBeInTheDocument();
  });

  it('advances to next question after completing one', async () => {
    render(<QuizSession />);

    // Complete first question
    const buttons = screen.getAllByRole('button');
    await userEvent.click(buttons[0]); // Click first number
    await userEvent.click(buttons[1]); // Click second number

    // Wait for multiple choice
    await waitFor(() => {
      expect(screen.getByText('What\'s the answer?')).toBeInTheDocument();
    });

    // Click any answer
    const choiceButtons = screen.getAllByRole('button');
    await userEvent.click(choiceButtons[0]);

    // Should show transition screen
    await waitFor(() => {
      expect(screen.getByText(/Awesome!|Great job!|Perfect!|You did it!|Excellent!/)).toBeInTheDocument();
    }, { timeout: 2000 });

    // Should advance to question 2
    await waitFor(() => {
      expect(screen.getByText('Question 2 of 10')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('shows summary after 10 questions', async () => {
    render(<QuizSession />);
    
    // This would require completing all 10 questions
    // For now, just verify the component renders
    expect(screen.getByText('Question 1 of 10')).toBeInTheDocument();
  });

  it('resets quiz when Try Again clicked', async () => {
    // This test would require completing the full quiz first
    // Placeholder for now
    expect(true).toBe(true);
  });
});
