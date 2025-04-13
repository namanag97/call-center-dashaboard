import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import SearchBar from './SearchBar';

const meta: Meta<typeof SearchBar> = {
  title: 'Data/SearchBar',
  component: SearchBar,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div className="max-w-md bg-white p-4 border rounded-md">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SearchBar>;

// Interactive example
const SearchBarWithState = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <div className="space-y-4">
      <SearchBar
        onSearch={(value) => {
          setSearchTerm(value);
          action('onSearch')(value);
        }}
      />
      
      <div className="text-sm">
        <p>
          Current search term: <span className="font-medium">{searchTerm || '(empty)'}</span>
        </p>
        <p className="text-xs text-neutral-500 mt-1">
          Type to search with debounce (300ms) or press Enter to search immediately
        </p>
      </div>
    </div>
  );
};

export const Interactive: Story = {
  render: () => <SearchBarWithState />,
};

// Basic example
export const Basic: Story = {
  args: {
    placeholder: 'Search...',
    onSearch: action('onSearch'),
  },
};

// With initial value
export const WithInitialValue: Story = {
  args: {
    placeholder: 'Search...',
    initialValue: 'Initial search term',
    onSearch: action('onSearch'),
  },
};

// With custom placeholder
export const CustomPlaceholder: Story = {
  args: {
    placeholder: 'Find calls by agent name or client...',
    onSearch: action('onSearch'),
  },
};

// With min characters
export const WithMinCharacters: Story = {
  args: {
    placeholder: 'Type at least 3 characters to search...',
    minChars: 3,
    onSearch: action('onSearch'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Only triggers search when at least 3 characters are entered (or when cleared to 0).',
      },
    },
  },
};

// Disabled state
export const Disabled: Story = {
  args: {
    placeholder: 'Search is disabled',
    disabled: true,
    onSearch: action('onSearch'),
  },
};

// Custom debounce
export const LongDebounce: Story = {
  args: {
    placeholder: 'Typing has a longer debounce (800ms)...',
    debounceMs: 800,
    onSearch: action('onSearch'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Uses a longer 800ms debounce instead of the default 300ms.',
      },
    },
  },
};

// Clear after search
export const ClearAfterSearch: Story = {
  args: {
    placeholder: 'Press Enter to search and clear...',
    clearAfterSearch: true,
    onSearch: action('onSearch'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Input is cleared after pressing Enter to perform a search.',
      },
    },
  },
}; 