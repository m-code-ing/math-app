import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DifficultySelector } from '../DifficultySelector';

describe('DifficultySelector', () => {
  it('should render all difficulty levels', () => {
    const mockOnSelect = jest.fn();
    render(<DifficultySelector onSelect={mockOnSelect} />);

    expect(screen.getByText('Up to 10')).toBeInTheDocument();
    expect(screen.getByText('Up to 20')).toBeInTheDocument();
    expect(screen.getByText('Up to 50')).toBeInTheDocument();
    expect(screen.getByText('Up to 100')).toBeInTheDocument();
  });

  it('should display correct descriptions', () => {
    const mockOnSelect = jest.fn();
    render(<DifficultySelector onSelect={mockOnSelect} />);

    expect(screen.getByText('Sums up to 10')).toBeInTheDocument();
    expect(screen.getByText('Sums up to 20')).toBeInTheDocument();
    expect(screen.getByText('Sums up to 50')).toBeInTheDocument();
    expect(screen.getByText('Sums up to 100')).toBeInTheDocument();
  });

  it('should call onSelect with easy when Up to 10 is clicked', () => {
    const mockOnSelect = jest.fn();
    render(<DifficultySelector onSelect={mockOnSelect} />);

    fireEvent.click(screen.getByText('Up to 10'));
    expect(mockOnSelect).toHaveBeenCalledWith('easy');
  });

  it('should call onSelect with medium when Up to 20 is clicked', () => {
    const mockOnSelect = jest.fn();
    render(<DifficultySelector onSelect={mockOnSelect} />);

    fireEvent.click(screen.getByText('Up to 20'));
    expect(mockOnSelect).toHaveBeenCalledWith('medium');
  });

  it('should call onSelect with hard when Up to 50 is clicked', () => {
    const mockOnSelect = jest.fn();
    render(<DifficultySelector onSelect={mockOnSelect} />);

    fireEvent.click(screen.getByText('Up to 50'));
    expect(mockOnSelect).toHaveBeenCalledWith('hard');
  });

  it('should call onSelect with expert when Up to 100 is clicked', () => {
    const mockOnSelect = jest.fn();
    render(<DifficultySelector onSelect={mockOnSelect} />);

    fireEvent.click(screen.getByText('Up to 100'));
    expect(mockOnSelect).toHaveBeenCalledWith('expert');
  });
});
