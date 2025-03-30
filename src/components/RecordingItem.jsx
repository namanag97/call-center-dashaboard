// src/components/RecordingItem.jsx
import React from 'react';
import { Paper, Text, Group, Box } from '@mantine/core';

const RecordingItem = React.memo(function RecordingItem({ recording, isActive, onClick }) {
  // Format duration for display
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSecs = seconds % 60;
    return `${minutes}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // Get formatted date
  const getFormattedDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  // Get status display info
  const getStatusInfo = (status) => {
    switch(status) {
      case 'analysis_completed':
        return { label: 'Completed', color: 'teal' };
      case 'analyzing':
        return { label: 'Analyzing', color: 'blue' };
      case 'transcription_completed':
        return { label: 'Transcribed', color: 'yellow' };
      case 'transcribing':
        return { label: 'Transcribing', color: 'orange' };
      default:
        return status?.includes('failed') 
          ? { label: 'Failed', color: 'red' }
          : { label: status?.replace(/_/g, ' '), color: 'gray' };
    }
  };

  const { label, color } = getStatusInfo(recording.processing_status);

  return (
    <Paper 
      withBorder 
      p="sm" 
      mb="xs" 
      style={{ 
        cursor: 'pointer',
        background: isActive ? 'var(--color-primary-light, var(--mantine-color-primary-light))' : 'var(--color-paper, white)'
      }}
      onClick={() => onClick(recording.id)}
      data-testid={`recording-item-${recording.id}`}
    >
      <Text fw={500} size="sm">{recording.original_file_name}</Text>
      <Group position="apart" mb="xs">
        <Text size="xs" c="dimmed">
          {getFormattedDate(recording.ingestion_timestamp)}
        </Text>
        <Text size="xs" c="dimmed">
          {formatDuration(recording.duration_seconds)}
        </Text>
      </Group>
      <Text size="xs" c="dimmed" mb="xs">
        {recording.id.substring(0, 8)}...
      </Text>
      <Box 
        style={{ 
          display: 'inline-block', 
          backgroundColor: `var(--mantine-color-${color}-light)`,
          color: `var(--mantine-color-${color}-filled)`,
          padding: '3px 8px',
          borderRadius: '4px',
          fontSize: '0.75rem',
          fontWeight: 500
        }}
      >
        {label}
      </Box>
    </Paper>
  );
});

export default RecordingItem;