// src/pages/Uploads.jsx
import { useState, useEffect } from 'react';
import { Box, Title, Text, Group, Button, Paper, Tabs, TextInput, Select, Grid, Badge, Progress } from '@mantine/core';
import { IconSearch, IconFilter, IconCalendar, IconRefresh, IconUpload } from '@tabler/icons-react';
import UploadModal from '../components/UploadModal';
import { useRecordings } from '../hooks/useRecordings';

function Uploads() {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('recent');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { recordings, loading, error, fetchRecordings } = useRecordings();
  
  // Filter recordings based on search and status
  const filteredRecordings = recordings.filter(rec => {
    const matchesSearch = searchQuery 
      ? rec.original_file_name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    const matchesTab = activeTab === 'recent' ? true :
                      activeTab === 'processing' ? 
                        ['pending_validation', 'pending_transcription', 'transcribing', 'pending_analysis', 'analyzing'].includes(rec.processing_status) :
                      activeTab === 'completed' ? 
                        ['transcription_completed', 'analysis_completed'].includes(rec.processing_status) :
                      activeTab === 'failed' ? 
                        ['transcription_failed', 'analysis_failed'].includes(rec.processing_status) :
                      true;
    
    return matchesSearch && matchesTab;
  });
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleRefresh = () => {
    fetchRecordings();
  };
  
  // Format date for display
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  // Format duration
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
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
              leftSection={<IconRefresh size={16} />}
              onClick={handleRefresh}
            >
              Refresh
            </Button>
            <Button 
              leftSection={<IconUpload size={16} />}
              onClick={() => setUploadModalOpen(true)}
            >
              Upload Calls
            </Button>
          </Group>
        </Group>
      </Box>
      
      {/* Search and Filter */}
      <Paper p="md" mb="lg" withBorder>
        <Group justify="space-between">
          <TextInput
            placeholder="Search by file name, date, or status..."
            leftSection={<IconSearch size={16} />}
            style={{ maxWidth: '400px', flex: 1 }}
            value={searchQuery}
            onChange={handleSearchChange}
          />
          
          <Group>
            <Button 
              variant="outline" 
              leftSection={<IconFilter size={16} />}
            >
              Filter
            </Button>
            
            <Button 
              variant="outline" 
              leftSection={<IconCalendar size={16} />}
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
      {loading ? (
        <Text align="center" my="xl">Loading uploads...</Text>
      ) : error ? (
        <Text align="center" my="xl" color="red">{error}</Text>
      ) : filteredRecordings.length === 0 ? (
        <Text align="center" my="xl">No recordings found</Text>
      ) : (
        <Grid>
          {filteredRecordings.map((recording) => {
            // Determine status and progress
            let status = recording.processing_status;
            let progress = 0;
            
            switch (status) {
              case 'pending_validation':
                progress = 10;
                break;
              case 'pending_transcription':
                progress = 20;
                break;
              case 'transcribing':
                progress = 50;
                break;
              case 'transcription_completed':
              case 'pending_analysis':
                progress = 75;
                break;
              case 'analyzing':
                progress = 90;
                break;
              case 'analysis_completed':
                progress = 100;
                break;
              default:
                progress = 0;
            }
            
            // Determine if processing or completed
            const isProcessing = progress < 100 && !status.includes('failed');
            const isCompleted = progress === 100;
            
            return (
              <Grid.Col span={{ base: 12, sm: 6, lg: 4 }} key={recording.id}>
                <Paper withBorder style={{ height: '100%' }}>
                  {/* Card Header */}
                  <Group p="sm" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)', background: 'var(--mantine-color-gray-0)' }}>
                    <Box style={{ flex: 1 }}>
                      <Text fw={500} size="sm">{recording.original_file_name}</Text>
                      <Text size="xs" c="dimmed">{recording.id}</Text>
                    </Box>
                  </Group>
                  
                  {/* Card Content */}
                  <Box p="md">
                    <Grid gutter="xs">
                      <Grid.Col span={6}>
                        <Text size="xs" c="dimmed">Upload Date</Text>
                        <Text size="sm">{formatDate(recording.ingestion_timestamp)}</Text>
                      </Grid.Col>
                      
                      <Grid.Col span={6}>
                        <Text size="xs" c="dimmed">File Size</Text>
                        <Text size="sm">{formatFileSize(recording.file_size_bytes)}</Text>
                      </Grid.Col>
                      
                      <Grid.Col span={6}>
                        <Text size="xs" c="dimmed">Duration</Text>
                        <Text size="sm">{formatDuration(recording.duration_seconds)}</Text>
                      </Grid.Col>
                      
                      <Grid.Col span={6}>
                        <Text size="xs" c="dimmed">Status</Text>
                        <Badge 
                          color={
                            status.includes('failed') ? 'red' : 
                            isCompleted ? 'teal' : 
                            'blue'
                          } 
                          variant="light"
                        >
                          {status.replace(/_/g, ' ')}
                        </Badge>
                      </Grid.Col>
                    </Grid>
                    
                    {isProcessing && (
                      <Box mt="md">
                        <Group position="apart" mb="xs">
                          <Text size="xs">Processing Progress</Text>
                          <Text size="xs">{progress}%</Text>
                        </Group>
                        <Progress value={progress} />
                      </Box>
                    )}
                  </Box>
                  
                  {/* Card Footer */}
                  <Group 
                    p="sm" 
                    position="apart" 
                    style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }}
                  >
                    <Text size="xs" c={isCompleted ? 'teal' : 'dimmed'}>
                      {isCompleted ? 'Completed' : isProcessing ? 'Processing' : 'Failed'}
                    </Text>
                    
                    <Group spacing={8}>
                      <Button variant="subtle" size="xs">
                        Details
                      </Button>
                    </Group>
                  </Group>
                </Paper>
              </Grid.Col>
            );
          })}
        </Grid>
      )}
      
      {/* Upload Modal */}
      <UploadModal
        opened={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
      />
    </Box>
  );
}

export default Uploads;