// src/pages/Settings.jsx
import { useState } from 'react';
import { Box, Title, Text, Group, Button, Paper, Grid, Switch, Select, TextInput, Tabs, Divider } from '@mantine/core';
import * as TablerIcons from '@tabler/icons-react';

function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  
  return (
    <Box p="md">
      {/* Page Header */}
      <Box mb="lg">
        <Group justify="space-between" mb="md">
          <Box>
            <Title order={2} mb="xs">Settings</Title>
            <Text c="dimmed" size="sm">Configure system preferences and settings</Text>
          </Box>
        </Group>
      </Box>
      
      <Grid>
        {/* Left sidebar with settings categories */}
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Paper withBorder p="md">
            <Tabs value={activeTab} onChange={setActiveTab} orientation="vertical">
              <Tabs.List>
                <Tabs.Tab value="general" leftSection={<TablerIcons.IconSettings size={16} />}>
                  General
                </Tabs.Tab>
                <Tabs.Tab value="account" leftSection={<TablerIcons.IconUser size={16} />}>
                  Account
                </Tabs.Tab>
                <Tabs.Tab value="notifications" leftSection={<TablerIcons.IconBell size={16} />}>
                  Notifications
                </Tabs.Tab>
                <Tabs.Tab value="api" leftSection={<TablerIcons.IconApi size={16} />}>
                  API Settings
                </Tabs.Tab>
                <Tabs.Tab value="transcription" leftSection={<TablerIcons.IconFileText size={16} />}>
                  Transcription
                </Tabs.Tab>
                <Tabs.Tab value="security" leftSection={<TablerIcons.IconLock size={16} />}>
                  Security
                </Tabs.Tab>
              </Tabs.List>
            </Tabs>
          </Paper>
        </Grid.Col>
        
        {/* Right content area */}
        <Grid.Col span={{ base: 12, md: 9 }}>
          {activeTab === 'general' && (
            <Paper withBorder p="md">
              <Title order={4} mb="md">General Settings</Title>
              
              <Box mb="lg">
                <Text fw={500} mb="xs">System Preferences</Text>
                <Divider mb="md" />
                
                <Grid>
                  <Grid.Col span={8}>
                    <Text>Default Dashboard View</Text>
                    <Text size="xs" c="dimmed">Select the default view when logging into the system</Text>
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <Select
                      data={[
                        'Call Analytics',
                        'Agent Dashboard',
                        'Queue Status',
                        'System Overview'
                      ]}
                      defaultValue="Call Analytics"
                    />
                  </Grid.Col>
                </Grid>
                
                <Divider my="md" />
                
                <Grid>
                  <Grid.Col span={8}>
                    <Text>Time Zone</Text>
                    <Text size="xs" c="dimmed">Set the default time zone for reports and timestamps</Text>
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <Select
                      data={[
                        'UTC (Coordinated Universal Time)',
                        'IST (India Standard Time)',
                        'EST (Eastern Standard Time)',
                        'PST (Pacific Standard Time)'
                      ]}
                      defaultValue="IST (India Standard Time)"
                    />
                  </Grid.Col>
                </Grid>
                
                <Divider my="md" />
                
                <Grid>
                  <Grid.Col span={8}>
                    <Text>Enable Dark Mode</Text>
                    <Text size="xs" c="dimmed">Toggle between light and dark interface theme</Text>
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <Switch size="md" />
                  </Grid.Col>
                </Grid>
              </Box>
              
              <Box mb="lg">
                <Text fw={500} mb="xs">System Performance</Text>
                <Divider mb="md" />
                
                <Grid>
                  <Grid.Col span={8}>
                    <Text>Max Upload Size</Text>
                    <Text size="xs" c="dimmed">Maximum file size for call recordings (MB)</Text>
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <TextInput defaultValue="50" />
                  </Grid.Col>
                </Grid>
                
                <Divider my="md" />
                
                <Grid>
                  <Grid.Col span={8}>
                    <Text>Concurrency Limit</Text>
                    <Text size="xs" c="dimmed">Maximum number of simultaneous processes</Text>
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <TextInput defaultValue="10" />
                  </Grid.Col>
                </Grid>
                
                <Divider my="md" />
                
                <Grid>
                  <Grid.Col span={8}>
                    <Text>Auto-refresh Dashboard</Text>
                    <Text size="xs" c="dimmed">Automatically refresh dashboard data</Text>
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <Select
                      data={[
                        'Off',
                        '30 seconds',
                        '1 minute',
                        '5 minutes',
                        '15 minutes'
                      ]}
                      defaultValue="5 minutes"
                    />
                  </Grid.Col>
                </Grid>
              </Box>
              
              <Group position="right">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </Group>
            </Paper>
          )}
          
          {activeTab === 'account' && (
            <Paper withBorder p="md">
              <Title order={4} mb="md">Account Settings</Title>
              <Text c="dimmed">Manage your account preferences, profile and login information.</Text>
            </Paper>
          )}
          
          {activeTab === 'notifications' && (
            <Paper withBorder p="md">
              <Title order={4} mb="md">Notification Settings</Title>
              <Text c="dimmed">Configure email, in-app, and mobile notification preferences.</Text>
            </Paper>
          )}
          
          {activeTab === 'api' && (
            <Paper withBorder p="md">
              <Title order={4} mb="md">API Settings</Title>
              <Text c="dimmed">Manage API keys, webhooks, and integration settings.</Text>
            </Paper>
          )}
          
          {activeTab === 'transcription' && (
            <Paper withBorder p="md">
              <Title order={4} mb="md">Transcription Settings</Title>
              <Text c="dimmed">Configure speech-to-text engines, accuracy preferences, and language settings.</Text>
            </Paper>
          )}
          
          {activeTab === 'security' && (
            <Paper withBorder p="md">
              <Title order={4} mb="md">Security Settings</Title>
              <Text c="dimmed">Manage authentication, password policies, and access controls.</Text>
            </Paper>
          )}
        </Grid.Col>
      </Grid>
    </Box>
  );
}

export default Settings;