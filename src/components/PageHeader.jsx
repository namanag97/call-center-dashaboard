// src/components/PageHeader.jsx
import { Box, Title, Text, Group, Button } from '@mantine/core';
import { IconUpload, IconAdjustments } from '@tabler/icons-react';

function PageHeader({ title, subtitle, onUploadClick }) {
  return (
    <Box mb="lg">
      <Group justify="space-between" mb="md">
        <Box>
          <Title order={2} mb="xs">{title}</Title>
          <Text c="dimmed" size="sm">{subtitle}</Text>
        </Box>
        
        <Group>
          <Button 
            variant="outline" 
            leftSection={<IconAdjustments size={16} />}
          >
            Filters
          </Button>
          
          <Button 
            leftSection={<IconUpload size={16} />}
            onClick={onUploadClick}
          >
            Upload Calls
          </Button>
        </Group>
      </Group>
    </Box>
  );
}

export default PageHeader;