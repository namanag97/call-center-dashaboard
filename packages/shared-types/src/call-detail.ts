import { User, UserRole } from './index';

/**
 * Detailed information about a call
 */
export interface CallDetail {
  /**
   * Unique identifier
   */
  id: string;
  
  /**
   * Call title
   */
  title: string;
  
  /**
   * Date and time
   */
  date: string;
  
  /**
   * Duration in seconds
   */
  duration: number;
  
  /**
   * Agent identifier
   */
  agentId: string;
  
  /**
   * Agent name
   */
  agentName: string;
  
  /**
   * Customer identifier
   */
  customerId: string;
  
  /**
   * Customer name
   */
  customerName: string;
  
  /**
   * Call categories
   */
  categories: string[];
  
  /**
   * Call status
   */
  status: CallDetailStatus;
  
  /**
   * Call tags
   */
  tags: string[];
  
  /**
   * Overall score (0-100)
   */
  score: number;
  
  /**
   * Overall sentiment
   */
  sentiment: 'positive' | 'neutral' | 'negative';
  
  /**
   * Whether compliance issues were detected
   */
  complianceIssues: boolean;
  
  /**
   * Last updated timestamp
   */
  lastUpdated: string;
  
  /**
   * Audio metadata
   */
  audio: AudioSegment;
  
  /**
   * Transcript segments
   */
  transcript?: TranscriptEntry[];
  
  /**
   * Metadata about the transcript
   */
  transcriptMetadata: TranscriptMetadata;
  
  /**
   * Metadata about the analysis
   */
  analysisMetadata: AnalysisMetadata;
  
  /**
   * Quality assurance data
   */
  qaMetadata?: QAMetadata;
}

/**
 * Represents a segment in the audio file
 */
export interface AudioSegment {
  /**
   * URL for the audio file
   */
  url: string;
  /**
   * Duration in seconds
   */
  duration: number;
  /**
   * Audio format (e.g., 'mp3', 'wav')
   */
  format: string;
  /**
   * File size in bytes
   */
  size: number;
}

/**
 * Speaker role in a transcript
 */
export enum SpeakerRole {
  Agent = 'agent',
  Customer = 'customer',
  Unknown = 'unknown'
}

/**
 * Represents a single entry in the transcript
 */
export interface TranscriptEntry {
  /**
   * Unique identifier for the segment
   */
  id: string;
  /**
   * Speaker identifier
   */
  speakerId: string;
  /**
   * Speaker name
   */
  speakerName: string;
  /**
   * Speaker role
   */
  speakerRole: SpeakerRole;
  /**
   * Transcript text
   */
  text: string;
  /**
   * Confidence score for the transcription (0-1)
   */
  confidence?: number;
  /**
   * Words with their individual timing information
   */
  words?: Array<{
    /**
     * Word text
     */
    text: string;
    /**
     * Start time in seconds
     */
    startTime: number;
    /**
     * End time in seconds
     */
    endTime: number;
    /**
     * Confidence score (0-1)
     */
    confidence?: number;
  }>;
}

/**
 * Type of sentiment analysis
 */
export type SentimentType = 'positive' | 'neutral' | 'negative';

/**
 * Detailed sentiment analysis results
 */
export interface SentimentAnalysis {
  /**
   * Overall sentiment type
   */
  overall: SentimentType;
  /**
   * Numerical score (-1 to 1)
   */
  score: number;
  /**
   * Sentiment by speaker
   */
  bySpeaker: Record<string, {
    /**
     * Sentiment type
     */
    type: SentimentType;
    /**
     * Numerical score (-1 to 1)
     */
    score: number;
  }>;
  /**
   * Sentiment over time (for visualization)
   */
  timeline: Array<{
    /**
     * Time in seconds
     */
    time: number;
    /**
     * Sentiment type
     */
    type: SentimentType;
    /**
     * Numerical score (-1 to 1)
     */
    score: number;
  }>;
}

/**
 * Named entity in the transcript
 */
export interface NamedEntity {
  /**
   * Entity text
   */
  text: string;
  /**
   * Entity type (e.g., 'person', 'organization', 'location')
   */
  type: string;
  /**
   * Confidence score (0-1)
   */
  confidence: number;
  /**
   * Occurrences in the transcript
   */
  occurrences: Array<{
    /**
     * Transcript entry ID
     */
    transcriptEntryId: string;
    /**
     * Start position in the text
     */
    startPosition: number;
    /**
     * End position in the text
     */
    endPosition: number;
  }>;
}

/**
 * Topic identified in the transcript
 */
export interface Topic {
  /**
   * Topic name
   */
  name: string;
  /**
   * Keywords associated with the topic
   */
  keywords: string[];
  /**
   * Relevance score (0-1)
   */
  relevance: number;
  /**
   * Transcript entries related to this topic
   */
  relatedEntryIds: string[];
}

/**
 * Action item identified in the call
 */
export interface ActionItem {
  /**
   * Action text
   */
  text: string;
  /**
   * Who is assigned to the action
   */
  assignee?: string;
  /**
   * Due date if specified
   */
  dueDate?: string;
  /**
   * Priority level
   */
  priority?: 'low' | 'medium' | 'high';
  /**
   * Transcript entry ID where this was detected
   */
  transcriptEntryId: string;
}

