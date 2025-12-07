import React from 'react';
import { render, screen } from '../../../../shared/utils/test-utils';
import NumberDecomposition from '../NumberDecomposition';

describe('NumberDecomposition', () => {
  it('displays tens and units', () => {
    render(<NumberDecomposition number={47} tens={40} units={7} />);
    expect(screen.getByText('40')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('shows tens and units labels', () => {
    render(<NumberDecomposition number={23} tens={20} units={3} />);
    expect(screen.getByText('Tens')).toBeInTheDocument();
    expect(screen.getByText('Units')).toBeInTheDocument();
  });
});
