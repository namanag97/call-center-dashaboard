import type { Meta, StoryObj } from '@storybook/react';
import { ProviderForm } from './ProviderForm';
import { ProviderType } from '@conista/shared-types';

const meta: Meta<typeof ProviderForm> = {
  title: 'Components/Settings/ProviderForm',
  component: ProviderForm,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-2xl p-6 bg-white shadow-sm rounded-lg">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ProviderForm>;

const mockProvider = {
  id: 'provider-1',
  name: 'OpenAI',
  type: ProviderType.Analysis,
  enabled: true,
  apiKey: 'sk-mock-key-1',
  config: {
    model: 'gpt-4',
    temperature: 0.1
  },
  updatedAt: new Date().toISOString(),
  createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  version: 1
};

export const AddNewProvider: Story = {
  args: {
    onSubmit: async (data) => {
      console.log('Form submitted with data:', data);
      return new Promise(resolve => setTimeout(resolve, 1000));
    },
    onCancel: () => console.log('Form cancelled'),
  },
};

export const EditExistingProvider: Story = {
  args: {
    provider: mockProvider,
    onSubmit: async (data) => {
      console.log('Form submitted with data:', data);
      return new Promise(resolve => setTimeout(resolve, 1000));
    },
    onCancel: () => console.log('Form cancelled'),
  },
};

export const WithLoading: Story = {
  args: {
    provider: mockProvider,
    onSubmit: async (data) => {
      console.log('Form submitted with data:', data);
      return new Promise(resolve => setTimeout(resolve, 5000));
    },
    onCancel: () => console.log('Form cancelled'),
    isLoading: true,
  },
}; 