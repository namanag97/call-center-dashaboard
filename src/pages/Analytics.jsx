// src/pages/Analytics.jsx
import { useState } from 'react';
import { Box, Title, Text, Group, Button, Paper, Grid, Tabs, Select } from '@mantine/core';
import * as TablerIcons from '@tabler/icons-react';

function Analytics() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <Box p="md">
      {/* Page Header */}
      <Box mb="lg">
        <Group justify="space-between" mb="md">
          <Box>
            <Title order={2} mb="xs">Analytics</Title>
            <Text c="dimmed" size="sm">Call center performance metrics and trends</Text>
          </Box>
          
          <Group>
            <Button 
              variant="outline" 
              leftSection={<TablerIcons.IconDownload size={16} />}
            >
              Export Report
            </Button>
          </Group>
        </Group>
      </Box>
      
      {/* Date Range and Filters */}
      <Paper p="md" mb="lg" withBorder>
        <Group justify="space-between">
          <Group>
            <Select
              label="Date Range"
              placeholder="Select date range"
              data={[
                'Last 7 days',
                'Last 30 days',
                'Last 90 days',
                'Year to date',
                'Custom range'
              ]}
              defaultValue="Last 7 days"
              style={{ minWidth: '200px' }}
            />
            
            <Select
              label="Agent"
              placeholder="All agents"
              data={[
                'All agents',
                'Raj Sharma',
                'Priya Patel',
                'Amit Kumar',
                'Sneha Gupta',
                'Vikram Singh'
              ]}
              defaultValue="All agents"
              style={{ minWidth: '200px' }}
            />
          </Group>
          
          <Button 
            variant="light" 
            leftSection={<TablerIcons.IconRefresh size={16} />}
          >
            Refresh
          </Button>
        </Group>
      </Paper>
      
      {/* Analytics Tabs */}
      <Tabs value={activeTab} onChange={setActiveTab} mb="md">
        <Tabs.List>
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
          <Tabs.Tab value="calls">Call Metrics</Tabs.Tab>
          <Tabs.Tab value="agents">Agent Performance</Tabs.Tab>
          <Tabs.Tab value="categories">Issue Categories</Tabs.Tab>
        </Tabs.List>
      </Tabs>
      
      {/* Statistics Cards */}
      <Grid mb="lg">
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Paper p="md" withBorder>
            <Text size="sm" c="dimmed" mb="xs">Total Calls</Text>
            <Text fw={700} size="xl" mb="xs">1,845</Text>
            <Group align="center">
              <Text size="xs" c="teal">+12.5%</Text>
              <Text size="xs" c="dimmed">vs last period</Text>
            </Group>
          </Paper>
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Paper p="md" withBorder>
            <Text size="sm" c="dimmed" mb="xs">Avg Resolution Time</Text>
            <Text fw={700} size="xl" mb="xs">14:32</Text>
            <Group align="center">
              <Text size="xs" c="teal">-3.2%</Text>
              <Text size="xs" c="dimmed">vs last period</Text>
            </Group>
          </Paper>
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Paper p="md" withBorder>
            <Text size="sm" c="dimmed" mb="xs">First Contact Resolution</Text>
            <Text fw={700} size="xl" mb="xs">76.2%</Text>
            <Group align="center">
              <Text size="xs" c="teal">+4.6%</Text>
              <Text size="xs" c="dimmed">vs last period</Text>
            </Group>
          </Paper>
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Paper p="md" withBorder>
            <Text size="sm" c="dimmed" mb="xs">Customer Satisfaction</Text>
            <Text fw={700} size="xl" mb="xs">4.2/5</Text>
            <Group align="center">
              <Text size="xs" c="red">-0.3</Text>
              <Text size="xs" c="dimmed">vs last period</Text>
            </Group>
          </Paper>
        </Grid.Col>
      </Grid>
      
      {/* Chart placeholder */}
      <Paper withBorder mb="lg" p="md">
        <Title order={4} mb="md">Call Volume Trends</Title>
        <Box style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--mantine-color-gray-1)' }}>
          <Text c="dimmed" fs="italic">Chart visualization would appear here</Text>
        </Box>
      </Paper>
      
      {/* Top issues */}
      <Paper withBorder mb="lg">
        <Group p="md" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
          <Title order={4}>Top Issue Categories</Title>
        </Group>
        
        <Box p="md">
          <Grid>
            {[
              { category: 'Account Login Issues', count: 412, growth: '+15%' },
              { category: 'Payment Gateway Errors', count: 287, growth: '+7%' },
              { category: 'Mobile App Technical Issues', count: 245, growth: '-3%' },
              { category: 'Fund Transfer Problems', count: 189, growth: '+2%' }
            ].map((issue, index) => (
              <Grid.Col span={{ base: 12, md: 6 }} key={index}>
                <Paper withBorder p="md">
                  <Group position="apart" mb="xs">
                    <Text fw={500}>{issue.category}</Text>
                    <Text size="sm" c={issue.growth.startsWith('+') ? 'teal' : 'red'}>{issue.growth}</Text>
                  </Group>
                  <Text size="xl" fw={700}>{issue.count}</Text>
                  <Text size="xs" c="dimmed">calls in this period</Text>
                </Paper>
              </Grid.Col>
            ))}
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}

export default Analytics;