// src/pages/Queues.jsx
import { useState } from 'react';
import { Box, Title, Text, Group, Button, Paper, Tabs, Grid, Select, Badge } from '@mantine/core';
import * as TablerIcons from '@tabler/icons-react';

function QueueCard({ title, stats, items }) {
  return (
    <Paper withBorder style={{ height: '100%' }}>
      <Box p="sm" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)', background: 'var(--mantine-color-gray-0)' }}>
        <Text fw={600} size="sm">{title}</Text>
        <Text size="xs" c="dimmed" mt={4}>{stats}</Text>
      </Box>
      
      <Box style={{ maxHeight: '400px', overflow: 'auto' }}>
        {items.map((item, index) => (
          <Box key={index} p="sm" style={{ 
            borderBottom: index !== items.length - 1 ? '1px solid var(--mantine-color-gray-3)' : 'none' 
          }}>
            <Text fw={500} size="sm" mb={4}>{item.title}</Text>
            <Group justify="space-between" wrap="nowrap">
              <Text size="xs" c="dimmed">{item.meta1}</Text>
              <Text size="xs" c="dimmed">{item.meta2}</Text>
            </Group>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}

function Queues() {
  const [activeTab, setActiveTab] = useState('processing');

  // Dummy data for queues
  const queues = [
    {
      title: 'Upload Queue',
      stats: '12 calls pending',
      items: [
        { title: 'CALL-2023-0467', meta1: '10.2 MB', meta2: 'Uploaded 5 mins ago' },
        { title: 'CALL-2023-0468', meta1: '8.7 MB', meta2: 'Uploaded 12 mins ago' },
        { title: 'CALL-2023-0469', meta1: '15.3 MB', meta2: 'Uploaded 18 mins ago' },
        { title: 'CALL-2023-0470', meta1: '6.1 MB', meta2: 'Uploaded 25 mins ago' }
      ]
    },
    {
      title: 'Transcription Queue',
      stats: '5 calls in process',
      items: [
        { title: 'CALL-2023-0462', meta1: 'Progress: 78%', meta2: 'ETA: 1:24' },
        { title: 'CALL-2023-0463', meta1: 'Progress: 45%', meta2: 'ETA: 3:12' },
        { title: 'CALL-2023-0464', meta1: 'Progress: 23%', meta2: 'ETA: 5:40' },
        { title: 'CALL-2023-0465', meta1: 'Progress: 12%', meta2: 'ETA: 7:15' },
        { title: 'CALL-2023-0466', meta1: 'Progress: 5%', meta2: 'ETA: 8:30' }
      ]
    },
    {
      title: 'Analysis Queue',
      stats: '8 transcripts pending',
      items: [
        { title: 'CALL-2023-0456', meta1: 'AI analysis in progress', meta2: 'Started 2 mins ago' },
        { title: 'CALL-2023-0457', meta1: 'Queued', meta2: 'Position: 1' },
        { title: 'CALL-2023-0458', meta1: 'Queued', meta2: 'Position: 2' },
        { title: 'CALL-2023-0459', meta1: 'Queued', meta2: 'Position: 3' }
      ]
    }
  ];

  // Dummy data for completed items
  const completedItems = [
    { id: 'CALL-2023-0452', time: '14:35', category: 'Account Access', status: 'Resolved', agent: 'Raj Sharma' },
    { id: 'CALL-2023-0451', time: '13:22', category: 'Failed Transfer', status: 'Escalated', agent: 'Priya Patel' },
    { id: 'CALL-2023-0450', time: '11:05', category: 'Investment Plans', status: 'Resolved', agent: 'Amit Kumar' },
    { id: 'CALL-2023-0449', time: '10:18', category: 'Customer Service', status: 'Workaround', agent: 'Sneha Gupta' },
    { id: 'CALL-2023-0448', time: '09:47', category: 'Mobile App', status: 'Unresolved', agent: 'Vikram Singh' }
  ];
  
  return (
    <Box p="md">
      {/* Page Header */}
      <Box mb="lg">
        <Group justify="space-between" mb="md">
          <Box>
            <Title order={2} mb="xs">Processing Queues</Title>
            <Text c="dimmed" size="sm">Manage transcription and analysis processes</Text>
          </Box>
          
          <Group>
            <Select
              placeholder="All Queues"
              data={[
                'All Queues',
                'Upload Queue',
                'Transcription Queue',
                'Analysis Queue'
              ]}
              defaultValue="All Queues"
              style={{ width: '180px' }}
            />
            
            <Button 
              variant="outline" 
              leftSection={<TablerIcons.IconSettings size={16} />}
            >
              Queue Settings
            </Button>
            
            <Button 
              leftSection={<TablerIcons.IconRefresh size={16} />}
            >
              Refresh
            </Button>
          </Group>
        </Group>
      </Box>
      
      {/* Queue Stats */}
      <Grid mb="lg">
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Paper p="md" withBorder>
            <Text size="sm" c="dimmed" mb="xs">Total in Queue</Text>
            <Text fw={700} size="xl" mb="xs">25</Text>
            <Group align="center">
              <Text size="xs" c="dimmed">Updated just now</Text>
            </Group>
          </Paper>
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Paper p="md" withBorder>
            <Text size="sm" c="dimmed" mb="xs">Avg. Processing Time</Text>
            <Text fw={700} size="xl" mb="xs">24:18</Text>
            <Group align="center">
              <Text size="xs" c="teal">-3.5%</Text>
              <Text size="xs" c="dimmed">vs last week</Text>
            </Group>
          </Paper>
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Paper p="md" withBorder>
            <Text size="sm" c="dimmed" mb="xs">System Load</Text>
            <Text fw={700} size="xl" mb="xs">42%</Text>
            <Group align="center">
              <Text size="xs" c="green">Normal</Text>
              <Text size="xs" c="dimmed">No delays expected</Text>
            </Group>
          </Paper>
        </Grid.Col>
      </Grid>
      
      {/* Tabs */}
      <Tabs value={activeTab} onChange={setActiveTab} mb="md">
        <Tabs.List>
          <Tabs.Tab value="processing">Processing Queues</Tabs.Tab>
          <Tabs.Tab value="completed">Recently Completed</Tabs.Tab>
          <Tabs.Tab value="failed">Failed Items</Tabs.Tab>
          <Tabs.Tab value="scheduled">Scheduled Jobs</Tabs.Tab>
        </Tabs.List>
      </Tabs>
      
      {/* Tab Content */}
      {activeTab === 'processing' && (
        <Grid>
          {queues.map((queue, index) => (
            <Grid.Col span={{ base: 12, md: 4 }} key={index}>
              <QueueCard {...queue} />
            </Grid.Col>
          ))}
        </Grid>
      )}
      
      {activeTab === 'completed' && (
        <Paper withBorder>
          <Box p="md" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
            <Group position="apart">
              <Text fw={500}>Recently Completed Items</Text>
              <Select
                placeholder="Today"
                data={['Today', 'Yesterday', 'Last 7 days']}
                defaultValue="Today"
                style={{ width: '150px' }}
              />
            </Group>
          </Box>
          
          <Box>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--mantine-color-gray-0)' }}>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '0.75rem', color: 'var(--mantine-color-gray-6)' }}>CALL ID</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '0.75rem', color: 'var(--mantine-color-gray-6)' }}>TIME</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '0.75rem', color: 'var(--mantine-color-gray-6)' }}>CATEGORY</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '0.75rem', color: 'var(--mantine-color-gray-6)' }}>STATUS</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '0.75rem', color: 'var(--mantine-color-gray-6)' }}>AGENT</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '0.75rem', color: 'var(--mantine-color-gray-6)' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {completedItems.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--mantine-color-gray-2)' }}>
                    <td style={{ padding: '12px 16px' }}>{item.id}</td>
                    <td style={{ padding: '12px 16px' }}>{item.time}</td>
                    <td style={{ padding: '12px 16px' }}>{item.category}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <Badge 
                        color={
                          item.status === 'Resolved' ? 'teal' : 
                          item.status === 'Escalated' ? 'blue' :
                          item.status === 'Workaround' ? 'yellow' : 'red'
                        }
                        variant="light"
                      >
                        {item.status}
                      </Badge>
                    </td>
                    <td style={{ padding: '12px 16px' }}>{item.agent}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <Button 
                        variant="subtle"
                        size="xs"
                        leftSection={<TablerIcons.IconEye size={14} />}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Paper>
      )}
      
      {activeTab === 'failed' && (
        <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 0' }}>
          <Box style={{ color: 'var(--mantine-color-gray-4)', marginBottom: '16px' }}>
            {TablerIcons.IconCheckupList && <TablerIcons.IconCheckupList size={48} />}
          </Box>
          <Text fw={500} mb="xs" size="lg">No failed items</Text>
          <Text c="dimmed" size="sm" align="center" style={{ maxWidth: '400px' }}>
            All processing tasks are currently running fine. Failed items will appear here if any errors occur.
          </Text>
        </Box>
      )}
      
      {activeTab === 'scheduled' && (
        <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 0' }}>
          <Box style={{ color: 'var(--mantine-color-gray-4)', marginBottom: '16px' }}>
            {TablerIcons.IconCalendarTime && <TablerIcons.IconCalendarTime size={48} />}
          </Box>
          <Text fw={500} mb="xs" size="lg">No scheduled jobs</Text>
          <Text c="dimmed" size="sm" align="center" style={{ maxWidth: '400px' }}>
            You don't have any scheduled batch processing jobs. Use the batch upload feature to schedule processing for off-peak hours.
          </Text>
          <Button 
            variant="light"
            mt="md"
            leftSection={<TablerIcons.IconPlus size={16} />}
          >
            Schedule New Job
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default Queues;