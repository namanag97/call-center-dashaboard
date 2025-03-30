// src/components/Pagination.jsx
import { Group, Button, Text, Select } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

function Pagination({ 
  currentPage, 
  totalPages, 
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading
}) {
  // Calculate visible page range
  const showPages = 5;
  const halfVisible = Math.floor(showPages / 2);
  let startPage = Math.max(1, currentPage - halfVisible);
  let endPage = Math.min(totalPages, startPage + showPages - 1);
  
  // Adjust if we're near the end
  if (endPage - startPage + 1 < showPages) {
    startPage = Math.max(1, endPage - showPages + 1);
  }
  
  // Create page buttons
  const pageButtons = [];
  for (let i = startPage; i <= endPage; i++) {
    pageButtons.push(
      <Button
        key={i}
        variant={i === currentPage ? 'filled' : 'subtle'}
        onClick={() => onPageChange(i)}
        disabled={loading}
      >
        {i}
      </Button>
    );
  }
  
  // Calculate display range
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);
  
  return (
    <Group position="apart" mt="md">
      <Group>
        <Text size="sm" color="dimmed">
          Showing {totalItems > 0 ? startItem : 0} to {endItem} of {totalItems} entries
        </Text>
        
        <Select
          value={pageSize.toString()}
          onChange={(value) => onPageSizeChange(parseInt(value))}
          data={[
            { value: '10', label: '10 per page' },
            { value: '20', label: '20 per page' },
            { value: '50', label: '50 per page' },
            { value: '100', label: '100 per page' }
          ]}
          style={{ width: '120px' }}
          size="xs"
          disabled={loading}
        />
      </Group>
      
      <Group>
        <Button
          variant="subtle"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          leftIcon={<IconChevronLeft size={14} />}
        >
          Previous
        </Button>
        
        {startPage > 1 && (
          <>
            <Button
              variant="subtle"
              onClick={() => onPageChange(1)}
              disabled={loading}
            >
              1
            </Button>
            {startPage > 2 && <Text>...</Text>}
          </>
        )}
        
        {pageButtons}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <Text>...</Text>}
            <Button
              variant="subtle"
              onClick={() => onPageChange(totalPages)}
              disabled={loading}
            >
              {totalPages}
            </Button>
          </>
        )}
        
        <Button
          variant="subtle"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          rightIcon={<IconChevronRight size={14} />}
        >
          Next
        </Button>
      </Group>
    </Group>
  );
}

export default Pagination;