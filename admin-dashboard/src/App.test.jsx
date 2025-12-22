import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import App from './App';

test('App renders without crashing', () => {
  render(<App />);
  expect(screen.getByText(/Loading.../i)).toBeDefined(); 
});