/**
 * Complete analysis results for a call
 */
export interface AnalysisResult {
  /**
   * Call ID
   */
  callId: string;
  /**
   * Sentiment analysis
   */
  sentiment: SentimentAnalysis;
  /**
   * Key topics identified in the call
   */
  topics: Topic[];
  /**
   * Named entities identified in the call
   */
  entities: NamedEntity[];
  /**
   * Action items identified in the call
   */
  actionItems: ActionItem[];
  /**
   * Key moments in the call
   */
  keyMoments: Array<{
    /**
     * Moment type
     */
    type: 'question' | 'decision' | 'problem' | 'solution' | 'objection' | 'commitment';
    /**
     * Description of the moment
     */
    description: string;
    /**
     * Transcript entry ID
     */
    transcriptEntryId: string;
    /**
     * Time in seconds
     */
    time: number;
  }>;
  /**
   * Summary of the call
   */
  summary: string;
  /**
   * Compliance issues detected
   */
  complianceIssues?: Array<{
    /**
     * Issue type
     */
    type: string;
    /**
     * Issue description
     */
    description: string;
    /**
     * Severity level
     */
    severity: 'low' | 'medium' | 'high';
    /**
     * Transcript entry ID
     */
    transcriptEntryId: string;
  }>;
}

/**
 * QA evaluation criteria
 */
export interface QACriterion {
  /**
   * Criterion ID
   */
  id: string;
  /**
   * Criterion name
   */
  name: string;
  /**
   * Criterion description
   */
  description: string;
  /**
   * Category of this criterion
   */
  category: string;
  /**
   * Weight of this criterion in the overall score (0-100)
   */
  weight: number;
}

/**
 * QA note attached to a specific part of the transcript
 */
export interface QANote {
  /**
   * Note ID
   */
  id: string;
  /**
   * Note text
   */
  text: string;
  /**
   * Transcript entry ID this note is related to
   */
  transcriptEntryId: string;
  /**
   * Created by user
   */
  createdBy: User;
  /**
   * Created at date
   */
  createdAt: string;
  /**
   * Category of the note
   */
  category?: 'positive' | 'negative' | 'suggestion' | 'general';
}

/**
 * Quality Assurance data for a call
 */
export interface QAData {
  /**
   * Call ID
   */
  callId: string;
  /**
   * Overall score (0-100)
   */
  score: number;
  /**
   * Status of the QA process
   */
  status: 'pending' | 'in-progress' | 'completed';
  /**
   * User who performed the evaluation
   */
  evaluatedBy?: User;
  /**
   * When the evaluation was performed
   */
  evaluatedAt?: string;
  /**
   * Evaluations for individual criteria
   */
  criteriaEvaluations: Array<{
    /**
     * Criterion ID
     */
    criterionId: string;
    /**
     * Score for this criterion (0-10)
     */
    score: number;
    /**
     * Comments about this criterion
     */
    comment?: string;
  }>;
  /**
   * Notes attached to specific parts of the transcript
   */
  notes: QANote[];
  /**
   * Overall feedback about the call
   */
  feedback?: string;
}

/**
 * Call Status enum
 */
export enum CallDetailStatus {
  Pending = 'pending',
  Transcribing = 'transcribing',
  Transcribed = 'transcribed',
  Analyzing = 'analyzing',
  Analyzed = 'analyzed',
  Failed = 'failed',
  // Include base statuses to avoid conflicts
  New = 'new',
  Reviewed = 'reviewed',
  Archived = 'archived'
}

/**
 * API Error Response for consistent error handling
 */
export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

/**
 * Word with timing information
 */
export interface Word {
  text: string;
  startTime: number;
  endTime: number;
  confidence: number;
}

/**
 * Sentiment information
 */
export interface SentimentInfo {
  type: 'positive' | 'neutral' | 'negative';
  score: number;
}

/**
 * Timeline sentiment point
 */
export interface SentimentTimelinePoint {
  time: number;
  type: 'positive' | 'neutral' | 'negative';
  score: number;
}

/**
 * Entity occurrence in transcript
 */
export interface EntityOccurrence {
  transcriptEntryId: string;
  startPosition: number;
  endPosition: number;
}

/**
 * Entity detected in analysis
 */
export interface Entity {
  text: string;
  type: string;
  confidence: number;
  occurrences: EntityOccurrence[];
}

/**
 * Key moment from call
 */
export interface KeyMoment {
  type: 'problem' | 'solution' | 'commitment' | 'question' | 'other';
  description: string;
  transcriptEntryId: string;
  time: number;
}

/**
 * Compliance issue detected in call
 */
export interface ComplianceIssue {
  type: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  transcriptEntryId: string;
}

/**
 * Call detail metadata about transcript
 */
export interface TranscriptMetadata {
  available: boolean;
  segmentCount: number;
  wordCount: number;
  engine?: string;
  confidence?: number;
}

/**
 * Call detail metadata about analysis
 */
export interface AnalysisMetadata {
  available: boolean;
  completedAt?: string;
  version?: string;
}

/**
 * Call detail metadata about QA
 */
export interface QAMetadata {
  status: 'pending' | 'in-progress' | 'completed';
  reviewedBy?: User;
  reviewedAt?: string;
  score?: number;
} 