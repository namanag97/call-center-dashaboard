// src/pages/Dashboard.jsx
import { Container, Group, Loader, Alert } from '@mantine/core';
import { useState } from 'react';
import { IconAlertCircle } from '@tabler/icons-react';
import PageHeader from '../components/PageHeader';
import ActionBar from '../components/ActionBar';
import StatCards from '../components/StatCards';
import ProcessingQueues from '../components/ProcessingQueues';
import RecentCalls from '../components/RecentCalls';
import UploadModal from '../components/UploadModal';
import { useRecordings } from '../hooks/useRecordings';

function Dashboard() {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { recordings, loading, error, fetchRecordings } = useRecordings();
  
  // Filter recordings based on search
  const filteredRecordings = searchQuery 
    ? recordings.filter(rec => 
        rec.original_file_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : recordings;
  
  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };
  
  const handleRefresh = () => {
    fetchRecordings();
  };
  
  return (
    <Container fluid p="md">
      <PageHeader 
        title="Dashboard" 
        subtitle="Overview of your call analytics system"
        onUploadClick={() => setUploadModalOpen(true)}
      />
      
      <ActionBar 
        onSearchChange={handleSearchChange} 
        onFilterClick={() => {}} 
        onRefreshClick={handleRefresh} 
      />
      
      {loading && (
        <Group position="center" my="xl">
          <Loader />
        </Group>
      )}
      
      {error && (
        <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red" my="md">
          {error}
        </Alert>
      )}
      
      {!loading && !error && (
        <>
          <StatCards recordings={recordings} />
          <ProcessingQueues recordings={recordings} />
          <RecentCalls recordings={filteredRecordings.slice(0, 5)} />
        </>
      )}
      
      <UploadModal
        opened={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
      />
    </Container>
  );
}

export default Dashboard;