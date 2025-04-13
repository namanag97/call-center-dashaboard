import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import Checkbox from './Checkbox'

const meta: Meta<typeof Checkbox> = {
  component: Checkbox,
  title: 'UI/Checkbox',
  argTypes: {
    label: { control: 'text' },
    description: { control: 'text' },
    error: { control: 'text' },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary'],
    },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Checkbox>

// Add console log in stories to show events
const logCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log('Checkbox changed:', e.target.checked)
}

export const Default: Story = {
  args: {
    label: 'Accept terms and conditions',
    onChange: logCheck,
  },
  render: (args) => {
    // Using render function to get onChange to work with the console log
    return <Checkbox {...args} onChange={logCheck} />
  }
}

export const WithDescription: Story = {
  args: {
    label: 'Subscribe to newsletter',
    description: 'Receive updates about our products and promotions',
    onChange: logCheck,
  },
  render: (args) => <Checkbox {...args} onChange={logCheck} />
}

export const WithError: Story = {
  args: {
    label: 'I agree to the terms',
    error: 'You must accept the terms to continue',
    onChange: logCheck,
  },
  render: (args) => <Checkbox {...args} onChange={logCheck} />
}

export const Required: Story = {
  args: {
    label: 'Required checkbox',
    required: true,
    onChange: logCheck,
  },
  render: (args) => <Checkbox {...args} onChange={logCheck} />
}

export const Disabled: Story = {
  args: {
    label: 'Disabled checkbox',
    disabled: true,
    onChange: logCheck,
  },
  render: (args) => <Checkbox {...args} onChange={logCheck} />
}

export const SmallSize: Story = {
  args: {
    label: 'Small checkbox',
    size: 'sm',
    onChange: logCheck,
  },
  render: (args) => <Checkbox {...args} onChange={logCheck} />
}

export const LargeSize: Story = {
  args: {
    label: 'Large checkbox',
    size: 'lg',
    onChange: logCheck,
  },
  render: (args) => <Checkbox {...args} onChange={logCheck} />
}

export const SecondaryVariant: Story = {
  args: {
    label: 'Secondary color variant',
    variant: 'secondary',
    onChange: logCheck,
  },
  render: (args) => <Checkbox {...args} onChange={logCheck} />
}

export const Controlled: Story = {
  render: () => {
    const [checked, setChecked] = useState(false)
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setChecked(e.target.checked)
      console.log('Controlled checkbox changed:', e.target.checked)
    }
    
    return (
      <div className="space-y-4">
        <Checkbox 
          label="Controlled checkbox"
          checked={checked}
          onChange={handleChange}
        />
        <div className="text-sm text-neutral-500">
          Current state: {checked ? 'Checked' : 'Unchecked'}
        </div>
      </div>
    )
  }
}

export const MultipleCheckboxes: Story = {
  render: () => {
    const [values, setValues] = useState({
      option1: false,
      option2: true,
      option3: false,
    })
    
    const handleChange = (name: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues(prev => {
        const newValues = { ...prev, [name]: e.target.checked }
        console.log('Multiple checkboxes:', newValues)
        return newValues
      })
    }
    
    return (
      <div className="space-y-2">
        <Checkbox 
          label="Option 1"
          checked={values.option1}
          onChange={handleChange('option1')}
        />
        <Checkbox 
          label="Option 2 (pre-selected)"
          checked={values.option2}
          onChange={handleChange('option2')}
        />
        <Checkbox 
          label="Option 3"
          checked={values.option3}
          onChange={handleChange('option3')}
          description="With additional description"
        />
      </div>
    )
  }
} 