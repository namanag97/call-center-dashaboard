// src/components/ProcessingQueues.jsx
import { Paper, Title, Button, Box, Text, Group, Grid, Stack, Divider } from '@mantine/core';
import { IconRefresh } from '@tabler/icons-react';

function QueueCard({ title, stats, items }) {
  return (
    <Paper withBorder style={{ height: '100%' }}>
      <Box bg="gray.0" p="sm" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
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

function ProcessingQueues() {
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
  
  return (
    <Paper withBorder mb="lg">
      <Group p="md" justify="space-between" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
        <Title order={4}>Processing Queues</Title>
        <Button variant="subtle" leftSection={<IconRefresh size={16} />}>
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