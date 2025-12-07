import React from 'react';
import { render, screen, waitFor } from '../../utils/test-utils';
import userEvent from '@testing-library/user-event';
import InteractiveMathProblem from '../InteractiveMathProblem';

describe('InteractiveMathProblem Integration', () => {
  const mockProblem = {
    num1: 23,
    num2: 45,
    operation: '+' as const,
    expectedAnswer: 68,
  };

  it('completes full problem flow correctly', async () => {
    const onComplete = jest.fn();
    render(<InteractiveMathProblem problem={mockProblem} onComplete={onComplete} />);

    // Initial state
    expect(screen.getByText('23 + 45 = ?')).toBeInTheDocument();

    // Click first number
    const buttons = screen.getAllByRole('button');
    await userEvent.click(buttons[0]);

    // Should show decomposition
    await waitFor(() => {
      expect(screen.getByText('23 = 20 + 3')).toBeInTheDocument();
    });

    // Click second number
    await userEvent.click(buttons[1]);

    // Should show second decomposition
    await waitFor(() => {
      expect(screen.getByText('45 = 40 + 5')).toBeInTheDocument();
    });

    // Should show multiple choice
    await waitFor(() => {
      expect(screen.getByText('What\'s the answer?')).toBeInTheDocument();
    });

    // Click correct answer
    await userEvent.click(screen.getByText('68'));

    // Should call onComplete with correct=true
    await waitFor(() => {
      expect(onComplete).toHaveBeenCalledWith(true, expect.any(Number));
    }, { timeout: 2000 });
  });

  it('handles incorrect answer', async () => {
    const onComplete = jest.fn();
    render(<InteractiveMathProblem problem={mockProblem} onComplete={onComplete} />);

    const buttons = screen.getAllByRole('button');
    await userEvent.click(buttons[0]);
    await userEvent.click(buttons[1]);

    await waitFor(() => {
      expect(screen.getByText('What\'s the answer?')).toBeInTheDocument();
    });

    // Click wrong answer
    const choiceButtons = screen.getAllByRole('button');
    const wrongButton = choiceButtons.find(btn => btn.textContent !== '68');
    if (wrongButton) await userEvent.click(wrongButton);

    await waitFor(() => {
      expect(onComplete).toHaveBeenCalledWith(false, expect.any(Number));
    }, { timeout: 2000 });
  });
});
