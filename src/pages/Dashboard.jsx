// src/pages/Dashboard.jsx
import { Container } from '@mantine/core';
import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import ActionBar from '../components/ActionBar';
import StatCards from '../components/StatCards';
import ProcessingQueues from '../components/ProcessingQueues';
import RecentCalls from '../components/RecentCalls';
import UploadModal from '../components/UploadModal';

function Dashboard() {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  
  return (
    <Container fluid p="md">
      <PageHeader 
        title="Dashboard" 
        subtitle="Overview of your call analytics system"
        onUploadClick={() => setUploadModalOpen(true)}
      />
      
      <ActionBar />
      
      <StatCards />
      
      <ProcessingQueues />
      
      <RecentCalls />
      
      <UploadModal
        opened={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
      />
    </Container>
  );
}

export default Dashboard;