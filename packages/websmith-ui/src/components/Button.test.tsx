import { render, screen } from '@testing-library/react';
import { Button } from './Button';
import { expect, test } from 'vitest';

test('Button renders correctly', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
