// src/pages/Transcripts.jsx
import { useState } from 'react';
import { Box, Title, Text, Group, Button, Paper, Grid, TextInput, Tabs, Badge, Divider, Avatar } from '@mantine/core';
import * as TablerIcons from '@tabler/icons-react';

// RecordingItem component for the left panel
function RecordingItem({ recording, isActive, onClick }) {
  return (
    <Paper 
      withBorder 
      p="sm" 
      mb="xs" 
      style={{ 
        cursor: 'pointer',
        background: isActive ? 'var(--mantine-color-primary-light)' : 'white'
      }}
      onClick={() => onClick(recording.id)}
    >
      <Text fw={500} size="sm">{recording.id}</Text>
      <Text size="xs" c="dimmed" mb="xs">{recording.category}</Text>
      <Group position="apart" mb="xs">
        <Text size="xs" c="dimmed">{recording.date}</Text>
        <Text size="xs" c="dimmed">{recording.duration}</Text>
      </Group>
      <Group position="apart">
        <Badge 
          color={
            recording.status === 'Resolved' ? 'teal' : 
            recording.status === 'Escalated' ? 'blue' :
            recording.status === 'Workaround' ? 'yellow' : 'red'
          }
          variant="light"
          size="sm"
        >
          {recording.status}
        </Badge>
        <Text size="xs" c="dimmed">{recording.agent}</Text>
      </Group>
    </Paper>
  );
}

// Message component for the chat panel
function Message({ sender, content, time, isAgent }) {
  return (
    <Group align="flex-start" position={isAgent ? 'left' : 'right'} noWrap mt="md">
      {isAgent && (
        <Avatar color="indigo" radius="xl">A</Avatar>
      )}
      
      <Box 
        style={{
          background: isAgent ? 'white' : 'var(--mantine-color-primary-light)',
          padding: '10px 14px',
          borderRadius: 12,
          maxWidth: '70%',
          border: isAgent ? '1px solid var(--mantine-color-gray-3)' : 'none',
          position: 'relative'
        }}
      >
        <Text 
          size="xs" 
          fw={500} 
          mb="xs" 
          c={isAgent ? 'indigo' : 'gray.7'}
        >
          {isAgent ? 'Agent (Priya)' : 'Customer'}
        </Text>
        
        <Text size="sm">{content}</Text>
        <Text size="xs" c="dimmed" align="right" mt="xs">{time}</Text>
      </Box>
      
      {!isAgent && (
        <Avatar color="gray" radius="xl">C</Avatar>
      )}
    </Group>
  );
}

