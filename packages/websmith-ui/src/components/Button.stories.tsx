import type { Meta, StoryObj } from '@storybook/react';
import { Button, type ButtonProps } from './Button';

const meta: Meta<ButtonProps> = {
  title: 'Components/Button',
  component: Button,
  args: {
    children: 'Click me',
    variant: 'default',
    size: 'default',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<ButtonProps>;

export const Default: Story = {};
export const Outline: Story = {
  args: {
    variant: 'outline',
  },
};
export const Ghost: Story = {
  args: {
    variant: 'ghost',
  },
};
