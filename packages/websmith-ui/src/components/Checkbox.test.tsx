import { fireEvent, render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { Checkbox } from './Checkbox';

test('renders a checkbox that toggles checked state on click', () => {
  render(<Checkbox aria-label="Enable notifications" />);

  const checkbox = screen.getByRole('checkbox');
  expect(checkbox).toHaveAttribute('data-state', 'unchecked');

  fireEvent.click(checkbox);
  expect(checkbox).toHaveAttribute('data-state', 'checked');

  fireEvent.click(checkbox);
  expect(checkbox).toHaveAttribute('data-state', 'unchecked');
});
