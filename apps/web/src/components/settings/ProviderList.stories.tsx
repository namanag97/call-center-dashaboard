import type { Meta, StoryObj } from '@storybook/react';
import { ProviderList } from './ProviderList';
import { ProviderType } from '@conista/shared-types';

const meta: Meta<typeof ProviderList> = {
  title: 'Components/Settings/ProviderList',
  component: ProviderList,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-4xl">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ProviderList>;

const mockProviders = [
  {
    id: '1',
    name: 'DeepGram',
    type: ProviderType.Transcription,
    enabled: true,
    createdAt: new Date('2023-05-12').toISOString(),
    updatedAt: new Date('2023-05-12').toISOString(),
  },
  {
    id: '2',
    name: 'OpenAI',
    type: ProviderType.Analysis,
    enabled: true,
    createdAt: new Date('2023-06-20').toISOString(),
    updatedAt: new Date('2023-07-08').toISOString(),
  },
  {
    id: '3',
    name: 'AWS S3',
    type: ProviderType.Storage,
    enabled: false,
    createdAt: new Date('2023-04-05').toISOString(),
    updatedAt: new Date('2023-08-15').toISOString(),
  },
];

export const Default: Story = {
  args: {
    providers: mockProviders,
    onAddProvider: () => alert('Add provider clicked'),
    onEditProvider: (provider) => alert(`Edit provider clicked: ${provider.name}`),
  },
};

export const Loading: Story = {
  args: {
    providers: [],
    isLoading: true,
    onAddProvider: () => alert('Add provider clicked'),
    onEditProvider: () => {},
  },
};

export const Error: Story = {
  args: {
    providers: [],
    error: 'Failed to load providers. Please try again later.',
    onAddProvider: () => alert('Add provider clicked'),
    onEditProvider: () => {},
  },
};

export const Empty: Story = {
  args: {
    providers: [],
    onAddProvider: () => alert('Add provider clicked'),
    onEditProvider: () => {},
  },
}; 