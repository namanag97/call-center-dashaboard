// src/components/RecordingsFilter.jsx
import { useState } from 'react';
import { 
  Paper, 
  Group, 
  TextInput, 
  Select, 
  Button, 
  Box, 
  Popover,
  Stack,
  Input
} from '@mantine/core';
import { IconSearch, IconFilter, IconX, IconCalendar } from '@tabler/icons-react';

function RecordingsFilter({ 
  searchValue, 
  onSearchChange, 
  dateRange, 
  onDateRangeChange,
  status,
  onStatusChange,
  onResetFilters,
  loading
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [fromDate, setFromDate] = useState(dateRange?.from ? new Date(dateRange.from).toISOString().split('T')[0] : '');
  const [toDate, setToDate] = useState(dateRange?.to ? new Date(dateRange.to).toISOString().split('T')[0] : '');
  
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'pending_validation', label: 'Pending Validation' },
    { value: 'pending_transcription', label: 'Pending Transcription' },
    { value: 'transcribing', label: 'Transcribing' },
    { value: 'transcription_completed', label: 'Transcription Completed' },
    { value: 'pending_analysis', label: 'Pending Analysis' },
    { value: 'analyzing', label: 'Analyzing' },
    { value: 'analysis_completed', label: 'Analysis Completed' },
    { value: 'transcription_failed', label: 'Transcription Failed' },
    { value: 'analysis_failed', label: 'Analysis Failed' }
  ];
  
  const hasActiveFilters = Boolean(
    dateRange?.from || 
    dateRange?.to || 
    (status && status !== '')
  );

  const handleDateChange = () => {
    const newRange = {
      from: fromDate ? new Date(fromDate) : null,
      to: toDate ? new Date(toDate) : null
    };
    onDateRangeChange(newRange);
  };
  
  return (
    <Paper p="md" mb="lg" withBorder>
      <Group position="apart">
        <TextInput
          placeholder="Search recordings..."
          leftSection={<IconSearch size={16} />}
          value={searchValue}
          onChange={onSearchChange}
          style={{ maxWidth: '400px', flex: 1 }}
          disabled={loading}
        />
        
        <Group>
          <Popover 
            opened={filtersOpen} 
            onClose={() => setFiltersOpen(false)}
            position="bottom-end"
            shadow="md"
          >
            <Popover.Target>
              <Button 
                variant={hasActiveFilters ? "filled" : "outline"}
                leftSection={<IconFilter size={16} />}
                onClick={() => setFiltersOpen(!filtersOpen)}
                disabled={loading}
              >
                Filters {hasActiveFilters && '(Active)'}
              </Button>
            </Popover.Target>
            
            <Popover.Dropdown>
              <Stack spacing="md" style={{ minWidth: '300px' }}>
                <Box>
                  <Input.Label>Date Range</Input.Label>
                  <Group spacing="xs">
                    <Input
                      type="date"
                      placeholder="From"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      rightSection={<IconCalendar size={16} />}
                      style={{ flex: 1 }}
                    />
                    <Input
                      type="date"
                      placeholder="To"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      rightSection={<IconCalendar size={16} />}
                      style={{ flex: 1 }}
                    />
                  </Group>
                </Box>
                
                <Box>
                  <Select
                    label="Status"
                    placeholder="Select status"
                    data={statusOptions}
                    value={status}
                    onChange={onStatusChange}
                    clearable
                  />
                </Box>
                
                <Group position="apart">
                  <Button 
                    variant="subtle" 
                    leftSection={<IconX size={16} />}
                    onClick={onResetFilters}
                    disabled={!hasActiveFilters}
                  >
                    Clear Filters
                  </Button>
                  
                  <Button onClick={() => {
                    handleDateChange();
                    setFiltersOpen(false);
                  }}>
                    Apply Filters
                  </Button>
                </Group>
              </Stack>
            </Popover.Dropdown>
          </Popover>
        </Group>
      </Group>
    </Paper>
  );
}

export default RecordingsFilter;