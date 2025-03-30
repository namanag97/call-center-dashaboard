// src/components/ActionBar.jsx
import { Group, TextInput, Button, Paper } from '@mantine/core';
import { IconSearch, IconCalendar, IconDownload, IconRefresh } from '@tabler/icons-react';

function ActionBar({ onSearchChange, onFilterClick, onRefreshClick }) {
  return (
    <Paper p="md" mb="lg" withBorder>
      <Group justify="space-between">
        <TextInput
          placeholder="Search by call ID, agent, or issue..."
          leftSection={<IconSearch size={16} />}
          style={{ maxWidth: '400px', flex: 1 }}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
        />
        
        <Group>
          <Button 
            variant="outline" 
            leftSection={<IconCalendar size={16} />}
            onClick={() => onFilterClick && onFilterClick()}
          >
            Last 7 days
          </Button>
          
          <Button 
            variant="outline" 
            leftSection={<IconDownload size={16} />}
          >
            Export
          </Button>
          
          <Button 
            variant="outline" 
            leftSection={<IconRefresh size={16} />}
            onClick={() => onRefreshClick && onRefreshClick()}
          >
            Refresh
          </Button>
        </Group>
      </Group>
    </Paper>
  );
}

export default ActionBar;