import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import Tooltip from './Tooltip'
import Button from './Button'
import Icon from './Icon'

const meta: Meta<typeof Tooltip> = {
  component: Tooltip,
  title: 'UI/Tooltip',
  argTypes: {
    placement: {
      control: { type: 'select' },
      options: ['top', 'bottom', 'left', 'right'],
    },
    delay: {
      control: { type: 'number' },
    },
    offset: {
      control: { type: 'number' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Tooltip>

export const Default: Story = {
  args: {
    content: 'This is a tooltip',
    children: (
      <Button>Hover me</Button>
    ),
  },
}

export const PlacementTop: Story = {
  args: {
    content: 'Tooltip on top',
    placement: 'top',
    children: (
      <Button variant="outline">Top Tooltip</Button>
    ),
  },
}

export const PlacementBottom: Story = {
  args: {
    content: 'Tooltip on bottom',
    placement: 'bottom',
    children: (
      <Button variant="outline">Bottom Tooltip</Button>
    ),
  },
}

export const PlacementLeft: Story = {
  args: {
    content: 'Tooltip on left',
    placement: 'left',
    children: (
      <Button variant="outline">Left Tooltip</Button>
    ),
  },
}

export const PlacementRight: Story = {
  args: {
    content: 'Tooltip on right',
    placement: 'right',
    children: (
      <Button variant="outline">Right Tooltip</Button>
    ),
  },
}

export const WithIcon: Story = {
  args: {
    content: 'Information about this feature',
    children: (
      <div className="text-info-500 cursor-help">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      </div>
    ),
  },
}

export const ComplexContent: Story = {
  args: {
    content: (
      <div className="text-center">
        <div className="font-bold mb-1">Product Detail</div>
        <div className="mb-2 text-xs">Click to see more information</div>
        <div className="text-xs text-neutral-300">ID: 12345678</div>
      </div>
    ),
    children: (
      <Button>Product Info</Button>
    ),
  },
}

export const CustomDelay: Story = {
  args: {
    content: 'This tooltip appears with almost no delay',
    delay: 50,
    children: (
      <Button variant="ghost">Quick Tooltip</Button>
    ),
  },
}

export const CustomOffset: Story = {
  args: {
    content: 'This tooltip has a larger offset from its trigger',
    offset: 16,
    children: (
      <Button variant="link">Distant Tooltip</Button>
    ),
  },
}

export const Disabled: Story = {
  args: {
    content: 'You should not see this tooltip',
    disabled: true,
    children: (
      <Button variant="outline" disabled>Disabled Tooltip</Button>
    ),
  },
}

export const AllPlacements: Story = {
  render: () => (
    <div className="flex flex-col items-center justify-center space-y-20 p-20">
      <Tooltip content="Top tooltip" placement="top">
        <Button>Top</Button>
      </Tooltip>
      
      <div className="flex space-x-20">
        <Tooltip content="Left tooltip" placement="left">
          <Button>Left</Button>
        </Tooltip>
        
        <Tooltip content="Right tooltip" placement="right">
          <Button>Right</Button>
        </Tooltip>
      </div>
      
      <Tooltip content="Bottom tooltip" placement="bottom">
        <Button>Bottom</Button>
      </Tooltip>
    </div>
  ),
}

export const CustomStyling: Story = {
  args: {
    content: 'Custom styled tooltip',
    tooltipClassName: 'bg-primary-600 text-white font-medium',
    arrowClassName: 'bg-primary-600',
    children: (
      <Button variant="primary">Custom Style</Button>
    ),
  },
} 