import type { Meta, StoryObj } from '@storybook/react';
import { Stack, type StackProps } from './Stack';

const meta: Meta<StackProps> = {
  title: 'Components/Stack',
  component: Stack,
  args: {
    gap: 4,
    direction: 'col',
  },
  render: props => (
    <Stack {...props}>
      <div className="rounded-md bg-blue-100 p-4 text-sm text-blue-700">
        Item A
      </div>
      <div className="rounded-md bg-blue-100 p-4 text-sm text-blue-700">
        Item B
      </div>
      <div className="rounded-md bg-blue-100 p-4 text-sm text-blue-700">
        Item C
      </div>
    </Stack>
  ),
};

export default meta;
type Story = StoryObj<StackProps>;

export const Column: Story = {};

export const Row: Story = {
  args: {
    direction: 'row',
  },
};

export const LargeGap: Story = {
  args: {
    gap: 12,
  },
};
