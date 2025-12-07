import React from 'react';
import { render, screen, waitFor } from '../../../../shared/utils/test-utils';
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
    render(<InteractiveMathProblem problem={mockProblem} onComplete={onComplete} showDecomposition={true} />);

    // Numbers are automatically decomposed now
    await waitFor(() => {
      expect(screen.getByText('Layer 2: Break Down Numbers')).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('40')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    // Answer choices should be visible immediately
    await waitFor(() => {
      expect(screen.getByText('What\'s the answer?')).toBeInTheDocument();
    });

    const correctButton = await waitFor(() => {
      const buttons = screen.getAllByRole('button');
      const button = buttons.find(btn => btn.textContent === '68');
      expect(button).toBeDefined();
      return button!;
    });

    await userEvent.click(correctButton);

    await waitFor(() => {
      expect(onComplete).toHaveBeenCalledWith(true, expect.any(Number));
    }, { timeout: 1500 });
  });

  it('allows retry on incorrect answer', async () => {
    const onComplete = jest.fn();
    render(<InteractiveMathProblem problem={mockProblem} onComplete={onComplete} showDecomposition={true} />);

    // Wait for decomposition to appear automatically
    await waitFor(() => {
      expect(screen.getByText('Layer 2: Break Down Numbers')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('What\'s the answer?')).toBeInTheDocument();
    });

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
    });
    
    await userEvent.click(wrongButton);

    await waitFor(() => {
      expect(onComplete).not.toHaveBeenCalled();
    }, { timeout: 1000 });

    expect(wrongButton).toBeDisabled();
  });
});
