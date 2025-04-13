import React from 'react';
import { PaginationState } from '@conista/shared-types';
import { Button, Text } from '../ui';

export interface PaginationProps {
  /**
   * Current pagination state
   */
  pagination: PaginationState;
  
  /**
   * Available page size options
   */
  pageSizeOptions?: number[];
  
  /**
   * Callback when the page changes
   */
  onPageChange: (page: number) => void;
  
  /**
   * Callback when the page size changes
   */
  onPageSizeChange: (pageSize: number) => void;
  
  /**
   * Whether to disable all pagination controls
   */
  disabled?: boolean;
  
  /**
   * Custom class names to apply to the component
   */
  className?: string;
}

/**
 * Pagination component for navigating through paginated data
 */
const Pagination: React.FC<PaginationProps> = ({
  pagination,
  pageSizeOptions = [10, 25, 50, 100],
  onPageChange,
  onPageSizeChange,
  disabled = false,
  className = '',
}) => {
  const { page, pageSize, totalPages, totalItems } = pagination;
  
  // Calculate the range of items being displayed
  const startItem = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalItems);
  
  // Generate page numbers to display
  const getPageNumbers = (): (number | 'ellipsis')[] => {
    // Always show first and last page
    if (totalPages <= 7) {
      // If few pages, show all
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    // Show first, last, current and surrounding pages with ellipsis for the rest
    const pages: (number | 'ellipsis')[] = [1];
    
    if (page > 3) {
      pages.push('ellipsis');
    }
    
    // Pages around current
    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    if (page < totalPages - 2) {
      pages.push('ellipsis');
    }
    
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 py-4 ${className}`}>
      {/* Page size selector */}
      <div className="flex items-center space-x-2">
        <Text as="span" size="sm" className="text-neutral-500">
          Show
        </Text>
        <select
          className="rounded-md border-neutral-300 py-1 pl-2 pr-8 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          disabled={disabled}
          aria-label="Page size"
          data-testid="page-size-select"
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <Text as="span" size="sm" className="text-neutral-500">
          per page
        </Text>
      </div>
      
      {/* Info text */}
      <div className="text-sm text-neutral-500">
        {totalItems > 0 ? (
          <span data-testid="pagination-info">
            Showing <span className="font-medium">{startItem}</span> to{' '}
            <span className="font-medium">{endItem}</span> of{' '}
            <span className="font-medium">{totalItems}</span> results
          </span>
        ) : (
          <span data-testid="pagination-info">No results</span>
        )}
      </div>
      
      {/* Page buttons */}
      <div className="flex space-x-1">
        {/* Previous page button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={disabled || page <= 1}
          aria-label="Previous page"
          data-testid="previous-page-button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </Button>
        
        {/* Page number buttons */}
        {getPageNumbers().map((pageNum, index) => 
          pageNum === 'ellipsis' ? (
            <Button
              key={`ellipsis-${index}`}
              variant="ghost"
              size="sm"
              disabled={true}
              className="cursor-default"
            >
              ...
            </Button>
          ) : (
            <Button
              key={pageNum}
              variant={pageNum === page ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onPageChange(pageNum)}
              disabled={disabled}
              aria-label={`Page ${pageNum}`}
              aria-current={pageNum === page ? 'page' : undefined}
              data-testid={`page-button-${pageNum}`}
            >
              {pageNum}
            </Button>
          )
        )}
        
        {/* Next page button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={disabled || page >= totalPages}
          aria-label="Next page"
          data-testid="next-page-button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
};

export default Pagination; 