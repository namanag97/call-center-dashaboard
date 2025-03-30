// src/api/profiles.js
import { mockAnalysisProfiles, mockAnalysisTypes } from './mockData';

// Get all analysis profiles
export const getAnalysisProfiles = async () => {
  // In a real implementation, this would call the API
  // For now, we'll return the mock data
  return mockAnalysisProfiles;
};

// Get specific analysis profile by ID
export const getAnalysisProfile = async (id) => {
  // In a real implementation, this would call the API
  const profile = mockAnalysisProfiles.find(p => p.id === id);
  if (!profile) {
    throw new Error('Profile not found');
  }
  
  return profile;
};

// Create new analysis profile
export const createAnalysisProfile = async (profileData) => {
  const newProfile = {
    id: `prof-${Date.now()}`,
    profile_name: profileData.profileName,
    description: profileData.description,
    is_default: profileData.isDefault || false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    analysis_types: profileData.analysisTypeKeys || []
  };
  
  // In a real implementation, this would post to the API
  // For now, we'll just return the mock data
  return newProfile;
};

// Update analysis profile
export const updateAnalysisProfile = async (id, profileData) => {
  // Find the profile to update
  const profile = mockAnalysisProfiles.find(p => p.id === id);
  if (!profile) {
    throw new Error('Profile not found');
  }
  
  // Update the profile
  const updatedProfile = {
    ...profile,
    profile_name: profileData.profileName || profile.profile_name,
    description: profileData.description || profile.description,
    is_default: profileData.isDefault !== undefined ? profileData.isDefault : profile.is_default,
    analysis_types: profileData.analysisTypeKeys || profile.analysis_types,
    updated_at: new Date().toISOString()
  };
  
  // In a real implementation, this would put to the API
  // For now, we'll just return the updated profile
  return updatedProfile;
};

// Delete analysis profile
export const deleteAnalysisProfile = async (id) => {
  // In a real implementation, this would delete the profile
  // For now, we'll just return success
  return true;
};

// Get all analysis types
export const getAnalysisTypes = async () => {
  // In a real implementation, this would call the API
  // For now, we'll return the mock data
  return mockAnalysisTypes;
};