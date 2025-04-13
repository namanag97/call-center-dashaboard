import React, { useState } from 'react';
import { SystemSettings, Provider } from '@conista/shared-types';
import { Input, Dropdown, Button, Checkbox } from '../ui';

export interface GeneralSettingsFormProps {
  settings: SystemSettings;
  providers: Provider[];
  onSubmit: (data: SystemSettings) => Promise<void>;
  isLoading?: boolean;
  className?: string;
}

interface FormErrors {
  maxUploadSize?: string;
  maxFilesPerBatch?: string;
  retentionPeriodDays?: string;
}

export const GeneralSettingsForm: React.FC<GeneralSettingsFormProps> = ({
  settings,
  providers,
  onSubmit,
  isLoading = false,
  className = '',
}) => {
  // Form state
  const [formData, setFormData] = useState<SystemSettings>({
    ...settings,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Handler for text input changes
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numberValue = parseInt(value, 10);
    
    if (!isNaN(numberValue) || value === '') {
      setFormData((prev) => ({ 
        ...prev, 
        [name]: value === '' ? 0 : numberValue 
      }));
      setTouched((prev) => ({ ...prev, [name]: true }));
    }
  };

  // Handler for checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  // Handler for file types input (comma separated)
  const handleFileTypesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    
    const fileTypes = value
      .split(',')
      .map(type => type.trim())
      .filter(type => type.length > 0);
    
    setFormData((prev) => ({ ...prev, allowedFileTypes: fileTypes }));
  };

  // Handler for dropdown changes
  const handleProviderChange = (name: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [name]: value as string }));
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (formData.maxUploadSize <= 0) {
      newErrors.maxUploadSize = 'Maximum upload size must be greater than 0';
    }
    
    if (formData.maxFilesPerBatch <= 0) {
      newErrors.maxFilesPerBatch = 'Maximum files per batch must be greater than 0';
    }
    
    if (formData.retentionPeriodDays <= 0) {
      newErrors.retentionPeriodDays = 'Retention period must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Touch all fields for validation
    const allFields = { 
      maxUploadSize: true, 
      maxFilesPerBatch: true, 
      retentionPeriodDays: true 
    };
    setTouched(allFields);
    
    if (validateForm()) {
      try {
        await onSubmit(formData);
      } catch (error) {
        console.error('Error submitting settings:', error);
      }
    }
  };

  // Blur handler for validation
  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateForm();
  };

  // Group providers by type
  const transcriptionProviders = providers.filter(p => p.type === 'transcription');
  const analysisProviders = providers.filter(p => p.type === 'analysis');
  const storageProviders = providers.filter(p => p.type === 'storage');

  // Create dropdown options
  const transcriptionOptions = transcriptionProviders.map(p => ({ value: p.id, label: p.name }));
  const analysisOptions = analysisProviders.map(p => ({ value: p.id, label: p.name }));
  const storageOptions = storageProviders.map(p => ({ value: p.id, label: p.name }));

  const fileTypesString = formData.allowedFileTypes?.join(', ') || '';

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      <h2 className="text-lg font-medium">
        General Settings
      </h2>
      
      <div className="space-y-4">
        <h3 className="text-md font-medium">Default Providers</h3>
        
        <Dropdown
          label="Default Transcription Provider"
          options={transcriptionOptions}
          value={formData.defaultTranscriptionProviderId || ''}
          onChange={(value) => handleProviderChange('defaultTranscriptionProviderId', value)}
          disabled={isLoading || transcriptionOptions.length === 0}
          placeholder={transcriptionOptions.length === 0 ? 'No transcription providers available' : 'Select provider'}
        />
        
        <Dropdown
          label="Default Analysis Provider"
          options={analysisOptions}
          value={formData.defaultAnalysisProviderId || ''}
          onChange={(value) => handleProviderChange('defaultAnalysisProviderId', value)}
          disabled={isLoading || analysisOptions.length === 0}
          placeholder={analysisOptions.length === 0 ? 'No analysis providers available' : 'Select provider'}
        />
        
        <Dropdown
          label="Default Storage Provider"
          options={storageOptions}
          value={formData.defaultStorageProviderId || ''}
          onChange={(value) => handleProviderChange('defaultStorageProviderId', value)}
          disabled={isLoading || storageOptions.length === 0}
          placeholder={storageOptions.length === 0 ? 'No storage providers available' : 'Select provider'}
        />
      </div>
      
      <div className="space-y-4">
        <h3 className="text-md font-medium">Upload Settings</h3>
        
        <Input
          name="maxUploadSize"
          label="Maximum Upload Size (bytes)"
          value={formData.maxUploadSize.toString()}
          onChange={handleNumberChange}
          onBlur={() => handleBlur('maxUploadSize')}
          error={touched.maxUploadSize ? errors.maxUploadSize : undefined}
          disabled={isLoading}
          helperText="Maximum file size in bytes (e.g., 52428800 for 50 MB)"
          status={touched.maxUploadSize && errors.maxUploadSize ? 'error' : 'default'}
        />
        
        <Input
          name="allowedFileTypes"
          label="Allowed File Types"
          value={fileTypesString}
          onChange={handleFileTypesChange}
          disabled={isLoading}
          helperText="Comma-separated list of MIME types (e.g., audio/mp3, audio/wav)"
        />
        
        <Input
          name="maxFilesPerBatch"
          label="Maximum Files Per Batch"
          value={formData.maxFilesPerBatch.toString()}
          onChange={handleNumberChange}
          onBlur={() => handleBlur('maxFilesPerBatch')}
          error={touched.maxFilesPerBatch ? errors.maxFilesPerBatch : undefined}
          disabled={isLoading}
          status={touched.maxFilesPerBatch && errors.maxFilesPerBatch ? 'error' : 'default'}
        />
      </div>
      
      <div className="space-y-4">
        <h3 className="text-md font-medium">Retention and Processing</h3>
        
        <Input
          name="retentionPeriodDays"
          label="Retention Period (days)"
          value={formData.retentionPeriodDays.toString()}
          onChange={handleNumberChange}
          onBlur={() => handleBlur('retentionPeriodDays')}
          error={touched.retentionPeriodDays ? errors.retentionPeriodDays : undefined}
          disabled={isLoading}
          helperText="Number of days to retain recordings before automatic deletion"
          status={touched.retentionPeriodDays && errors.retentionPeriodDays ? 'error' : 'default'}
        />
        
        <Checkbox
          label="Auto-Transcribe"
          name="autoTranscribe"
          checked={formData.autoTranscribe}
          onChange={handleCheckboxChange}
          disabled={isLoading}
          description="Automatically transcribe new recordings upon upload"
        />
        
        <Checkbox
          label="Auto-Analyze"
          name="autoAnalyze"
          checked={formData.autoAnalyze}
          onChange={handleCheckboxChange}
          disabled={isLoading}
          description="Automatically analyze new recordings after transcription"
        />
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          variant="primary"
          type="submit"
          isLoading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </form>
  );
};

export default GeneralSettingsForm; 