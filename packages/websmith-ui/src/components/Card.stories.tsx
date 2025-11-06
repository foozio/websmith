import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  subcomponents: {
    CardHeader,
    CardFooter,
    CardTitle,
    CardDescription,
    CardContent,
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Card component is a flexible content container with header, body, and footer sections. Perfect for displaying related information in a structured layout.',
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
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content goes here. This is the main body of the card where you can display any information you want.</p>
      </CardContent>
      <CardFooter>
        <p>Card footer content</p>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Basic card with all sections: header, content, and footer.',
      },
    },
  },
};

export const OnlyContent: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardContent className="pt-6">
        <p>This card contains only content without header or footer sections.</p>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Card with only content section.',
      },
    },
  },
};

export const HeaderOnly: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Simple Header</CardTitle>
        <CardDescription>Just a title and description</CardDescription>
      </CardHeader>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Card with only header section.',
      },
    },
  },
};

export const WithActions: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create Project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Choose a template and get started with your next project.</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200">
          Cancel
        </button>
        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
          Deploy
        </button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Card with action buttons in the footer.',
      },
    },
  },
};

export const UserProfile: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader className="flex flex-row items-center space-y-0 pb-4">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-lg font-medium">JD</span>
        </div>
        <div className="ml-4 space-y-1">
          <CardTitle>John Doe</CardTitle>
          <CardDescription>@johndoe</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm">Frontend developer passionate about React and TypeScript.</p>
          <div className="flex space-x-4 text-sm text-gray-600">
            <span><strong>42</strong> Following</span>
            <span><strong>128</strong> Followers</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <button className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
          Follow
        </button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'User profile card with avatar, stats, and follow button.',
      },
    },
  },
};

export const PricingCard: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl">Pro Plan</CardTitle>
        <CardDescription className="text-lg">Perfect for growing teams</CardDescription>
        <div className="mt-4">
          <span className="text-4xl font-bold">$29</span>
          <span className="text-gray-600">/month</span>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          <li className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Unlimited projects
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Priority support
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Advanced analytics
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Custom themes
          </li>
        </ul>
      </CardContent>
      <CardFooter>
        <button className="w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
          Get Started
        </button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Pricing card with features list and call-to-action.',
      },
    },
  },
};

export const DashboardStats: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <span className="text-green-600 text-sm">+12.5%</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$45,231.89</div>
          <p className="text-xs text-gray-600">+20.1% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          <span className="text-blue-600 text-sm">+8.2%</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2,350</div>
          <p className="text-xs text-gray-600">+180 from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          <span className="text-red-600 text-sm">-2.1%</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">3.2%</div>
          <p className="text-xs text-gray-600">-0.1% from last month</p>
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Dashboard statistics cards showing metrics and trends.',
      },
    },
  },
};

export const CustomStyles: Story = {
  render: () => (
    <div className="space-y-4">
      <Card className="w-[350px] border-2 border-blue-500 shadow-lg">
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-blue-900">Featured Card</CardTitle>
          <CardDescription className="text-blue-700">This card has custom styling</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Custom border color, shadow, and header background.</p>
        </CardContent>
      </Card>
      
      <Card className="w-[350px] bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
        <CardHeader>
          <CardTitle className="text-white">Gradient Card</CardTitle>
          <CardDescription className="text-purple-100">Beautiful gradient background</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-white">This card uses a gradient background with custom text colors.</p>
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Cards with custom styling including borders, shadows, and gradients.',
      },
    },
  },
};

export const LoadingState: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="h-10 bg-gray-200 rounded animate-pulse w-full"></div>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Card in loading state with skeleton placeholders.',
      },
    },
  },
};
