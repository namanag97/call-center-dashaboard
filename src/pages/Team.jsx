// src/pages/Team.jsx
import { useState } from 'react';
import { Box, Title, Text, Group, Button, Paper, Grid, TextInput, Avatar, Badge, Tabs } from '@mantine/core';
import * as TablerIcons from '@tabler/icons-react';

function TeamMemberCard({ member }) {
  return (
    <Paper withBorder p="md">
      <Group>
        <Avatar 
          size="lg" 
          color={member.color} 
          radius="xl"
        >
          {member.initials}
        </Avatar>
        <Box>
          <Text fw={500}>{member.name}</Text>
          <Text size="xs" c="dimmed">{member.role}</Text>
          <Badge 
            color={member.status === 'Online' ? 'teal' : member.status === 'Away' ? 'yellow' : 'gray'} 
            variant="light"
            size="sm"
            mt="xs"
          >
            {member.status}
          </Badge>
        </Box>
      </Group>
    </Paper>
  );
}

function Team() {
  const [activeTab, setActiveTab] = useState('agents');
  
  // Dummy data for team members
  const teamMembers = [
    {
      id: 1,
      name: 'Raj Sharma',
      initials: 'RS',
      role: 'Senior Agent',
      status: 'Online',
      color: 'indigo'
    },
    {
      id: 2,
      name: 'Priya Patel',
      initials: 'PP',
      role: 'Team Lead',
      status: 'Online',
      color: 'violet'
    },
    {
      id: 3,
      name: 'Amit Kumar',
      initials: 'AK',
      role: 'Agent',
      status: 'Away',
      color: 'blue'
    },
    {
      id: 4,
      name: 'Sneha Gupta',
      initials: 'SG',
      role: 'Agent',
      status: 'Online',
      color: 'pink'
    },
    {
      id: 5,
      name: 'Vikram Singh',
      initials: 'VS',
      role: 'Senior Agent',
      status: 'Offline',
      color: 'cyan'
    },
    {
      id: 6,
      name: 'Neha Verma',
      initials: 'NV',
      role: 'Agent',
      status: 'Online',
      color: 'teal'
    }
  ];
  
  // Admin team members
  const adminMembers = [
    {
      id: 7,
      name: 'Amit Mehta',
      initials: 'AM',
      role: 'Admin',
      status: 'Online',
      color: 'red'
    },
    {
      id: 8,
      name: 'Sanjay Patel',
      initials: 'SP',
      role: 'System Manager',
      status: 'Online',
      color: 'orange'
    }
  ];
  
  return (
    <Box p="md">
      {/* Page Header */}
      <Box mb="lg">
        <Group justify="space-between" mb="md">
          <Box>
            <Title order={2} mb="xs">Team Management</Title>
            <Text c="dimmed" size="sm">Manage your call center agents and teams</Text>
          </Box>
          
          <Group>
            <Button 
              leftSection={<TablerIcons.IconUserPlus size={16} />}
            >
              Add Member
            </Button>
          </Group>
        </Group>
      </Box>
      
      {/* Tabs */}
      <Tabs value={activeTab} onChange={setActiveTab} mb="md">
        <Tabs.List>
          <Tabs.Tab value="agents">Agents</Tabs.Tab>
          <Tabs.Tab value="admins">Admins</Tabs.Tab>
        </Tabs.List>
      </Tabs>
      
      {/* Tab Content */}
      {activeTab === 'agents' && (
        <Grid>
          {teamMembers.map((member) => (
            <Grid.Col span={{ base: 12, sm: 6, lg: 4 }} key={member.id}>
              <TeamMemberCard member={member} />
            </Grid.Col>
          ))}
        </Grid>
      )}
      
      {activeTab === 'admins' && (
        <Grid>
          {adminMembers.map((member) => (
            <Grid.Col span={{ base: 12, sm: 6, lg: 4 }} key={member.id}>
              <TeamMemberCard member={member} />
            </Grid.Col>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default Team;