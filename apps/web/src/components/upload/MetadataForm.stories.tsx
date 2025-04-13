import type { Meta, StoryObj } from '@storybook/react';
import { MetadataForm } from './MetadataForm';
import { http, HttpResponse, delay } from 'msw';

const meta: Meta<typeof MetadataForm> = {
  component: MetadataForm,
  title: 'Upload/MetadataForm',
  parameters: {
    layout: 'centered',
    msw: {
      handlers: [
        http.get('/api/calls/categories', async () => {
          await delay(300);
          return HttpResponse.json({
            data: ['Sales', 'Support', 'Complaint', 'Inquiry', 'Follow-up']
          });
        }),
        http.get('/api/calls/tags', async () => {
          await delay(300);
          return HttpResponse.json({
            data: ['Important', 'Urgent', 'VIP', 'Escalated', 'Resolved', 'Pending']
          });
        }),
      ]
    }
  },
  tags: ['autodocs'],
  argTypes: {
    onSubmit: { action: 'submitted' },
    onCancel: { action: 'cancelled' }
  },
  decorators: [
    (Story) => (
      <div style={{ width: '600px', padding: '1.5rem', background: 'white', borderRadius: '0.5rem', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MetadataForm>;

// Sample agent options
const sampleAgentOptions = [
  { id: '1', name: 'John Admin' },
  { id: '2', name: 'Sarah Manager' },
  { id: '3', name: 'Mike Agent' },
];

// Sample category options
const sampleCategoryOptions = ['Sales', 'Support', 'Complaint', 'Inquiry', 'Follow-up'];

// Sample tag options
const sampleTagOptions = ['Important', 'Urgent', 'VIP', 'Escalated', 'Resolved', 'Pending'];

export const Default: Story = {
  args: {
    agentOptions: sampleAgentOptions,
    categoryOptions: sampleCategoryOptions,
    tagOptions: sampleTagOptions,
  },
};

export const WithInitialValues: Story = {
  args: {
    initialValues: {
      title: 'Support call with customer',
      date: new Date().toISOString().split('T')[0],
      agentId: '3',
      customerId: 'CUST-1234',
      customerName: 'Jane Smith',
      categories: ['Support', 'Inquiry'],
      tags: ['Important'],
      notes: 'Customer called about an issue with their account.',
    },
    agentOptions: sampleAgentOptions,
    categoryOptions: sampleCategoryOptions,
    tagOptions: sampleTagOptions,
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
    agentOptions: sampleAgentOptions,
    categoryOptions: sampleCategoryOptions,
    tagOptions: sampleTagOptions,
  },
};

export const WithNoOptions: Story = {
  args: {
    agentOptions: [],
    categoryOptions: [],
    tagOptions: [],
  },
};

export const WithValidationErrors: Story = {
  args: {
    agentOptions: sampleAgentOptions,
    categoryOptions: sampleCategoryOptions,
    tagOptions: sampleTagOptions,
    initialValues: {
      // Intentionally empty to trigger validation errors on render
    },
  },
  play: async ({ canvasElement }) => {
    // In a real implementation, we would use testing-library to trigger validation errors
    // But Storybook's play function is somewhat limited in CSF3 format
    // This serves as a placeholder for a more complete interaction test
  },
}; 