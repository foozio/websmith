import type { Meta, StoryObj } from '@storybook/react';
import { Badge, badgeVariants } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Badge component is a small status descriptor for UI elements. Built with class-variance-authority for consistent styling and multiple variants.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'Badge content',
    },
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
      description: 'Visual style variant',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for styling',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: 'Default',
    variant: 'default',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default badge with primary color scheme.',
      },
    },
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary',
    variant: 'secondary',
  },
  parameters: {
    docs: {
      description: {
        story: 'Secondary badge with muted color scheme.',
      },
    },
  },
};

export const Destructive: Story = {
  args: {
    children: 'Error',
    variant: 'destructive',
  },
  parameters: {
    docs: {
      description: {
        story: 'Destructive badge with error color scheme for alerts or warnings.',
      },
    },
  },
};

export const Outline: Story = {
  args: {
    children: 'Outline',
    variant: 'outline',
  },
  parameters: {
    docs: {
      description: {
        story: 'Outline badge with border and no background fill.',
      },
    },
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All badge variants displayed together for comparison.',
      },
    },
  },
};

export const StatusBadges: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Badge className="bg-green-500 text-white">Active</Badge>
        <Badge className="bg-yellow-500 text-white">Pending</Badge>
        <Badge className="bg-red-500 text-white">Inactive</Badge>
        <Badge className="bg-blue-500 text-white">New</Badge>
      </div>
      <div className="flex items-center space-x-4">
        <Badge className="bg-purple-500 text-white">Premium</Badge>
        <Badge className="bg-gray-500 text-white">Basic</Badge>
        <Badge className="bg-indigo-500 text-white">Enterprise</Badge>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Status badges with custom colors for different states and tiers.',
      },
    },
  },
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <Badge className="flex items-center space-x-1">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span>Verified</span>
      </Badge>
      <Badge variant="destructive" className="flex items-center space-x-1">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
        <span>Error</span>
      </Badge>
      <Badge variant="secondary" className="flex items-center space-x-1">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <span>Info</span>
      </Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Badges with inline icons for enhanced visual communication.',
      },
    },
  },
};

export const InteractiveBadges: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <Badge 
        className="cursor-pointer hover:bg-primary/90 transition-colors"
        onClick={() => console.log('Badge clicked!')}
      >
        Clickable
      </Badge>
      <Badge 
        variant="outline"
        className="cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={() => console.log('Filter applied!')}
      >
        Filter
      </Badge>
      <Badge 
        className="cursor-pointer hover:bg-red-600 transition-colors"
        onClick={() => console.log('Tag removed!')}
      >
        Tag ×
      </Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Interactive badges with hover states and click handlers.',
      },
    },
  },
};

export const NotificationBadges: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <Badge className="absolute -top-1 -right-1 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500">
            3
          </Badge>
        </div>
        
        <div className="relative">
          <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </button>
          <Badge className="absolute -top-1 -right-1 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs bg-blue-500">
            12
          </Badge>
        </div>
        
        <div className="relative">
          <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
          <Badge className="absolute -top-1 -right-1 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs bg-green-500">
            5
          </Badge>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Badges used as notification indicators on buttons and icons.',
      },
    },
  },
};

export const CustomSizes: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Badge className="text-xs px-2 py-0.5">Extra Small</Badge>
        <Badge>Small</Badge>
        <Badge className="text-sm px-3 py-1">Medium</Badge>
        <Badge className="text-base px-4 py-1.5">Large</Badge>
      </div>
      <div className="flex items-center space-x-4">
        <Badge className="w-8 h-8 rounded-full p-0 flex items-center justify-center">A</Badge>
        <Badge className="w-10 h-10 rounded-full p-0 flex items-center justify-center text-sm">JD</Badge>
        <Badge className="w-12 h-12 rounded-full p-0 flex items-center justify-center text-base">99</Badge>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Badges with custom sizes using utility classes.',
      },
    },
  },
};

export const TagList: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline">React</Badge>
        <Badge variant="outline">TypeScript</Badge>
        <Badge variant="outline">Tailwind CSS</Badge>
        <Badge variant="outline">Storybook</Badge>
        <Badge variant="outline">Vite</Badge>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">Frontend</Badge>
        <Badge className="bg-green-100 text-green-800 border-green-200">Backend</Badge>
        <Badge className="bg-purple-100 text-purple-800 border-purple-200">Full Stack</Badge>
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">DevOps</Badge>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Badges used as tags in a list format with custom colors.',
      },
    },
  },
};
