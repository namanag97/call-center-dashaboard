import React, { useState, useEffect } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import ProgressBar from './ProgressBar'

const meta: Meta<typeof ProgressBar> = {
  component: ProgressBar,
  title: 'UI/ProgressBar',
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'warning', 'error', 'info'],
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg'],
    },
    value: {
      control: { type: 'number', min: 0, max: 100 },
    },
    max: {
      control: { type: 'number', min: 1 },
    },
    showValue: {
      control: { type: 'boolean' },
    },
    label: {
      control: 'text',
    },
  },
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ProgressBar>

export const Default: Story = {
  args: {
    value: 45,
    max: 100,
  },
}

export const WithLabelAndValue: Story = {
  args: {
    value: 65,
    label: 'Upload progress',
    showValue: true,
  },
}

export const Variants: Story = {
  render: () => (
    <div className="space-y-4">
      <ProgressBar value={45} variant="primary" label="Primary" showValue />
      <ProgressBar value={55} variant="secondary" label="Secondary" showValue />
      <ProgressBar value={65} variant="success" label="Success" showValue />
      <ProgressBar value={75} variant="warning" label="Warning" showValue />
      <ProgressBar value={85} variant="error" label="Error" showValue />
      <ProgressBar value={95} variant="info" label="Info" showValue />
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <ProgressBar value={70} size="xs" label="Extra Small" />
      <ProgressBar value={70} size="sm" label="Small" />
      <ProgressBar value={70} size="md" label="Medium" />
      <ProgressBar value={70} size="lg" label="Large" />
    </div>
  ),
}

export const CustomValueFormat: Story = {
  args: {
    value: 42.5,
    max: 100,
    showValue: true,
    label: 'Custom format',
    valueFormat: (value, max) => `${value.toFixed(1)}/${max} MB`,
  },
}

export const Indeterminate: Story = {
  args: {
    label: 'Loading...',
  },
}

export const MilestoneProgressBar: Story = {
  render: () => {
    const milestones = [
      { value: 0, label: 'Start' },
      { value: 25, label: 'Step 1' },
      { value: 50, label: 'Step 2' },
      { value: 75, label: 'Step 3' },
      { value: 100, label: 'Complete' }
    ]
    
    return (
      <div className="space-y-1">
        <ProgressBar 
          value={50} 
          variant="primary" 
          size="md" 
          className="mb-2"
        />
        <div className="flex justify-between">
          {milestones.map((milestone) => (
            <div key={milestone.value} className="flex flex-col items-center">
              <div 
                className={`w-3 h-3 rounded-full mb-1 ${
                  milestone.value <= 50 
                    ? 'bg-primary-600' 
                    : 'bg-neutral-300'
                }`}
              />
              <span className="text-xs text-neutral-500">
                {milestone.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export const AnimatedProgress: Story = {
  render: function AnimatedExample() {
    const [progress, setProgress] = useState(0)
    
    useEffect(() => {
      const timer = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(timer)
            return 100
          }
          return prevProgress + 5
        })
      }, 500)
      
      return () => {
        clearInterval(timer)
      }
    }, [])
    
    return (
      <div className="space-y-2">
        <ProgressBar 
          value={progress} 
          variant="success" 
          showValue 
          label="Downloading file..." 
        />
        <div className="text-sm text-neutral-500">
          {progress < 100 
            ? `Downloading... ${progress}% complete` 
            : 'Download complete!'}
        </div>
      </div>
    )
  }
}

export const MultipleProgress: Story = {
  render: () => (
    <div className="space-y-3 max-w-md">
      <div>
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-neutral-700">Files</span>
          <span className="text-sm font-medium text-neutral-700">3/8</span>
        </div>
        <ProgressBar value={37.5} variant="primary" size="sm" />
      </div>
      
      <div>
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-neutral-700">Images</span>
          <span className="text-sm font-medium text-neutral-700">12/24</span>
        </div>
        <ProgressBar value={50} variant="info" size="sm" />
      </div>
      
      <div>
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-neutral-700">Videos</span>
          <span className="text-sm font-medium text-neutral-700">2/2</span>
        </div>
        <ProgressBar value={100} variant="success" size="sm" />
      </div>
    </div>
  )
} 