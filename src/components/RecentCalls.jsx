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
  
  function RecentCalls() {
    // Dummy data for calls
    const calls = [
      {
        id: 'CALL-2023-0452',
        dateTime: 'Aug 21, 2023 14:35',
        duration: '08:42',
        category: 'Account Access > Login Issue > Password Reset',
        severity: { label: 'Medium', color: 'yellow' },
        status: { label: 'Resolved', color: 'teal' },
        agent: 'Raj Sharma'
      },
      {
        id: 'CALL-2023-0451',
        dateTime: 'Aug 21, 2023 13:22',
        duration: '15:18',
        category: 'Transactions > Failed Transfer > Technical Error',
        severity: { label: 'Critical', color: 'red' },
        status: { label: 'Escalated', color: 'blue' },
        agent: 'Priya Patel'
      },
      {
        id: 'CALL-2023-0450',
        dateTime: 'Aug 21, 2023 11:05',
        duration: '04:37',
        category: 'Product Info > Investment Plans > Documentation',
        severity: { label: 'Low', color: 'blue' },
        status: { label: 'Resolved', color: 'teal' },
        agent: 'Amit Kumar'
      },
      {
        id: 'CALL-2023-0449',
        dateTime: 'Aug 21, 2023 10:18',
        duration: '12:45',
        category: 'Customer Service > Complaint > Service Delay',
        severity: { label: 'Medium', color: 'yellow' },
        status: { label: 'Workaround', color: 'yellow' },
        agent: 'Sneha Gupta'
      },
      {
        id: 'CALL-2023-0448',
        dateTime: 'Aug 21, 2023 09:47',
        duration: '06:23',
        category: 'Technical Support > Mobile App > Feature Request',
        severity: { label: 'Low', color: 'blue' },
        status: { label: 'Unresolved', color: 'red' },
        agent: 'Vikram Singh'
      }
    ];
    
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
            defaultValue="All Categories"
            style={{ width: '200px' }}
          />
        </Group>
        
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
            {calls.map((call) => (
              <Table.Tr key={call.id}>
                <Table.Td>{call.id}</Table.Td>
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
                  >
                    View
                  </Button>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        
        <Box p="md" style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }}>
          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              Showing 1 to 5 of 128 entries
            </Text>
            
            <Group>
              <Button variant="subtle" size="sm" disabled>Previous</Button>
              <Button variant="filled" size="sm">1</Button>
              <Button variant="subtle" size="sm">2</Button>
              <Button variant="subtle" size="sm">3</Button>
              <Button variant="subtle" size="sm">Next</Button>
            </Group>
          </Group>
        </Box>
      </Paper>
    );
  }
  
  export default RecentCalls;