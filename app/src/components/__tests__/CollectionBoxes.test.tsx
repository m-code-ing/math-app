import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CollectionBoxes from '../CollectionBoxes';

describe('CollectionBoxes Component', () => {
  describe('Rendering', () => {
    it('renders tens and units collection boxes', () => {
      render(<CollectionBoxes tensCount={2} unitsCount={3} />);

      expect(screen.getByText('Tens Collection')).toBeInTheDocument();
      expect(screen.getByText('Units Collection')).toBeInTheDocument();
    });

    it('displays correct count badges', () => {
      render(<CollectionBoxes tensCount={5} unitsCount={7} />);

      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('7')).toBeInTheDocument();
    });

    it('shows grand total calculation', () => {
      render(<CollectionBoxes tensCount={3} unitsCount={4} />);

      // 3 tens = 30, plus 4 units = 34
      expect(screen.getByText('Grand Total: 34')).toBeInTheDocument();
    });

    it('displays individual totals for tens and units', () => {
      render(<CollectionBoxes tensCount={2} unitsCount={6} />);

      expect(screen.getByText('Total: 20')).toBeInTheDocument(); // Tens total
      expect(screen.getByText('Total: 6')).toBeInTheDocument(); // Units total
    });
  });

  describe('Empty State', () => {
    it('shows empty message when no tens collected', () => {
      render(<CollectionBoxes tensCount={0} unitsCount={3} />);

      expect(screen.getByText('Tens will appear here when you click them in the modal')).toBeInTheDocument();
    });

    it('shows empty message when no units collected', () => {
      render(<CollectionBoxes tensCount={2} unitsCount={0} />);

      expect(screen.getByText('Units will appear here when you click them in the modal')).toBeInTheDocument();
    });

    it('shows empty messages for both when nothing collected', () => {
      render(<CollectionBoxes tensCount={0} unitsCount={0} />);

      expect(screen.getByText('Tens will appear here when you click them in the modal')).toBeInTheDocument();
      expect(screen.getByText('Units will appear here when you click them in the modal')).toBeInTheDocument();
    });

    it('shows empty box icons when counts are zero', () => {
      render(<CollectionBoxes tensCount={0} unitsCount={0} />);

      const emptyIcons = screen.getAllByText('📦');
      expect(emptyIcons).toHaveLength(2);
    });
  });

  describe('Collected Items', () => {
    it('renders correct number of collected tens', () => {
      const { container } = render(<CollectionBoxes tensCount={3} unitsCount={0} />);

      const collectedTens = container.querySelectorAll('.collected-ten');
      expect(collectedTens).toHaveLength(3);
    });

    it('renders correct number of collected units', () => {
      const { container } = render(<CollectionBoxes tensCount={0} unitsCount={5} />);

      const collectedUnits = container.querySelectorAll('.collected-unit');
      expect(collectedUnits).toHaveLength(5);
    });

    it('renders ten blocks with correct structure', () => {
      const { container } = render(<CollectionBoxes tensCount={2} unitsCount={0} />);

      const tenGrids = container.querySelectorAll('.ten-grid-small');
      const tenValues = screen.getAllByText('10');

      expect(tenGrids).toHaveLength(2);
      expect(tenValues).toHaveLength(2);
    });

    it('renders unit circles with correct value', () => {
      const { container } = render(<CollectionBoxes tensCount={0} unitsCount={3} />);

      const unitCircles = container.querySelectorAll('.unit-circle');
      expect(unitCircles).toHaveLength(3);

      // Each unit circle should contain "1"
      unitCircles.forEach(circle => {
        expect(circle).toHaveTextContent('1');
      });
    });

    it('renders grid units within ten blocks', () => {
      const { container } = render(<CollectionBoxes tensCount={1} unitsCount={0} />);

      const gridUnits = container.querySelectorAll('.grid-unit-small');
      expect(gridUnits).toHaveLength(10); // Each ten block has 10 grid units
    });
  });

  describe('Mathematical Calculations', () => {
    it('calculates tens total correctly', () => {
      render(<CollectionBoxes tensCount={4} unitsCount={0} />);

      expect(screen.getByText('Total: 40')).toBeInTheDocument();
    });

    it('calculates grand total correctly with tens and units', () => {
      render(<CollectionBoxes tensCount={3} unitsCount={7} />);

      expect(screen.getByText('Grand Total: 37')).toBeInTheDocument();
    });

    it('handles zero values correctly', () => {
      render(<CollectionBoxes tensCount={0} unitsCount={0} />);

      // Use getAllByText since there are two "Total: 0" elements
      const totalElements = screen.getAllByText('Total: 0');
      expect(totalElements).toHaveLength(2); // One for tens, one for units
      expect(screen.getByText('Grand Total: 0')).toBeInTheDocument();
    });

    it('calculates correctly with only tens', () => {
      render(<CollectionBoxes tensCount={9} unitsCount={0} />);

      expect(screen.getByText('Total: 90')).toBeInTheDocument();
      expect(screen.getByText('Grand Total: 90')).toBeInTheDocument();
    });

    it('calculates correctly with only units', () => {
      render(<CollectionBoxes tensCount={0} unitsCount={8} />);

      expect(screen.getByText('Total: 8')).toBeInTheDocument();
      expect(screen.getByText('Grand Total: 8')).toBeInTheDocument();
    });
  });

  describe('Visual Elements', () => {
    it('has correct count badge values', () => {
      render(<CollectionBoxes tensCount={6} unitsCount={2} />);

      // Count badges should show the exact counts
      const badges = screen.getAllByText(/^[0-9]+$/);
      expect(badges).toEqual(expect.arrayContaining([
        expect.objectContaining({ textContent: '6' }),
        expect.objectContaining({ textContent: '2' })
      ]));
    });

    it('applies correct CSS classes for styling', () => {
      const { container } = render(<CollectionBoxes tensCount={1} unitsCount={1} />);

      expect(container.querySelector('.collection-boxes')).toBeInTheDocument();
      expect(container.querySelector('.tens-box')).toBeInTheDocument();
      expect(container.querySelector('.units-box')).toBeInTheDocument();
      expect(container.querySelector('.grand-total')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles maximum reasonable values', () => {
      render(<CollectionBoxes tensCount={9} unitsCount={9} />);

      expect(screen.getByText('Grand Total: 99')).toBeInTheDocument();
    });

    it('handles single digit counts', () => {
      render(<CollectionBoxes tensCount={1} unitsCount={1} />);

      expect(screen.getByText('Grand Total: 11')).toBeInTheDocument();
    });

    it('handles large tens count', () => {
      const { container } = render(<CollectionBoxes tensCount={8} unitsCount={0} />);

      const collectedTens = container.querySelectorAll('.collected-ten');
      expect(collectedTens).toHaveLength(8);
      expect(screen.getByText('Total: 80')).toBeInTheDocument();
    });

    it('handles large units count', () => {
      const { container } = render(<CollectionBoxes tensCount={0} unitsCount={9} />);

      const collectedUnits = container.querySelectorAll('.collected-unit');
      expect(collectedUnits).toHaveLength(9);
      expect(screen.getByText('Total: 9')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper heading structure', () => {
      render(<CollectionBoxes tensCount={1} unitsCount={1} />);

      const h3Headers = screen.getAllByRole('heading', { level: 3 });
      const h4Headers = screen.getAllByRole('heading', { level: 4 });

      expect(h3Headers).toHaveLength(2); // "Tens Collection" and "Units Collection"
      expect(h4Headers).toHaveLength(1); // "Grand Total"
    });

    it('provides meaningful text content for screen readers', () => {
      render(<CollectionBoxes tensCount={2} unitsCount={3} />);

      expect(screen.getByText('Tens Collection')).toBeInTheDocument();
      expect(screen.getByText('Units Collection')).toBeInTheDocument();
      expect(screen.getByText('Grand Total: 23')).toBeInTheDocument();
    });
  });
});