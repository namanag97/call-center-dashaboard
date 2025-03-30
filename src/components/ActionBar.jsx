// src/components/ActionBar.jsx
import { Group, TextInput, Button, Paper } from '@mantine/core';
import { IconSearch, IconCalendar, IconDownload } from '@tabler/icons-react';

function ActionBar() {
  return (
    <Paper p="md" mb="lg" withBorder>
      <Group justify="space-between">
        <TextInput
          placeholder="Search by call ID, agent, or issue..."
          leftSection={<IconSearch size={16} />}
          style={{ maxWidth: '400px', flex: 1 }}
        />
        
        <Group>
          <Button 
            variant="outline" 
            leftSection={<IconCalendar size={16} />}
          >
            Last 7 days
          </Button>
          
          <Button 
            variant="outline" 
            leftSection={<IconDownload size={16} />}
          >
            Export
          </Button>
        </Group>
      </Group>
    </Paper>
  );
}

export default ActionBar;