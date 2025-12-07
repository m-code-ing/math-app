import React from 'react';
import { render, screen } from '../../utils/test-utils';
import userEvent from '@testing-library/user-event';
import { SummaryScreen } from '../SummaryScreen';

describe('SummaryScreen', () => {
  it('displays correct score', () => {
    render(<SummaryScreen totalQuestions={10} correctCount={8} sessionResults={[]} onTryAgain={() => {}} />);
    expect(screen.getByText('You got 8 out of 10 correct!')).toBeInTheDocument();
  });

  it('shows 5 stars for perfect score', () => {
    render(<SummaryScreen totalQuestions={10} correctCount={10} sessionResults={[]} onTryAgain={() => {}} />);
    expect(screen.getByText('Perfect!')).toBeInTheDocument();
    const stars = screen.getAllByTestId('StarIcon');
    expect(stars).toHaveLength(5);
  });

  it('shows 4 stars for 8-9 correct', () => {
    render(<SummaryScreen totalQuestions={10} correctCount={8} sessionResults={[]} onTryAgain={() => {}} />);
    expect(screen.getByText('Great!')).toBeInTheDocument();
    const stars = screen.getAllByTestId('StarIcon');
    expect(stars).toHaveLength(4);
  });

  it('calls onTryAgain when button clicked', async () => {
    const onTryAgain = jest.fn();
    render(<SummaryScreen totalQuestions={10} correctCount={8} sessionResults={[]} onTryAgain={onTryAgain} />);
    await userEvent.click(screen.getByText('Try Again'));
    expect(onTryAgain).toHaveBeenCalledTimes(1);
  });
});
