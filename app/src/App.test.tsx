import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders math problem', () => {
  render(<App />);
  
  // Check if the math problem is rendered
  expect(screen.getByText('12')).toBeInTheDocument();
  expect(screen.getByText('24')).toBeInTheDocument();
  expect(screen.getByText('+')).toBeInTheDocument();
  expect(screen.getByText('?')).toBeInTheDocument();
});
