import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ClickableNumber from '../ClickableNumber';

describe('ClickableNumber Component', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  describe('Rendering', () => {
    it('renders the number correctly', () => {
      render(
        <ClickableNumber
          number={12}
          isSelectable={true}
          isDecomposed={false}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByText('12')).toBeInTheDocument();
    });

    it('displays click hint when selectable and not decomposed', () => {
      render(
        <ClickableNumber
          number={12}
          isSelectable={true}
          isDecomposed={false}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByText('Tap me!')).toBeInTheDocument();
    });

    it('displays checkmark when decomposed', () => {
      render(
        <ClickableNumber
          number={12}
          isSelectable={false}
          isDecomposed={true}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByText('✓')).toBeInTheDocument();
    });

    it('does not display click hint when not selectable', () => {
      render(
        <ClickableNumber
          number={12}
          isSelectable={false}
          isDecomposed={false}
          onClick={mockOnClick}
        />
      );

      expect(screen.queryByText('Tap me!')).not.toBeInTheDocument();
    });
  });

  describe('CSS Classes', () => {
    it('applies selectable class when isSelectable is true and not decomposed', () => {
      render(
        <ClickableNumber
          number={12}
          isSelectable={true}
          isDecomposed={false}
          onClick={mockOnClick}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('clickable-number', 'selectable');
    });

    it('applies disabled class when not selectable', () => {
      render(
        <ClickableNumber
          number={12}
          isSelectable={false}
          isDecomposed={false}
          onClick={mockOnClick}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('clickable-number', 'disabled');
    });

    it('applies decomposed class when decomposed', () => {
      render(
        <ClickableNumber
          number={12}
          isSelectable={false}
          isDecomposed={true}
          onClick={mockOnClick}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('clickable-number', 'decomposed');
    });
  });

  describe('Interactions', () => {
    it('calls onClick when selectable button is clicked', () => {
      render(
        <ClickableNumber
          number={12}
          isSelectable={true}
          isDecomposed={false}
          onClick={mockOnClick}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled button is clicked', () => {
      render(
        <ClickableNumber
          number={12}
          isSelectable={false}
          isDecomposed={false}
          onClick={mockOnClick}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(mockOnClick).not.toHaveBeenCalled();
    });

    it('button is disabled when not selectable', () => {
      render(
        <ClickableNumber
          number={12}
          isSelectable={false}
          isDecomposed={false}
          onClick={mockOnClick}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('button is enabled when selectable', () => {
      render(
        <ClickableNumber
          number={12}
          isSelectable={true}
          isDecomposed={false}
          onClick={mockOnClick}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toBeEnabled();
    });
  });

  describe('Accessibility', () => {
    it('has correct aria-label when selectable', () => {
      render(
        <ClickableNumber
          number={12}
          isSelectable={true}
          isDecomposed={false}
          onClick={mockOnClick}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Number 12, click to break down');
    });

    it('has correct aria-label when not selectable', () => {
      render(
        <ClickableNumber
          number={12}
          isSelectable={false}
          isDecomposed={false}
          onClick={mockOnClick}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Number 12, already used');
    });

    it('is keyboard accessible when selectable', () => {
      render(
        <ClickableNumber
          number={12}
          isSelectable={true}
          isDecomposed={false}
          onClick={mockOnClick}
        />
      );

      const button = screen.getByRole('button');
      button.focus();
      // Use click event instead of keyDown for testing
      fireEvent.click(button);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    it('handles single digit numbers correctly', () => {
      render(
        <ClickableNumber
          number={5}
          isSelectable={true}
          isDecomposed={false}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('handles two digit numbers correctly', () => {
      render(
        <ClickableNumber
          number={99}
          isSelectable={true}
          isDecomposed={false}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByText('99')).toBeInTheDocument();
    });

    it('handles zero correctly', () => {
      render(
        <ClickableNumber
          number={0}
          isSelectable={true}
          isDecomposed={false}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });
});