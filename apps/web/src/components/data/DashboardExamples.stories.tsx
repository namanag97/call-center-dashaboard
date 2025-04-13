import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import ChartComponent from './ChartComponent';
import StatisticCard from './StatisticCard';
import { Icon } from '../ui';

const meta: Meta = {
  title: 'Data/Dashboard Examples',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj;

// Sample data for stories
const callVolumeData = [
  { name: 'Mon', value: 124 },
  { name: 'Tue', value: 186 },
  { name: 'Wed', value: 142 },
  { name: 'Thu', value: 198 },
  { name: 'Fri', value: 156 },
  { name: 'Sat', value: 84 },
  { name: 'Sun', value: 72 },
];

const callQualityData = [
  { name: 'Jan', value: 82, target: 85 },
  { name: 'Feb', value: 86, target: 85 },
  { name: 'Mar', value: 84, target: 85 },
  { name: 'Apr', value: 88, target: 85 },
  { name: 'May', value: 92, target: 85 },
  { name: 'Jun', value: 90, target: 85 },
];

const callTypeData = [
  { name: 'Support', value: 45 },
  { name: 'Sales', value: 28 },
  { name: 'Billing', value: 15 },
  { name: 'Technical', value: 12 },
];

const agentPerformanceData = [
  { name: 'Smith, J.', value: 94, avgDuration: 8.2 },
  { name: 'Johnson, M.', value: 87, avgDuration: 12.1 },
  { name: 'Williams, T.', value: 92, avgDuration: 9.5 },
  { name: 'Brown, A.', value: 84, avgDuration: 7.8 },
  { name: 'Davis, L.', value: 89, avgDuration: 10.2 },
];

export const CallCenterDashboard: Story = {
  render: () => (
    <div className="p-6 bg-neutral-50 min-h-screen">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Call Center Dashboard</h1>
      
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatisticCard
          title="Total Calls"
          value="962"
          description="Last 7 days"
          changePercentage={12.4}
          icon={<Icon name="phone" className="h-5 w-5" />}
          type="default"
        />
        <StatisticCard
          title="Average Duration"
          value="8:24"
          description="Minutes:seconds"
          changePercentage={-5.2}
          icon={<Icon name="clock" className="h-5 w-5" />}
          type="info"
        />
        <StatisticCard
          title="Quality Score"
          value="88%"
          description="Based on evaluations"
          progress={88}
          changePercentage={3.4}
          icon={<Icon name="star" className="h-5 w-5" />}
          type="success"
        />
        <StatisticCard
          title="Escalations"
          value="24"
          description="Requiring management"
          changePercentage={-18.2}
          icon={<Icon name="exclamation-circle" className="h-5 w-5" />}
          type="warning"
        />
      </div>
      
      {/* Middle Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartComponent
          type="line"
          data={callVolumeData}
          series={[{ name: 'Calls', dataKey: 'value', color: '#6366f1' }]}
          title="Daily Call Volume"
          xAxisLabel="Day"
          yAxisLabel="Number of Calls"
          height={300}
        />
        <ChartComponent
          type="bar"
          data={callQualityData}
          series={[
            { name: 'Actual', dataKey: 'value', color: '#22c55e' },
            { name: 'Target', dataKey: 'target', color: '#f59e0b' },
          ]}
          title="Monthly Quality Scores"
          xAxisLabel="Month"
          yAxisLabel="Score (%)"
          height={300}
        />
      </div>
      
      {/* Bottom Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartComponent
          type="pie"
          data={callTypeData}
          title="Call Distribution by Type"
          height={300}
        />
        <ChartComponent
          type="bar"
          data={agentPerformanceData}
          series={[{ name: 'Quality Score', dataKey: 'value', color: '#6366f1' }]}
          title="Top Performing Agents"
          xAxisLabel="Agent"
          yAxisLabel="Score (%)"
          height={300}
        />
      </div>
    </div>
  ),
};

export const CompactDashboard: Story = {
  render: () => (
    <div className="p-4 bg-white border rounded-lg shadow-sm" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-neutral-900">Daily Performance</h2>
        <span className="text-sm text-neutral-500">Today, {new Date().toLocaleDateString()}</span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <StatisticCard
          title="Calls"
          value="128"
          changePercentage={4.2}
          size="sm"
          type="default"
        />
        <StatisticCard
          title="Avg Time"
          value="7:12"
          changePercentage={-2.8}
          size="sm"
          type="info"
        />
        <StatisticCard
          title="Quality"
          value="92%"
          changePercentage={1.5}
          size="sm"
          type="success"
        />
        <StatisticCard
          title="Issues"
          value="5"
          changePercentage={-40}
          size="sm"
          type="error"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartComponent
          type="line"
          data={callVolumeData}
          series={[{ name: 'Calls', dataKey: 'value' }]}
          height={200}
          showGrid={false}
          showLegend={false}
        />
        <ChartComponent
          type="pie"
          data={callTypeData}
          height={200}
          showLegend={true}
        />
      </div>
    </div>
  ),
}; 