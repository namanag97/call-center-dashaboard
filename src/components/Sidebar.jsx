// src/components/Sidebar.jsx
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Stack, 
  Title, 
  Divider, 
  Text, 
  NavLink, 
  Box, 
  Flex, 
  Avatar 
} from '@mantine/core';
import * as TablerIcons from '@tabler/icons-react';

// Helper function to get the correct icon
function getIcon(iconName, fallbackIconName = null) {
  const Icon = TablerIcons[iconName] || (fallbackIconName ? TablerIcons[fallbackIconName] : null);
  return Icon ? <Icon size={18} /> : null;
}

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  
  return (
    <Stack h="100%" style={{ borderRight: '1px solid var(--mantine-color-gray-3)' }}>
      {/* Logo */}
      <Flex p="lg" pb="xs" align="center" gap="sm">
        {getIcon('IconMicrophone') || <div style={{ width: 32, height: 32, background: '#e9ecef', borderRadius: '50%' }}></div>}
        <Title order={4}>CallInsight</Title>
      </Flex>
      
      <Divider />
      
      {/* Navigation Links */}
      <Box px="md">
        <Text size="xs" fw={600} tt="uppercase" c="dimmed" mb="xs">
          Overview
        </Text>
        
        <NavLink
          label="Dashboard"
          leftSection={getIcon('IconHome')}
          active={currentPath === '/dashboard'}
          onClick={() => navigate('/dashboard')}
        />
        
        <NavLink
          label="Analytics"
          leftSection={getIcon('IconActivity')}
          active={currentPath === '/analytics'}
          onClick={() => navigate('/analytics')}
        />
      </Box>
      
      <Box px="md">
        <Text size="xs" fw={600} tt="uppercase" c="dimmed" mb="xs">
          Management
        </Text>
        
        <NavLink
          label="Uploads"
          leftSection={getIcon('IconUpload')}
          active={currentPath === '/uploads'}
          onClick={() => navigate('/uploads')}
        />
        
        <NavLink
          label="Queues"
          leftSection={getIcon('IconList')}
          active={currentPath === '/queues'}
          onClick={() => navigate('/queues')}
        />
        
        <NavLink
          label="Transcripts"
          leftSection={getIcon('IconFileText')}
          active={currentPath === '/transcripts'}
          onClick={() => navigate('/transcripts')}
        />
        
        <NavLink
          label="Reports"
          leftSection={getIcon('IconPieChart', 'IconChartPie')}
          active={currentPath === '/reports'}
          onClick={() => navigate('/reports')}
        />
      </Box>
      
      <Box px="md">
        <Text size="xs" fw={600} tt="uppercase" c="dimmed" mb="xs">
          Settings
        </Text>
        
        <NavLink
          label="Team"
          leftSection={getIcon('IconUsers')}
          active={currentPath === '/team'}
          onClick={() => navigate('/team')}
        />
        
        <NavLink
          label="Settings"
          leftSection={getIcon('IconSettings')}
          active={currentPath === '/settings'}
          onClick={() => navigate('/settings')}
        />
      </Box>
      
      {/* User Profile */}
      <Box style={{ marginTop: 'auto' }} p="md" pt="xl">
        <Divider mb="md" />
        
        <Flex align="center">
          <Avatar color="indigo" mr="md">AM</Avatar>
          <Box>
            <Text fw={500}>Amit Mehta</Text>
            <Text size="xs" c="dimmed">Admin</Text>
          </Box>
        </Flex>
      </Box>
    </Stack>
  );
}

export default Sidebar;