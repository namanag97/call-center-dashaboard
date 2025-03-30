// src/components/UploadModal.jsx
import { useState } from 'react';
import { 
  Modal, 
  Box, 
  Text, 
  Group, 
  Button, 
  Select, 
  TextInput,
  Stack,
  Progress,
  FileButton,
  Notification
} from '@mantine/core';
import { IconUpload, IconX, IconCheck, IconAlertCircle } from '@tabler/icons-react';
import { useRecordings } from '../hooks/useRecordings';
import { useProfiles } from '../hooks/useProfiles';

function UploadModal({ opened, onClose }) {
  const [file, setFile] = useState(null);
  const [tags, setTags] = useState('');
  const [selectedQueue, setSelectedQueue] = useState('Standard Queue (Processing time: ~30 mins)');
  const [selectedProfile, setSelectedProfile] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success, error
  const [statusMessage, setStatusMessage] = useState('');
  
  const { getUploadPresignedUrl, commitUploadedFile } = useRecordings(false, false);
  const { profiles, loading: profilesLoading } = useProfiles();
  
  // Transform profiles for Select component
  const profileOptions = profiles.map(profile => ({
    value: profile.id,
    label: profile.profile_name
  }));
  
  const handleFileChange = (selectedFile) => {
    if (selectedFile) {
      setFile(selectedFile);
      setUploadStatus('idle');
    }
  };
  
  // src/components/UploadModal.jsx (continued)
  const handleUpload = async () => {
    if (!file) {
      setUploadStatus('error');
      setStatusMessage('Please select a file to upload');
      return;
    }
    
    try {
      setUploadStatus('uploading');
      setUploadProgress(10);
      
      // Step 1: Get pre-signed URL
      const { uploadUrl, filePath, recordingId } = await getUploadPresignedUrl(file.name, file.type);
      setUploadProgress(30);
      
      // Step 2: Upload file to S3 using pre-signed URL
      // In a real implementation, you would use fetch or axios to upload the file
      // For now, we'll simulate the upload with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUploadProgress(70);
      
      // Step 3: Commit the upload
      const durationSeconds = 300; // Mock duration, in reality you'd extract this from the audio file
      await commitUploadedFile(
        filePath, 
        file.size, 
        durationSeconds,
        selectedProfile || null
      );
      
      setUploadProgress(100);
      setUploadStatus('success');
      setStatusMessage('File uploaded successfully and scheduled for processing');
      
      // Reset form after successful upload
      setTimeout(() => {
        if (opened) { // Only reset if the modal is still open
          setFile(null);
          setTags('');
          setUploadProgress(0);
          onClose(); // Close the modal after success
        }
      }, 2000);
      
    } catch (error) {
      setUploadStatus('error');
      setStatusMessage(error.message || 'Failed to upload file. Please try again.');
      setUploadProgress(0);
    }
  };
  
  const resetUpload = () => {
    setFile(null);
    setUploadStatus('idle');
    setUploadProgress(0);
    setStatusMessage('');
  };
  
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Upload Call Recordings"
      size="md"
      centered
    >
      <Stack spacing="md">
        {uploadStatus === 'error' && (
          <Notification icon={<IconAlertCircle size={18} />} color="red" onClose={() => setUploadStatus('idle')}>
            {statusMessage}
          </Notification>
        )}
        
        {uploadStatus === 'success' && (
          <Notification icon={<IconCheck size={18} />} color="teal" onClose={() => setUploadStatus('idle')}>
            {statusMessage}
          </Notification>
        )}
        
        {uploadStatus === 'uploading' ? (
          <Box>
            <Text size="sm" mb="xs">Uploading {file?.name}</Text>
            <Progress value={uploadProgress} mb="xs" />
            <Text size="xs" c="dimmed">Please wait while your file is being uploaded and processed...</Text>
          </Box>
        ) : (
          <FileButton onChange={handleFileChange} accept="audio/*">
            {(props) => (
              <Box 
                {...props}
                style={{
                  border: '2px dashed var(--mantine-color-gray-4)',
                  borderRadius: 'var(--mantine-radius-md)',
                  padding: '2rem',
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
              >
                <IconUpload size={48} stroke={1.5} style={{ color: 'var(--mantine-color-gray-5)', margin: '0 auto 1rem' }} />
                
                {file ? (
                  <Box>
                    <Text fw={500} mb="xs">Selected file: {file.name}</Text>
                    <Text size="xs">({(file.size / (1024 * 1024)).toFixed(2)} MB)</Text>
                    <Button variant="subtle" size="xs" onClick={(e) => { e.stopPropagation(); resetUpload(); }} mt="xs">
                      Remove
                    </Button>
                  </Box>
                ) : (
                  <>
                    <Text fw={500} mb="xs">
                      <strong>Click to upload</strong> or drag and drop
                    </Text>
                    
                    <Text size="xs" c="dimmed">
                      Supports AAC audio files (Max: 50MB)
                    </Text>
                  </>
                )}
              </Box>
            )}
          </FileButton>
        )}
        
        <Select
          label="Processing Queue"
          placeholder="Select processing queue"
          data={[
            'Standard Queue (Processing time: ~30 mins)',
            'Priority Queue (Processing time: ~10 mins)',
            'Batch Processing (Schedule for off-peak hours)'
          ]}
          value={selectedQueue}
          onChange={setSelectedQueue}
          disabled={uploadStatus === 'uploading'}
        />
        
        <Select
          label="Analysis Profile"
          placeholder="Select analysis profile"
          data={profileOptions}
          value={selectedProfile}
          onChange={setSelectedProfile}
          disabled={uploadStatus === 'uploading' || profilesLoading}
          description="Select which analysis modules to run on this recording"
        />
        
        <TextInput
          label="Tags (Optional)"
          placeholder="E.g., product-inquiry, escalation, hindi"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          disabled={uploadStatus === 'uploading'}
        />
        
        <Group position="right" mt="lg">
          <Button variant="subtle" onClick={onClose} disabled={uploadStatus === 'uploading'}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpload} 
            loading={uploadStatus === 'uploading'}
            disabled={!file || uploadStatus === 'success'}
          >
            {uploadStatus === 'uploading' ? 'Uploading...' : 'Start Upload'}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

export default UploadModal;