// src/components/RecentCalls.jsx
import { 
    Paper, 
    Title, 
    Select, 
    Table, 
    Group, 
    Badge, 
    Button, 
    Text,
    Box
  } from '@mantine/core';
  import { IconEye } from '@tabler/icons-react';
  import { useNavigate } from 'react-router-dom';
  import { useEffect, useState } from 'react';
  
  function RecentCalls({ recordings = [] }) {
    const [category, setCategory] = useState('All Categories');
    const [formattedCalls, setFormattedCalls] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
      // Format recordings for display
      const calls = recordings.map(rec => {
        // Extract date and time
        const date = new Date(rec.ingestion_timestamp);
        const dateTime = `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        
        // Format duration
        const minutes = Math.floor(rec.duration_seconds / 60);
        const seconds = rec.duration_seconds % 60;
        const duration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Determine category (in a real app, this would come from analysis data)
        let category, severity, status, agent;
        
        // For demo purposes, assign mock values based on the recording ID
        const idSum = rec.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
        
        // Set mock values based on the id sum (just for variety)
        const categories = [
          'Account Access > Login Issue > Password Reset',
          'Transactions > Failed Transfer > Technical Error',
          'Product Info > Investment Plans > Documentation',
          'Customer Service > Complaint > Service Delay',
          'Technical Support > Mobile App > Feature Request'
        ];
        
        const severities = [
          { label: 'Low', color: 'blue' },
          { label: 'Medium', color: 'yellow' },
          { label: 'High', color: 'orange' },
          { label: 'Critical', color: 'red' }
        ];
        
        const statuses = [
          { label: 'Unresolved', color: 'red' },
          { label: 'In Progress', color: 'blue' },
          { label: 'Workaround', color: 'yellow' },
          { label: 'Resolved', color: 'teal' },
          { label: 'Escalated', color: 'indigo' }
        ];
        
        const agents = [
          'Raj Sharma',
          'Priya Patel',
          'Amit Kumar',
          'Sneha Gupta',
          'Vikram Singh'
        ];
        
        category = categories[idSum % categories.length];
        severity = severities[idSum % severities.length];
        status = statuses[idSum % statuses.length];
        agent = agents[idSum % agents.length];
        
        return {
          id: rec.id,
          dateTime,
          duration,
          category,
          severity,
          status,
          agent,
          original_file_name: rec.original_file_name
        };
      });
      
      setFormattedCalls(calls);
    }, [recordings]);
    
    // Filter by category if not "All Categories"
    const filteredCalls = category === 'All Categories' 
      ? formattedCalls 
      : formattedCalls.filter(call => call.category.includes(category));
    
    const handleViewClick = (id) => {
      navigate(`/transcripts?id=${id}`);
    };
    
    return (
      <Paper withBorder mb="lg">
        <Group p="md" justify="space-between" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
          <Title order={4}>Recent Call Analysis</Title>
          <Select
            placeholder="All Categories"
            data={[
              'All Categories',
              'Account Issues',
              'Transaction Problems',
              'Technical Support',
              'Product Inquiries'
            ]}
            value={category}
            onChange={setCategory}
            style={{ width: '200px' }}
          />
        </Group>
        
        {filteredCalls.length === 0 ? (
          <Box p="xl" style={{ textAlign: 'center' }}>
            <Text c="dimmed">No calls found</Text>
          </Box>
        ) : (
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Call ID</Table.Th>
                <Table.Th>Date & Time</Table.Th>
                <Table.Th>Duration</Table.Th>
                <Table.Th>Category</Table.Th>
                <Table.Th>Severity</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Agent</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredCalls.map((call) => (
                <Table.Tr key={call.id}>
                  <Table.Td>{call.original_file_name}</Table.Td>
                  <Table.Td>{call.dateTime}</Table.Td>
                  <Table.Td>{call.duration}</Table.Td>
                  <Table.Td>{call.category}</Table.Td>
                  <Table.Td>
                    <Badge color={call.severity.color} variant="light">
                      {call.severity.label}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={call.status.color} variant="light">
                      {call.status.label}
                    </Badge>
                  </Table.Td>
                  <Table.Td>{call.agent}</Table.Td>
                  <Table.Td>
                    <Button 
                      variant="subtle" 
                      size="xs"
                      leftSection={<IconEye size={14} />}
                      onClick={() => handleViewClick(call.id)}
                    >
                      View
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
        
        <Box p="md" style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }}>
          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              Showing 1 to {filteredCalls.length} of {filteredCalls.length} entries
            </Text>
            
            <Group>
              <Button variant="subtle" size="sm" disabled>Previous</Button>
              <Button variant="filled" size="sm">1</Button>
              <Button variant="subtle" size="sm" disabled>Next</Button>
            </Group>
          </Group>
        </Box>
      </Paper>
    );
  }
  
  export default RecentCalls;