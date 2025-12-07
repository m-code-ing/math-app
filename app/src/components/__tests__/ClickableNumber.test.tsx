import React from 'react';
import { render, screen } from '../../utils/test-utils';
import userEvent from '@testing-library/user-event';
import ClickableNumber from '../ClickableNumber';

describe('ClickableNumber', () => {
  it('renders number correctly', () => {
    render(<ClickableNumber number={42} isSelectable={true} isDecomposed={false} onClick={() => {}} />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('calls onClick when selectable and clicked', async () => {
    const onClick = jest.fn();
    render(<ClickableNumber number={42} isSelectable={true} isDecomposed={false} onClick={onClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('button is disabled when not selectable', () => {
    const onClick = jest.fn();
    render(<ClickableNumber number={42} isSelectable={false} isDecomposed={false} onClick={onClick} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows checkmark when decomposed', () => {
    render(<ClickableNumber number={42} isSelectable={false} isDecomposed={true} onClick={() => {}} />);
    expect(screen.getByTestId('CheckCircleIcon')).toBeInTheDocument();
  });
});
