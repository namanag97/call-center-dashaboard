// src/pages/Placeholder.jsx
import { Box, Title, Text, Paper, Button } from '@mantine/core';
import * as TablerIcons from '@tabler/icons-react';

function Placeholder({ title = "Page Under Construction" }) {
  return (
    <Box p="md">
      <Paper withBorder p="xl" style={{ 
        textAlign: 'center', 
        maxWidth: '600px', 
        margin: '40px auto' 
      }}>
        <Box mb="lg" style={{ color: 'var(--mantine-color-gray-4)' }}>
          {TablerIcons.IconTools && <TablerIcons.IconTools size={64} />}
        </Box>
        <Title order={2} mb="md">{title}</Title>
        <Text c="dimmed" mb="xl">
          This page is currently under development. We're working hard to build this feature
          and it will be available soon.
        </Text>
        <Button
          variant="outline"
          leftSection={<TablerIcons.IconArrowLeft size={16} />}
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
      </Paper>
    </Box>
  );
}

export default Placeholder;