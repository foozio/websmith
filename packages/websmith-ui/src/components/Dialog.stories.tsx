import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Button } from './Button';
import { 
  Dialog, 
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './Dialog';

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  subcomponents: {
    DialogPortal,
    DialogOverlay,
    DialogClose,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Dialog component is a modal window that appears on top of the main content to capture user attention or request input. Built on top of Radix UI Dialog primitive with full accessibility support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'Dialog content',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-600">
            Please confirm you want to delete your account. All associated data will be permanently removed.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => console.log('Cancel clicked')}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={() => console.log('Delete clicked')}>
            Delete Account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Basic dialog with title, description, and action buttons.',
      },
    },
  },
};

export const FormDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add New User</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
          <DialogDescription>
            Create a new user account. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="name" className="text-right">
              Name
            </label>
            <input
              id="name"
              className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="John Doe"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="username" className="text-right">
              Username
            </label>
            <input
              id="username"
              className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="@johndoe"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="email" className="text-right">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="john@example.com"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Dialog containing a form with input fields for user data entry.',
      },
    },
  },
};

export const ConfirmationDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete Project</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "My Awesome Project"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="py-6">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-medium">Warning</h4>
              <p className="text-sm text-gray-600 mt-1">
                This will permanently delete the project and all associated data including files, settings, and analytics.
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button variant="destructive">Delete Project</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Confirmation dialog with warning icon and detailed message.',
      },
    },
  },
};

export const SuccessDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Complete Task</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Task Completed!</DialogTitle>
          <DialogDescription>
            Your task has been successfully completed and saved.
          </DialogDescription>
        </DialogHeader>
        <div className="py-6">
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <div className="text-center mt-4">
            <h4 className="text-lg font-medium">Great job!</h4>
            <p className="text-sm text-gray-600 mt-1">
              The task has been marked as complete and all stakeholders have been notified.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button>View Details</Button>
          <Button>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Success dialog with checkmark icon and positive feedback.',
      },
    },
  },
};

export const ScrollableDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View Terms</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Terms of Service</DialogTitle>
          <DialogDescription>
            Please read and accept our terms of service.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 max-h-96 overflow-y-auto">
          <div className="space-y-4 text-sm">
            <section>
              <h3 className="font-medium text-lg mb-2">1. Acceptance of Terms</h3>
              <p className="text-gray-600">
                By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>
            <section>
              <h3 className="font-medium text-lg mb-2">2. Use License</h3>
              <p className="text-gray-600">
                Permission is granted to temporarily download one copy of the materials on our website for personal, non-commercial transitory viewing only.
              </p>
            </section>
            <section>
              <h3 className="font-medium text-lg mb-2">3. Disclaimer</h3>
              <p className="text-gray-600">
                The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties.
              </p>
            </section>
            <section>
              <h3 className="font-medium text-lg mb-2">4. Limitations</h3>
              <p className="text-gray-600">
                In no event shall our company or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website.
              </p>
            </section>
            <section>
              <h3 className="font-medium text-lg mb-2">5. Privacy Policy</h3>
              <p className="text-gray-600">
                Your Privacy Policy will detail how we use, share and protect your personal data. When you use our services, you understand and agree that we may collect, use and share your information as described in our Privacy Policy.
              </p>
            </section>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Decline</Button>
          <Button>Accept Terms</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Dialog with scrollable content for long documents or terms.',
      },
    },
  },
};

export const CustomSize: Story = {
  render: () => (
    <div className="space-x-4 flex">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">Small</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[300px]">
          <DialogHeader>
            <DialogTitle>Small Dialog</DialogTitle>
            <DialogDescription>
              A compact dialog for simple messages.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm">This is a smaller dialog with reduced width.</p>
          </div>
          <DialogFooter>
            <Button size="sm">OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Large</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Large Dialog</DialogTitle>
            <DialogDescription>
              A spacious dialog for complex content.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Section 1</h4>
                <p className="text-sm text-gray-600">Content for the first section goes here.</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Section 2</h4>
                <p className="text-sm text-gray-600">Content for the second section goes here.</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline">Cancel</Button>
            <Button>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Dialogs with custom sizes using max-width classes.',
      },
    },
  },
};

export const WithoutCloseButton: Story = {
  render: () => {
    const CustomDialogContent = React.forwardRef<
      React.ElementRef<typeof DialogContent>,
      React.ComponentPropsWithoutRef<typeof DialogContent>
    >(({ children, ...props }, ref) => (
      <DialogContent ref={ref} {...props}>
        {children}
      </DialogContent>
    ));
    CustomDialogContent.displayName = 'CustomDialogContent';

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Important Notice</Button>
        </DialogTrigger>
        <CustomDialogContent>
          <DialogHeader>
            <DialogTitle>System Maintenance</DialogTitle>
            <DialogDescription>
              Scheduled maintenance is required.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm">
              Our system will undergo maintenance from 2:00 AM to 4:00 AM EST. During this time, services may be temporarily unavailable.
            </p>
          </div>
          <DialogFooter>
            <Button>I Understand</Button>
          </DialogFooter>
        </CustomDialogContent>
      </Dialog>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Dialog without the close button, forcing user interaction.',
      },
    },
  },
};
