import React, { useState, useEffect } from 'react';
import { Button, Input, Checkbox, Dropdown, Label } from '../ui';

// Provider type definition
export type ProviderType = 'transcription' | 'analysis' | 'storage';

// Provider interface
export interface Provider {
  id: string;
  name: string;
  type: ProviderType;
  apiKey: string;
  apiEndpoint?: string;
  enabled: boolean;
  version?: number;
}

export interface ProviderFormProps {
  /** Provider to edit (undefined for create mode) */
  provider?: Provider;
  /** Handler for form submission */
  onSubmit: (provider: Partial<Provider>) => Promise<void>;
  /** Handler for cancellation */
  onCancel: () => void;
  /** Loading state */
  isLoading?: boolean;
  /** Error message */
  error?: string;
}

/**
 * Form for adding or editing API providers
 */
export const ProviderForm: React.FC<ProviderFormProps> = ({
  provider,
  onSubmit,
  onCancel,
  isLoading = false,
  error,
}) => {
  // Form state
  const [name, setName] = useState('');
  const [type, setType] = useState<ProviderType>('transcription');
  const [apiKey, setApiKey] = useState('');
  const [apiEndpoint, setApiEndpoint] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [formError, setFormError] = useState('');

  // Load provider data when editing
  useEffect(() => {
    if (provider) {
      setName(provider.name || '');
      setType(provider.type);
      setApiKey(provider.apiKey || '');
      setApiEndpoint(provider.apiEndpoint || '');
      setEnabled(provider.enabled);
    }
  }, [provider]);

  // Provider type options
  const typeOptions = [
    { id: 'transcription', name: 'Transcription' },
    { id: 'analysis', name: 'Analysis' },
    { id: 'storage', name: 'Storage' },
  ];

  // Map provider types to dropdown format
  const dropdownOptions = typeOptions.map(option => ({
    value: option.id,
    label: option.name
  }));

  // Validate form
  const validateForm = () => {
    if (!name.trim()) {
      setFormError('Provider name is required');
      return false;
    }
    
    if (!apiKey.trim()) {
      setFormError('API key is required');
      return false;
    }
    
    setFormError('');
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await onSubmit({
        id: provider?.id,
        name,
        type,
        apiKey,
        apiEndpoint: apiEndpoint.trim() || undefined,
        enabled,
        version: provider?.version
      });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save provider');
    }
  };

  // Handle type selection
  const handleTypeChange = (value: string | string[]) => {
    // Ensure we're only handling single value since isMulti is not enabled
    if (typeof value === 'string') {
      setType(value as ProviderType);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter provider name"
          disabled={isLoading}
          required
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="type">Type</Label>
        <Dropdown
          name="type"
          value={type}
          onChange={handleTypeChange}
          options={dropdownOptions}
          isDisabled={isLoading || !!provider}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="apiKey">API Key</Label>
        <Input
          id="apiKey"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter API key"
          type="password"
          disabled={isLoading}
          required
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="apiEndpoint">API Endpoint (Optional)</Label>
        <Input
          id="apiEndpoint"
          value={apiEndpoint}
          onChange={(e) => setApiEndpoint(e.target.value)}
          placeholder="Enter API endpoint URL"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-1">
        <Checkbox
          id="enabled"
          checked={enabled}
          onChange={(checked) => setEnabled(checked)}
          disabled={isLoading}
          label="Enabled"
        />
      </div>

      {(error || formError) && (
        <div className="p-3 text-red-700 bg-red-100 rounded">
          {error || formError}
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {provider ? 'Update Provider' : 'Add Provider'}
        </Button>
      </div>
    </form>
  );
};

export default ProviderForm; 