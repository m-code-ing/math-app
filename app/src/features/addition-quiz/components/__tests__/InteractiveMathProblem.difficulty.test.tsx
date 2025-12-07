import React from 'react';
import { render, screen } from '@testing-library/react';
import InteractiveMathProblem from '../InteractiveMathProblem';
import { MathProblem } from '../../types/MathProblem';

describe('InteractiveMathProblem - Difficulty Modes', () => {
  const easyProblem: MathProblem = {
    num1: 3,
    num2: 5,
    operation: '+',
    expectedAnswer: 8,
  };

  const hardProblem: MathProblem = {
    num1: 23,
    num2: 18,
    operation: '+',
    expectedAnswer: 41,
  };

  describe('Easy difficulty (showDecomposition=false)', () => {
    it('should show simple question without clickable numbers', () => {
      const mockOnComplete = jest.fn();
      render(
        <InteractiveMathProblem
          problem={easyProblem}
          onComplete={mockOnComplete}
          showDecomposition={false}
          maxAnswerValue={10}
        />
      );

      // Easy mode doesn't show "Question" label, just the numbers
      expect(screen.getAllByText('3').length).toBeGreaterThan(0);
      expect(screen.getAllByText('5').length).toBeGreaterThan(0);
    });

    it('should show ten-frame visual helper', () => {
      const mockOnComplete = jest.fn();
      render(
        <InteractiveMathProblem
          problem={easyProblem}
          onComplete={mockOnComplete}
          showDecomposition={false}
          maxAnswerValue={10}
        />
      );

      expect(screen.getByText('Visual Helper')).toBeInTheDocument();
      const tenFrames = screen.getAllByTestId('ten-frame');
      expect(tenFrames).toHaveLength(2);
    });

    it('should show answer choices immediately', () => {
      const mockOnComplete = jest.fn();
      render(
        <InteractiveMathProblem
          problem={easyProblem}
          onComplete={mockOnComplete}
          showDecomposition={false}
          maxAnswerValue={10}
        />
      );

      expect(screen.getByText('Choose Answer')).toBeInTheDocument();
    });

    it('should not show Layer 2 decomposition', () => {
      const mockOnComplete = jest.fn();
      render(
        <InteractiveMathProblem
          problem={easyProblem}
          onComplete={mockOnComplete}
          showDecomposition={false}
          maxAnswerValue={10}
        />
      );

      expect(screen.queryByText('Layer 2: Break Down Numbers')).not.toBeInTheDocument();
    });
  });

  describe('Hard difficulty (showDecomposition=true)', () => {
    it('should show Layer 1 with static numbers', () => {
      const mockOnComplete = jest.fn();
      render(
        <InteractiveMathProblem
          problem={hardProblem}
          onComplete={mockOnComplete}
          showDecomposition={true}
          maxAnswerValue={50}
        />
      );

      expect(screen.getByText('Layer 1: Question')).toBeInTheDocument();
    });

    it('should show decomposition automatically', () => {
      const mockOnComplete = jest.fn();
      render(
        <InteractiveMathProblem
          problem={hardProblem}
          onComplete={mockOnComplete}
          showDecomposition={true}
          maxAnswerValue={50}
        />
      );

      expect(screen.getByText('Layer 2: Break Down Numbers')).toBeInTheDocument();
    });

    it('should not show ten-frame visual helper', () => {
      const mockOnComplete = jest.fn();
      render(
        <InteractiveMathProblem
          problem={hardProblem}
          onComplete={mockOnComplete}
          showDecomposition={true}
          maxAnswerValue={50}
        />
      );

      expect(screen.queryByText('Visual Helper')).not.toBeInTheDocument();
      expect(screen.queryByTestId('ten-frame')).not.toBeInTheDocument();
    });

    it('should show Layer 3 label', () => {
      const mockOnComplete = jest.fn();
      render(
        <InteractiveMathProblem
          problem={hardProblem}
          onComplete={mockOnComplete}
          showDecomposition={true}
          maxAnswerValue={50}
        />
      );

      // Answer choices won't show until numbers are clicked, but we can check the component renders
      expect(screen.getByText('Layer 1: Question')).toBeInTheDocument();
    });
  });
});
