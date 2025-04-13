import type { Meta, StoryObj } from '@storybook/react'
import Badge from './Badge'

const meta: Meta<typeof Badge> = {
  component: Badge,
  title: 'UI/Badge',
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral'],
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg'],
    },
    rounded: {
      control: { type: 'boolean' },
    },
    outlined: {
      control: { type: 'boolean' },
    },
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = {
  args: {
    children: 'Badge',
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-2">
      <Badge size="xs">Extra Small</Badge>
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="primary">Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="neutral">Neutral</Badge>
    </div>
  ),
}

export const Outlined: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="primary" outlined>Primary</Badge>
      <Badge variant="secondary" outlined>Secondary</Badge>
      <Badge variant="success" outlined>Success</Badge>
      <Badge variant="warning" outlined>Warning</Badge>
      <Badge variant="error" outlined>Error</Badge>
      <Badge variant="info" outlined>Info</Badge>
      <Badge variant="neutral" outlined>Neutral</Badge>
    </div>
  ),
}

export const Rounded: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="primary" rounded>Primary</Badge>
      <Badge variant="secondary" rounded>Secondary</Badge>
      <Badge variant="success" rounded>Success</Badge>
      <Badge variant="warning" rounded>Warning</Badge>
      <Badge variant="error" rounded>Error</Badge>
      <Badge variant="info" rounded>Info</Badge>
      <Badge variant="neutral" rounded>Neutral</Badge>
    </div>
  ),
}

export const OutlinedRounded: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="primary" outlined rounded>Primary</Badge>
      <Badge variant="secondary" outlined rounded>Secondary</Badge>
      <Badge variant="success" outlined rounded>Success</Badge>
      <Badge variant="warning" outlined rounded>Warning</Badge>
      <Badge variant="error" outlined rounded>Error</Badge>
      <Badge variant="info" outlined rounded>Info</Badge>
      <Badge variant="neutral" outlined rounded>Neutral</Badge>
    </div>
  ),
}

export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="success">
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Completed
      </Badge>
      <Badge variant="warning">
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        Warning
      </Badge>
      <Badge variant="info" rounded>
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        Info
      </Badge>
    </div>
  ),
}

export const InText: Story = {
  render: () => (
    <p className="max-w-md text-neutral-700">
      This is a paragraph that includes a <Badge variant="primary" size="sm">new</Badge> badge
      to highlight important information. You can also use <Badge variant="error" size="sm">warning</Badge> badges
      to draw attention to critical details or <Badge variant="success" size="sm" rounded>completed</Badge> to show status.
    </p>
  ),
}

export const CustomStyling: Story = {
  args: {
    children: 'Custom',
    className: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none',
  },
} 