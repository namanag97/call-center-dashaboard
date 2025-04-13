import type { Meta, StoryObj } from '@storybook/react';
import { SettingsLayout } from './SettingsLayout';

const meta: Meta<typeof SettingsLayout> = {
  component: SettingsLayout,
  title: 'Settings/SettingsLayout',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '800px', minHeight: '500px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SettingsLayout>;

// Example tab content
const GeneralContent = () => (
  <div className="space-y-4">
    <h2 className="text-lg font-medium">General Settings</h2>
    <p>Configure system-wide settings and defaults.</p>
    <div className="bg-gray-50 p-4 rounded border">
      <p className="text-sm text-gray-700">Example settings form would go here.</p>
    </div>
  </div>
);

const ProvidersContent = () => (
  <div className="space-y-4">
    <h2 className="text-lg font-medium">API Providers</h2>
    <p>Manage transcription, analysis, and storage providers.</p>
    <div className="bg-gray-50 p-4 rounded border">
      <p className="text-sm text-gray-700">Provider management interface would go here.</p>
    </div>
  </div>
);

const CategoriesContent = () => (
  <div className="space-y-4">
    <h2 className="text-lg font-medium">Analysis Categories</h2>
    <p>Manage categories for call analysis and classification.</p>
    <div className="bg-gray-50 p-4 rounded border">
      <p className="text-sm text-gray-700">Category management interface would go here.</p>
    </div>
  </div>
);

export const Default: Story = {
  args: {
    initialTab: 'general',
    generalContent: <GeneralContent />,
    providersContent: <ProvidersContent />,
    categoriesContent: <CategoriesContent />,
  },
};

export const ProvidersTab: Story = {
  args: {
    initialTab: 'providers',
    generalContent: <GeneralContent />,
    providersContent: <ProvidersContent />,
    categoriesContent: <CategoriesContent />,
  },
};

export const CategoriesTab: Story = {
  args: {
    initialTab: 'categories',
    generalContent: <GeneralContent />,
    providersContent: <ProvidersContent />,
    categoriesContent: <CategoriesContent />,
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};

export const Error: Story = {
  args: {
    error: 'Failed to load settings. Please try again later.',
  },
}; 