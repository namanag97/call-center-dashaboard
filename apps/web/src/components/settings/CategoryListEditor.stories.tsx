import type { Meta, StoryObj } from '@storybook/react';
import { CategoryListEditor } from './CategoryListEditor';

const meta: Meta<typeof CategoryListEditor> = {
  title: 'Components/Settings/CategoryListEditor',
  component: CategoryListEditor,
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
type Story = StoryObj<typeof CategoryListEditor>;

const mockCategories = [
  {
    id: 'category-1',
    name: 'Compliance',
    description: 'Regulatory compliance topics',
    order: 1,
    enabled: true,
    keywords: ['compliance', 'regulation', 'policy', 'legal'],
    updatedAt: new Date().toISOString(),
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    version: 1
  },
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
  },
  {
    id: 'category-3',
    name: 'Customer Service',
    description: 'Quality of customer service and interaction',
    order: 3,
    enabled: false,
    keywords: ['service', 'satisfaction', 'experience', 'friendly', 'helpful'],
    updatedAt: new Date().toISOString(),
    createdAt: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString(),
    version: 2
  }
];

export const Default: Story = {
  args: {
    categories: mockCategories,
    onAddCategory: () => console.log('Add category clicked'),
    onEditCategory: (category) => console.log('Edit category:', category),
    onDeleteCategory: (id) => console.log('Delete category:', id),
    onReorderCategories: (categories) => console.log('Reorder categories:', categories),
  },
};

export const Loading: Story = {
  args: {
    categories: [],
    isLoading: true,
    onAddCategory: () => console.log('Add category clicked'),
    onEditCategory: () => {},
    onDeleteCategory: () => {},
    onReorderCategories: () => {},
  },
};

export const Error: Story = {
  args: {
    categories: [],
    error: 'Failed to load categories. Please try again later.',
    onAddCategory: () => console.log('Add category clicked'),
    onEditCategory: () => {},
    onDeleteCategory: () => {},
    onReorderCategories: () => {},
  },
};

export const Empty: Story = {
  args: {
    categories: [],
    onAddCategory: () => console.log('Add category clicked'),
    onEditCategory: () => {},
    onDeleteCategory: () => {},
    onReorderCategories: () => {},
  },
}; 