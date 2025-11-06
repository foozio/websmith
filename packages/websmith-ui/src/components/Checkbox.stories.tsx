import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Checkbox } from './Checkbox';

interface CheckboxStoryProps {
  disabled?: boolean;
  defaultChecked?: boolean;
  label: string;
}

const meta: Meta<CheckboxStoryProps> = {
  title: 'Components/Checkbox',
  args: {
    label: 'Enable notifications',
    defaultChecked: false,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<CheckboxStoryProps>;

const Template: Story = {
  render: ({ label, ...props }) => (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <Checkbox {...props} />
      <span>{label}</span>
    </label>
  ),
};

export const Default = {
  ...Template,
};

export const Checked = {
  ...Template,
  args: {
    defaultChecked: true,
  },
};

export const Disabled = {
  ...Template,
  args: {
    disabled: true,
  },
};
