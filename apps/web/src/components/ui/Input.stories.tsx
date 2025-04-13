import type { Meta, StoryObj } from '@storybook/react'
import Input from './Input'

const meta: Meta<typeof Input> = {
  component: Input,
  title: 'UI/Input',
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
    disabled: {
      control: { type: 'boolean' },
    },
    isRequired: {
      control: { type: 'boolean' },
    },
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: {
    placeholder: 'Enter text here',
  },
}

export const WithLabel: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'name@example.com',
  },
}

export const WithHelperText: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter username',
    helperText: 'Username must be at least 4 characters',
  },
}

export const WithError: Story = {
  args: {
    label: 'Password',
    type: 'password',
    status: 'error',
    error: 'Password is too weak',
  },
}

export const WithSuccess: Story = {
  args: {
    label: 'Email',
    value: 'valid@example.com',
    status: 'success',
    helperText: 'Email is valid',
  },
}

export const Required: Story = {
  args: {
    label: 'Required Field',
    placeholder: 'This field is required',
    isRequired: true,
  },
}

export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    value: 'You cannot edit this',
    disabled: true,
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    placeholder: 'Small input',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    placeholder: 'Large input',
  },
}

export const WithLeftIcon: Story = {
  args: {
    label: 'Search',
    placeholder: 'Search...',
    leftElement: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
}

export const WithRightIcon: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter password',
    rightElement: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  },
} 