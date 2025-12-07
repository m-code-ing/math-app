import React from 'react';
import { render, screen, waitFor, within } from '../../utils/test-utils';
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

    // Click first number (23)
    await userEvent.click(screen.getByText('23'));

    // Should show decomposition
    await waitFor(() => {
      expect(screen.getByText('23 = 20 + 3')).toBeInTheDocument();
    });

    // Click second number (45)
    await userEvent.click(screen.getByText('45'));

    // Should show second decomposition
    await waitFor(() => {
      expect(screen.getByText('45 = 40 + 5')).toBeInTheDocument();
    });

    // Wait for both decompositions to be visible
    expect(screen.getByText('23 = 20 + 3')).toBeInTheDocument();
    expect(screen.getByText('45 = 40 + 5')).toBeInTheDocument();

    // Should show multiple choice after delay
    await waitFor(() => {
      expect(screen.getByText('What\'s the answer?')).toBeInTheDocument();
    }, { timeout: 3000 });

    // Wait for choices to be generated and find correct answer button
    const correctButton = await waitFor(() => {
      const buttons = screen.getAllByRole('button');
      const button = buttons.find(btn => btn.textContent === '68');
      expect(button).toBeDefined();
      return button!;
    }, { timeout: 2000 });

    // Click correct answer
    await userEvent.click(correctButton);

    // Should call onComplete with correct=true
    await waitFor(() => {
      expect(onComplete).toHaveBeenCalledWith(true, expect.any(Number));
    }, { timeout: 2000 });
  });

  it('handles incorrect answer', async () => {
    const onComplete = jest.fn();
    render(<InteractiveMathProblem problem={mockProblem} onComplete={onComplete} />);

    await userEvent.click(screen.getByText('23'));
    
    await waitFor(() => {
      expect(screen.getByText('23 = 20 + 3')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText('45'));

    await waitFor(() => {
      expect(screen.getByText('45 = 40 + 5')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('What\'s the answer?')).toBeInTheDocument();
    }, { timeout: 3000 });

    // Wait for choices and click wrong answer
    const wrongButton = await waitFor(() => {
      const buttons = screen.getAllByRole('button');
      const button = buttons.find(btn => 
        btn.textContent !== '68' && 
        btn.textContent !== '23' && 
        btn.textContent !== '45' &&
        btn.textContent !== '' &&
        btn.textContent !== '+'
      );
      expect(button).toBeDefined();
      return button!;
    }, { timeout: 2000 });
    
    await userEvent.click(wrongButton);

    await waitFor(() => {
      expect(onComplete).toHaveBeenCalledWith(false, expect.any(Number));
    }, { timeout: 2000 });
  });
});
