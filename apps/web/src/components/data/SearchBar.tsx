import React, { useState, useEffect, useRef, ChangeEvent, KeyboardEvent } from 'react';

export interface SearchBarProps {
  /**
   * Placeholder text for the search input
   */
  placeholder?: string;
  
  /**
   * Initial search value
   */
  initialValue?: string;
  
  /**
   * Callback fired when search value changes and debounce completes
   */
  onSearch: (value: string) => void;
  
  /**
   * Debounce delay in milliseconds
   */
  debounceMs?: number;
  
  /**
   * Whether to search immediately on Enter key press
   */
  searchOnEnter?: boolean;
  
  /**
   * Whether to clear the input after search
   */
  clearAfterSearch?: boolean;
  
  /**
   * Whether the search bar is disabled
   */
  disabled?: boolean;
  
  /**
   * Custom CSS class names
   */
  className?: string;
  
  /**
   * Minimum characters required before triggering search
   */
  minChars?: number;
}

/**
 * SearchBar component with debounced input for search functionality
 */
const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  initialValue = '',
  onSearch,
  debounceMs = 300,
  searchOnEnter = true,
  clearAfterSearch = false,
  disabled = false,
  className = '',
  minChars = 0,
}) => {
  const [value, setValue] = useState(initialValue);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Reset timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);
  
  // Update internal value when initialValue changes
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    // Set a new timer for the debounce
    if (newValue.length >= minChars || newValue.length === 0) {
      timerRef.current = setTimeout(() => {
        onSearch(newValue);
      }, debounceMs);
    }
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchOnEnter) {
      // Clear any existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      
      // Immediately perform the search
      if (value.length >= minChars || value.length === 0) {
        onSearch(value);
        
        // Clear input if specified
        if (clearAfterSearch) {
          setValue('');
        }
      }
    }
  };
  
  const handleClear = () => {
    setValue('');
    
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    // Trigger search with empty string
    onSearch('');
  };
  
  return (
    <div className={`relative w-full ${className}`} data-testid="search-bar">
      <input
        type="text"
        className="w-full rounded-md border border-neutral-300 pl-10 pr-10 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        data-testid="search-input"
      />
      
      {/* Search icon */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      
      {/* Clear button */}
      {value && (
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 focus:outline-none"
          onClick={handleClear}
          disabled={disabled}
          aria-label="Clear search"
          data-testid="clear-search-button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SearchBar; 