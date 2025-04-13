import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import ChartComponent from './ChartComponent';
import { Icon } from '../ui';

const meta: Meta<typeof ChartComponent> = {
  title: 'Data/ChartComponent',
  component: ChartComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['line', 'bar', 'pie'],
    },
    showGrid: {
      control: { type: 'boolean' },
    },
    showLegend: {
      control: { type: 'boolean' },
    },
    showTooltip: {
      control: { type: 'boolean' },
    },
    isLoading: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ChartComponent>;

// Sample data for stories
const sampleMonthlyData = [
  { name: 'Jan', value: 400, extraValue: 300 },
  { name: 'Feb', value: 300, extraValue: 450 },
  { name: 'Mar', value: 600, extraValue: 380 },
  { name: 'Apr', value: 800, extraValue: 520 },
  { name: 'May', value: 500, extraValue: 650 },
  { name: 'Jun', value: 900, extraValue: 700 },
];

const sampleCategoryData = [
  { name: 'Category A', value: 30 },
  { name: 'Category B', value: 25 },
  { name: 'Category C', value: 15 },
  { name: 'Category D', value: 20 },
  { name: 'Category E', value: 10 },
];

export const LineChart: Story = {
  args: {
    type: 'line',
    data: sampleMonthlyData,
    series: [
      { name: 'Revenue', dataKey: 'value', color: '#6366f1' },
      { name: 'Expenses', dataKey: 'extraValue', color: '#f97316' },
    ],
    title: 'Monthly Performance',
    xAxisLabel: 'Month',
    yAxisLabel: 'Amount ($)',
    showGrid: true,
    showLegend: true,
    showTooltip: true,
  },
};

export const BarChart: Story = {
  args: {
    type: 'bar',
    data: sampleMonthlyData,
    series: [
      { name: 'Revenue', dataKey: 'value', color: '#6366f1' },
      { name: 'Expenses', dataKey: 'extraValue', color: '#f97316' },
    ],
    title: 'Monthly Performance',
    xAxisLabel: 'Month',
    yAxisLabel: 'Amount ($)',
    showGrid: true,
    showLegend: true,
    showTooltip: true,
  },
};

export const PieChart: Story = {
  args: {
    type: 'pie',
    data: sampleCategoryData,
    title: 'Market Share by Category',
    showLegend: true,
    showTooltip: true,
  },
};

export const NoData: Story = {
  args: {
    type: 'line',
    data: [],
    title: 'Chart With No Data',
    xAxisLabel: 'Month',
    yAxisLabel: 'Amount ($)',
  },
};

export const Loading: Story = {
  args: {
    type: 'line',
    data: sampleMonthlyData,
    isLoading: true,
    title: 'Loading Chart',
  },
};

export const CustomColors: Story = {
  args: {
    type: 'bar',
    data: sampleMonthlyData,
    series: [
      { name: 'Revenue', dataKey: 'value' },
      { name: 'Expenses', dataKey: 'extraValue' },
    ],
    title: 'Monthly Performance with Custom Colors',
    colors: ['#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b', '#ef4444'],
    showLegend: true,
  },
};

export const MinimalistLine: Story = {
  args: {
    type: 'line',
    data: sampleMonthlyData.map(d => ({ name: d.name, value: d.value })),
    series: [{ name: 'Revenue', dataKey: 'value', color: '#6366f1' }],
    showGrid: false,
    showLegend: false,
    height: 200,
  },
};

export const Dashboard: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-neutral-50 rounded-lg" style={{ width: '1000px' }}>
      <ChartComponent
        type="line"
        data={sampleMonthlyData}
        series={[
          { name: 'Revenue', dataKey: 'value', color: '#6366f1' },
          { name: 'Expenses', dataKey: 'extraValue', color: '#f97316' },
        ]}
        title="Monthly Performance"
        height={250}
      />
      <ChartComponent
        type="bar"
        data={sampleMonthlyData.slice(0, 4)}
        series={[{ name: 'Revenue', dataKey: 'value', color: '#6366f1' }]}
        title="Quarterly Performance"
        height={250}
      />
      <ChartComponent
        type="pie"
        data={sampleCategoryData}
        title="Market Share"
        height={250}
      />
      <ChartComponent
        type="line"
        data={sampleMonthlyData.map(d => ({ name: d.name, value: Math.round(d.value * 0.75) }))}
        series={[{ name: 'Forecast', dataKey: 'value', color: '#8b5cf6' }]}
        title="Projected Growth"
        height={250}
        showGrid={false}
      />
    </div>
  ),
}; 