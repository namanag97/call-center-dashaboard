import React, { useState, useEffect } from 'react';
import { Button, Input, Text, Alert, Spinner } from '../ui';

export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  order?: number;
}

interface CategorySettingsProps {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  onSaveCategories: (categories: Category[]) => Promise<void>;
}

/**
 * Component for managing call categories
 */
export const CategorySettings: React.FC<CategorySettingsProps> = ({
  categories,
  isLoading,
  error,
  onSaveCategories,
}) => {
  const [localCategories, setLocalCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Initialize local state from props
  useEffect(() => {
    setLocalCategories(categories);
  }, [categories]);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timeout = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [successMessage]);

  // Add a new category
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    
    const newCategory: Category = {
      id: `category-${Date.now()}`,
      name: newCategoryName.trim(),
      order: localCategories.length,
    };
    
    setLocalCategories([...localCategories, newCategory]);
    setNewCategoryName('');
  };

  // Update category name
  const handleUpdateCategory = (id: string, name: string) => {
    setLocalCategories(
      localCategories.map(category => 
        category.id === id ? { ...category, name } : category
      )
    );
  };

  // Remove a category
  const handleRemoveCategory = (id: string) => {
    setLocalCategories(localCategories.filter(category => category.id !== id));
  };

  // Save all categories
  const handleSave = async () => {
    try {
      await onSaveCategories(localCategories);
      setSuccessMessage('Categories saved successfully');
    } catch (err) {
      // Error is handled by the store
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-10">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert status="error">
          {error}
        </Alert>
      )}
      
      {successMessage && (
        <Alert status="success">
          {successMessage}
        </Alert>
      )}
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Text as="h3" size="lg" weight="semibold">Call Categories</Text>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={handleSave}
            disabled={isLoading}
          >
            Save Changes
          </Button>
        </div>
        
        <div className="space-y-2">
          {localCategories.map(category => (
            <div key={category.id} className="flex items-center space-x-2">
              <Input
                value={category.name}
                onChange={(e) => handleUpdateCategory(category.id, e.target.value)}
                placeholder="Category name"
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveCategory(category.id)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
        
        <div className="flex items-center space-x-2 pt-4">
          <Input
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="New category name"
            className="flex-1"
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={handleAddCategory}
            disabled={!newCategoryName.trim()}
          >
            Add Category
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CategorySettings; 