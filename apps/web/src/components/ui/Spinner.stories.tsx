import type { Meta, StoryObj } from '@storybook/react'
import Spinner from './Spinner'

const meta: Meta<typeof Spinner> = {
  component: Spinner,
  title: 'UI/Spinner',
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outline', 'ghost', 'link'],
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    thickness: {
      control: 'text',
    },
    speed: {
      control: 'text',
    },
    color: {
      control: 'text',
      description: 'Tailwind color class without the border- prefix (e.g., "primary-600")',
    },
    label: {
      control: 'text',
    },
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Spinner>

export const Default: Story = {
  args: {},
}

export const Primary: Story = {
  args: {
    variant: 'primary',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
  },
}

export const Medium: Story = {
  args: {
    size: 'md',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
  },
}

export const ExtraLarge: Story = {
  args: {
    size: 'xl',
  },
}

export const CustomColor: Story = {
  args: {
    color: 'success-500',
  },
}

export const CustomThickness: Story = {
  args: {
    thickness: '4px',
    size: 'lg',
  },
}

export const SlowSpeed: Story = {
  args: {
    speed: '2s',
    size: 'lg',
  },
}

export const FastSpeed: Story = {
  args: {
    speed: '0.4s',
    size: 'lg',
  },
}

export const WithLabel: Story = {
  args: {
    label: 'Loading...',
    size: 'md',
  },
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <Spinner size="xs" />
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
      <Spinner size="xl" />
    </div>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <Spinner variant="primary" />
      <Spinner variant="secondary" />
      <Spinner variant="outline" />
      <Spinner variant="ghost" />
      <Spinner variant="link" />
    </div>
  ),
}

export const LoadingButton: Story = {
  render: () => (
    <button className="bg-primary-600 text-white rounded-md px-4 py-2 flex items-center">
      <Spinner size="sm" className="mr-2 border-white" />
      Loading...
    </button>
  ),
} 