function Transcripts() {
  const [activeRecording, setActiveRecording] = useState('CALL-2023-0451');
  const [activeTab, setActiveTab] = useState('transcript');
  
  // Dummy data for recordings
  const recordings = [
    { 
      id: 'CALL-2023-0451', 
      date: 'Aug 21, 2023', 
      duration: '15:18',
      category: 'Transactions > Failed Transfer',
      status: 'Escalated',
      agent: 'Priya Patel'
    },
    { 
      id: 'CALL-2023-0450', 
      date: 'Aug 21, 2023', 
      duration: '04:37',
      category: 'Product Info > Investment Plans',
      status: 'Resolved',
      agent: 'Amit Kumar'
    },
    { 
      id: 'CALL-2023-0449', 
      date: 'Aug 21, 2023', 
      duration: '12:45',
      category: 'Customer Service > Complaint',
      status: 'Workaround',
      agent: 'Sneha Gupta'
    },
    { 
      id: 'CALL-2023-0448', 
      date: 'Aug 21, 2023', 
      duration: '06:23',
      category: 'Technical Support > Mobile App',
      status: 'Unresolved',
      agent: 'Vikram Singh'
    }
  ];

  // Dummy conversation data
  const messages = [
    { 
      id: 1,
      sender: 'agent',
      content: 'Thank you for calling ABC Financial Services. My name is Priya. How may I help you today?',
      time: '00:07'
    },
    { 
      id: 2,
      sender: 'customer',
      content: 'Hi, I\'ve been trying to transfer money to my son\'s account but the transaction keeps failing. I\'ve tried three times already and each time I get an error message.',
      time: '00:22'
    },
    { 
      id: 3,
      sender: 'agent',
      content: 'I\'m sorry to hear that you\'re experiencing issues with your transfer. I\'d be happy to help you resolve this. Could you please verify your account by providing your customer ID?',
      time: '00:38'
    },
    { 
      id: 4,
      sender: 'customer',
      content: 'Yes, it\'s CUST00584.',
      time: '00:45'
    },
    { 
      id: 5,
      sender: 'agent',
      content: 'Thank you for verifying. Now, could you please tell me when you tried to make this transfer and what error message you received?',
      time: '00:52'
    },
    { 
      id: 6,
      sender: 'customer',
      content: 'I tried about 20 minutes ago. I\'m getting an error code E-45632. This is really frustrating because my son needs this money for his college fees and the deadline is tomorrow. I can\'t understand why this keeps happening.',
      time: '01:15'
    }
  ];

  return (
    <Box p="md" style={{ height: 'calc(100vh - 32px)' }}>
      {/* Page Header */}
      <Box mb="lg">
        <Group justify="space-between" mb="md">
          <Box>
            <Title order={2} mb="xs">Call Transcripts</Title>
            <Text c="dimmed" size="sm">View and analyze customer call recordings</Text>
          </Box>
          
          <Group>
            <TextInput
              placeholder="Search transcripts..."
              leftSection={<TablerIcons.IconSearch size={16} />}
              style={{ width: '300px' }}
            />
            
            <Button 
              variant="outline" 
              leftSection={<TablerIcons.IconFilter size={16} />}
            >
              Filter
            </Button>
          </Group>
        </Group>
      </Box>
      
      {/* Main Content - 3 panel layout */}
      <Grid style={{ height: 'calc(100vh - 140px)' }}>
        {/* Left panel - Recordings list */}
        <Grid.Col span={{ base: 12, md: 3 }} style={{ height: '100%' }}>
          <Paper withBorder p="md" style={{ height: '100%', overflow: 'auto' }}>
            <Title order={5} mb="md">Call Recordings</Title>
            <Box>
              {recordings.map((recording) => (
                <RecordingItem
                  key={recording.id}
                  recording={recording}
                  isActive={activeRecording === recording.id}
                  onClick={() => setActiveRecording(recording.id)}
                />
              ))}
            </Box>
          </Paper>
        </Grid.Col>
        
        {/* Middle panel - Transcript chat */}
        <Grid.Col span={{ base: 12, md: 6 }} style={{ height: '100%' }}>
          <Paper withBorder style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Chat header */}
            <Box p="md" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
              <Group position="apart">
                <Box>
                  <Text fw={500}>Call Transcript: {activeRecording}</Text>
                  <Text size="xs" c="dimmed">
                    {recordings.find(r => r.id === activeRecording)?.category} | Aug 21, 2023
                  </Text>
                </Box>
                
                <Group>
                  <Button 
                    variant="outline" 
                    size="sm"
                    leftSection={<TablerIcons.IconEdit size={14} />}
                  >
                    Edit
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    leftSection={<TablerIcons.IconDownload size={14} />}
                  >
                    Export
                  </Button>
                </Group>
              </Group>
            </Box>
            
            {/* Audio player */}
            <Box p="md" style={{ background: 'var(--mantine-color-gray-0)', borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
              <Group>
                <Button variant="default" style={{ width: 36, height: 36, padding: 0, borderRadius: '50%' }}>
                  {TablerIcons.IconPlayerPlay && <TablerIcons.IconPlayerPlay size={16} />}
                </Button>
                
                <Box style={{ flex: 1 }}>
                  <Box style={{ 
                    height: 4, 
                    background: 'var(--mantine-color-gray-3)', 
                    borderRadius: 9999,
                    position: 'relative' 
                  }}>
                    <Box style={{ 
                      width: '35%', 
                      height: '100%', 
                      background: 'var(--mantine-color-primary-filled)',
                      borderRadius: 9999 
                    }} />
                    <Box style={{ 
                      width: 12, 
                      height: 12, 
                      background: 'var(--mantine-color-primary-filled)',
                      border: '2px solid white',
                      borderRadius: '50%',
                      position: 'absolute',
                      top: '50%',
                      left: '35%',
                      transform: 'translate(-50%, -50%)'
                    }} />
                  </Box>
                  
                  <Group position="apart" mt={4}>
                    <Text size="xs" c="dimmed">05:21 / 15:18</Text>
                    <Group spacing={8}>
                      {TablerIcons.IconVolume && <TablerIcons.IconVolume size={14} style={{ color: 'var(--mantine-color-gray-5)' }} />}
                      {TablerIcons.IconPlayerTrackNext && <TablerIcons.IconPlayerTrackNext size={14} style={{ color: 'var(--mantine-color-gray-5)' }} />}
                    </Group>
                  </Group>
                </Box>
              </Group>
            </Box>
            
            {/* Chat messages */}
            <Box p="md" style={{ flex: 1, overflow: 'auto' }}>
              {messages.map((message) => (
                <Message
                  key={message.id}
                  sender={message.sender}
                  content={message.content}
                  time={message.time}
                  isAgent={message.sender === 'agent'}
                />
              ))}
              
              {/* Load more messages */}
              <Box mt="xl" style={{ textAlign: 'center' }}>
                <Text size="xs" c="dimmed">Showing 6 of 24 messages</Text>
                <Button 
                  variant="subtle" 
                  size="xs" 
                  mt="sm"
                >
                  Load More
                </Button>
              </Box>
            </Box>
            
            {/* Chat footer */}
            <Box p="md" style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }}>
              <Group position="apart" mb="xs">
                <Text size="sm" fw={500}>
                  Transcript Confidence: <Text span c="teal" fw={500}>High (96%)</Text>
                </Text>
                
                <Group spacing={8}>
                  <Button variant="subtle" size="xs" p={6} style={{ borderRadius: '50%' }}>
                    {TablerIcons.IconFlag && <TablerIcons.IconFlag size={14} />}
                  </Button>
                  
                  <Button variant="subtle" size="xs" p={6} style={{ borderRadius: '50%' }}>
                    {TablerIcons.IconThumbUp && <TablerIcons.IconThumbUp size={14} />}
                  </Button>
                </Group>
              </Group>
              
              <Text size="xs" c="dimmed">
                Transcription by ElevenLabs API | Analysis by OpenAI GPT-4
              </Text>
            </Box>
          </Paper>
        </Grid.Col>
        
        {/* Right panel - Analysis */}
        <Grid.Col span={{ base: 12, md: 3 }} style={{ height: '100%' }}>
          <Box style={{ height: '100%', overflow: 'auto' }}>
            {/* Call Information */}
            <Paper withBorder mb="md">
              <Group p="sm" position="apart" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
                <Text fw={500} size="sm">Call Information</Text>
                {TablerIcons.IconInfoCircle && <TablerIcons.IconInfoCircle size={16} style={{ color: 'var(--mantine-color-gray-5)' }} />}
              </Group>
              
              <Box p="md">
                <Grid gutter="xs">
                  <Grid.Col span={12}>
                    <Text size="xs" c="dimmed">Agent</Text>
                    <Text size="sm">Priya Patel</Text>
                  </Grid.Col>
                  
                  <Grid.Col span={12}>
                    <Text size="xs" c="dimmed">Customer ID</Text>
                    <Text size="sm">CUST00584</Text>
                  </Grid.Col>
                  
                  <Grid.Col span={12}>
                    <Text size="xs" c="dimmed">Date & Time</Text>
                    <Text size="sm">Aug 21, 2023 13:22</Text>
                  </Grid.Col>
                  
                  <Grid.Col span={12}>
                    <Text size="xs" c="dimmed">Duration</Text>
                    <Text size="sm">15:18</Text>
                  </Grid.Col>
                  
                  <Grid.Col span={12}>
                    <Text size="xs" c="dimmed">Status</Text>
                    <Badge color="blue" variant="light">Escalated</Badge>
                  </Grid.Col>
                </Grid>
              </Box>
            </Paper>
            
            {/* AI Analysis */}
            <Paper withBorder mb="md">
              <Group p="sm" position="apart" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
                <Text fw={500} size="sm">AI Analysis</Text>
                {TablerIcons.IconCpu && <TablerIcons.IconCpu size={16} style={{ color: 'var(--mantine-color-gray-5)' }} />}
              </Group>
              
              <Box p="md">
                <Box mb="md">
                  <Text size="xs" c="dimmed" mb="xs">Issue Category</Text>
                  <Text size="sm">Transactions > Failed Transfer > Technical Error</Text>
                </Box>
                
                <Box mb="md">
                  <Text size="xs" c="dimmed" mb="xs">Severity</Text>
                  <Badge color="red" variant="light">Critical</Badge>
                </Box>
                
                <Box mb="md">
                  <Text size="xs" c="dimmed" mb="xs">Customer Sentiment</Text>
                  <Text size="sm" mb="xs">Started Negative, Ended Neutral</Text>
                  
                  <Group position="apart" mb="xs">
                    <Text size="xs" c="red">Negative</Text>
                    <Text size="xs" c="teal">Positive</Text>
                  </Group>
                  
                  <Box style={{ 
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
                      border: '2px solid var(--mantine-color-gray-7)',
                      borderRadius: '50%',
                      position: 'absolute',
                      top: '50%',
                      left: '65%',
                      transform: 'translate(-50%, -50%)'
                    }} />
                  </Box>
                </Box>
                
                <Box mb="md">
                  <Text size="xs" c="dimmed" mb="xs">Extracted Entities</Text>
                  
                  <Box style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
                    <Group position="apart" py="xs" style={{ borderBottom: '1px solid var(--mantine-color-gray-2)' }}>
                      <Text size="xs" c="dimmed">Error Code</Text>
                      <Text size="xs" fw={500}>E-45632</Text>
                    </Group>
                    
                    <Group position="apart" py="xs" style={{ borderBottom: '1px solid var(--mantine-color-gray-2)' }}>
                      <Text size="xs" c="dimmed">Transfer Amount</Text>
                      <Text size="xs" fw={500}>Rs. 45,000</Text>
                    </Group>
                    
                    <Group position="apart" py="xs" style={{ borderBottom: '1px solid var(--mantine-color-gray-2)' }}>
                      <Text size="xs" c="dimmed">Customer ID</Text>
                      <Text size="xs" fw={500}>CUST00584</Text>
                    </Group>
                    
                    <Group position="apart" py="xs" style={{ borderBottom: '1px solid var(--mantine-color-gray-2)' }}>
                      <Text size="xs" c="dimmed">Account (Last 4)</Text>
                      <Text size="xs" fw={500}>7832</Text>
                    </Group>
                    
                    <Group position="apart" py="xs">
                      <Text size="xs" c="dimmed">Transfer Type</Text>
                      <Text size="xs" fw={500}>IMPS</Text>
                    </Group>
                  </Box>
                </Box>
              </Box>
            </Paper>
            
            {/* Analysis Verification */}
            <Paper withBorder mb="md">
              <Group p="sm" position="apart" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
                <Text fw={500} size="sm">Analysis Verification</Text>
                <Button 
                  variant="light" 
                  size="xs"
                  leftSection={<TablerIcons.IconCheck size={12} />}
                >
                  Approve
                </Button>
              </Group>
              
              <Box p="md">
                <Text size="sm" mb="md">Is the AI analysis accurate and complete?</Text>
                
                <Group mb="md">
                  <Button 
                    variant="outline" 
                    size="xs"
                    leftSection={<TablerIcons.IconThumbUp size={14} />}
                    style={{ flex: 1 }}
                  >
                    Accurate
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="xs"
                    leftSection={<TablerIcons.IconEdit size={14} />}
                    style={{ flex: 1 }}
                  >
                    Edit
                  </Button>
                </Group>
                
                <Box>
                  <Text size="xs" c="dimmed" mb="xs">Comments (optional)</Text>
                  <textarea 
                    style={{ 
                      width: '100%', 
                      minHeight: '80px', 
                      padding: '8px', 
                      border: '1px solid var(--mantine-color-gray-3)', 
                      borderRadius: 'var(--mantine-radius-sm)', 
                      fontFamily: 'inherit', 
                      fontSize: '0.75rem' 
                    }}
                    placeholder="Add your verification notes here..."
                  />
                </Box>
              </Box>
            </Paper>
          </Box>
        </Grid.Col>
      </Grid>
    </Box>
  );
}

export default Transcripts;