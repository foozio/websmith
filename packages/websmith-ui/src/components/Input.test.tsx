import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from './Input';
import { expect, test, describe } from 'vitest';

describe('Input', () => {
  test('renders correctly', () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('flex', 'h-10', 'w-full', 'rounded-md');
  });

  test('handles value changes', () => {
    const handleChange = vi.fn();
    render(<Input value="test" onChange={handleChange} />);
    
    const input = screen.getByDisplayValue('test');
    fireEvent.change(input, { target: { value: 'new value' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('applies variant classes correctly', () => {
    render(<Input variant="destructive" data-testid="input" />);
    const input = screen.getByTestId('input');
    expect(input).toHaveClass('border-red-500');
  });

  test('applies size classes correctly', () => {
    render(<Input size="lg" data-testid="input" />);
    const input = screen.getByTestId('input');
    expect(input).toHaveClass('h-11');
  });

  test('is disabled when disabled prop is true', () => {
    render(<Input disabled data-testid="input" />);
    const input = screen.getByTestId('input');
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute('disabled');
  });

  test('shows required attribute when required', () => {
    render(<Input required data-testid="input" />);
    const input = screen.getByTestId('input');
    expect(input).toBeRequired();
  });

  test('supports different input types', () => {
    render(<Input type="email" data-testid="input" />);
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('type', 'email');
  });

  test('applies custom className', () => {
    render(<Input className="custom-class" data-testid="input" />);
    const input = screen.getByTestId('input');
    expect(input).toHaveClass('custom-class');
  });

  test('supports ref forwarding', () => {
    const ref = { current: null };
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  test('handles focus events', () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();
    
    render(
      <Input 
        onFocus={handleFocus} 
        onBlur={handleBlur} 
        data-testid="input" 
      />
    );
    
    const input = screen.getByTestId('input');
    fireEvent.focus(input);
    fireEvent.blur(input);
    
    expect(handleFocus).toHaveBeenCalledTimes(1);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  test('supports aria attributes', () => {
    render(
      <Input 
        aria-label="Search input"
        aria-describedby="search-help"
        data-testid="input"
      />
    );
    
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('aria-label', 'Search input');
    expect(input).toHaveAttribute('aria-describedby', 'search-help');
  });
});
