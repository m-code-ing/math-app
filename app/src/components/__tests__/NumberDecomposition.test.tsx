import React from 'react';
import { render, screen } from '../../utils/test-utils';
import NumberDecomposition from '../NumberDecomposition';

describe('NumberDecomposition', () => {
  it('displays correct decomposition', () => {
    render(<NumberDecomposition number={47} tens={40} units={7} />);
    expect(screen.getByText('47 = 40 + 7')).toBeInTheDocument();
    expect(screen.getByText('40')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('shows tens and units labels', () => {
    render(<NumberDecomposition number={23} tens={20} units={3} />);
    expect(screen.getByText('tens')).toBeInTheDocument();
    expect(screen.getByText('units')).toBeInTheDocument();
  });
});
