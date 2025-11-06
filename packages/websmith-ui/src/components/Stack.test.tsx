import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { Stack } from './Stack';

test('renders column stack with default gap', () => {
  render(
    <Stack data-testid="stack">
      <span>One</span>
      <span>Two</span>
    </Stack>
  );

  const stack = screen.getByTestId('stack');
  expect(stack).toHaveClass('flex-col');
  expect(stack.className).toContain('gap-4');
});

test('supports custom direction and gap', () => {
  render(
    <Stack data-testid="stack" direction="row" gap={8}>
      <span>One</span>
      <span>Two</span>
    </Stack>
  );

  const stack = screen.getByTestId('stack');
  expect(stack).toHaveClass('flex-row');
  expect(stack.className).toContain('gap-8');
});
