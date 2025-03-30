// src/components/ProcessingQueues.jsx
import { Paper, Title, Button, Box, Text, Group, Grid } from '@mantine/core';
import { IconRefresh } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

function QueueCard({ title, stats, items }) {
  return (
    <Paper withBorder style={{ height: '100%' }}>
      <Box bg="gray.0" p="sm" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
        <Text fw={600} size="sm">{title}</Text>
        <Text size="xs" c="dimmed" mt={4}>{stats}</Text>
      </Box>
      
      <Box style={{ maxHeight: '400px', overflow: 'auto' }}>
        {items.length === 0 ? (
          <Box p="sm" style={{ textAlign: 'center' }}>
            <Text size="sm" c="dimmed">No items in queue</Text>
          </Box>
        ) : (
          items.map((item, index) => (
            <Box key={index} p="sm" style={{ 
              borderBottom: index !== items.length - 1 ? '1px solid var(--mantine-color-gray-3)' : 'none' 
            }}>
              <Text fw={500} size="sm" mb={4}>{item.title}</Text>
              <Group justify="space-between" wrap="nowrap">
                <Text size="xs" c="dimmed">{item.meta1}</Text>
                <Text size="xs" c="dimmed">{item.meta2}</Text>
              </Group>
            </Box>
          ))
        )}
      </Box>
    </Paper>
  );
}

function ProcessingQueues({ recordings = [], onRefresh }) {
  const [queues, setQueues] = useState([
    {
      title: 'Upload Queue',
      stats: '0 calls pending',
      items: []
    },
    {
      title: 'Transcription Queue',
      stats: '0 calls in process',
      items: []
    },
    {
      title: 'Analysis Queue',
      stats: '0 transcripts pending',
      items: []
    }
  ]);
  
  useEffect(() => {
    if (recordings.length > 0) {
      // Group recordings by processing status
      const pendingValidation = recordings.filter(rec => rec.processing_status === 'pending_validation')
        .map(rec => ({
          title: rec.original_file_name,
          meta1: `${(rec.file_size_bytes / (1024 * 1024)).toFixed(1)} MB`,
          meta2: `Uploaded ${getTimeAgo(rec.ingestion_timestamp)}`
        }));
      
      const pendingTranscription = recordings.filter(rec => 
        rec.processing_status === 'pending_transcription' ||
        rec.processing_status === 'transcribing'
      ).map(rec => {
        const progress = rec.processing_status === 'transcribing' ? Math.floor(Math.random() * 100) : 0;
        return {
          title: rec.original_file_name,
          meta1: `Progress: ${progress}%`,
          meta2: `ETA: ${Math.floor(Math.random() * 10) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
        };
      });
      
      const pendingAnalysis = recordings.filter(rec => 
        rec.processing_status === 'pending_analysis' ||
        rec.processing_status === 'analyzing'
      ).map(rec => ({
        title: rec.original_file_name,
        meta1: rec.processing_status === 'analyzing' ? 'AI analysis in progress' : 'Queued',
        meta2: rec.processing_status === 'analyzing' ? 'Started recently' : `Position: ${Math.floor(Math.random() * 5) + 1}`
      }));
      
      setQueues([
        {
          title: 'Upload Queue',
          stats: `${pendingValidation.length} calls pending`,
          items: pendingValidation
        },
        {
          title: 'Transcription Queue',
          stats: `${pendingTranscription.length} calls in process`,
          items: pendingTranscription
        },
        {
          title: 'Analysis Queue',
          stats: `${pendingAnalysis.length} transcripts pending`,
          items: pendingAnalysis
        }
      ]);
    }
  }, [recordings]);
  
  // Helper function to format time ago
  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} mins ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  };
  
  return (
    <Paper withBorder mb="lg">
      <Group p="md" justify="space-between" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
        <Title order={4}>Processing Queues</Title>
        <Button 
          variant="subtle" 
          leftSection={<IconRefresh size={16} />}
          onClick={onRefresh}
        >
          Refresh
        </Button>
      </Group>
      
      <Box p="md">
        <Grid>
          {queues.map((queue, index) => (
            <Grid.Col span={{ base: 12, md: 4 }} key={index}>
              <QueueCard {...queue} />
            </Grid.Col>
          ))}
        </Grid>
      </Box>
    </Paper>
  );
}

export default ProcessingQueues;