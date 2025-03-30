// src/pages/Uploads.jsx
import { useState } from 'react';
import { Box, Title, Text, Group, Button, Paper, Tabs, TextInput, Select, Grid } from '@mantine/core';
import * as TablerIcons from '@tabler/icons-react';
import UploadModal from '../components/UploadModal';

function Uploads() {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('recent');
  
  // Dummy data for uploads
  const uploadFiles = [
    {
      id: 'CALL-2023-0475',
      title: 'CALL-2023-0475.aac',
      uploadDate: 'Aug 21, 2023 15:42',
      fileSize: '12.4 MB',
      duration: '14:26',
      queue: 'Standard',
      progress: 45,
      status: 'processing'
    },
    {
      id: 'CALL-2023-0473',
      title: 'CALL-2023-0473.aac',
      uploadDate: 'Aug 21, 2023 15:30',
      fileSize: '15.3 MB',
      duration: '18:45',
      queue: 'Standard',
      progress: 32,
      status: 'processing'
    },
    {
      id: 'CALL-2023-0472',
      title: 'CALL-2023-0472.aac',
      uploadDate: 'Aug 21, 2023 15:22',
      fileSize: '7.8 MB',
      duration: '08:34',
      queue: 'Priority',
      category: 'Account Issues > Login > Password Reset',
      severity: 'Medium',
      progress: 100,
      status: 'completed'
    },
    {
      id: 'CALL-2023-0474',
      title: 'CALL-2023-0474.aac',
      uploadDate: 'Aug 21, 2023 15:38',
      fileSize: '8.7 MB',
      duration: '09:12',
      queue: 'Priority',
      progress: 78,
      status: 'processing'
    }
  ];

  return (
    <Box p="md">
      {/* Page Header */}
      <Box mb="lg">
        <Group justify="space-between" mb="md">
          <Box>
            <Title order={2} mb="xs">Call Uploads</Title>
            <Text c="dimmed" size="sm">Manage your call recording uploads and processing</Text>
          </Box>
          
          <Group>
            <Button 
              variant="outline" 
              leftSection={<TablerIcons.IconSettings size={16} />}
            >
              Upload Settings
            </Button>
            <Button 
              leftSection={<TablerIcons.IconUpload size={16} />}
              onClick={() => setUploadModalOpen(true)}
            >
              Upload Calls
            </Button>
          </Group>
        </Group>
      </Box>
      
      {/* Quick Upload Area */}
      <Paper withBorder mb="lg">
        <Box p="md" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
          <Title order={4}>Quick Upload</Title>
        </Box>
        
        <Box p="md">
          {/* Upload Drop Area */}
          <Box 
            style={{
              border: '2px dashed var(--mantine-color-gray-4)',
              borderRadius: 'var(--mantine-radius-md)',
              padding: '2rem',
              textAlign: 'center',
              cursor: 'pointer',
              marginBottom: '1rem'
            }}
          >
            <Box style={{ color: 'var(--mantine-color-gray-5)', marginBottom: '1rem' }}>
              {TablerIcons.IconUploadCloud && <TablerIcons.IconUploadCloud size={48} />}
            </Box>
            
            <Text fw={500} mb="xs">
              <strong>Click to upload</strong> or drag and drop call recordings
            </Text>
            
            <Text size="xs" c="dimmed">
              Supports AAC audio files (Max: 50MB per file)
            </Text>
          </Box>
          
          {/* Upload Options */}
          <Grid>
            <Grid.Col span={{ base: 12, sm: 4 }}>
              <Select
                label="Processing Queue"
                data={[
                  'Standard Queue (Processing time: ~30 mins)',
                  'Priority Queue (Processing time: ~10 mins)',
                  'Batch Processing (Schedule for off-peak hours)'
                ]}
                defaultValue="Standard Queue (Processing time: ~30 mins)"
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, sm: 4 }}>
              <Select
                label="Categories"
                data={[
                  'All Categories',
                  'Account Issues',
                  'Transaction Problems',
                  'Technical Support',
                  'Product Inquiries'
                ]}
                defaultValue="All Categories"
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, sm: 4 }}>
              <TextInput
                label="Tags"
                placeholder="E.g., product-inquiry, escalation, hindi"
              />
            </Grid.Col>
          </Grid>
        </Box>
      </Paper>
      
      {/* Search and Filter */}
      <Paper p="md" mb="lg" withBorder>
        <Group justify="space-between">
          <TextInput
            placeholder="Search by call ID, date, or status..."
            leftSection={<TablerIcons.IconSearch size={16} />}
            style={{ maxWidth: '400px', flex: 1 }}
          />
          
          <Group>
            <Button 
              variant="outline" 
              leftSection={<TablerIcons.IconFilter size={16} />}
            >
              Filter
            </Button>
            
            <Button 
              variant="outline" 
              leftSection={<TablerIcons.IconCalendar size={16} />}
            >
              Last 7 days
            </Button>
          </Group>
        </Group>
      </Paper>
      
      {/* Tabs */}
      <Tabs value={activeTab} onChange={setActiveTab} mb="md">
        <Tabs.List>
          <Tabs.Tab value="recent">Recent Uploads</Tabs.Tab>
          <Tabs.Tab value="processing">Processing</Tabs.Tab>
          <Tabs.Tab value="completed">Completed</Tabs.Tab>
          <Tabs.Tab value="failed">Failed</Tabs.Tab>
        </Tabs.List>
      </Tabs>
      
      {/* Upload Cards */}
      <Grid>
        {uploadFiles.map((file) => (
          <Grid.Col span={{ base: 12, sm: 6, lg: 4 }} key={file.id}>
            <Paper withBorder style={{ height: '100%' }}>
              {/* Card Header */}
              <Group p="sm" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)', background: 'var(--mantine-color-gray-0)' }}>
                <Box 
                  style={{ 
                    width: 32, 
                    height: 32, 
                    borderRadius: 'var(--mantine-radius-sm)',
                    background: file.status === 'completed' 
                      ? 'rgba(16, 185, 129, 0.1)' 
                      : 'var(--mantine-color-primary-light)',
                    color: file.status === 'completed' 
                      ? 'var(--mantine-color-success-filled)' 
                      : 'var(--mantine-color-primary-filled)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {file.status === 'completed' 
                    ? (TablerIcons.IconCheck && <TablerIcons.IconCheck size={16} />)
                    : (TablerIcons.IconMicrophone && <TablerIcons.IconMicrophone size={16} />)
                  }
                </Box>
                
                <Text fw={500} size="sm" style={{ flex: 1 }}>{file.title}</Text>
                
                <Button variant="subtle" compact p={0} style={{ color: 'var(--mantine-color-gray-5)' }}>
                  {TablerIcons.IconDotsVertical && <TablerIcons.IconDotsVertical size={16} />}
                </Button>
              </Group>
              
              {/* Card Content */}
              <Box p="md">
                <Grid gutter="xs">
                  <Grid.Col span={6}>
                    <Text size="xs" c="dimmed">Upload Date</Text>
                    <Text size="sm">{file.uploadDate}</Text>
                  </Grid.Col>
                  
                  <Grid.Col span={6}>
                    <Text size="xs" c="dimmed">File Size</Text>
                    <Text size="sm">{file.fileSize}</Text>
                  </Grid.Col>
                  
                  <Grid.Col span={6}>
                    <Text size="xs" c="dimmed">Duration</Text>
                    <Text size="sm">{file.duration}</Text>
                  </Grid.Col>
                  
                  <Grid.Col span={6}>
                    <Text size="xs" c="dimmed">Queue</Text>
                    <Text size="sm">{file.queue}</Text>
                  </Grid.Col>
                </Grid>
                
                {file.status === 'processing' && (
                  <Box mt="md">
                    <Group position="apart" mb="xs">
                      <Text size="xs">Transcription Progress</Text>
                      <Text size="xs">{file.progress}%</Text>
                    </Group>
                    <Box style={{ 
                      width: '100%', 
                      height: 6, 
                      background: 'var(--mantine-color-gray-2)',
                      borderRadius: 999,
                      overflow: 'hidden'
                    }}>
                      <Box style={{ 
                        width: `${file.progress}%`, 
                        height: '100%', 
                        background: 'var(--mantine-color-primary-filled)',
                        borderRadius: 999
                      }} />
                    </Box>
                  </Box>
                )}
                
                {file.status === 'completed' && file.category && (
                  <Box mt="md">
                    <Text size="xs" c="dimmed" mb="xs">Category</Text>
                    <Text size="sm" fw={500}>{file.category}</Text>
                    
                    <Group mt="sm">
                      <Box>
                        <Text size="xs" c="dimmed">Severity</Text>
                        <Box 
                          style={{ 
                            background: 'rgba(245, 158, 11, 0.1)', 
                            color: 'var(--mantine-color-yellow-7)',
                            borderRadius: 999,
                            padding: '2px 8px',
                            display: 'inline-block',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            marginTop: 4
                          }}
                        >
                          {file.severity}
                        </Box>
                      </Box>
                      
                      <Box>
                        <Text size="xs" c="dimmed">Status</Text>
                        <Box 
                          style={{ 
                            background: 'rgba(16, 185, 129, 0.1)', 
                            color: 'var(--mantine-color-teal-7)',
                            borderRadius: 999,
                            padding: '2px 8px',
                            display: 'inline-block',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            marginTop: 4
                          }}
                        >
                          Resolved
                        </Box>
                      </Box>
                    </Group>
                  </Box>
                )}
              </Box>
              
              {/* Card Footer */}
              <Group 
                p="sm" 
                position="apart" 
                style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }}
              >
                <Group spacing={4}>
                  {file.status === 'processing' ? (
                    <>
                      {TablerIcons.IconLoader && <TablerIcons.IconLoader size={12} />}
                      <Text size="xs">Processing</Text>
                    </>
                  ) : (
                    <>
                      {TablerIcons.IconCircleCheck && <TablerIcons.IconCircleCheck size={12} color="var(--mantine-color-teal-7)" />}
                      <Text size="xs" c="teal">Completed</Text>
                    </>
                  )}
                </Group>
                
                <Group spacing={8}>
                  {file.status === 'processing' && (
                    <Button variant="subtle" compact p={0} style={{ color: 'var(--mantine-color-gray-6)' }}>
                      {TablerIcons.IconPause && <TablerIcons.IconPause size={14} />}
                    </Button>
                  )}
                  
                  {file.status === 'completed' && (
                    <Button variant="subtle" compact p={0} style={{ color: 'var(--mantine-color-gray-6)' }}>
                      {TablerIcons.IconFileText && <TablerIcons.IconFileText size={14} />}
                    </Button>
                  )}
                  
                  <Button variant="subtle" compact p={0} style={{ color: 'var(--mantine-color-gray-6)' }}>
                    {TablerIcons.IconInfo && <TablerIcons.IconInfo size={14} />}
                  </Button>
                </Group>
              </Group>
            </Paper>
          </Grid.Col>
        ))}
      </Grid>
      
      {/* Upload Modal */}
      <UploadModal
        opened={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
      />
    </Box>
  );
}

export default Uploads;