import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import StatisticCard from './StatisticCard';
import { Icon } from '../ui';

const meta: Meta<typeof StatisticCard> = {
  title: 'Data/StatisticCard',
  component: StatisticCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof StatisticCard>;

export const Default: Story = {
  args: {
    title: 'Total Calls',
    value: '1,254',
    description: 'Since last month',
  },
};

export const WithProgress: Story = {
  args: {
    title: 'Completion Rate',
    value: '68%',
    description: 'Based on completed calls',
    progress: 68,
    type: 'default',
  },
};

export const WithChangePositive: Story = {
  args: {
    title: 'Average Score',
    value: '87.5',
    description: 'Across all calls',
    changePercentage: 12.4,
    type: 'success',
  },
};

export const WithChangeNegative: Story = {
  args: {
    title: 'Failed Calls',
    value: '24',
    description: 'System errors or disconnects',
    changePercentage: -8.5,
    type: 'error',
  },
};

export const WithIcon: Story = {
  args: {
    title: 'Active Agents',
    value: '42',
    description: 'Currently taking calls',
    icon: <Icon name="user-group" className="h-5 w-5" />,
    type: 'info',
  },
};

export const WithFooter: Story = {
  args: {
    title: 'Unreviewed Calls',
    value: '38',
    description: 'Pending quality review',
    type: 'warning',
    footer: (
      <div className="flex justify-between items-center">
        <span className="text-xs text-neutral-500">Updated 5m ago</span>
        <a href="#" className="text-xs text-primary-600 hover:underline">View all</a>
      </div>
    ),
  },
};

export const Small: Story = {
  args: {
    title: 'Compliance Issues',
    value: '7',
    changePercentage: -12,
    type: 'success',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    title: 'Customer Satisfaction',
    value: '94%',
    description: 'Based on post-call surveys',
    progress: 94,
    type: 'success',
    size: 'lg',
  },
};

export const Dashboard: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-neutral-50 rounded-lg" style={{ width: '1000px' }}>
      <StatisticCard
        title="Total Calls"
        value="1,254"
        description="Past 30 days"
        icon={<Icon name="phone" className="h-5 w-5" />}
        type="default"
      />
      <StatisticCard
        title="Average Duration"
        value="14:32"
        description="Minutes:seconds"
        changePercentage={-5.2}
        type="info"
      />
      <StatisticCard
        title="Quality Score"
        value="86%"
        description="All reviewed calls"
        progress={86}
        changePercentage={3.4}
        type="success"
      />
      <StatisticCard
        title="Compliance Issues"
        value="12"
        description="Flagged for review"
        changePercentage={15.8}
        type="error"
      />
    </div>
  ),
}; 