import React, { useState, useEffect, useMemo } from 'react';
import { SortOptions } from '@conista/shared-types';

interface Column<T> {
  id: string;
  header: string | React.ReactNode;
  accessor: (item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface DataTableProps<T> {
  /**
   * The data to display in the table
   */
  data: T[];
  
  /**
   * Column definitions that specify how to render each column
   */
  columns: Column<T>[];
  
  /**
   * Unique identifier for each row
   */
  getRowId: (row: T) => string;
  
  /**
   * Whether data is currently being loaded
   */
  isLoading?: boolean;
  
  /**
   * Custom message to display when there's no data
   */
  emptyMessage?: string;
  
  /**
   * Whether to show row selection checkboxes
   */
  selectable?: boolean;
  
  /**
   * Currently selected row IDs
   */
  selectedIds?: string[];
  
  /**
   * Callback when selection changes
   */
  onSelectionChange?: (selectedIds: string[]) => void;
  
  /**
   * Initial sort state
   */
  initialSort?: SortOptions;
  
  /**
   * Callback when sort changes
   */
  onSortChange?: (sort: SortOptions) => void;
  
  /**
   * Whether to use client-side sorting (true) or rely on server sorting (false)
   */
  clientSideSort?: boolean;
  
  /**
   * Whether table has a hover state on rows
   */
  hoverable?: boolean;
  
  /**
   * Custom class names to apply to the table
   */
  className?: string;
  
  /**
   * Additional props to apply to each row element
   */
  getRowProps?: (row: T) => Record<string, unknown>;
}

/**
 * DataTable component to display tabular data with sorting and selection
 */
function DataTable<T>({
  data,
  columns,
  getRowId,
  isLoading = false,
  emptyMessage = 'No data available',
  selectable = false,
  selectedIds = [],
  onSelectionChange,
  initialSort,
  onSortChange,
  clientSideSort = true,
  hoverable = true,
  className = '',
  getRowProps = () => ({}),
}: DataTableProps<T>) {
  // State for internal selection handling (when controlled selection is not used)
  const [internalSelectedIds, setInternalSelectedIds] = useState<string[]>([]);
  
  // Use either controlled or internal selection
  const actualSelectedIds = onSelectionChange ? selectedIds : internalSelectedIds;
  
  // State for current sort
  const [sort, setSort] = useState<SortOptions | undefined>(initialSort);
  
  // Reset internal selected IDs when data changes
  useEffect(() => {
    if (!onSelectionChange) {
      setInternalSelectedIds([]);
    }
  }, [data, onSelectionChange]);
  
  // Update sort state when initialSort changes
  useEffect(() => {
    setSort(initialSort);
  }, [initialSort]);
  
  // Handle sort changes
  const handleSort = (columnId: string) => {
    const column = columns.find(col => col.id === columnId);
    if (!column?.sortable) return;
    
    let newSort: SortOptions | undefined;
    
    if (sort?.field === columnId) {
      if (sort.direction === 'asc') {
        newSort = { field: columnId, direction: 'desc' };
      } else {
        // If already descending, remove sort
        newSort = undefined;
      }
    } else {
      newSort = { field: columnId, direction: 'asc' };
    }
    
    setSort(newSort);
    
    if (onSortChange) {
      onSortChange(newSort!);
    }
  };
  
  // Apply client-side sorting if enabled
  const sortedData = useMemo(() => {
    if (!clientSideSort || !sort) return data;
    
    const { field, direction } = sort;
    
    return [...data].sort((a: any, b: any) => {
      const aValue = a[field];
      const bValue = b[field];
      
      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return direction === 'asc' ? -1 : 1;
      if (bValue === undefined) return direction === 'asc' ? 1 : -1;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return direction === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      // Default comparison for other types
      return 0;
    });
  }, [data, sort, clientSideSort]);
  
  // Handle selection changes
  const handleSelectRow = (rowId: string) => {
    let newSelectedIds: string[];
    
    if (actualSelectedIds.includes(rowId)) {
      newSelectedIds = actualSelectedIds.filter(id => id !== rowId);
    } else {
      newSelectedIds = [...actualSelectedIds, rowId];
    }
    
    if (onSelectionChange) {
      onSelectionChange(newSelectedIds);
    } else {
      setInternalSelectedIds(newSelectedIds);
    }
  };
  
  // Handle select all rows
  const handleSelectAll = () => {
    let newSelectedIds: string[];
    
    if (actualSelectedIds.length === data.length) {
      // If all are selected, deselect all
      newSelectedIds = [];
    } else {
      // Otherwise select all
      newSelectedIds = data.map(getRowId);
    }
    
    if (onSelectionChange) {
      onSelectionChange(newSelectedIds);
    } else {
      setInternalSelectedIds(newSelectedIds);
    }
  };
  
  // Check if all rows are selected
  const allRowsSelected = data.length > 0 && actualSelectedIds.length === data.length;
  
  // Check if some but not all rows are selected
  const someRowsSelected = actualSelectedIds.length > 0 && actualSelectedIds.length < data.length;
  
  // Render the empty state
  if (!isLoading && data.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 border rounded-md bg-white text-neutral-500">
        {emptyMessage}
      </div>
    );
  }
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 border rounded-md bg-white">
        <div className="flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full divide-y divide-neutral-200 bg-white ${className}`}>
        <thead className="bg-neutral-50">
          <tr>
            {selectable && (
              <th className="px-4 py-3 w-10">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                    checked={allRowsSelected}
                    ref={input => {
                      if (input) {
                        input.indeterminate = someRowsSelected;
                      }
                    }}
                    onChange={handleSelectAll}
                    aria-label="Select all rows"
                  />
                </div>
              </th>
            )}
            
            {columns.map(column => (
              <th
                key={column.id}
                className={`px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider ${
                  column.sortable ? 'cursor-pointer select-none' : ''
                } ${column.align === 'center' ? 'text-center' : ''}  ${column.align === 'right' ? 'text-right' : ''}`}
                style={{ width: column.width }}
                onClick={() => column.sortable && handleSort(column.id)}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.header}</span>
                  {column.sortable && (
                    <span className="flex flex-col">
                      <svg
                        className={`w-3 h-3 -mb-1 ${
                          sort?.field === column.id && sort?.direction === 'asc'
                            ? 'text-neutral-900'
                            : 'text-neutral-400'
                        }`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                      </svg>
                      <svg
                        className={`w-3 h-3 -mt-1 ${
                          sort?.field === column.id && sort?.direction === 'desc'
                            ? 'text-neutral-900'
                            : 'text-neutral-400'
                        }`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200">
          {sortedData.map(row => {
            const rowId = getRowId(row);
            const isSelected = actualSelectedIds.includes(rowId);
            
            return (
              <tr
                key={rowId}
                className={`
                  ${hoverable ? 'hover:bg-neutral-50' : ''} 
                  ${isSelected ? 'bg-primary-50' : ''}
                `}
                {...getRowProps(row)}
              >
                {selectable && (
                  <td className="px-4 py-3 w-10">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                        checked={isSelected}
                        onChange={() => handleSelectRow(rowId)}
                        aria-label={`Select row ${rowId}`}
                      />
                    </div>
                  </td>
                )}
                
                {columns.map(column => (
                  <td
                    key={`${rowId}-${column.id}`}
                    className={`px-4 py-3 text-sm ${
                      column.align === 'center' ? 'text-center' : ''
                    } ${column.align === 'right' ? 'text-right' : ''}`}
                  >
                    {column.accessor(row)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable; 