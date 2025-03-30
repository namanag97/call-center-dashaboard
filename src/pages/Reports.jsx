// src/pages/Reports.jsx
import { useState } from 'react';
import { Box, Title, Text, Group, Button, Paper, Grid, Select, Tabs, Badge } from '@mantine/core';
import * as TablerIcons from '@tabler/icons-react';

function ReportCard({ title, description, lastRun, frequency, icon: Icon }) {
  return (
    <Paper p="md" withBorder>
      <Group mb="md">
        <Box 
          style={{ 
            width: 40, 
            height: 40, 
            borderRadius: 'var(--mantine-radius-sm)',
            background: 'var(--mantine-color-primary-light)',
            color: 'var(--mantine-color-primary-filled)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {Icon && <Icon size={20} />}
        </Box>
        <Box>
          <Text fw={500}>{title}</Text>
          <Text size="xs" c="dimmed">{description}</Text>
        </Box>
      </Group>
      
      <Grid>
        <Grid.Col span={6}>
          <Text size="xs" c="dimmed">Last Run</Text>
          <Text size="sm">{lastRun}</Text>
        </Grid.Col>
        
        <Grid.Col span={6}>
          <Text size="xs" c="dimmed">Frequency</Text>
          <Text size="sm">{frequency}</Text>
        </Grid.Col>
      </Grid>
      
      <Group position="right" mt="lg">
        <Button 
          variant="outline" 
          size="xs"
          leftSection={<TablerIcons.IconHistory size={14} />}
        >
          History
        </Button>
        
        <Button 
          variant="outline" 
          size="xs"
          leftSection={<TablerIcons.IconDownload size={14} />}
        >
          Download
        </Button>
        
        <Button 
          size="xs"
          leftSection={<TablerIcons.IconRefresh size={14} />}
        >
          Run Now
        </Button>
      </Group>
    </Paper>
  );
}

function Reports() {
  const [activeTab, setActiveTab] = useState('standard');
  
  // Dummy data for reports
  const standardReports = [
    {
      title: 'Call Volume Report',
      description: 'Daily, weekly, and monthly call volume with trend analysis',
      lastRun: 'Today, 08:30 AM',
      frequency: 'Daily',
      icon: TablerIcons.IconChartBar
    },
    {
      title: 'Agent Performance',
      description: 'Call handling metrics by agent with KPI measurements',
      lastRun: 'Today, 08:30 AM',
      frequency: 'Daily',
      icon: TablerIcons.IconUsers
    },
    {
      title: 'Issue Categories',
      description: 'Distribution of call categories and subcategories',
      lastRun: 'Yesterday, 11:45 PM',
      frequency: 'Weekly',
      icon: TablerIcons.IconCategory
    },
    {
      title: 'Resolution Time',
      description: 'Average time to resolution by issue category',
      lastRun: 'Aug 20, 2023',
      frequency: 'Weekly',
      icon: TablerIcons.IconClock
    },
    {
      title: 'Call Sentiment',
      description: 'Analysis of customer sentiment during calls',
      lastRun: 'Aug 18, 2023',
      frequency: 'Weekly',
      icon: TablerIcons.IconMoodSmile
    },
    {
      title: 'Service Level Agreement',
      description: 'SLA compliance and violation reports',
      lastRun: 'Aug 15, 2023',
      frequency: 'Monthly',
      icon: TablerIcons.IconFileCheck
    }
  ];
  
  // Custom reports (fewer items)
  const customReports = [
    {
      title: 'Executive Summary',
      description: 'High-level overview of key metrics for management',
      lastRun: 'Aug 10, 2023',
      frequency: 'Monthly',
      icon: TablerIcons.IconReportAnalytics
    },
    {
      title: 'Critical Issues Tracker',
      description: 'Tracking of critical customer issues and resolutions',
      lastRun: 'Today, 06:15 AM',
      frequency: 'Daily',
      icon: TablerIcons.IconAlertTriangle
    }
  ];
  
  return (
    <Box p="md">
      {/* Page Header */}
      <Box mb="lg">
        <Group justify="space-between" mb="md">
          <Box>
            <Title order={2} mb="xs">Reports</Title>
            <Text c="dimmed" size="sm">View and manage automated analytics reports</Text>
          </Box>
          
          <Group>
            <Select
              placeholder="Time Range"
              data={[
                'Last 7 days',
                'Last 30 days',
                'Last 90 days',
                'Custom range'
              ]}
              defaultValue="Last 7 days"
              style={{ width: '150px' }}
            />
            
            <Button 
              variant="outline" 
              leftSection={<TablerIcons.IconFolder size={16} />}
            >
              Saved Reports
            </Button>
            
            <Button 
              leftSection={<TablerIcons.IconPlus size={16} />}
            >
              Create Report
            </Button>
          </Group>
        </Group>
      </Box>
      
      {/* Report Status Summary */}
      <Grid mb="lg">
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Paper p="md" withBorder>
            <Text size="sm" c="dimmed" mb="xs">Reports Generated</Text>
            <Text fw={700} size="xl" mb="xs">124</Text>
            <Group align="center">
              <Text size="xs" c="teal">+8%</Text>
              <Text size="xs" c="dimmed">vs last month</Text>
            </Group>
          </Paper>
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Paper p="md" withBorder>
            <Text size="sm" c="dimmed" mb="xs">Scheduled Reports</Text>
            <Text fw={700} size="xl" mb="xs">8</Text>
            <Group align="center">
              <Badge color="teal" variant="light" size="sm">All Active</Badge>
            </Group>
          </Paper>
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Paper p="md" withBorder>
            <Text size="sm" c="dimmed" mb="xs">Storage Used</Text>
            <Text fw={700} size="xl" mb="xs">356 MB</Text>
            <Group align="center">
              <Text size="xs" c="dimmed">Limit: 10 GB</Text>
            </Group>
          </Paper>
        </Grid.Col>
      </Grid>
      
      {/* Tabs */}
      <Tabs value={activeTab} onChange={setActiveTab} mb="md">
        <Tabs.List>
          <Tabs.Tab value="standard">Standard Reports</Tabs.Tab>
          <Tabs.Tab value="custom">Custom Reports</Tabs.Tab>
          <Tabs.Tab value="scheduled">Scheduled Reports</Tabs.Tab>
        </Tabs.List>
      </Tabs>
      
      {/* Tab Content */}
      {activeTab === 'standard' && (
        <Grid>
          {standardReports.map((report, index) => (
            <Grid.Col span={{ base: 12, md: 6 }} key={index}>
              <ReportCard {...report} />
            </Grid.Col>
          ))}
        </Grid>
      )}
      
      {activeTab === 'custom' && (
        <Grid>
          {customReports.map((report, index) => (
            <Grid.Col span={{ base: 12, md: 6 }} key={index}>
              <ReportCard {...report} />
            </Grid.Col>
          ))}
          
          {/* Add Report Card */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Paper 
              p="md" 
              withBorder 
              style={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                alignItems: 'center',
                borderStyle: 'dashed',
                cursor: 'pointer'
              }}
            >
              <Box 
                style={{ 
                  width: 48, 
                  height: 48, 
                  borderRadius: '50%',
                  background: 'var(--mantine-color-gray-1)',
                  color: 'var(--mantine-color-gray-6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16
                }}
              >
                {TablerIcons.IconPlus && <TablerIcons.IconPlus size={24} />}
              </Box>
              <Text fw={500} mb="xs">Create Custom Report</Text>
              <Text c="dimmed" size="sm" align="center">
                Build a tailored report with specific metrics and data filters
              </Text>
            </Paper>
          </Grid.Col>
        </Grid>
      )}
      
      {activeTab === 'scheduled' && (
        <Box>
          <Paper withBorder mb="lg">
            <Box p="md" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
              <Group position="apart">
                <Text fw={500}>Active Schedules</Text>
                <Button 
                  variant="subtle" 
                  size="xs"
                  leftSection={<TablerIcons.IconPlus size={14} />}
                >
                  Add Schedule
                </Button>
              </Group>
            </Box>
            
            <Box>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--mantine-color-gray-0)' }}>
                    <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '0.75rem', color: 'var(--mantine-color-gray-6)' }}>REPORT NAME</th>
                    <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '0.75rem', color: 'var(--mantine-color-gray-6)' }}>FREQUENCY</th>
                    <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '0.75rem', color: 'var(--mantine-color-gray-6)' }}>NEXT RUN</th>
                    <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '0.75rem', color: 'var(--mantine-color-gray-6)' }}>RECIPIENTS</th>
                    <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '0.75rem', color: 'var(--mantine-color-gray-6)' }}>STATUS</th>
                    <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '0.75rem', color: 'var(--mantine-color-gray-6)' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Daily Summary', frequency: 'Daily', nextRun: 'Tomorrow, 08:30 AM', recipients: 'Management Team', status: 'Active' },
                    { name: 'Weekly Performance', frequency: 'Weekly (Mon)', nextRun: 'Aug 28, 2023', recipients: 'Team Leaders', status: 'Active' },
                    { name: 'Monthly Analytics', frequency: 'Monthly (1st)', nextRun: 'Sep 1, 2023', recipients: 'Executive Team', status: 'Active' }
                  ].map((schedule, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid var(--mantine-color-gray-2)' }}>
                      <td style={{ padding: '12px 16px' }}>{schedule.name}</td>
                      <td style={{ padding: '12px 16px' }}>{schedule.frequency}</td>
                      <td style={{ padding: '12px 16px' }}>{schedule.nextRun}</td>
                      <td style={{ padding: '12px 16px' }}>{schedule.recipients}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <Badge color="teal" variant="light">
                          {schedule.status}
                        </Badge>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <Group spacing={8}>
                          <Button 
                            variant="subtle" 
                            size="xs"
                            p={0}
                            style={{ color: 'var(--mantine-color-gray-6)' }}
                          >
                            {TablerIcons.IconEdit && <TablerIcons.IconEdit size={14} />}
                          </Button>
                          
                          <Button 
                            variant="subtle" 
                            size="xs"
                            p={0}
                            style={{ color: 'var(--mantine-color-gray-6)' }}
                          >
                            {TablerIcons.IconTrash && <TablerIcons.IconTrash size={14} />}
                          </Button>
                        </Group>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </Paper>
          
          <Paper withBorder>
            <Box p="md" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
              <Text fw={500}>Delivery Settings</Text>
            </Box>
            
            <Box p="md">
              <Text mb="md">Configure how scheduled reports are delivered to recipients.</Text>
              
              <Grid>
                <Grid.Col span={6}>
                  <Text fw={500} size="sm" mb="xs">Email Delivery</Text>
                  <Group>
                    <Box 
                      style={{ 
                        width: 20, 
                        height: 20, 
                        borderRadius: '50%',
                        background: 'var(--mantine-color-teal-light)',
                        color: 'var(--mantine-color-teal-filled)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {TablerIcons.IconCheck && <TablerIcons.IconCheck size={12} />}
                    </Box>
                    <Text size="sm">Enabled</Text>
                  </Group>
                  <Text size="xs" c="dimmed" mt="xs">
                    Reports will be sent as PDF attachments to recipient email addresses.
                  </Text>
                </Grid.Col>
                
                <Grid.Col span={6}>
                  <Text fw={500} size="sm" mb="xs">Slack Integration</Text>
                  <Group>
                    <Box 
                      style={{ 
                        width: 20, 
                        height: 20, 
                        borderRadius: '50%',
                        background: 'var(--mantine-color-gray-2)',
                        color: 'var(--mantine-color-gray-5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {TablerIcons.IconX && <TablerIcons.IconX size={12} />}
                    </Box>
                    <Text size="sm">Disabled</Text>
                  </Group>
                  <Text size="xs" c="dimmed" mt="xs">
                    Connect Slack to deliver reports directly to channels.
                  </Text>
                </Grid.Col>
              </Grid>
              
              <Button 
                variant="light" 
                size="sm" 
                leftSection={<TablerIcons.IconSettings size={14} />}
                mt="lg"
              >
                Configure Delivery Settings
              </Button>
            </Box>
          </Paper>
        </Box>
      )}
    </Box>
  );
}

export default Reports;