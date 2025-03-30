// src/components/UploadModal.jsx
import { 
    Modal, 
    Box, 
    Text, 
    Group, 
    Button, 
    Select, 
    TextInput,
    Stack
  } from '@mantine/core';
  import { IconUpload, IconX } from '@tabler/icons-react';
  
  function UploadModal({ opened, onClose }) {
    return (
      <Modal
        opened={opened}
        onClose={onClose}
        title="Upload Call Recordings"
        size="md"
        centered
      >
        <Stack spacing="md">
          <Box 
            style={{
              border: '2px dashed var(--mantine-color-gray-4)',
              borderRadius: 'var(--mantine-radius-md)',
              padding: '2rem',
              textAlign: 'center',
              cursor: 'pointer'
            }}
          >
            <IconUpload size={48} stroke={1.5} style={{ color: 'var(--mantine-color-gray-5)', margin: '0 auto 1rem' }} />
            
            <Text fw={500} mb="xs">
              <strong>Click to upload</strong> or drag and drop
            </Text>
            
            <Text size="xs" c="dimmed">
              Supports AAC audio files (Max: 50MB)
            </Text>
          </Box>
          
          <Select
            label="Processing Queue"
            placeholder="Select processing queue"
            data={[
              'Standard Queue (Processing time: ~30 mins)',
              'Priority Queue (Processing time: ~10 mins)',
              'Batch Processing (Schedule for off-peak hours)'
            ]}
            defaultValue="Standard Queue (Processing time: ~30 mins)"
          />
          
          <TextInput
            label="Tags (Optional)"
            placeholder="E.g., product-inquiry, escalation, hindi"
          />
          
          <Group position="right" mt="lg">
            <Button variant="subtle" onClick={onClose}>Cancel</Button>
            <Button>Start Upload</Button>
          </Group>
        </Stack>
      </Modal>
    );
  }
  
  export default UploadModal;