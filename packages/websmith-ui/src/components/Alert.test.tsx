import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { Alert, AlertDescription, AlertTitle } from './Alert';

test('renders default alert with accessible content', () => {
  render(
    <Alert>
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>Pay attention to this update.</AlertDescription>
    </Alert>
  );

  const alert = screen.getByRole('alert');
  expect(alert).toHaveTextContent('Heads up');
  expect(alert).toHaveTextContent('Pay attention to this update.');
  expect(alert).toHaveClass('bg-background');
});

test('applies destructive variant styling', () => {
  render(
    <Alert variant="destructive">
      <AlertDescription>Failure incoming.</AlertDescription>
    </Alert>
  );

  const alert = screen.getByRole('alert');
  expect(alert).toHaveClass('text-destructive');
});
