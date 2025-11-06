import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Avatar, AvatarImage, AvatarFallback } from './Avatar';
import { expect, test, describe } from 'vitest';

describe('Avatar Components', () => {
  test('renders Avatar with image and fallback', () => {
    render(
      <Avatar>
        <AvatarImage src="https://example.com/avatar.jpg" alt="User avatar" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    );

    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    expect(image).toHaveAttribute('alt', 'User avatar');
  });

  test('renders fallback when image fails to load', () => {
    render(
      <Avatar>
        <AvatarImage src="invalid-url.jpg" alt="User avatar" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    );

    const fallback = screen.getByText('JD');
    expect(fallback).toBeInTheDocument();
  });

  test('renders only fallback when no image provided', () => {
    render(
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
    );

    const fallback = screen.getByText('AB');
    expect(fallback).toBeInTheDocument();
  });

  test('Avatar applies correct CSS classes', () => {
    render(<Avatar data-testid="avatar">Fallback</Avatar>);
    const avatar = screen.getByTestId('avatar');
    expect(avatar).toHaveClass('relative', 'flex', 'h-10', 'w-10', 'shrink-0', 'overflow-hidden', 'rounded-full');
  });

  test('AvatarImage applies correct CSS classes', () => {
    render(
      <Avatar>
        <AvatarImage src="test.jpg" data-testid="image" />
      </Avatar>
    );
    const image = screen.getByTestId('image');
    expect(image).toHaveClass('aspect-square', 'h-full', 'w-full');
  });

  test('AvatarFallback applies correct CSS classes', () => {
    render(
      <Avatar>
        <AvatarFallback data-testid="fallback">TF</AvatarFallback>
      </Avatar>
    );
    const fallback = screen.getByTestId('fallback');
    expect(fallback).toHaveClass('flex', 'h-full', 'w-full', 'items-center', 'justify-center', 'rounded-full', 'bg-muted');
  });

  test('Avatar supports custom className', () => {
    render(<Avatar className="custom-class" data-testid="avatar">Fallback</Avatar>);
    const avatar = screen.getByTestId('avatar');
    expect(avatar).toHaveClass('custom-class');
  });

  test('Avatar supports different sizes', () => {
    render(<Avatar className="h-12 w-12" data-testid="avatar">Fallback</Avatar>);
    const avatar = screen.getByTestId('avatar');
    expect(avatar).toHaveClass('h-12', 'w-12');
  });

  test('AvatarImage handles onError correctly', () => {
    render(
      <Avatar>
        <AvatarImage 
          src="invalid.jpg" 
          onError={(e) => e.currentTarget.style.display = 'none'}
          data-testid="image"
        />
        <AvatarFallback data-testid="fallback">EF</AvatarFallback>
      </Avatar>
    );

    const image = screen.getByTestId('image');
    const fallback = screen.getByTestId('fallback');
    
    // Simulate error
    fireEvent.error(image);
    
    expect(image).toHaveStyle('display: none');
  });

  test('Avatar components support ref forwarding', () => {
    const ref = { current: null };
    render(<Avatar ref={ref}>Fallback</Avatar>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  test('AvatarImage supports ref forwarding', () => {
    const ref = { current: null };
    render(
      <Avatar>
        <AvatarImage ref={ref} src="test.jpg" />
      </Avatar>
    );
    expect(ref.current).toBeInstanceOf(HTMLImageElement);
  });

  test('AvatarFallback supports ref forwarding', () => {
    const ref = { current: null };
    render(
      <Avatar>
        <AvatarFallback ref={ref}>FB</AvatarFallback>
      </Avatar>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
