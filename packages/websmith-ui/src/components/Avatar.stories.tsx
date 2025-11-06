import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, AvatarImage, AvatarFallback } from './Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  subcomponents: { AvatarImage, AvatarFallback },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Avatar component displays user profile images or fallback initials when no image is available. Built on top of Radix UI Avatar primitive.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes for styling',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Default avatar with image and fallback text.',
      },
    },
  },
};

export const FallbackOnly: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Avatar showing only fallback text when no image is provided.',
      },
    },
  },
};

export const LongFallback: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>John Doe</AvatarFallback>
    </Avatar>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Avatar with long fallback text that gets truncated.',
      },
    },
  },
};

export const CustomSize: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <Avatar className="h-8 w-8">
        <AvatarImage src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar className="h-12 w-12">
        <AvatarImage src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar className="h-16 w-16">
        <AvatarImage src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Avatars with different sizes using custom classes.',
      },
    },
  },
};

export const LoadingState: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <Avatar>
        <AvatarImage src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80" alt="@shadcn" />
        <AvatarFallback className="animate-pulse">CN</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback className="animate-pulse bg-gray-200" />
      </Avatar>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Avatar components in loading states with pulse animation.',
      },
    },
  },
};

export const WithBorder: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <Avatar className="border-2 border-white shadow-lg">
        <AvatarImage src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-primary">
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Avatars with custom borders and shadows.',
      },
    },
  },
};

export const AvatarGroup: Story = {
  render: () => (
    <div className="flex -space-x-2">
      <Avatar className="border-2 border-white">
        <AvatarImage src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-white">
        <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?&w=128&h=128&dpr=2&q=80" alt="@johndoe" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-white">
        <AvatarImage src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?&w=128&h=128&dpr=2&q=80" alt="@jane" />
        <AvatarFallback>JA</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-white bg-gray-100">
        <AvatarFallback className="text-sm">+3</AvatarFallback>
      </Avatar>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Group of overlapping avatars commonly used for showing multiple users.',
      },
    },
  },
};

export const Accessibility: Story = {
  render: () => (
    <div className="space-y-4">
      <Avatar>
        <AvatarImage 
          src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80" 
          alt="Profile picture of Sarah Chen" 
        />
        <AvatarFallback>SC</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback aria-label="User profile, initials JD">JD</AvatarFallback>
      </Avatar>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Avatars with proper accessibility labels and ARIA attributes.',
      },
    },
  },
};
