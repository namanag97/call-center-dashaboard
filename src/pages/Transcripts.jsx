// src/pages/Transcripts.jsx (full implementation with API-driven approach)
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Box, 
  Title, 
  Text, 
  Group, 
  Button, 
  Paper, 
  Grid, 
  Loader, 
  Alert 
} from '@mantine/core';
import { IconAlertCircle, IconEdit, IconDownload } from '@tabler/icons-react';

import { useRecordings } from '../hooks/useRecordings';
import { useRecordingDetails } from '../hooks/useRecordingDetails';

import RecordingsFilter from '../components/RecordingsFilter';
import Pagination from '../components/Pagination';
import RecordingItem from '../components/RecordingItem';
import MessageList from '../components/MessageList';
import AudioPlayer from '../components/AudioPlayer';
import AnalysisPanel from '../components/AnalysisPanel';

function Transcripts() {
  // Local state
  const [activeRecordingId, setActiveRecordingId] = useState(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  
  // Router
  const location = useLocation();
  
  // Setup API parameters
  const initialParams = {
    pageSize: 20,
    sortField: 'ingestion_timestamp',
    sortDirection: 'desc',
    filters: {}
  };
  
  // Use API-driven hooks
  const { 
    recordings, 
    meta, 
    loading: recordingsLoading, 
    error: recordingsError, 
    params,
    setSearch, 
    setFilter, 
    setPage,
    setPageSize, 
    setSort,
    resetFilters
  } = useRecordings(initialParams);
  
  const { 
    recording, 
    transcript, 
    analysis, 
    loading: detailsLoading, 
    error: detailsError,
    refresh: refreshDetails 
  } = useRecordingDetails(activeRecordingId);
  
  // Handle URL parameter
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');
    if (id) {
      setActiveRecordingId(id);
      setInitialLoadComplete(true);
    }
  }, [location.search]);
  
  // Set initial active recording after data loads
  useEffect(() => {
    if (!initialLoadComplete && !recordingsLoading && recordings.length > 0) {
      setActiveRecordingId(recordings[0].id);
      setInitialLoadComplete(true);
    }
  }, [recordings, recordingsLoading, initialLoadComplete]);
  
  // Format messages from transcript
  const messages = useMemo(() => {
    return transcript?.messages?.map((msg, index) => ({
      id: index,
      sender: msg.speaker,
      content: msg.content,
      time: formatTime(msg.start_time),
      startTime: msg.start_time
    })) || [];
  }, [transcript]);
  
  // Handlers
  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value);
  }, [setSearch]);
  
  const handleDateRangeChange = useCallback((range) => {
    setFilter('dateFrom', range?.from || null);
    setFilter('dateTo', range?.to || null);
  }, [setFilter]);
  
  const handleStatusChange = useCallback((status) => {
    setFilter('status', status || null);
  }, [setFilter]);
  
  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
  }, [setPage]);
  
  const handlePageSizeChange = useCallback((newSize) => {
    setPageSize(newSize);
  }, [setPageSize]);
  
  const handleRecordingSelect = useCallback((id) => {
    setActiveRecordingId(id);
    // Update URL with selected ID for bookmarking/sharing
    const url = new URL(window.location);
    url.searchParams.set('id', id);
    window.history.pushState({}, '', url);
  }, []);
  
  const handleMessageClick = useCallback((time) => {
    setCurrentTime(time);
  }, []);
  
  // Helper function to format time
  function formatTime(seconds) {
    if (!seconds && seconds !== 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSecs = Math.round(seconds % 60);
    return `${minutes}:${remainingSecs.toString().padStart(2, '0')}`;
  }
  
  return (
    <Box p="md" style={{ height: 'calc(100vh - 32px)' }}>
      {/* Page Header */}
      <Box mb="lg">
        <Group justify="space-between" mb="md">
          <Box>
            <Title order={2} mb="xs">Call Transcripts</Title>
            <Text c="dimmed" size="sm">View and analyze customer call recordings</Text>
          </Box>
        </Group>
      </Box>
      
      {/* Filters */}
      <RecordingsFilter
        searchValue={params.search}
        onSearchChange={handleSearchChange}
        dateRange={{ 
          from: params.filters.dateFrom ? new Date(params.filters.dateFrom) : null, 
          to: params.filters.dateTo ? new Date(params.filters.dateTo) : null 
        }}
        // src/pages/Transcripts.jsx (continued)
        onDateRangeChange={handleDateRangeChange}
        status={params.filters.status || ''}
        onStatusChange={handleStatusChange}
        onResetFilters={resetFilters}
        loading={recordingsLoading}
      />
      
      {/* Main Content - 3 panel layout */}
      <Grid style={{ height: 'calc(100vh - 240px)' }}>
        {/* Left panel - Recordings list */}
        <Grid.Col span={{ base: 12, md: 3 }} style={{ height: '100%' }}>
          <Paper withBorder p="md" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Title order={5} mb="md">Call Recordings</Title>
            
            {recordingsLoading ? (
              <Group position="center" my="xl">
                <Loader size="sm" />
                <Text size="sm">Loading recordings...</Text>
              </Group>
            ) : recordingsError ? (
              <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red" my="md">
                {recordingsError}
              </Alert>
            ) : recordings.length === 0 ? (
              <Text c="dimmed" align="center" my="xl">No recordings found</Text>
            ) : (
              <>
                <Box style={{ flexGrow: 1, overflow: 'auto' }}>
                  {recordings.map((recording) => (
                    <RecordingItem
                      key={recording.id}
                      recording={recording}
                      isActive={activeRecordingId === recording.id}
                      onClick={handleRecordingSelect}
                    />
                  ))}
                </Box>
                
                {/* Pagination at bottom of recordings list */}
                <Box mt="sm">
                  <Pagination
                    currentPage={meta.page}
                    totalPages={meta.totalPages}
                    totalItems={meta.total}
                    pageSize={meta.pageSize}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                    loading={recordingsLoading}
                  />
                </Box>
              </>
            )}
          </Paper>
        </Grid.Col>
        
        {/* Middle panel - Transcript chat */}
        <Grid.Col span={{ base: 12, md: 6 }} style={{ height: '100%' }}>
          <Paper withBorder style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Chat header */}
            <Box p="md" style={{ borderBottom: '1px solid var(--color-border, var(--mantine-color-gray-3))' }}>
              <Group position="apart">
                <Box>
                  <Text fw={500}>
                    {recording ? `Call Transcript: ${recording.original_file_name}` : 'Select a recording'}
                  </Text>
                  {recording && (
                    <Text size="xs" c="dimmed">
                      {analysis?.category || 'Not categorized'} | {new Date(recording.ingestion_timestamp).toLocaleDateString()}
                    </Text>
                  )}
                </Box>
                
                {recording && (
                  <Group>
                    <Button 
                      variant="outline" 
                      size="sm"
                      leftSection={<IconEdit size={14} />}
                      disabled={detailsLoading}
                    >
                      Edit
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      leftSection={<IconDownload size={14} />}
                      disabled={detailsLoading}
                    >
                      Export
                    </Button>
                  </Group>
                )}
              </Group>
            </Box>
            
            {detailsLoading ? (
              <Group position="center" style={{ flex: 1 }}>
                <Loader />
                <Text>Loading transcript data...</Text>
              </Group>
            ) : detailsError ? (
              <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red" m="md">
                {detailsError}
              </Alert>
            ) : !recording ? (
              <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <Text c="dimmed">Select a recording to view its transcript</Text>
              </Box>
            ) : (
              <>
                {/* Audio player */}
                <AudioPlayer 
                  recording={recording} 
                  currentTime={currentTime} 
                  setCurrentTime={setCurrentTime} 
                />
                
                {/* Chat messages */}
                <MessageList 
                  messages={messages}
                  onMessageClick={handleMessageClick}
                  currentTime={currentTime}
                />
              </>
            )}
          </Paper>
        </Grid.Col>
        
        {/* Right panel - Analysis */}
        <Grid.Col span={{ base: 12, md: 3 }} style={{ height: '100%' }}>
          <Box style={{ height: '100%', overflow: 'auto' }}>
            {detailsLoading ? (
              <Group position="center" my="xl">
                <Loader size="sm" />
                <Text size="sm">Loading analysis...</Text>
              </Group>
            ) : !recording ? (
              <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <Text c="dimmed">Select a recording to view analysis</Text>
              </Box>
            ) : (
              <AnalysisPanel recording={recording} analysis={analysis} />
            )}
          </Box>
        </Grid.Col>
      </Grid>
    </Box>
  );
}

export default Transcripts;