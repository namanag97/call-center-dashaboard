import type { Meta, StoryObj } from '@storybook/react'
import Icon from './Icon'

const meta: Meta<typeof Icon> = {
  component: Icon,
  title: 'UI/Icon',
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outline', 'ghost', 'link'],
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    color: {
      control: { type: 'text' },
      description: 'Tailwind color class without the text- prefix (e.g., "primary-600")',
    },
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Icon>

// Helper function to create SVG icons
const createIcon = (label: string) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={label === 'Search' 
      ? "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
      : label === 'Home'
      ? "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      : label === 'Star'
      ? "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      : "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"} />
  </svg>
)

export const Default: Story = {
  args: {
    children: createIcon('Bell'),
  },
}

export const Search: Story = {
  args: {
    children: createIcon('Search'),
  },
}

export const Home: Story = {
  args: {
    children: createIcon('Home'),
  },
}

export const Star: Story = {
  args: {
    children: createIcon('Star'),
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    children: createIcon('Search'),
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    children: createIcon('Search'),
  },
}

export const ExtraLarge: Story = {
  args: {
    size: 'xl',
    children: createIcon('Search'),
  },
}

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: createIcon('Bell'),
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: createIcon('Bell'),
  },
}

export const CustomColor: Story = {
  args: {
    color: 'primary-600',
    children: createIcon('Bell'),
  },
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end space-x-4">
      <Icon size="xs">{createIcon('Bell')}</Icon>
      <Icon size="sm">{createIcon('Bell')}</Icon>
      <Icon size="md">{createIcon('Bell')}</Icon>
      <Icon size="lg">{createIcon('Bell')}</Icon>
      <Icon size="xl">{createIcon('Bell')}</Icon>
    </div>
  ),
} 