import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Pagination from '../Pagination'
import { PaginationState } from '@conista/shared-types'

describe('Pagination Component', () => {
  const defaultPagination: PaginationState = {
    page: 3,
    pageSize: 10,
    totalItems: 95,
    totalPages: 10,
  }

  it('renders with all required elements', () => {
    const onPageChange = vi.fn()
    const onPageSizeChange = vi.fn()
    
    render(
      <Pagination 
        pagination={defaultPagination}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    )
    
    // Page size selector
    expect(screen.getByTestId('page-size-select')).toBeInTheDocument()
    
    // Information text
    expect(screen.getByTestId('pagination-info')).toBeInTheDocument()
    expect(screen.getByTestId('pagination-info')).toHaveTextContent('Showing 21 to 30 of 95 results')
    
    // Navigation buttons
    expect(screen.getByTestId('previous-page-button')).toBeInTheDocument()
    expect(screen.getByTestId('next-page-button')).toBeInTheDocument()
    
    // Page number buttons
    expect(screen.getByTestId('page-button-1')).toBeInTheDocument()
    expect(screen.getByTestId('page-button-3')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('page-button-10')).toBeInTheDocument()
  })

  it('calls onPageChange when page buttons are clicked', () => {
    const onPageChange = vi.fn()
    const onPageSizeChange = vi.fn()
    
    render(
      <Pagination 
        pagination={defaultPagination}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    )
    
    // Click next page button
    fireEvent.click(screen.getByTestId('next-page-button'))
    expect(onPageChange).toHaveBeenCalledWith(4)
    
    // Click previous page button
    fireEvent.click(screen.getByTestId('previous-page-button'))
    expect(onPageChange).toHaveBeenCalledWith(2)
    
    // Click a specific page number
    fireEvent.click(screen.getByTestId('page-button-10'))
    expect(onPageChange).toHaveBeenCalledWith(10)
  })

  it('calls onPageSizeChange when page size is changed', () => {
    const onPageChange = vi.fn()
    const onPageSizeChange = vi.fn()
    
    render(
      <Pagination 
        pagination={defaultPagination}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    )
    
    const select = screen.getByTestId('page-size-select')
    fireEvent.change(select, { target: { value: '25' } })
    
    expect(onPageSizeChange).toHaveBeenCalledWith(25)
  })

  it('disables navigation buttons when appropriate', () => {
    const onPageChange = vi.fn()
    const onPageSizeChange = vi.fn()
    
    // First page - previous should be disabled
    const firstPagePagination = { ...defaultPagination, page: 1 }
    const { rerender } = render(
      <Pagination 
        pagination={firstPagePagination}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    )
    
    expect(screen.getByTestId('previous-page-button')).toBeDisabled()
    expect(screen.getByTestId('next-page-button')).not.toBeDisabled()
    
    // Last page - next should be disabled
    const lastPagePagination = { ...defaultPagination, page: 10 }
    rerender(
      <Pagination 
        pagination={lastPagePagination}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    )
    
    expect(screen.getByTestId('previous-page-button')).not.toBeDisabled()
    expect(screen.getByTestId('next-page-button')).toBeDisabled()
  })

  it('shows correct pagination info with different page sizes', () => {
    const onPageChange = vi.fn()
    const onPageSizeChange = vi.fn()
    
    const pagination = { ...defaultPagination, page: 2, pageSize: 25, totalItems: 95 }
    render(
      <Pagination 
        pagination={pagination}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    )
    
    expect(screen.getByTestId('pagination-info')).toHaveTextContent('Showing 26 to 50 of 95 results')
  })

  it('shows "No results" when there are no items', () => {
    const onPageChange = vi.fn()
    const onPageSizeChange = vi.fn()
    
    const emptyPagination = { ...defaultPagination, page: 1, totalItems: 0, totalPages: 0 }
    render(
      <Pagination 
        pagination={emptyPagination}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    )
    
    expect(screen.getByTestId('pagination-info')).toHaveTextContent('No results')
  })

  it('disables all controls when disabled prop is true', () => {
    const onPageChange = vi.fn()
    const onPageSizeChange = vi.fn()
    
    render(
      <Pagination 
        pagination={defaultPagination}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        disabled={true}
      />
    )
    
    expect(screen.getByTestId('page-size-select')).toBeDisabled()
    expect(screen.getByTestId('previous-page-button')).toBeDisabled()
    expect(screen.getByTestId('next-page-button')).toBeDisabled()
    expect(screen.getByTestId('page-button-1')).toBeDisabled()
  })
}) 