// src/hooks/useProfiles.js
import { useState, useEffect, useCallback } from 'react';
import { getAnalysisProfiles, getAnalysisProfile, createAnalysisProfile, updateAnalysisProfile, deleteAnalysisProfile, getAnalysisTypes } from '../api/profiles';

export function useProfiles(initialLoad = true) {
  const [profiles, setProfiles] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getAnalysisProfiles();
      setProfiles(response);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to fetch profiles');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const fetchTypes = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getAnalysisTypes();
      setTypes(response);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to fetch analysis types');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const fetchProfile = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getAnalysisProfile(id);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to fetch profile');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const createProfile = useCallback(async (profileData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await createAnalysisProfile(profileData);
      setProfiles(prev => [...prev, response]);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to create profile');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const updateProfile = useCallback(async (id, profileData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await updateAnalysisProfile(id, profileData);
      setProfiles(prev => prev.map(p => p.id === id ? response : p));
      return response;
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const deleteProfile = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await deleteAnalysisProfile(id);
      setProfiles(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (err) {
      setError(err.message || 'Failed to delete profile');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    if (initialLoad) {
      fetchProfiles();
      fetchTypes();
    }
  }, [fetchProfiles, fetchTypes, initialLoad]);
  
  return {
    profiles,
    types,
    loading,
    error,
    fetchProfiles,
    fetchTypes,
    fetchProfile,
    createProfile,
    updateProfile,
    deleteProfile
  };
}