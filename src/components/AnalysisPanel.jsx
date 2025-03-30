// src/components/AnalysisPanel.jsx
import { Box, Title, Text, Group, Paper, Grid, Badge } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

function AnalysisPanel({ recording, analysis }) {
  if (!recording) return null;
  
  // Format entity type for display
  const formatEntityType = (type) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };
  
  // Get sentiment label
  const getSentimentLabel = (score) => {
    if (score > 0.3) return 'Positive';
    if (score < -0.3) return 'Negative';
    return 'Neutral';
  };
  
  return (
    <>
      {/* Call Information */}
      <Paper withBorder mb="md">
        <Group p="sm" position="apart" style={{ 
          borderBottom: '1px solid var(--color-border, var(--mantine-color-gray-3))' 
        }}>
          <Text fw={500} size="sm">Call Information</Text>
          <IconInfoCircle size={16} style={{ 
            color: 'var(--color-text-secondary, var(--mantine-color-gray-5))' 
          }} />
        </Group>
        
        <Box p="md">
          <Grid gutter="xs">
            <Grid.Col span={12}>
              <Text size="xs" c="dimmed">File Name</Text>
              <Text size="sm">{recording.original_file_name}</Text>
            </Grid.Col>
            
            <Grid.Col span={12}>
              <Text size="xs" c="dimmed">Date & Time</Text>
              <Text size="sm">{new Date(recording.ingestion_timestamp).toLocaleString()}</Text>
            </Grid.Col>
            
            <Grid.Col span={12}>
              <Text size="xs" c="dimmed">Duration</Text>
              <Text size="sm">
                {Math.floor(recording.duration_seconds / 60)}:{(recording.duration_seconds % 60).toString().padStart(2, '0')}
              </Text>
            </Grid.Col>
            
            <Grid.Col span={12}>
              <Text size="xs" c="dimmed">Status</Text>
              <StatusBadge status={recording.processing_status} />
            </Grid.Col>
          </Grid>
        </Box>
      </Paper>
      
      {/* AI Analysis */}
      {analysis && (
        <Paper withBorder mb="md">
          <Group p="sm" position="apart" style={{ 
            borderBottom: '1px solid var(--color-border, var(--mantine-color-gray-3))' 
          }}>
            <Text fw={500} size="sm">AI Analysis</Text>
          </Group>
          
          <Box p="md">
            <Box mb="md">
              <Text size="xs" c="dimmed" mb="xs">Issue Category</Text>
              <Text size="sm">{analysis.category}</Text>
            </Box>
            
            <Box mb="md">
              <Text size="xs" c="dimmed" mb="xs">Severity</Text>
              <StatusBadge status={analysis.severity} />
            </Box>
            
            <Box mb="md">
              <Text size="xs" c="dimmed" mb="xs">Customer Sentiment</Text>
              <Text size="sm" mb="xs">
                {getSentimentLabel(analysis.sentiment.overall)}
              </Text>
              
              <Group position="apart" mb="xs">
                <Text size="xs" c="red">Negative</Text>
                <Text size="xs" c="teal">Positive</Text>
              </Group>
              
              <Box className="sentiment-gradient" style={{ 
                height: 8, 
                background: 'linear-gradient(to right, #ef4444, #d1d5db, #10b981)',
                borderRadius: 9999,
                position: 'relative',
                marginBottom: 8
              }}>
                <Box style={{ 
                  width: 12, 
                  height: 12, 
                  background: 'white',
                  border: '2px solid var(--color-text-primary, var(--mantine-color-gray-7))',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: '50%',
                  left: `${((analysis.sentiment.overall + 1) / 2) * 100}%`,
                  transform: 'translate(-50%, -50%)'
                }} />
              </Box>
            </Box>
            
            {analysis.entities && analysis.entities.length > 0 && (
              <Box mb="md">
                <Text size="xs" c="dimmed" mb="xs">Extracted Entities</Text>
                
                <Box style={{ borderTop: '1px solid var(--color-border, var(--mantine-color-gray-2))' }}>
                  {analysis.entities.map((entity, index) => (
                    <Group 
                      key={index}
                      position="apart" 
                      py="xs" 
                      style={{ 
                        borderBottom: index !== analysis.entities.length - 1 ? 
                          '1px solid var(--color-border, var(--mantine-color-gray-2))' : 'none' 
                      }}
                    >
                      <Text size="xs" c="dimmed">{formatEntityType(entity.type)}</Text>
                      <Text size="xs" fw={500}>{entity.value}</Text>
                    </Group>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </Paper>
      )}
    </>
  );
}

// Status badge component
function StatusBadge({ status }) {
  const getStatusInfo = (status) => {
    switch(status) {
      case 'analysis_completed':
      case 'completed':
        return { label: 'Completed', color: 'teal' };
      case 'analyzing':
        return { label: 'Analyzing', color: 'blue' };
      case 'transcription_completed':
        return { label: 'Transcribed', color: 'yellow' };
      case 'transcribing':
        return { label: 'Transcribing', color: 'orange' };
      case 'critical':
        return { label: 'Critical', color: 'red' };
      case 'high':
        return { label: 'High', color: 'orange' };
      case 'medium':
        return { label: 'Medium', color: 'yellow' };
      case 'low':
        return { label: 'Low', color: 'blue' };
      default:
        return status?.includes('failed') 
          ? { label: 'Failed', color: 'red' }
          : { label: status?.replace(/_/g, ' '), color: 'gray' };
    }
  };

  const { label, color } = getStatusInfo(status);
  
  return (
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
  );
}

export default AnalysisPanel;