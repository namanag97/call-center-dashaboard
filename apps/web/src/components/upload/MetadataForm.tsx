import React, { useState, useEffect } from 'react';
import { UploadMetadata } from '@conista/shared-types';
import { Button, Input } from '../ui';

/**
 * Form validation errors
 */
interface FormErrors {
  title?: string;
  date?: string;
  agentId?: string;
  customerId?: string;
  customerName?: string;
  categories?: string;
  tags?: string;
  notes?: string;
}

/**
 * Props for the MetadataForm component
 */
interface MetadataFormProps {
  /**
   * Initial metadata values
   */
  initialValues?: Partial<UploadMetadata>;
  /**
   * Called when form is submitted with valid data
   */
  onSubmit: (metadata: UploadMetadata) => void;
  /**
   * Called when form is cancelled
   */
  onCancel?: () => void;
  /**
   * Whether the form is in a loading state
   */
  isLoading?: boolean;
  /**
   * Available agent options
   */
  agentOptions?: Array<{ id: string; name: string }>;
  /**
   * Available category options
   */
  categoryOptions?: string[];
  /**
   * Available tag options
   */
  tagOptions?: string[];
  /**
   * Custom class name
   */
  className?: string;
}

/**
 * Form for inputting call recording metadata
 */
export const MetadataForm: React.FC<MetadataFormProps> = ({
  initialValues = {},
  onSubmit,
  onCancel,
  isLoading = false,
  agentOptions = [],
  categoryOptions = [],
  tagOptions = [],
  className = '',
}) => {
  // Form state
  const [values, setValues] = useState<Partial<UploadMetadata>>({
    title: '',
    date: new Date().toISOString().split('T')[0], // Default to today
    agentId: '',
    customerId: '',
    customerName: '',
    categories: [],
    tags: [],
    notes: '',
    ...initialValues,
  });

  // Validation errors
  const [errors, setErrors] = useState<FormErrors>({});
  
  // Form touched state
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Update form when initialValues change
  useEffect(() => {
    setValues(prev => ({
      ...prev,
      ...initialValues,
    }));
  }, [initialValues]);

  /**
   * Validate a single field
   */
  const validateField = (name: string, value: any): string | undefined => {
    switch (name) {
      case 'title':
        return !value || value.trim() === '' ? 'Title is required' : undefined;
      case 'date':
        return !value ? 'Date is required' : undefined;
      case 'agentId':
        return !value ? 'Agent is required' : undefined;
      default:
        return undefined;
    }
  };

  /**
   * Validate the entire form
   */
  const validateForm = (): FormErrors => {
    const formErrors: FormErrors = {};
    
    Object.entries(values).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) {
        formErrors[key as keyof FormErrors] = error;
      }
    });
    
    return formErrors;
  };

  /**
   * Handle input change
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let newValue = value;

    // Handle special input types
    if (type === 'date' && value) {
      newValue = value; // Format date to YYYY-MM-DD if needed
    }

    setValues(prev => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear error when field is edited
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  /**
   * Handle multiple select for categories and tags
   */
  const handleMultipleSelect = (name: 'categories' | 'tags', value: string) => {
    setValues(prev => {
      const currentValues = prev[name] || [];
      
      if (currentValues.includes(value)) {
        // Remove if already selected
        return {
          ...prev,
          [name]: currentValues.filter(v => v !== value),
        };
      } else {
        // Add if not selected
        return {
          ...prev,
          [name]: [...currentValues, value],
        };
      }
    });
  };

  /**
   * Handle blur event for validation
   */
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true,
    }));
    
    // Validate the field
    const error = validateField(name, value);
    if (error) {
      setErrors(prev => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched: Record<string, boolean> = {};
    Object.keys(values).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);
    
    // Validate all fields
    const formErrors = validateForm();
    setErrors(formErrors);
    
    // Submit if no errors
    if (Object.keys(formErrors).length === 0) {
      // Cast to full UploadMetadata (we've validated required fields)
      onSubmit(values as UploadMetadata);
    }
  };

  /**
   * Render a field with label and error message
   */
  const renderField = (
    label: string,
    name: keyof UploadMetadata,
    type: string = 'text',
    placeholder: string = '',
    required: boolean = false,
    options?: Array<{ id: string; name: string } | string>
  ) => {
    const hasError = touched[name] && errors[name];
    
    return (
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        {type === 'textarea' ? (
          <textarea
            name={name}
            value={values[name] as string || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={isLoading}
            className={`
              w-full px-3 py-2 border rounded-md shadow-sm focus:ring-1 focus:outline-none
              ${hasError 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}
            `}
            rows={3}
          />
        ) : type === 'select' ? (
          <select
            name={name}
            value={values[name] as string || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isLoading}
            className={`
              w-full px-3 py-2 border rounded-md shadow-sm focus:ring-1 focus:outline-none
              ${hasError 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}
            `}
          >
            <option value="">Select {label.toLowerCase()}</option>
            {options?.map((option) => {
              // Handle both string options and object options
              const value = typeof option === 'string' ? option : option.id;
              const label = typeof option === 'string' ? option : option.name;
              
              return (
                <option key={value} value={value}>
                  {label}
                </option>
              );
            })}
          </select>
        ) : type === 'checkboxes' ? (
          <div className="flex flex-wrap gap-2 mt-1">
            {options?.map((option) => {
              const value = typeof option === 'string' ? option : option.id;
              const label = typeof option === 'string' ? option : option.name;
              const isChecked = (values[name] as string[])?.includes(value) || false;
              
              return (
                <div 
                  key={value} 
                  className={`
                    px-3 py-1 border rounded-md text-sm cursor-pointer select-none
                    ${isChecked 
                      ? 'bg-blue-50 border-blue-300 text-blue-700' 
                      : 'bg-white border-gray-300 hover:bg-gray-50'
                    }
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                  onClick={() => !isLoading && handleMultipleSelect(name as 'categories' | 'tags', value)}
                >
                  {label}
                </div>
              );
            })}
            {(options?.length || 0) === 0 && (
              <div className="text-sm text-gray-500 italic">No options available</div>
            )}
          </div>
        ) : (
          <Input
            name={name}
            type={type}
            value={values[name] as string || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={isLoading}
            status={hasError ? 'error' : 'default'}
          />
        )}
        
        {hasError && (
          <p className="text-sm text-red-600 mt-1">{errors[name]}</p>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-medium text-gray-900">Call Metadata</h3>
      
      {renderField('Title', 'title', 'text', 'Enter call title', true)}
      {renderField('Date', 'date', 'date', '', true)}
      {renderField('Agent', 'agentId', 'select', '', true, agentOptions)}
      {renderField('Customer ID', 'customerId', 'text', 'Enter customer ID')}
      {renderField('Customer Name', 'customerName', 'text', 'Enter customer name')}
      
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Categories
        </label>
        {renderField('', 'categories', 'checkboxes', '', false, categoryOptions)}
      </div>
      
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Tags
        </label>
        {renderField('', 'tags', 'checkboxes', '', false, tagOptions)}
      </div>
      
      {renderField('Notes', 'notes', 'textarea', 'Enter additional notes about this call')}
      
      <div className="flex justify-end space-x-2 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
        
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
          isLoading={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save Metadata'}
        </Button>
      </div>
    </form>
  );
}; 