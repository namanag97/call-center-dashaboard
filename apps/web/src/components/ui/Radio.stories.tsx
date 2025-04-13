import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import Radio from './Radio'

const meta: Meta<typeof Radio> = {
  component: Radio,
  title: 'UI/Radio',
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
type Story = StoryObj<typeof Radio>

// Add console log in stories to show events
const logChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log('Radio changed:', e.target.value)
}

export const Default: Story = {
  args: {
    label: 'Radio option',
    name: 'default-radio',
    value: 'option1',
    onChange: logChange,
  },
  render: (args) => {
    // Using render function to get onChange to work with the console log
    return <Radio {...args} onChange={logChange} />
  }
}

export const WithDescription: Story = {
  args: {
    label: 'Standard shipping',
    description: 'Delivery in 3-5 business days',
    name: 'shipping',
    value: 'standard',
    onChange: logChange,
  },
  render: (args) => <Radio {...args} onChange={logChange} />
}

export const WithError: Story = {
  args: {
    label: 'I agree to the terms',
    error: 'Please select one of the options',
    name: 'terms',
    value: 'agree',
    onChange: logChange,
  },
  render: (args) => <Radio {...args} onChange={logChange} />
}

export const Required: Story = {
  args: {
    label: 'Required option',
    required: true,
    name: 'required',
    value: 'required',
    onChange: logChange,
  },
  render: (args) => <Radio {...args} onChange={logChange} />
}

export const Disabled: Story = {
  args: {
    label: 'Disabled option',
    disabled: true,
    name: 'disabled',
    value: 'disabled',
    onChange: logChange,
  },
  render: (args) => <Radio {...args} onChange={logChange} />
}

export const SmallSize: Story = {
  args: {
    label: 'Small radio',
    size: 'sm',
    name: 'size',
    value: 'small',
    onChange: logChange,
  },
  render: (args) => <Radio {...args} onChange={logChange} />
}

export const LargeSize: Story = {
  args: {
    label: 'Large radio',
    size: 'lg',
    name: 'size',
    value: 'large',
    onChange: logChange,
  },
  render: (args) => <Radio {...args} onChange={logChange} />
}

export const SecondaryVariant: Story = {
  args: {
    label: 'Secondary color variant',
    variant: 'secondary',
    name: 'variant',
    value: 'secondary',
    onChange: logChange,
  },
  render: (args) => <Radio {...args} onChange={logChange} />
}

export const RadioGroup: Story = {
  render: () => {
    const [selected, setSelected] = useState('standard')
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSelected(e.target.value)
      console.log('Selected shipping option:', e.target.value)
    }
    
    return (
      <div className="space-y-4">
        <div className="font-medium mb-2">Shipping options:</div>
        <div className="space-y-2">
          <Radio 
            label="Standard shipping"
            description="Delivery in 3-5 business days (Free)"
            name="shipping-option"
            value="standard"
            checked={selected === 'standard'}
            onChange={handleChange}
          />
          <Radio 
            label="Express shipping"
            description="Delivery in 1-2 business days (+$10.00)"
            name="shipping-option"
            value="express"
            checked={selected === 'express'}
            onChange={handleChange}
          />
          <Radio 
            label="Same day delivery"
            description="Delivery today (+$25.00)"
            name="shipping-option"
            value="same-day"
            checked={selected === 'same-day'}
            onChange={handleChange}
          />
        </div>
        <div className="text-sm text-neutral-500 mt-4">
          Selected option: {selected}
        </div>
      </div>
    )
  }
}

export const PreSelectedDisabled: Story = {
  render: () => {
    return (
      <div className="space-y-4">
        <div className="font-medium mb-2">Payment methods (preselected and disabled):</div>
        <div className="space-y-2">
          <Radio 
            label="Credit Card"
            description="Visa, Mastercard, AMEX"
            name="payment"
            value="card"
            checked={true}
            disabled={true}
            onChange={() => console.log('This is disabled')}
          />
          <Radio 
            label="PayPal"
            description="Pay with your PayPal account"
            name="payment"
            value="paypal"
            disabled={true}
            onChange={() => console.log('This is disabled')}
          />
        </div>
        <div className="text-sm text-neutral-500">
          Only Credit Card is accepted for this order
        </div>
      </div>
    )
  }
} 