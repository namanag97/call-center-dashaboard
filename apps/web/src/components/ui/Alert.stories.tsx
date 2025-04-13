import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import Alert from './Alert'

const meta: Meta<typeof Alert> = {
  component: Alert,
  title: 'UI/Alert',
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outline', 'ghost', 'link'],
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    status: {
      control: { type: 'select' },
      options: ['default', 'success', 'error', 'warning', 'info'],
    },
    title: {
      control: 'text',
    },
    isClosable: {
      control: 'boolean',
    },
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Alert>

export const Default: Story = {
  args: {
    children: 'This is a standard alert with neutral styling.',
  },
}

export const Success: Story = {
  args: {
    status: 'success',
    title: 'Success!',
    children: 'Operation completed successfully.',
  },
}

export const Error: Story = {
  args: {
    status: 'error',
    title: 'Error!',
    children: 'There was an error processing your request.',
  },
}

export const Warning: Story = {
  args: {
    status: 'warning',
    title: 'Warning',
    children: 'Please review your information before continuing.',
  },
}

export const Info: Story = {
  args: {
    status: 'info',
    title: 'Information',
    children: 'This is some helpful information about using this feature.',
  },
}

export const WithoutIcon: Story = {
  args: {
    status: 'info',
    icon: null,
    children: 'This alert has no icon.',
  },
}

export const WithCustomIcon: Story = {
  args: {
    status: 'default',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
      </svg>
    ),
    title: 'Security Alert',
    children: 'Your password will expire in 3 days.',
  },
}

export const Closable: Story = {
  render: () => {
    const [isVisible, setIsVisible] = useState(true);
    
    if (!isVisible) {
      return <div className="text-neutral-500">Alert was closed</div>;
    }
    
    return (
      <Alert
        status="info"
        title="Closable Alert"
        isClosable={true}
        onClose={() => setIsVisible(false)}
      >
        This alert can be closed by clicking the X button.
      </Alert>
    );
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    status: 'info',
    children: 'This is a smaller alert.',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    status: 'success',
    title: 'Large Alert',
    children: 'This is a larger alert with a title.',
  },
}

export const AllStatuses: Story = {
  render: () => (
    <div className="space-y-4 w-96">
      <Alert status="default">Default alert style</Alert>
      <Alert status="info">Informational alert</Alert>
      <Alert status="success">Success alert</Alert>
      <Alert status="warning">Warning alert</Alert>
      <Alert status="error">Error alert</Alert>
    </div>
  ),
} 