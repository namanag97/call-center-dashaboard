/**
 * Common type definitions for the Conista application
 */

// Basic user types
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt?: string;
  lastLogin?: string;
}

export enum UserRole {
  Admin = 'admin',
  Agent = 'agent',
  Manager = 'manager',
  Viewer = 'viewer'
}

// Authentication types
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresAt?: string;
}

export interface AuthError {
  code: AuthErrorCode;
  message: string;
  field?: string;
  details?: Record<string, any>;
}

export enum AuthErrorCode {
  InvalidCredentials = 'invalid_credentials',
  AccountLocked = 'account_locked',
  EmailNotVerified = 'email_not_verified',
  TooManyAttempts = 'too_many_attempts',
  ServerError = 'server_error',
  NetworkError = 'network_error',
  ValidationError = 'validation_error'
}

// Call related types
export interface CallRecord {
  id: string;
  title: string;
  date: string;
  duration: number;
  agentId: string;
  agentName: string;
  customerId?: string;
  customerName?: string;
  categories: string[];
  status: CallStatus;
  tags: string[];
  score?: number;
  sentiment?: 'positive' | 'neutral' | 'negative';
  complianceIssues?: boolean;
  lastUpdated?: string;
}

export enum CallStatus {
  New = 'new',
  Analyzed = 'analyzed',
  Reviewed = 'reviewed',
  Archived = 'archived'
}

// Data display types
export interface PaginationState {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FilterOptions {
  search?: string;
  status?: CallStatus[];
  dateRange?: {
    start?: string;
    end?: string;
  };
  agentIds?: string[];
  categories?: string[];
  tags?: string[];
  sentiment?: ('positive' | 'neutral' | 'negative')[];
  duration?: {
    min?: number;
    max?: number;
  };
  score?: {
    min?: number;
    max?: number;
  };
  complianceIssues?: boolean;
}

export interface CallListParams {
  pagination: {
    page: number;
    pageSize: number;
  };
  sort?: SortOptions;
  filters?: FilterOptions;
}

// API response types
export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
}

export interface CallListResponse {
  data: CallRecord[];
  pagination: PaginationState;
}

export interface CallStatistics {
  total: number;
  byStatus: Record<CallStatus, number>;
  averageDuration: number;
  averageScore?: number;
  bySentiment?: Record<string, number>;
  complianceIssuesCount?: number;
}

// Call Detail Types
export * from './call-detail';

// Upload Types
export * from './upload';

// Settings Types
export * from './settings';

// Re-export all types
export * from './index';