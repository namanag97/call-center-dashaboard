import React, { useState } from 'react';
import { CallStatus, FilterOptions } from '@conista/shared-types';
import { Button, Input, Dropdown } from '../ui';

// Types that should match those from shared-types
interface DateRangeFilter {
  start?: string;
  end?: string;
}

interface RangeFilter<T extends number> {
  min?: T;
  max?: T;
}

export interface FilterControlsProps {
  /**
   * Current filter options
   */
  filters: FilterOptions;
  
  /**
   * Available agent options for dropdown
   */
  agentOptions?: { value: string; label: string }[];
  
  /**
   * Available client options for dropdown
   */
  clientOptions?: { value: string; label: string }[];
  
  /**
   * Callback when filters change
   */
  onFilterChange: (filters: FilterOptions) => void;
  
  /**
   * Whether filter controls are collapsed
   */
  collapsed?: boolean;
  
  /**
   * Toggle collapsed state
   */
  onToggleCollapse?: () => void;
  
  /**
   * Whether the component is in a loading state
   */
  isLoading?: boolean;
  
  /**
   * Custom CSS class names
   */
  className?: string;
}

/**
 * FilterControls component for filtering call data
 */
const FilterControls: React.FC<FilterControlsProps> = ({
  filters,
  agentOptions = [],
  clientOptions = [],
  onFilterChange,
  collapsed = false,
  onToggleCollapse,
  isLoading = false,
  className = '',
}) => {
  // Internal filter state (for handling updates before applying)
  const [internalFilters, setInternalFilters] = useState<FilterOptions>(filters);
  
  // Status options
  const statusOptions = Object.values(CallStatus).map(status => ({
    value: status,
    label: formatStatusLabel(status),
  }));
  
  // Helper to update a specific filter field
  const updateFilter = <K extends keyof FilterOptions>(
    key: K,
    value: FilterOptions[K]
  ) => {
    const updatedFilters = {
      ...internalFilters,
      [key]: value,
    };
    setInternalFilters(updatedFilters);
  };
  
  // Update date range filter
  const updateDateRange = (field: keyof DateRangeFilter, value: string) => {
    const currentRange = internalFilters.dateRange || {};
    const newRange = { ...currentRange, [field]: value };
    updateFilter('dateRange', newRange);
  };
  
  // Update range filter
  const updateRangeFilter = <T extends number>(
    filterKey: 'duration' | 'score',
    field: keyof RangeFilter<T>,
    value: string
  ) => {
    const currentRange = (internalFilters[filterKey] as RangeFilter<T>) || {};
    const parsedValue = value ? Number(value) : undefined;
    const newRange = { ...currentRange, [field]: parsedValue };
    updateFilter(filterKey, newRange);
  };
  
  // Apply current filters
  const applyFilters = () => {
    onFilterChange(internalFilters);
  };
  
  // Reset all filters
  const resetFilters = () => {
    const emptyFilters: FilterOptions = {};
    setInternalFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };
  
  // Handle status selection
  const handleStatusChange = (value: string | string[]) => {
    const selectedValues = Array.isArray(value) ? value : [value];
    updateFilter('status', selectedValues as CallStatus[]);
  };
  
  // Handle agent selection
  const handleAgentsChange = (value: string | string[]) => {
    const selectedValues = Array.isArray(value) ? value : [value];
    updateFilter('agentIds', selectedValues);
  };
  
  // Handle client selection (which maps to categories in FilterOptions)
  const handleClientsChange = (value: string | string[]) => {
    const selectedValues = Array.isArray(value) ? value : [value];
    updateFilter('categories', selectedValues);
  };
  
  // Helper to format status label
  function formatStatusLabel(status: CallStatus): string {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
  
  // Render only a toggle button when collapsed
  if (collapsed) {
    return (
      <div className={`flex justify-end py-2 ${className}`}>
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleCollapse}
          disabled={isLoading}
          data-testid="expand-filters-button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Show Filters
        </Button>
      </div>
    );
  }
  
  return (
    <div
      className={`bg-white border rounded-md p-4 mb-4 ${className}`}
      data-testid="filter-controls"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Filters</h3>
        {onToggleCollapse && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            data-testid="collapse-filters-button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Status Filter */}
        <div>
          <Dropdown
            label="Status"
            options={statusOptions}
            isMulti
            placeholder="Select statuses..."
            value={internalFilters.status || []}
            onChange={handleStatusChange}
            isDisabled={isLoading}
            data-testid="status-filter"
          />
        </div>
        
        {/* Date Range Filter */}
        <div>
          <label className="block text-sm font-medium mb-1">Date Range</label>
          <div className="flex space-x-2">
            <Input
              type="date"
              placeholder="From"
              value={internalFilters.dateRange?.start || ''}
              onChange={(e) => updateDateRange('start', e.target.value)}
              disabled={isLoading}
              data-testid="date-from-filter"
              className="w-full"
            />
            <Input
              type="date"
              placeholder="To"
              value={internalFilters.dateRange?.end || ''}
              onChange={(e) => updateDateRange('end', e.target.value)}
              disabled={isLoading}
              data-testid="date-to-filter"
              className="w-full"
            />
          </div>
        </div>
        
        {/* Agent Filter */}
        <div>
          <Dropdown
            label="Agent"
            options={agentOptions}
            isMulti
            placeholder="Select agents..."
            value={internalFilters.agentIds || []}
            onChange={handleAgentsChange}
            isDisabled={isLoading}
            data-testid="agent-filter"
          />
        </div>
        
        {/* Client Filter */}
        <div>
          <Dropdown
            label="Client"
            options={clientOptions}
            isMulti
            placeholder="Select clients..."
            value={internalFilters.categories || []}
            onChange={handleClientsChange}
            isDisabled={isLoading}
            data-testid="client-filter"
          />
        </div>
        
        {/* Duration Range Filter */}
        <div>
          <label className="block text-sm font-medium mb-1">Duration (seconds)</label>
          <div className="flex space-x-2">
            <Input
              type="number"
              min={0}
              placeholder="Min"
              value={internalFilters.duration?.min?.toString() || ''}
              onChange={(e) => updateRangeFilter('duration', 'min', e.target.value)}
              disabled={isLoading}
              data-testid="duration-min-filter"
              className="w-full"
            />
            <Input
              type="number"
              min={0}
              placeholder="Max"
              value={internalFilters.duration?.max?.toString() || ''}
              onChange={(e) => updateRangeFilter('duration', 'max', e.target.value)}
              disabled={isLoading}
              data-testid="duration-max-filter"
              className="w-full"
            />
          </div>
        </div>
        
        {/* Score Range Filter */}
        <div>
          <label className="block text-sm font-medium mb-1">Score</label>
          <div className="flex space-x-2">
            <Input
              type="number"
              min={0}
              max={100}
              placeholder="Min"
              value={internalFilters.score?.min?.toString() || ''}
              onChange={(e) => updateRangeFilter('score', 'min', e.target.value)}
              disabled={isLoading}
              data-testid="score-min-filter"
              className="w-full"
            />
            <Input
              type="number"
              min={0}
              max={100}
              placeholder="Max"
              value={internalFilters.score?.max?.toString() || ''}
              onChange={(e) => updateRangeFilter('score', 'max', e.target.value)}
              disabled={isLoading}
              data-testid="score-max-filter"
              className="w-full"
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end mt-4 space-x-3">
        <Button
          variant="outline"
          onClick={resetFilters}
          disabled={isLoading}
          data-testid="reset-filters-button"
        >
          Reset
        </Button>
        <Button
          variant="primary"
          onClick={applyFilters}
          isLoading={isLoading}
          data-testid="apply-filters-button"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default FilterControls; 