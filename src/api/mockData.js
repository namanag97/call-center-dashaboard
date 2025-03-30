// src/api/mockData.js
// This file will contain our mock data for testing

// Helper function to generate a UUID
const generateId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Mock call recordings data
export const mockRecordings = [
  {
    id: generateId(),
    original_file_name: 'API-call_20230821_001.aac',
    processed_file_path: 's3://your-bucket-recordings-processed/2023/08/21/call_001.aac',
    file_content_hash: 'a1b2c3d4e5f6g7h8i9j0',
    file_size_bytes: 10485760, // 10 MB
    duration_seconds: 543, // 9:03
    mime_type: 'audio/aac',
    ingestion_source: 'upload',
    ingestion_timestamp: '2023-08-21T14:35:00Z',
    processing_status: 'transcription_completed',
    transcription_status: 'completed',
    transcript_file_path: 's3://your-bucket-transcripts/call_001_transcript.json',
    created_at: '2023-08-21T14:35:00Z',
    updated_at: '2023-08-21T14:45:00Z'
  },
  {
    id: generateId(),
    original_file_name: 'API-call_20230821_002.aac',
    processed_file_path: 's3://your-bucket-recordings-processed/2023/08/21/call_002.aac',
    file_content_hash: 'b2c3d4e5f6g7h8i9j0k1',
    file_size_bytes: 15728640, // 15 MB
    duration_seconds: 918, // 15:18
    mime_type: 'audio/aac',
    ingestion_source: 'upload',
    ingestion_timestamp: '2023-08-21T13:22:00Z',
    processing_status: 'analyzing',
    transcription_status: 'completed',
    transcript_file_path: 's3://your-bucket-transcripts/call_002_transcript.json',
    created_at: '2023-08-21T13:22:00Z',
    updated_at: '2023-08-21T13:35:00Z'
  },
  // Add more mock recordings as needed
];

// Mock transcripts data
export const mockTranscripts = {
  [mockRecordings[0].id]: {
    messages: [
      { speaker: 'agent', content: 'Thank you for calling ABC Financial Services. My name is Raj. How may I help you today?', start_time: 0, end_time: 7 },
      { speaker: 'customer', content: 'Hi, I need to reset my online banking password. I\'ve been locked out after three attempts.', start_time: 8, end_time: 15 },
      { speaker: 'agent', content: 'I understand, and I\'d be happy to help you with that. For security purposes, could you please verify your identity by providing your account number and the last four digits of your registered mobile number?', start_time: 16, end_time: 30 },
      // Add more messages
    ]
  },
  [mockRecordings[1].id]: {
    messages: [
      { speaker: 'agent', content: 'Thank you for calling ABC Financial Services. My name is Priya. How may I help you today?', start_time: 0, end_time: 7 },
      { speaker: 'customer', content: 'Hi, I\'ve been trying to transfer money to my son\'s account but the transaction keeps failing. I\'ve tried three times already and each time I get an error message.', start_time: 8, end_time: 22 },
      { speaker: 'agent', content: 'I\'m sorry to hear that you\'re experiencing issues with your transfer. I\'d be happy to help you resolve this. Could you please verify your account by providing your customer ID?', start_time: 23, end_time: 38 },
      // Add more messages
    ]
  }
};

// Mock analysis results
export const mockAnalysis = {
  [mockRecordings[0].id]: {
    sentiment: { overall: 0.2, start: -0.4, end: 0.6 }, // -1 to 1 scale
    category: 'Account Access > Login Issue > Password Reset',
    severity: 'medium',
    status: 'resolved',
    entities: [
      { type: 'customer_id', value: 'CUST00472', confidence: 0.95 },
      { type: 'issue_type', value: 'password_reset', confidence: 0.98 },
      { type: 'product', value: 'online_banking', confidence: 0.92 }
    ]
  },
  [mockRecordings[1].id]: {
    sentiment: { overall: -0.3, start: -0.7, end: -0.1 }, // -1 to 1 scale
    category: 'Transactions > Failed Transfer > Technical Error',
    severity: 'critical',
    status: 'escalated',
    entities: [
      { type: 'customer_id', value: 'CUST00584', confidence: 0.96 },
      { type: 'error_code', value: 'E-45632', confidence: 0.99 },
      { type: 'amount', value: '45000', confidence: 0.94 },
      { type: 'transfer_type', value: 'IMPS', confidence: 0.92 }
    ]
  }
};

// Mock analysis profiles
export const mockAnalysisProfiles = [
  {
    id: generateId(),
    profile_name: 'Standard Analysis',
    description: 'Basic sentiment, category, and entity extraction',
    is_default: true,
    created_at: '2023-07-01T10:00:00Z',
    updated_at: '2023-07-01T10:00:00Z',
    analysis_types: ['sentiment_v1', 'categorization_v1', 'entity_extraction_v1']
  },
  {
    id: generateId(),
    profile_name: 'Comprehensive Analysis',
    description: 'Detailed analysis including PII detection and compliance checking',
    is_default: false,
    created_at: '2023-07-15T11:30:00Z',
    updated_at: '2023-07-15T11:30:00Z',
    analysis_types: ['sentiment_v2', 'categorization_v2', 'entity_extraction_v2', 'pii_detection_v1', 'compliance_check_v1']
  }
];

// Mock analysis types
export const mockAnalysisTypes = [
  {
    type_key: 'sentiment_v1',
    display_name: 'Basic Sentiment Analysis',
    description: 'Analyzes the overall sentiment of the conversation',
    input_requirements: 'transcript_json',
    output_format: 'json',
    is_enabled: true
  },
  {
    type_key: 'sentiment_v2',
    display_name: 'Advanced Sentiment Analysis',
    description: 'Analyzes sentiment with temporal tracking throughout the call',
    input_requirements: 'transcript_json',
    output_format: 'json',
    is_enabled: true
  },
  {
    type_key: 'categorization_v1',
    display_name: 'Basic Categorization',
    description: 'Categorizes the call into predefined categories',
    input_requirements: 'transcript_json',
    output_format: 'json',
    is_enabled: true
  },
  {
    type_key: 'categorization_v2',
    display_name: 'Detailed Categorization',
    description: 'Categorizes the call with primary, secondary, and tertiary categories',
    input_requirements: 'transcript_json',
    output_format: 'json',
    is_enabled: true
  },
  {
    type_key: 'entity_extraction_v1',
    display_name: 'Entity Extraction',
    description: 'Extracts key entities such as account numbers, amounts, and dates',
    input_requirements: 'transcript_json',
    output_format: 'json',
    is_enabled: true
  },
  {
    type_key: 'entity_extraction_v2',
    display_name: 'Advanced Entity Extraction',
    description: 'Extracts entities with relationship mapping',
    input_requirements: 'transcript_json',
    output_format: 'json',
    is_enabled: true
  },
  {
    type_key: 'pii_detection_v1',
    display_name: 'PII Detection',
    description: 'Identifies personally identifiable information',
    input_requirements: 'transcript_json',
    output_format: 'json',
    is_enabled: true
  },
  {
    type_key: 'compliance_check_v1',
    display_name: 'Compliance Check',
    description: 'Checks compliance with regulatory requirements',
    input_requirements: 'transcript_json',
    output_format: 'json',
    is_enabled: true
  }
];