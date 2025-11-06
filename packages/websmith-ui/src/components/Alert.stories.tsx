import type { Meta, StoryObj } from '@storybook/react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  type VariantProps,
} from './Alert';

interface AlertStoryProps extends VariantProps<typeof Alert> {
  title: string;
  description: string;
}

const meta: Meta<AlertStoryProps> = {
  title: 'Components/Alert',
  args: {
    variant: 'default',
    title: 'Heads up!',
    description: 'Something just happened that you may want to know about.',
  },
};

export default meta;
type Story = StoryObj<AlertStoryProps>;

const Template: Story = {
  render: ({ title, description, ...props }) => (
    <Alert {...props}>
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  ),
};

export const Default = {
  ...Template,
};

export const Destructive = {
  ...Template,
  args: {
    variant: 'destructive',
    title: 'Something went wrong',
    description: 'Please try again in a few moments.',
  },
};
