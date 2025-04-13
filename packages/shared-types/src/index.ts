/**
 * Common type definitions for the Conista application
 */

// Basic user types
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
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
}

export interface AuthResponse {
  user: User;
  token: string;
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
}

export enum CallStatus {
  New = 'new',
  Analyzed = 'analyzed',
  Reviewed = 'reviewed',
  Archived = 'archived'
}

// Re-export all types
export * from './index'; 