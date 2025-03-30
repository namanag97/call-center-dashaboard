// src/App.jsx
import { Flex, Box } from '@mantine/core';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Uploads from './pages/Uploads';
import Queues from './pages/Queues';
import Transcripts from './pages/Transcripts';
import Reports from './pages/Reports';
import Team from './pages/Team';
import Settings from './pages/Settings';
import Placeholder from './pages/Placeholder';

function App() {
  return (
    <Router>
      <Flex style={{ height: '100vh' }}>
        {/* Sidebar */}
        <Box w={280} style={{ flexShrink: 0 }}>
          <Sidebar />
        </Box>
        
        {/* Main Content Area */}
        <Box style={{ flexGrow: 1, overflow: 'auto' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/uploads" element={<Uploads />} />
            <Route path="/queues" element={<Queues />} />
            <Route path="/transcripts" element={<Transcripts />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/team" element={<Team />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Placeholder title="Page Not Found" />} />
          </Routes>
        </Box>
      </Flex>
    </Router>
  );
}

export default App;