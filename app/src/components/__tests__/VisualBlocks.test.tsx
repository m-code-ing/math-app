import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import VisualBlocks from '../VisualBlocks';

describe('VisualBlocks Component', () => {
  const mockOnTensClick = jest.fn();
  const mockOnUnitsClick = jest.fn();

  beforeEach(() => {
    mockOnTensClick.mockClear();
    mockOnUnitsClick.mockClear();
  });

  describe('Rendering', () => {
    it('renders tens and units correctly', () => {
      render(
        <VisualBlocks
          tens={2}
          units={3}
          isClickable={false}
        />
      );

      expect(screen.getByText('Tens')).toBeInTheDocument();
      expect(screen.getByText('Units')).toBeInTheDocument();
    });

    it('renders correct number of ten blocks', () => {
      render(
        <VisualBlocks
          tens={3}
          units={0}
          isClickable={false}
        />
      );

      const tenBlocks = screen.getAllByText('10');
      expect(tenBlocks).toHaveLength(3);
    });

    it('renders correct number of unit blocks', () => {
      render(
        <VisualBlocks
          tens={0}
          units={5}
          isClickable={false}
        />
      );

      const unitBlocks = document.querySelectorAll('.unit-block');
      expect(unitBlocks).toHaveLength(5);
    });

    it('shows empty state when no tens or units', () => {
      render(
        <VisualBlocks
          tens={0}
          units={0}
          isClickable={false}
        />
      );

      expect(screen.getByText('No tens or units to show')).toBeInTheDocument();
    });

    it('only shows tens section when units is 0', () => {
      render(
        <VisualBlocks
          tens={2}
          units={0}
          isClickable={false}
        />
      );

      expect(screen.getByText('Tens')).toBeInTheDocument();
      expect(screen.queryByText('Units')).not.toBeInTheDocument();
    });

    it('only shows units section when tens is 0', () => {
      render(
        <VisualBlocks
          tens={0}
          units={4}
          isClickable={false}
        />
      );

      expect(screen.getByText('Units')).toBeInTheDocument();
      expect(screen.queryByText('Tens')).not.toBeInTheDocument();
    });
  });

  describe('Size Variations', () => {
    it('applies small size class correctly', () => {
      const { container } = render(
        <VisualBlocks
          tens={1}
          units={1}
          size="small"
          isClickable={false}
        />
      );

      const visualBlocks = container.querySelector('.visual-blocks');
      expect(visualBlocks).toHaveClass('small');
    });

    it('applies medium size class by default', () => {
      const { container } = render(
        <VisualBlocks
          tens={1}
          units={1}
          isClickable={false}
        />
      );

      const visualBlocks = container.querySelector('.visual-blocks');
      expect(visualBlocks).toHaveClass('medium');
    });

    it('applies large size class correctly', () => {
      const { container } = render(
        <VisualBlocks
          tens={1}
          units={1}
          size="large"
          isClickable={false}
        />
      );

      const visualBlocks = container.querySelector('.visual-blocks');
      expect(visualBlocks).toHaveClass('large');
    });
  });

  describe('Clickable Functionality', () => {
    it('calls onTensClick when tens are clicked and clickable', () => {
      const { container } = render(
        <VisualBlocks
          tens={2}
          units={3}
          isClickable={true}
          onTensClick={mockOnTensClick}
          onUnitsClick={mockOnUnitsClick}
        />
      );

      const tensContainer = container.querySelector('.tens-container');
      fireEvent.click(tensContainer!);

      expect(mockOnTensClick).toHaveBeenCalledTimes(1);
    });

    it('calls onUnitsClick when units are clicked and clickable', () => {
      const { container } = render(
        <VisualBlocks
          tens={2}
          units={3}
          isClickable={true}
          onTensClick={mockOnTensClick}
          onUnitsClick={mockOnUnitsClick}
        />
      );

      const unitsContainer = container.querySelector('.units-container');
      fireEvent.click(unitsContainer!);

      expect(mockOnUnitsClick).toHaveBeenCalledTimes(1);
    });

    it('does not call click handlers when not clickable', () => {
      const { container } = render(
        <VisualBlocks
          tens={2}
          units={3}
          isClickable={false}
          onTensClick={mockOnTensClick}
          onUnitsClick={mockOnUnitsClick}
        />
      );

      const tensContainer = container.querySelector('.tens-container');
      const unitsContainer = container.querySelector('.units-container');
      
      fireEvent.click(tensContainer!);
      fireEvent.click(unitsContainer!);

      expect(mockOnTensClick).not.toHaveBeenCalled();
      expect(mockOnUnitsClick).not.toHaveBeenCalled();
    });

    it('does not call onTensClick when tens is 0', () => {
      const { container } = render(
        <VisualBlocks
          tens={0}
          units={3}
          isClickable={true}
          onTensClick={mockOnTensClick}
          onUnitsClick={mockOnUnitsClick}
        />
      );

      const visualBlocks = container.querySelector('.visual-blocks');
      fireEvent.click(visualBlocks!);

      expect(mockOnTensClick).not.toHaveBeenCalled();
    });

    it('does not call onUnitsClick when units is 0', () => {
      const { container } = render(
        <VisualBlocks
          tens={2}
          units={0}
          isClickable={true}
          onTensClick={mockOnTensClick}
          onUnitsClick={mockOnUnitsClick}
        />
      );

      const visualBlocks = container.querySelector('.visual-blocks');
      fireEvent.click(visualBlocks!);

      expect(mockOnUnitsClick).not.toHaveBeenCalled();
    });

    it('applies clickable class when isClickable is true', () => {
      const { container } = render(
        <VisualBlocks
          tens={2}
          units={3}
          isClickable={true}
          onTensClick={mockOnTensClick}
          onUnitsClick={mockOnUnitsClick}
        />
      );

      const tensContainer = container.querySelector('.tens-container');
      const unitsContainer = container.querySelector('.units-container');

      expect(tensContainer).toHaveClass('clickable');
      expect(unitsContainer).toHaveClass('clickable');
    });
  });

  describe('Ten Block Structure', () => {
    it('creates correct grid structure for ten blocks', () => {
      const { container } = render(
        <VisualBlocks
          tens={1}
          units={0}
          isClickable={false}
        />
      );

      const tenGrid = container.querySelector('.ten-grid');
      const gridUnits = container.querySelectorAll('.grid-unit');

      expect(tenGrid).toBeInTheDocument();
      expect(gridUnits).toHaveLength(10);
    });

    it('displays correct label for ten blocks', () => {
      render(
        <VisualBlocks
          tens={2}
          units={0}
          isClickable={false}
        />
      );

      const tenLabels = screen.getAllByText('10');
      expect(tenLabels).toHaveLength(2);
    });
  });

  describe('Edge Cases', () => {
    it('handles large numbers of tens correctly', () => {
      const { container } = render(
        <VisualBlocks
          tens={9}
          units={0}
          isClickable={false}
        />
      );

      const tenBlocks = screen.getAllByText('10');
      expect(tenBlocks).toHaveLength(9);
    });

    it('handles large numbers of units correctly', () => {
      const { container } = render(
        <VisualBlocks
          tens={0}
          units={9}
          isClickable={false}
        />
      );

      const unitBlocks = container.querySelectorAll('.unit-block');
      expect(unitBlocks).toHaveLength(9);
    });

    it('handles maximum reasonable values', () => {
      const { container } = render(
        <VisualBlocks
          tens={9}
          units={9}
          isClickable={false}
        />
      );

      const tenBlocks = screen.getAllByText('10');
      const unitBlocks = container.querySelectorAll('.unit-block');

      expect(tenBlocks).toHaveLength(9);
      expect(unitBlocks).toHaveLength(9);
    });
  });
});