import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { PaginationState } from '@conista/shared-types';
import Pagination from './Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Data/Pagination',
  component: Pagination,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div className="bg-white p-4 border rounded-md">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Pagination>;

// Interactive example
const PaginationWithState = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 10,
    totalItems: 124,
    totalPages: 13,
  });

  const handlePageChange = (page: number) => {
    setPagination({
      ...pagination,
      page,
    });
  };

  const handlePageSizeChange = (pageSize: number) => {
    // When page size changes, reset to page 1 and recalculate totalPages
    const totalPages = Math.ceil(pagination.totalItems / pageSize);
    setPagination({
      ...pagination,
      page: 1,
      pageSize,
      totalPages,
    });
  };

  return (
    <Pagination
      pagination={pagination}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
    />
  );
};

export const Interactive: Story = {
  render: () => <PaginationWithState />,
};

// Few pages example
export const FewPages: Story = {
  args: {
    pagination: {
      page: 2,
      pageSize: 10,
      totalItems: 45,
      totalPages: 5,
    },
    onPageChange: () => {},
    onPageSizeChange: () => {},
  },
};

// Many pages example
export const ManyPages: Story = {
  args: {
    pagination: {
      page: 5,
      pageSize: 25,
      totalItems: 478,
      totalPages: 20,
    },
    onPageChange: () => {},
    onPageSizeChange: () => {},
  },
};

// First page example
export const FirstPage: Story = {
  args: {
    pagination: {
      page: 1,
      pageSize: 10,
      totalItems: 248,
      totalPages: 25,
    },
    onPageChange: () => {},
    onPageSizeChange: () => {},
  },
};

// Last page example
export const LastPage: Story = {
  args: {
    pagination: {
      page: 25,
      pageSize: 10,
      totalItems: 248,
      totalPages: 25,
    },
    onPageChange: () => {},
    onPageSizeChange: () => {},
  },
};

// Empty results example
export const EmptyResults: Story = {
  args: {
    pagination: {
      page: 1,
      pageSize: 10,
      totalItems: 0,
      totalPages: 0,
    },
    onPageChange: () => {},
    onPageSizeChange: () => {},
  },
};

// Disabled example
export const Disabled: Story = {
  args: {
    pagination: {
      page: 3,
      pageSize: 10,
      totalItems: 145,
      totalPages: 15,
    },
    onPageChange: () => {},
    onPageSizeChange: () => {},
    disabled: true,
  },
}; 