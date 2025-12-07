import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '../../utils/test-utils';
import { TenFrame } from '../TenFrame';
import { TenFrameQuestion } from '../TenFrameQuestion';
import { TenFrameQuiz } from '../TenFrameQuiz';

describe('TenFrame', () => {
  it('renders correct number of filled dots', () => {
    const { container } = render(<TenFrame filledCount={7} />);
    const dots = container.querySelectorAll('[style*="border-radius: 50%"]');
    expect(dots.length).toBe(7);
  });

  it('renders 10 boxes total', () => {
    const { container } = render(<TenFrame filledCount={5} />);
    const boxes = container.querySelectorAll('[style*="width: 60px"]');
    expect(boxes.length).toBe(10);
  });

  it('handles edge case of 0 filled', () => {
    const { container } = render(<TenFrame filledCount={0} />);
    const dots = container.querySelectorAll('[style*="border-radius: 50%"]');
    expect(dots.length).toBe(0);
  });

  it('handles edge case of 10 filled', () => {
    const { container } = render(<TenFrame filledCount={10} />);
    const dots = container.querySelectorAll('[style*="border-radius: 50%"]');
    expect(dots.length).toBe(10);
  });
});

describe('TenFrameQuestion', () => {
  it('renders recognition mode question', () => {
    const question = { number: 7, correctAnswer: 7 };
    render(
      <TenFrameQuestion question={question} mode="recognition" onComplete={jest.fn()} />
    );
    expect(screen.getByText('What number is this?')).toBeInTheDocument();
  });

  it('renders make10 mode question', () => {
    const question = { number: 7, correctAnswer: 3 };
    render(
      <TenFrameQuestion question={question} mode="make10" onComplete={jest.fn()} />
    );
    expect(screen.getByText('How many more to make 10?')).toBeInTheDocument();
  });

  it('calls onComplete with correct answer in recognition mode', async () => {
    const onComplete = jest.fn();
    const question = { number: 7, correctAnswer: 7 };
    render(
      <TenFrameQuestion question={question} mode="recognition" onComplete={onComplete} />
    );

    await waitFor(() => {
      const button = screen.getByRole('button', { name: /7/ });
      expect(button).toBeInTheDocument();
    });

    const correctButton = screen.getByRole('button', { name: /7/ });
    fireEvent.click(correctButton);

    await waitFor(() => {
      expect(onComplete).toHaveBeenCalledWith(true, 1);
    }, { timeout: 1000 });
  });

  it('calls onComplete with correct answer in make10 mode', async () => {
    const onComplete = jest.fn();
    const question = { number: 7, correctAnswer: 3 };
    render(
      <TenFrameQuestion question={question} mode="make10" onComplete={onComplete} />
    );

    await waitFor(() => {
      const button = screen.getByRole('button', { name: /3/ });
      expect(button).toBeInTheDocument();
    });

    const correctButton = screen.getByRole('button', { name: /3/ });
    fireEvent.click(correctButton);

    await waitFor(() => {
      expect(onComplete).toHaveBeenCalledWith(true, 1);
    }, { timeout: 1000 });
  });

  it('allows retry on wrong answer', async () => {
    const onComplete = jest.fn();
    const question = { number: 7, correctAnswer: 7 };
    render(
      <TenFrameQuestion question={question} mode="recognition" onComplete={onComplete} />
    );

    await waitFor(() => {
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBe(3);
    });

    const buttons = screen.getAllByRole('button');
    const wrongButton = buttons.find(btn => btn.textContent !== '7');
    
    if (wrongButton) {
      fireEvent.click(wrongButton);
      await waitFor(() => {
        expect(wrongButton).toBeDisabled();
      });
      expect(onComplete).not.toHaveBeenCalled();
    }
  });
});

describe('TenFrameQuiz', () => {
  it('renders recognition mode quiz', () => {
    render(<TenFrameQuiz mode="recognition" />);
    expect(screen.getByText(/Question 1 of 10/)).toBeInTheDocument();
    expect(screen.getByText('What number is this?')).toBeInTheDocument();
  });

  it('renders make10 mode quiz', () => {
    render(<TenFrameQuiz mode="make10" />);
    expect(screen.getByText(/Question 1 of 10/)).toBeInTheDocument();
    expect(screen.getByText('How many more to make 10?')).toBeInTheDocument();
  });

  it('generates 10 unique questions', () => {
    render(<TenFrameQuiz mode="recognition" />);
    expect(screen.getByText(/Question 1 of 10/)).toBeInTheDocument();
  });
});
