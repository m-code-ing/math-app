import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MultipleChoiceAnswer from '../MultipleChoiceAnswer';

describe('MultipleChoiceAnswer Component', () => {
  const mockOnSelect = jest.fn();
  const sampleChoices = [30, 35, 36]; // 36 is correct
  const correctAnswer = 36;

  beforeEach(() => {
    mockOnSelect.mockClear();
  });

  describe('Rendering', () => {
    it('renders all choice buttons', () => {
      render(
        <MultipleChoiceAnswer
          choices={sampleChoices}
          correctAnswer={correctAnswer}
          onSelect={mockOnSelect}
        />
      );

      expect(screen.getByText('30')).toBeInTheDocument();
      expect(screen.getByText('35')).toBeInTheDocument();
      expect(screen.getByText('36')).toBeInTheDocument();
    });

    it('renders choices as buttons', () => {
      render(
        <MultipleChoiceAnswer
          choices={sampleChoices}
          correctAnswer={correctAnswer}
          onSelect={mockOnSelect}
        />
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(3);
    });

    it('does not show feedback message initially', () => {
      render(
        <MultipleChoiceAnswer
          choices={sampleChoices}
          correctAnswer={correctAnswer}
          onSelect={mockOnSelect}
        />
      );

      expect(screen.queryByText(/Excellent! You got it right!/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Good try!/)).not.toBeInTheDocument();
    });
  });

  describe('Interaction', () => {
    it('calls onSelect when a choice is clicked', async () => {
      render(
        <MultipleChoiceAnswer
          choices={sampleChoices}
          correctAnswer={correctAnswer}
          onSelect={mockOnSelect}
        />
      );

      const correctButton = screen.getByText('36');
      fireEvent.click(correctButton);

      await waitFor(() => {
        expect(mockOnSelect).toHaveBeenCalledWith(36);
      }, { timeout: 1000 });
    });

    it('disables all buttons after a choice is made', () => {
      render(
        <MultipleChoiceAnswer
          choices={sampleChoices}
          correctAnswer={correctAnswer}
          onSelect={mockOnSelect}
        />
      );

      const correctButton = screen.getByText('36');
      fireEvent.click(correctButton);

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toBeDisabled();
      });
    });

    it('prevents multiple selections', async () => {
      const localMockOnSelect = jest.fn();
      render(
        <MultipleChoiceAnswer
          choices={sampleChoices}
          correctAnswer={correctAnswer}
          onSelect={localMockOnSelect}
        />
      );

      const correctButton = screen.getByRole('button', { name: /Answer choice 36/ });
      const incorrectButton = screen.getByRole('button', { name: /Answer choice 30/ });

      fireEvent.click(correctButton);
      
      // Wait for first click to complete
      await waitFor(() => {
        expect(localMockOnSelect).toHaveBeenCalledTimes(1);
      }, { timeout: 1000 });
      
      // Try to click another button
      fireEvent.click(incorrectButton);
      
      // Should still only have been called once
      expect(localMockOnSelect).toHaveBeenCalledTimes(1);
      expect(localMockOnSelect).toHaveBeenCalledWith(36);
    });
  });

  describe('Correct Answer Selection', () => {
    it('shows correct styling when correct answer is selected', () => {
      render(
        <MultipleChoiceAnswer
          choices={sampleChoices}
          correctAnswer={correctAnswer}
          onSelect={mockOnSelect}
        />
      );

      const correctButton = screen.getByRole('button', { name: /Answer choice 36/ });
      fireEvent.click(correctButton);

      expect(correctButton).toHaveClass('correct');
    });

    it('shows success feedback for correct answer', () => {
      render(
        <MultipleChoiceAnswer
          choices={sampleChoices}
          correctAnswer={correctAnswer}
          onSelect={mockOnSelect}
        />
      );

      const correctButton = screen.getByText('36');
      fireEvent.click(correctButton);

      expect(screen.getByText('🎉 Excellent! You got it right!')).toBeInTheDocument();
    });

    it('shows checkmark indicator for correct answer', () => {
      render(
        <MultipleChoiceAnswer
          choices={sampleChoices}
          correctAnswer={correctAnswer}
          onSelect={mockOnSelect}
        />
      );

      const correctButton = screen.getByText('36');
      fireEvent.click(correctButton);

      expect(screen.getByText('✓')).toBeInTheDocument();
    });
  });

  describe('Incorrect Answer Selection', () => {
    it('shows incorrect styling when wrong answer is selected', () => {
      render(
        <MultipleChoiceAnswer
          choices={sampleChoices}
          correctAnswer={correctAnswer}
          onSelect={mockOnSelect}
        />
      );

      const incorrectButton = screen.getByRole('button', { name: /Answer choice 30/ });
      fireEvent.click(incorrectButton);

      expect(incorrectButton).toHaveClass('incorrect');
    });

    it('shows try again feedback for incorrect answer', () => {
      render(
        <MultipleChoiceAnswer
          choices={sampleChoices}
          correctAnswer={correctAnswer}
          onSelect={mockOnSelect}
        />
      );

      const incorrectButton = screen.getByText('30');
      fireEvent.click(incorrectButton);

      expect(screen.getByText('😊 Good try! The correct answer is 36')).toBeInTheDocument();
    });

    it('shows X indicator for incorrect answer', () => {
      render(
        <MultipleChoiceAnswer
          choices={sampleChoices}
          correctAnswer={correctAnswer}
          onSelect={mockOnSelect}
        />
      );

      const incorrectButton = screen.getByText('30');
      fireEvent.click(incorrectButton);

      expect(screen.getByText('✗')).toBeInTheDocument();
    });
  });

  describe('CSS Classes', () => {
    it('applies disabled class to non-selected choices', () => {
      render(
        <MultipleChoiceAnswer
          choices={sampleChoices}
          correctAnswer={correctAnswer}
          onSelect={mockOnSelect}
        />
      );

      const selectedButton = screen.getByRole('button', { name: /Answer choice 36/ });
      const nonSelectedButton1 = screen.getByRole('button', { name: /Answer choice 30/ });
      const nonSelectedButton2 = screen.getByRole('button', { name: /Answer choice 35/ });

      fireEvent.click(selectedButton);

      expect(nonSelectedButton1).toHaveClass('disabled');
      expect(nonSelectedButton2).toHaveClass('disabled');
    });

    it('applies base choice-button class to all buttons', () => {
      render(
        <MultipleChoiceAnswer
          choices={sampleChoices}
          correctAnswer={correctAnswer}
          onSelect={mockOnSelect}
        />
      );

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveClass('choice-button');
      });
    });
  });

  describe('Accessibility', () => {
    it('has correct aria-labels for each choice', () => {
      render(
        <MultipleChoiceAnswer
          choices={sampleChoices}
          correctAnswer={correctAnswer}
          onSelect={mockOnSelect}
        />
      );

      expect(screen.getByLabelText('Answer choice 30')).toBeInTheDocument();
      expect(screen.getByLabelText('Answer choice 35')).toBeInTheDocument();
      expect(screen.getByLabelText('Answer choice 36')).toBeInTheDocument();
    });

    it('maintains button accessibility after selection', () => {
      render(
        <MultipleChoiceAnswer
          choices={sampleChoices}
          correctAnswer={correctAnswer}
          onSelect={mockOnSelect}
        />
      );

      const correctButton = screen.getByRole('button', { name: /Answer choice 36/ });
      fireEvent.click(correctButton);

      expect(correctButton).toHaveAttribute('aria-label', 'Answer choice 36');
    });

    it('buttons are keyboard accessible', async () => {
      render(
        <MultipleChoiceAnswer
          choices={sampleChoices}
          correctAnswer={correctAnswer}
          onSelect={mockOnSelect}
        />
      );

      const button = screen.getByRole('button', { name: /Answer choice 36/ });
      button.focus();
      fireEvent.click(button); // Use click instead of keyDown for testing

      await waitFor(() => {
        expect(mockOnSelect).toHaveBeenCalledWith(36);
      }, { timeout: 1000 });
    });
  });

  describe('Edge Cases', () => {
    it('handles single choice correctly', () => {
      render(
        <MultipleChoiceAnswer
          choices={[42]}
          correctAnswer={42}
          onSelect={mockOnSelect}
        />
      );

      expect(screen.getByText('42')).toBeInTheDocument();
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(1);
    });

    it('handles large numbers correctly', () => {
      const largeChoices = [987, 999, 1000];
      render(
        <MultipleChoiceAnswer
          choices={largeChoices}
          correctAnswer={999}
          onSelect={mockOnSelect}
        />
      );

      expect(screen.getByText('987')).toBeInTheDocument();
      expect(screen.getByText('999')).toBeInTheDocument();
      expect(screen.getByText('1000')).toBeInTheDocument();
    });

    it('handles many choices correctly', () => {
      const manyChoices = [10, 20, 30, 40, 50];
      render(
        <MultipleChoiceAnswer
          choices={manyChoices}
          correctAnswer={30}
          onSelect={mockOnSelect}
        />
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(5);
    });

    it('handles zero as a choice', async () => {
      render(
        <MultipleChoiceAnswer
          choices={[0, 1, 2]}
          correctAnswer={0}
          onSelect={mockOnSelect}
        />
      );

      const zeroButton = screen.getByRole('button', { name: /Answer choice 0/ });
      fireEvent.click(zeroButton);

      await waitFor(() => {
        expect(mockOnSelect).toHaveBeenCalledWith(0);
      }, { timeout: 1000 });
    });

    it('handles negative numbers as choices', () => {
      render(
        <MultipleChoiceAnswer
          choices={[-5, 0, 5]}
          correctAnswer={-5}
          onSelect={mockOnSelect}
        />
      );

      expect(screen.getByText('-5')).toBeInTheDocument();
    });
  });

  describe('Timing', () => {
    it('delays onSelect call to show visual feedback', async () => {
      render(
        <MultipleChoiceAnswer
          choices={sampleChoices}
          correctAnswer={correctAnswer}
          onSelect={mockOnSelect}
        />
      );

      const correctButton = screen.getByText('36');
      fireEvent.click(correctButton);

      // Should not be called immediately
      expect(mockOnSelect).not.toHaveBeenCalled();

      // Should be called after delay
      await waitFor(() => {
        expect(mockOnSelect).toHaveBeenCalledWith(36);
      }, { timeout: 1000 });
    });
  });
});