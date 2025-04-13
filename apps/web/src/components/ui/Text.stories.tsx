import type { Meta, StoryObj } from '@storybook/react'
import Text from './Text'

const meta: Meta<typeof Text> = {
  component: Text,
  title: 'UI/Text',
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outline', 'ghost', 'link'],
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    as: {
      control: { type: 'select' },
      options: ['p', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    },
    weight: {
      control: { type: 'select' },
      options: ['normal', 'medium', 'semibold', 'bold'],
    },
    truncate: {
      control: { type: 'boolean' },
    },
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Text>

export const Default: Story = {
  args: {
    children: 'This is a text component',
  },
}

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary text style',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary text style',
  },
}

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link text style',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small text size',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large text size',
  },
}

export const Bold: Story = {
  args: {
    weight: 'bold',
    children: 'Bold text weight',
  },
}

export const Heading1: Story = {
  args: {
    as: 'h1',
    size: 'xl',
    weight: 'bold',
    children: 'Heading 1',
  },
}

export const Heading2: Story = {
  args: {
    as: 'h2',
    size: 'lg',
    weight: 'semibold',
    children: 'Heading 2',
  },
}

export const Truncated: Story = {
  args: {
    truncate: true,
    children: 'This is a very long text that should be truncated when it exceeds the available width of its container. You should see an ellipsis at the end.',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
}

export const AllTypographyVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <Text as="h1" size="xl" weight="bold">Heading 1 (xl + bold)</Text>
      <Text as="h2" size="lg" weight="semibold">Heading 2 (lg + semibold)</Text>
      <Text as="h3" size="md" weight="semibold">Heading 3 (md + semibold)</Text>
      <Text as="h4" size="sm" weight="medium">Heading 4 (sm + medium)</Text>
      <Text>Regular paragraph text with normal weight</Text>
      <Text size="sm">Small paragraph text</Text>
      <Text variant="secondary">Secondary text style</Text>
      <Text variant="ghost">Ghost text style (de-emphasized)</Text>
      <Text variant="link">Link text style</Text>
    </div>
  ),
} 