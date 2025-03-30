// src/components/MessageList.jsx
import { Box, Text } from '@mantine/core';

function Message({ message, onClick, isActive }) {
  const { sender, content, time, startTime } = message;
  const isAgent = sender === 'agent';
  
  return (
    <Box 
      style={{
        display: 'flex',
        flexDirection: isAgent ? 'row' : 'row-reverse',
        marginTop: '1rem',
        position: 'relative',
        backgroundColor: isActive ? 'var(--color-primary-light, rgba(66, 99, 235, 0.1))' : 'transparent',
        padding: '8px',
        borderRadius: '8px',
        cursor: 'pointer'
      }}
      onClick={() => onClick(startTime)}
    >
      <Box 
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          backgroundColor: isAgent ? 'var(--mantine-color-indigo-light)' : 'var(--mantine-color-gray-light)',
          color: isAgent ? 'var(--mantine-color-indigo-filled)' : 'var(--mantine-color-gray-filled)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '0.8rem',
          marginRight: isAgent ? '12px' : '0',
          marginLeft: isAgent ? '0' : '12px'
        }}
      >
        {isAgent ? 'A' : 'C'}
      </Box>
      
      <Box 
        style={{
          background: isAgent ? 'var(--color-paper, white)' : 'var(--color-primary-light, var(--mantine-color-primary-light))',
          padding: '10px 14px',
          borderRadius: 12,
          maxWidth: '85%',
          border: isAgent ? '1px solid var(--color-border, var(--mantine-color-gray-3))' : 'none',
          position: 'relative',
          flex: 1
        }}
      >
        <Text 
          size="xs" 
          fw={500} 
          mb="xs" 
          c={isAgent ? 'indigo' : 'gray.7'}
        >
          {isAgent ? 'Agent' : 'Customer'}
        </Text>
        
        <Text size="sm">{content}</Text>
        <Text size="xs" c="dimmed" style={{ textAlign: 'right', marginTop: '4px' }}>{time}</Text>
      </Box>
    </Box>
  );
}

function MessageList({ messages, onMessageClick, currentTime }) {
  // Find the active message based on current playback time
  const getActiveMessageIndex = () => {
    if (!messages.length || currentTime === undefined) return -1;
    
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].startTime <= currentTime) {
        return i;
      }
    }
    
    return -1;
  };
  
  const activeIndex = getActiveMessageIndex();
  
  return (
    <Box p="md" style={{ flex: 1, overflow: 'auto' }}>
      {messages.length === 0 ? (
        <Text c="dimmed" align="center" my="xl">No transcript data available</Text>
      ) : (
        messages.map((message, index) => (
          <Message
            key={message.id}
            message={message}
            onClick={onMessageClick}
            isActive={index === activeIndex}
          />
        ))
      )}
      
      {/* Message counter */}
      {messages.length > 0 && (
        <Box mt="xl" style={{ textAlign: 'center' }}>
          <Text size="xs" c="dimmed">Showing {messages.length} messages</Text>
        </Box>
      )}
    </Box>
  );
}

export default MessageList;