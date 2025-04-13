import type { Meta, StoryObj } from '@storybook/react'
import { useArgs } from '@storybook/preview-api'
import Dropdown from './Dropdown'

const meta: Meta<typeof Dropdown> = {
  component: Dropdown,
  title: 'UI/Dropdown',
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outline', 'ghost', 'link'],
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    isMulti: {
      control: { type: 'boolean' },
    },
    isSearchable: {
      control: { type: 'boolean' },
    },
    isDisabled: {
      control: { type: 'boolean' },
    },
    isRequired: {
      control: { type: 'boolean' },
    },
    error: {
      control: { type: 'text' },
    },
    helperText: {
      control: { type: 'text' },
    },
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta

// Sample options for all stories
const sampleOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
  { value: 'option4', label: 'Option 4' },
  { value: 'option5', label: 'Option 5' },
]

type Story = StoryObj<typeof Dropdown>

export const Default: Story = {
  args: {
    options: sampleOptions,
    placeholder: 'Select an option',
  },
  render: (args) => {
    const [{ value }, updateArgs] = useArgs()
    
    const handleChange = (newValue: string | string[]) => {
      updateArgs({ value: newValue })
    }
    
    return <Dropdown {...args} value={value} onChange={handleChange} />
  },
}

export const WithLabel: Story = {
  args: {
    options: sampleOptions,
    label: 'Select Option',
    placeholder: 'Choose from the list',
  },
  render: (args) => {
    const [{ value }, updateArgs] = useArgs()
    const handleChange = (newValue: string | string[]) => {
      updateArgs({ value: newValue })
    }
    return <Dropdown {...args} value={value} onChange={handleChange} />
  },
}

export const Required: Story = {
  args: {
    options: sampleOptions,
    label: 'Required Field',
    isRequired: true,
  },
  render: (args) => {
    const [{ value }, updateArgs] = useArgs()
    const handleChange = (newValue: string | string[]) => {
      updateArgs({ value: newValue })
    }
    return <Dropdown {...args} value={value} onChange={handleChange} />
  },
}

export const Searchable: Story = {
  args: {
    options: [
      ...sampleOptions,
      { value: 'option6', label: 'Searchable Option' },
      { value: 'option7', label: 'Another Search Result' },
      { value: 'option8', label: 'Finding This One' },
      { value: 'option9', label: 'Last Result Item' },
    ],
    isSearchable: true,
    label: 'Searchable Dropdown',
  },
  render: (args) => {
    const [{ value }, updateArgs] = useArgs()
    const handleChange = (newValue: string | string[]) => {
      updateArgs({ value: newValue })
    }
    return <Dropdown {...args} value={value} onChange={handleChange} />
  },
}

export const MultiSelect: Story = {
  args: {
    options: sampleOptions,
    isMulti: true,
    label: 'Select Multiple Options',
  },
  render: (args) => {
    const [{ value }, updateArgs] = useArgs()
    const handleChange = (newValue: string | string[]) => {
      updateArgs({ value: newValue })
    }
    return <Dropdown {...args} value={value} onChange={handleChange} />
  },
}

export const WithHelperText: Story = {
  args: {
    options: sampleOptions,
    label: 'With Helper Text',
    helperText: 'This is some helpful information',
  },
  render: (args) => {
    const [{ value }, updateArgs] = useArgs()
    const handleChange = (newValue: string | string[]) => {
      updateArgs({ value: newValue })
    }
    return <Dropdown {...args} value={value} onChange={handleChange} />
  },
}

export const WithError: Story = {
  args: {
    options: sampleOptions,
    label: 'With Error State',
    error: 'Please select a valid option',
  },
  render: (args) => {
    const [{ value }, updateArgs] = useArgs()
    const handleChange = (newValue: string | string[]) => {
      updateArgs({ value: newValue })
    }
    return <Dropdown {...args} value={value} onChange={handleChange} />
  },
}

export const Disabled: Story = {
  args: {
    options: sampleOptions,
    label: 'Disabled Dropdown',
    isDisabled: true,
    value: 'option1',
  },
  render: (args) => {
    const [{ value }, updateArgs] = useArgs()
    const handleChange = (newValue: string | string[]) => {
      updateArgs({ value: newValue })
    }
    return <Dropdown {...args} value={value} onChange={handleChange} />
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col space-y-4">
      <Dropdown
        options={sampleOptions}
        label="Extra Small (xs)"
        size="xs"
      />
      <Dropdown
        options={sampleOptions}
        label="Small (sm)"
        size="sm"
      />
      <Dropdown
        options={sampleOptions}
        label="Medium (md)"
        size="md"
      />
      <Dropdown
        options={sampleOptions}
        label="Large (lg)"
        size="lg"
      />
      <Dropdown
        options={sampleOptions}
        label="Extra Large (xl)"
        size="xl"
      />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col space-y-4">
      <Dropdown
        options={sampleOptions}
        label="Primary Variant"
        variant="primary"
      />
      <Dropdown
        options={sampleOptions}
        label="Secondary Variant"
        variant="secondary"
      />
      <Dropdown
        options={sampleOptions}
        label="Outline Variant"
        variant="outline"
      />
      <Dropdown
        options={sampleOptions}
        label="Ghost Variant"
        variant="ghost"
      />
      <Dropdown
        options={sampleOptions}
        label="Link Variant"
        variant="link"
      />
    </div>
  ),
}

export const WithInitialValue: Story = {
  args: {
    options: sampleOptions,
    label: 'With Initial Value',
    value: 'option2',
  },
  render: (args) => {
    const [{ value }, updateArgs] = useArgs()
    const handleChange = (newValue: string | string[]) => {
      updateArgs({ value: newValue })
    }
    return <Dropdown {...args} value={value} onChange={handleChange} />
  },
}

export const WithCustomMaxHeight: Story = {
  args: {
    options: Array.from({ length: 20 }, (_, i) => ({
      value: `option${i + 1}`,
      label: `Option ${i + 1}`,
    })),
    label: 'With Custom Max Height',
    maxHeight: '10rem',
    isSearchable: true,
  },
  render: (args) => {
    const [{ value }, updateArgs] = useArgs()
    const handleChange = (newValue: string | string[]) => {
      updateArgs({ value: newValue })
    }
    return <Dropdown {...args} value={value} onChange={handleChange} />
  },
} 