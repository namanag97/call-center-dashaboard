import React, { useState } from 'react';
import { Category } from '@conista/shared-types';
import { Input, Button, Checkbox } from '../ui';

export interface CategoryFormProps {
  category?: Category;
  onSubmit: (data: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  existingCategories?: Category[];
  className?: string;
}

interface FormErrors {
  name?: string;
  description?: string;
  keywords?: string;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  onSubmit,
  onCancel,
  isLoading = false,
  existingCategories = [],
  className = '',
}) => {
  // Form state
  const [formData, setFormData] = useState<Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'version'>>({
    name: category?.name || '',
    description: category?.description || '',
    order: category?.order || existingCategories.length + 1,
    enabled: category?.enabled ?? true,
    keywords: category?.keywords || [],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [keywordsInput, setKeywordsInput] = useState(category?.keywords?.join(', ') || '');

  // Handler for text input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  // Handler for keywords change
  const handleKeywordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeywordsInput(value);
    
    // Parse keywords and update form data
    const keywords = value
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);
    
    setFormData(prev => ({ ...prev, keywords }));
    setTouched(prev => ({ ...prev, keywords: true }));
  };

  // Handler for checkbox changes
  const handleEnabledChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, enabled: e.target.checked }));
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    } else if (
      // Check for duplicates if adding a new category or changing the name of an existing one
      existingCategories.some(c => 
        c.name.toLowerCase() === formData.name.toLowerCase() && 
        c.id !== category?.id
      )
    ) {
      newErrors.name = 'A category with this name already exists';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Touch all fields for validation
    const allFields = { name: true, description: true, keywords: true };
    setTouched(allFields);
    
    if (validateForm()) {
      try {
        await onSubmit(formData);
      } catch (error) {
        console.error('Error submitting category:', error);
      }
    }
  };

  // Blur handler for validation
  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateForm();
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      <h2 className="text-lg font-medium">
        {category ? 'Edit Category' : 'Add Category'}
      </h2>
      
      <Input
        name="name"
        label="Category Name"
        value={formData.name}
        onChange={handleChange}
        onBlur={() => handleBlur('name')}
        error={touched.name ? errors.name : undefined}
        placeholder="Enter category name"
        isRequired
        status={touched.name && errors.name ? 'error' : 'default'}
        disabled={isLoading}
      />
      
      <Input
        name="description"
        label="Description"
        value={formData.description || ''}
        onChange={handleChange}
        onBlur={() => handleBlur('description')}
        error={touched.description ? errors.description : undefined}
        placeholder="Enter category description"
        status={touched.description && errors.description ? 'error' : 'default'}
        disabled={isLoading}
        helperText="Brief description of what this category represents"
      />
      
      <Input
        name="keywords"
        label="Keywords"
        value={keywordsInput}
        onChange={handleKeywordsChange}
        onBlur={() => handleBlur('keywords')}
        error={touched.keywords ? errors.keywords : undefined}
        placeholder="Enter comma-separated keywords"
        status={touched.keywords && errors.keywords ? 'error' : 'default'}
        disabled={isLoading}
        helperText="Comma-separated keywords for AI classification (e.g., compliance, regulation, legal)"
      />
      
      <Checkbox
        label="Enabled"
        checked={formData.enabled}
        onChange={handleEnabledChange}
        disabled={isLoading}
        description="Enable or disable this category"
      />
      
      <div className="flex justify-end space-x-3 pt-2">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          type="button"
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          type="submit"
          isLoading={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save Category'}
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm; 