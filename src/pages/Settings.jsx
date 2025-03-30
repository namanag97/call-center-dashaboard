// src/pages/Settings.jsx
import { useState, useEffect } from 'react';
import { Box, Title, Text, Group, Button, Paper, Grid, Switch, Select, TextInput, Tabs, Divider, MultiSelect, Checkbox, Modal, Stack, Loader, Alert } from '@mantine/core';
import { IconSettings, IconUser, IconBell, IconApi, IconFileText, IconLock, IconPlus, IconEdit, IconTrash, IconAlertCircle } from '@tabler/icons-react';
import { useProfiles } from '../hooks/useProfiles';

// Analysis Profile Editor Modal
function ProfileEditorModal({ opened, onClose, initialData = null, onSave }) {
  const [profileName, setProfileName] = useState('');
  const [description, setDescription] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const { types } = useProfiles(true);
  
  // Map types to MultiSelect format
 // src/pages/Settings.jsx (continued)
  // Map types to MultiSelect format
  const typeOptions = types.map(type => ({
    value: type.type_key,
    label: type.display_name,
    description: type.description
  }));
  
  // Reset form when modal opens/closes or initialData changes
  useEffect(() => {
    if (initialData) {
      setProfileName(initialData.profile_name);
      setDescription(initialData.description || '');
      setIsDefault(initialData.is_default || false);
      setSelectedTypes(initialData.analysis_types || []);
    } else {
      setProfileName('');
      setDescription('');
      setIsDefault(false);
      setSelectedTypes([]);
    }
  }, [initialData, opened]);
  
  const handleSubmit = async () => {
    if (!profileName) {
      alert('Profile name is required');
      return;
    }
    
    setLoading(true);
    
    try {
      await onSave({
        profileName,
        description,
        isDefault,
        analysisTypeKeys: selectedTypes
      });
      
      onClose();
    } catch (error) {
      console.error('Error saving profile:', error);
      alert(`Failed to save profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={initialData ? 'Edit Analysis Profile' : 'Create New Analysis Profile'}
      size="lg"
    >
      <Stack spacing="md">
        <TextInput
          label="Profile Name"
          placeholder="Enter profile name"
          value={profileName}
          onChange={(e) => setProfileName(e.target.value)}
          required
        />
        
        <TextInput
          label="Description"
          placeholder="Enter profile description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        
        <Checkbox
          label="Set as default profile"
          checked={isDefault}
          onChange={(e) => setIsDefault(e.target.checked)}
        />
        
        <MultiSelect
          label="Analysis Types"
          placeholder="Select analysis types"
          data={typeOptions}
          value={selectedTypes}
          onChange={setSelectedTypes}
          description="Select which analysis modules to include in this profile"
        />
        
        <Group position="right" mt="md">
          <Button variant="subtle" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={loading}>
            {initialData ? 'Update Profile' : 'Create Profile'}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

// Analysis Profiles Management Component
function AnalysisProfilesTab() {
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState(null);
  
  const { 
    profiles, 
    types, 
    loading, 
    error, 
    fetchProfiles, 
    createProfile, 
    updateProfile, 
    deleteProfile 
  } = useProfiles();
  
  const handleAddProfile = () => {
    setSelectedProfile(null);
    setEditorOpen(true);
  };
  
  const handleEditProfile = (profile) => {
    setSelectedProfile(profile);
    setEditorOpen(true);
  };
  
  const handleDeleteClick = (profile) => {
    setProfileToDelete(profile);
    setConfirmDeleteOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!profileToDelete) return;
    
    try {
      await deleteProfile(profileToDelete.id);
      setConfirmDeleteOpen(false);
      setProfileToDelete(null);
    } catch (error) {
      console.error('Error deleting profile:', error);
      alert(`Failed to delete profile: ${error.message}`);
    }
  };
  
  const handleSaveProfile = async (profileData) => {
    if (selectedProfile) {
      return await updateProfile(selectedProfile.id, profileData);
    } else {
      return await createProfile(profileData);
    }
  };
  
  return (
    <Box>
      <Group position="apart" mb="md">
        <Title order={4}>Analysis Profiles</Title>
        <Button 
          leftSection={<IconPlus size={16} />}
          onClick={handleAddProfile}
        >
          Add Profile
        </Button>
      </Group>
      
      {loading && (
        <Group position="center" my="xl">
          <Loader />
          <Text>Loading profiles...</Text>
        </Group>
      )}
      
      {error && (
        <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red" my="md">
          {error}
        </Alert>
      )}
      
      {!loading && !error && profiles.length === 0 && (
        <Paper withBorder p="xl" style={{ textAlign: 'center' }}>
          <Text size="lg" mb="md">No analysis profiles found</Text>
          <Text c="dimmed" mb="xl">
            Create your first analysis profile to define which types of analysis should be run on call recordings.
          </Text>
          <Button onClick={handleAddProfile}>Create Profile</Button>
        </Paper>
      )}
      
      {!loading && !error && profiles.length > 0 && (
        <Grid>
          {profiles.map((profile) => (
            <Grid.Col key={profile.id} span={{ base: 12, md: 6 }}>
              <Paper withBorder p="md">
                <Group position="apart" mb="sm">
                  <Box>
                    <Group>
                      <Text fw={500}>{profile.profile_name}</Text>
                      {profile.is_default && (
                        <Badge color="teal" variant="light">Default</Badge>
                      )}
                    </Group>
                    <Text size="xs" c="dimmed">{profile.description}</Text>
                  </Box>
                  
                  <Group spacing={8}>
                    <Button 
                      variant="subtle" 
                      size="xs"
                      p={0}
                      onClick={() => handleEditProfile(profile)}
                    >
                      <IconEdit size={18} />
                    </Button>
                    
                    <Button 
                      variant="subtle" 
                      size="xs"
                      color="red"
                      p={0}
                      onClick={() => handleDeleteClick(profile)}
                    >
                      <IconTrash size={18} />
                    </Button>
                  </Group>
                </Group>
                
                <Divider my="sm" />
                
                <Text size="xs" fw={500} mb="xs">Analysis Types</Text>
                <Box>
                  {profile.analysis_types && profile.analysis_types.map((typeKey) => {
                    const typeObj = types.find(t => t.type_key === typeKey);
                    return (
                      <Badge key={typeKey} mr="xs" mb="xs">
                        {typeObj ? typeObj.display_name : typeKey}
                      </Badge>
                    );
                  })}
                </Box>
              </Paper>
            </Grid.Col>
          ))}
        </Grid>
      )}
      
      {/* Profile Editor Modal */}
      <ProfileEditorModal
        opened={editorOpen}
        onClose={() => setEditorOpen(false)}
        initialData={selectedProfile}
        onSave={handleSaveProfile}
      />
      
      {/* Confirm Delete Modal */}
      <Modal
        opened={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        title="Confirm Delete"
        size="sm"
      >
        <Box>
          <Text mb="md">
            Are you sure you want to delete the profile "{profileToDelete?.profile_name}"? This action cannot be undone.
          </Text>
          
          <Group position="right">
            <Button variant="subtle" onClick={() => setConfirmDeleteOpen(false)}>
              Cancel
            </Button>
            <Button color="red" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </Group>
        </Box>
      </Modal>
    </Box>
  );
}

function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  
  return (
    <Box p="md">
      {/* Page Header */}
      <Box mb="lg">
        <Group justify="space-between" mb="md">
          <Box>
            <Title order={2} mb="xs">Settings</Title>
            <Text c="dimmed" size="sm">Configure system preferences and settings</Text>
          </Box>
        </Group>
      </Box>
      
      <Grid>
        {/* Left sidebar with settings categories */}
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Paper withBorder p="md">
            <Tabs value={activeTab} onChange={setActiveTab} orientation="vertical">
              <Tabs.List>
                <Tabs.Tab value="general" leftSection={<IconSettings size={16} />}>
                  General
                </Tabs.Tab>
                <Tabs.Tab value="account" leftSection={<IconUser size={16} />}>
                  Account
                </Tabs.Tab>
                <Tabs.Tab value="analysis_profiles" leftSection={<IconFileText size={16} />}>
                  Analysis Profiles
                </Tabs.Tab>
                <Tabs.Tab value="notifications" leftSection={<IconBell size={16} />}>
                  Notifications
                </Tabs.Tab>
                <Tabs.Tab value="api" leftSection={<IconApi size={16} />}>
                  API Settings
                </Tabs.Tab>
                <Tabs.Tab value="transcription" leftSection={<IconFileText size={16} />}>
                  Transcription
                </Tabs.Tab>
                <Tabs.Tab value="security" leftSection={<IconLock size={16} />}>
                  Security
                </Tabs.Tab>
              </Tabs.List>
            </Tabs>
          </Paper>
        </Grid.Col>
        
        {/* Right content area */}
        <Grid.Col span={{ base: 12, md: 9 }}>
          {activeTab === 'general' && (
            <Paper withBorder p="md">
              <Title order={4} mb="md">General Settings</Title>
              
              <Box mb="lg">
                <Text fw={500} mb="xs">System Preferences</Text>
                <Divider mb="md" />
                
                <Grid>
                  <Grid.Col span={8}>
                    <Text>Default Dashboard View</Text>
                    <Text size="xs" c="dimmed">Select the default view when logging into the system</Text>
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <Select
                      data={[
                        'Call Analytics',
                        'Agent Dashboard',
                        'Queue Status',
                        'System Overview'
                      ]}
                      defaultValue="Call Analytics"
                    />
                  </Grid.Col>
                </Grid>
                
                <Divider my="md" />
                
                <Grid>
                  <Grid.Col span={8}>
                    <Text>Time Zone</Text>
                    <Text size="xs" c="dimmed">Set the default time zone for reports and timestamps</Text>
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <Select
                      data={[
                        'UTC (Coordinated Universal Time)',
                        'IST (India Standard Time)',
                        'EST (Eastern Standard Time)',
                        'PST (Pacific Standard Time)'
                      ]}
                      defaultValue="IST (India Standard Time)"
                    />
                  </Grid.Col>
                </Grid>
                
                <Divider my="md" />
                
                <Grid>
                  <Grid.Col span={8}>
                    <Text>Enable Dark Mode</Text>
                    <Text size="xs" c="dimmed">Toggle between light and dark interface theme</Text>
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <Switch size="md" />
                  </Grid.Col>
                </Grid>
              </Box>
              
              <Group position="right">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </Group>
            </Paper>
          )}
          
          {activeTab === 'analysis_profiles' && (
            <Paper withBorder p="md">
              <AnalysisProfilesTab />
            </Paper>
          )}
          
          {activeTab === 'account' && (
            <Paper withBorder p="md">
              <Title order={4} mb="md">Account Settings</Title>
              <Text c="dimmed">Manage your account preferences, profile and login information.</Text>
            </Paper>
          )}
          
          {activeTab === 'notifications' && (
            <Paper withBorder p="md">
              <Title order={4} mb="md">Notification Settings</Title>
              <Text c="dimmed">Configure email, in-app, and mobile notification preferences.</Text>
            </Paper>
          )}
          
          {activeTab === 'api' && (
            <Paper withBorder p="md">
              <Title order={4} mb="md">API Settings</Title>
              <Text c="dimmed">Manage API keys, webhooks, and integration settings.</Text>
            </Paper>
          )}
          
          {activeTab === 'transcription' && (
            <Paper withBorder p="md">
              <Title order={4} mb="md">Transcription Settings</Title>
              <Text c="dimmed">Configure speech-to-text engines, accuracy preferences, and language settings.</Text>
            </Paper>
          )}
          
          {activeTab === 'security' && (
            <Paper withBorder p="md">
              <Title order={4} mb="md">Security Settings</Title>
              <Text c="dimmed">Manage authentication, password policies, and access controls.</Text>
            </Paper>
          )}
        </Grid.Col>
      </Grid>
    </Box>
  );
}

export default Settings;