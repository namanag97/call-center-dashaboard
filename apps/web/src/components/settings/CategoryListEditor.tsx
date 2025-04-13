import React, { useState, useCallback } from 'react';
import { Button, Input, Checkbox } from '../ui';
import { PlusIcon } from '@heroicons/react/24/outline';

/**
 * Category interface
 */
export interface Category {
  /**
   * Unique identifier
   */
  id: string;
  /**
   * Display name
   */
  name: string;
  /**
   * Whether the category is enabled
   */
  enabled: boolean;
  /**
   * Category color (hex)
   */
  color?: string;
  /**
   * Display order
   */
  order: number;
}

/**
 * Props for the CategoryListEditor
 */
interface CategoryListEditorProps {
  /**
   * List of categories
   */
  categories: Category[];
  /**
   * Called when categories are updated (add, edit, remove, reorder)
   */
  onCategoriesChange: (categories: Category[]) => void;
  /**
   * Whether the component is in a loading state
   */
  isLoading?: boolean;
  /**
   * Error message
   */
  error?: string;
}

/**
 * Component for editing analysis categories
 */
export const CategoryListEditor: React.FC<CategoryListEditorProps> = ({
  categories,
  onCategoriesChange,
  isLoading = false,
  error,
}) => {
  // State for editing mode
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // State for new category
  const [newCategory, setNewCategory] = useState<Omit<Category, 'id' | 'order'>>({
    name: '',
    enabled: true,
    color: '#3B82F6',
  });
  
  // State for tracking edited category
  const [editedCategory, setEditedCategory] = useState<Category | null>(null);
  
  // State for drag and drop
  const [draggedItem, setDraggedItem] = useState<Category | null>(null);
  
  // Handle initiating edit
  const handleEditStart = useCallback((category: Category) => {
    setEditingId(category.id);
    setEditedCategory(category);
  }, []);
  
  // Handle category save
  const handleSaveCategory = useCallback(() => {
    if (editedCategory) {
      const updatedCategories = categories.map(c => 
        c.id === editedCategory.id ? editedCategory : c
      );
      onCategoriesChange(updatedCategories);
      setEditingId(null);
      setEditedCategory(null);
    }
  }, [editedCategory, categories, onCategoriesChange]);
  
  // Handle category delete
  const handleDeleteCategory = useCallback((id: string) => {
    const updatedCategories = categories
      .filter(c => c.id !== id)
      .map((c, index) => ({ ...c, order: index }));
    onCategoriesChange(updatedCategories);
  }, [categories, onCategoriesChange]);
  
  // Handle new category add
  const handleAddCategory = useCallback(() => {
    if (newCategory.name.trim() === '') return;
    
    const newCategoryItem: Category = {
      id: `category-${Date.now()}`,
      name: newCategory.name.trim(),
      enabled: newCategory.enabled,
      color: newCategory.color,
      order: categories.length,
    };
    
    onCategoriesChange([...categories, newCategoryItem]);
    
    // Reset new category form
    setNewCategory({
      name: '',
      enabled: true,
      color: '#3B82F6',
    });
  }, [newCategory, categories, onCategoriesChange]);
  
  // Handle drag start
  const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>, category: Category) => {
    setDraggedItem(category);
    // For ghost drag image
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      // Create semi-transparent helper
      e.dataTransfer.setDragImage(e.currentTarget, 20, 20);
    }
  }, []);
  
  // Handle drag over
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>, category: Category) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.id === category.id) return;
    
    // Reorder the items
    const newCategories = [...categories];
    const draggedIndex = newCategories.findIndex(c => c.id === draggedItem.id);
    const targetIndex = newCategories.findIndex(c => c.id === category.id);
    
    if (draggedIndex !== -1 && targetIndex !== -1) {
      // Remove the dragged item
      const [removed] = newCategories.splice(draggedIndex, 1);
      // Insert at the new position
      newCategories.splice(targetIndex, 0, removed);
      
      // Update order values
      const updated = newCategories.map((c, index) => ({
        ...c,
        order: index,
      }));
      
      onCategoriesChange(updated);
    }
  }, [draggedItem, categories, onCategoriesChange]);
  
  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setDraggedItem(null);
  }, []);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Analysis Categories</h2>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}
      
      {/* Category List */}
      <div className="space-y-3">
        {categories.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-md border border-gray-200">
            <p className="text-gray-500">No categories defined</p>
            <p className="text-sm text-gray-400 mt-1">Add your first category below</p>
          </div>
        ) : (
          categories
            .sort((a, b) => a.order - b.order)
            .map(category => (
              <div 
                key={category.id}
                className={`
                  border rounded-md p-3 flex items-center gap-3
                  ${draggedItem?.id === category.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}
                  ${!category.enabled ? 'opacity-60' : ''}
                  ${isLoading ? 'opacity-50 pointer-events-none' : ''}
                `}
                draggable={!isLoading && editingId !== category.id}
                onDragStart={(e) => handleDragStart(e, category)}
                onDragOver={(e) => handleDragOver(e, category)}
                onDragEnd={handleDragEnd}
              >
                {/* Drag Handle */}
                <div className="cursor-move text-gray-400 p-1">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                  </svg>
                </div>
                
                {/* Color Indicator */}
                <div 
                  className="w-5 h-5 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: category.color || '#CBD5E1' }}
                />
                
                {editingId === category.id ? (
                  <div className="flex-1 flex items-center gap-3">
                    <Input
                      value={editedCategory?.name || ''}
                      onChange={(e) => setEditedCategory(prev => 
                        prev ? { ...prev, name: e.target.value } : null
                      )}
                      placeholder="Category name"
                      disabled={isLoading}
                      className="flex-1"
                      data-testid="category-edit-name-input"
                    />
                    <Input
                      type="color"
                      value={editedCategory?.color || '#3B82F6'}
                      onChange={(e) => setEditedCategory(prev => 
                        prev ? { ...prev, color: e.target.value } : null
                      )}
                      disabled={isLoading}
                      className="w-24"
                      data-testid="category-edit-color-input"
                    />
                    <Checkbox
                      checked={editedCategory?.enabled || false}
                      onChange={(checked) => setEditedCategory(prev => 
                        prev ? { ...prev, enabled: checked } : null
                      )}
                      disabled={isLoading}
                      data-testid="category-edit-enabled-checkbox"
                    />
                  </div>
                ) : (
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{category.name}</h4>
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  {editingId === category.id ? (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingId(null)}
                        disabled={isLoading}
                        data-testid="category-cancel-button"
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSaveCategory}
                        disabled={!editedCategory?.name || isLoading}
                        data-testid="category-save-button"
                      >
                        Save
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditStart(category)}
                        disabled={isLoading}
                        data-testid="category-edit-button"
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteCategory(category.id)}
                        disabled={isLoading}
                        data-testid="category-delete-button"
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))
        )}
      </div>
      
      {/* Add New Category */}
      <div className="border rounded-md p-4 bg-gray-50">
        <h3 className="text-md font-medium text-gray-900 mb-3">Add New Category</h3>
        <div className="flex items-center gap-3">
          <Input
            value={newCategory.name}
            onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Category name"
            disabled={isLoading}
            className="flex-1"
            data-testid="category-new-name-input"
          />
          <Input
            type="color"
            value={newCategory.color || '#3B82F6'}
            onChange={(e) => setNewCategory(prev => ({ ...prev, color: e.target.value }))}
            disabled={isLoading}
            className="w-24"
            data-testid="category-new-color-input"
          />
          <Checkbox
            id="new-category-enabled"
            checked={newCategory.enabled}
            onChange={(checked) => setNewCategory(prev => ({ ...prev, enabled: checked }))}
            disabled={isLoading}
            data-testid="category-new-enabled-checkbox"
          />
          <label htmlFor="new-category-enabled" className="text-sm text-gray-700">
            Enabled
          </label>
          <Button
            onClick={handleAddCategory}
            disabled={!newCategory.name.trim() || isLoading}
            size="sm"
            data-testid="category-add-button"
          >
            <PlusIcon className="h-5 w-5 mr-1" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CategoryListEditor; 