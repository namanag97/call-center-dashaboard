import type { Meta, StoryObj } from '@storybook/react';
import { CategoryForm } from './CategoryForm';

const meta: Meta<typeof CategoryForm> = {
  title: 'Components/Settings/CategoryForm',
  component: CategoryForm,
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
type Story = StoryObj<typeof CategoryForm>;

const mockCategory = {
  id: 'category-1',
  name: 'Compliance',
  description: 'Regulatory compliance topics',
  order: 1,
  enabled: true,
  keywords: ['compliance', 'regulation', 'policy', 'legal'],
  updatedAt: new Date().toISOString(),
  createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  version: 1
};

const mockExistingCategories = [
  mockCategory,
  {
    id: 'category-2',
    name: 'Product Knowledge',
    description: 'Agent knowledge of products and services',
    order: 2,
    enabled: true,
    keywords: ['product', 'features', 'specifications', 'pricing'],
    updatedAt: new Date().toISOString(),
    createdAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
    version: 3
  }
];

export const AddNewCategory: Story = {
  args: {
    existingCategories: mockExistingCategories,
    onSubmit: async (data) => {
      console.log('Form submitted with data:', data);
      return new Promise(resolve => setTimeout(resolve, 1000));
    },
    onCancel: () => console.log('Form cancelled'),
  },
};

export const EditExistingCategory: Story = {
  args: {
    category: mockCategory,
    existingCategories: mockExistingCategories,
    onSubmit: async (data) => {
      console.log('Form submitted with data:', data);
      return new Promise(resolve => setTimeout(resolve, 1000));
    },
    onCancel: () => console.log('Form cancelled'),
  },
};

export const WithLoading: Story = {
  args: {
    category: mockCategory,
    existingCategories: mockExistingCategories,
    onSubmit: async (data) => {
      console.log('Form submitted with data:', data);
      return new Promise(resolve => setTimeout(resolve, 5000));
    },
    onCancel: () => console.log('Form cancelled'),
    isLoading: true,
  },
}; 