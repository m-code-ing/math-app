import React from 'react';
import { render, screen, waitFor } from '../../utils/test-utils';
import userEvent from '@testing-library/user-event';
import MultipleChoiceAnswer from '../MultipleChoiceAnswer';

describe('MultipleChoiceAnswer', () => {
  it('generates 4 choices including correct answer', () => {
    render(<MultipleChoiceAnswer correctAnswer={50} onAnswerSelected={() => {}} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(4);
    expect(screen.getByText('50')).toBeInTheDocument();
  });

  it('calls onAnswerSelected with true when correct answer clicked', async () => {
    const onAnswerSelected = jest.fn();
    render(<MultipleChoiceAnswer correctAnswer={50} onAnswerSelected={onAnswerSelected} />);
    
    await userEvent.click(screen.getByText('50'));
    
    await waitFor(() => {
      expect(onAnswerSelected).toHaveBeenCalledWith(true);
    }, { timeout: 1500 });
  });

  it('calls onAnswerSelected with false when wrong answer clicked', async () => {
    const onAnswerSelected = jest.fn();
    render(<MultipleChoiceAnswer correctAnswer={50} onAnswerSelected={onAnswerSelected} />);
    
    const buttons = screen.getAllByRole('button');
    const wrongButton = buttons.find(btn => btn.textContent !== '50');
    if (wrongButton) await userEvent.click(wrongButton);
    
    await waitFor(() => {
      expect(onAnswerSelected).toHaveBeenCalledWith(false);
    }, { timeout: 1500 });
  });
});
