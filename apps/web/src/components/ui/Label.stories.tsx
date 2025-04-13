import type { Meta, StoryObj } from '@storybook/react'
import Label from './Label'

const meta: Meta<typeof Label> = {
  component: Label,
  title: 'UI/Label',
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outline', 'ghost', 'link'],
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
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
type Story = StoryObj<typeof Label>

export const Default: Story = {
  args: {
    children: 'Form Label',
  },
}

export const Required: Story = {
  args: {
    children: 'Required Field',
    isRequired: true,
  },
}

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Label',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Label',
  },
}

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link Label',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Label',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Label',
  },
}

export const WithHtmlFor: Story = {
  args: {
    children: 'Username',
    htmlFor: 'username-input',
  },
  decorators: [
    (Story) => (
      <div className="space-y-1">
        <Story />
        <input 
          id="username-input" 
          type="text" 
          className="border border-neutral-300 rounded-md px-3 py-2" 
          placeholder="Enter username"
        />
      </div>
    ),
  ],
} 