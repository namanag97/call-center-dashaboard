import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import SearchBar from '../SearchBar'

describe('SearchBar', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders with default placeholder', () => {
    const onSearch = vi.fn()
    render(<SearchBar onSearch={onSearch} />)
    
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
  })
  
  it('renders with custom placeholder', () => {
    const onSearch = vi.fn()
    render(<SearchBar onSearch={onSearch} placeholder="Custom placeholder" />)
    
    expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument()
  })
  
  it('renders with initial value', () => {
    const onSearch = vi.fn()
    render(<SearchBar onSearch={onSearch} initialValue="Initial value" />)
    
    expect(screen.getByDisplayValue('Initial value')).toBeInTheDocument()
  })
  
  it('calls onSearch after debounce when typing', () => {
    const onSearch = vi.fn()
    render(<SearchBar onSearch={onSearch} debounceMs={300} />)
    
    const input = screen.getByTestId('search-input')
    fireEvent.change(input, { target: { value: 'test' } })
    
    expect(onSearch).not.toHaveBeenCalled()
    
    // Fast-forward time
    vi.advanceTimersByTime(300)
    
    expect(onSearch).toHaveBeenCalledWith('test')
  })
  
  it('calls onSearch immediately on Enter key press', () => {
    const onSearch = vi.fn()
    render(<SearchBar onSearch={onSearch} />)
    
    const input = screen.getByTestId('search-input')
    fireEvent.change(input, { target: { value: 'test' } })
    
    // Clear any debounced calls
    vi.clearAllTimers()
    onSearch.mockClear()
    
    // Press Enter
    fireEvent.keyDown(input, { key: 'Enter' })
    
    expect(onSearch).toHaveBeenCalledWith('test')
  })
  
  it('clears input after search when clearAfterSearch is true', () => {
    const onSearch = vi.fn()
    render(<SearchBar onSearch={onSearch} clearAfterSearch={true} />)
    
    const input = screen.getByTestId('search-input')
    fireEvent.change(input, { target: { value: 'test' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    
    expect(input).toHaveValue('')
    expect(onSearch).toHaveBeenCalledWith('test')
  })
  
  it('does not trigger search when input is shorter than minChars', () => {
    const onSearch = vi.fn()
    render(<SearchBar onSearch={onSearch} minChars={3} />)
    
    const input = screen.getByTestId('search-input')
    fireEvent.change(input, { target: { value: 'te' } })
    
    // Fast-forward time
    vi.advanceTimersByTime(500)
    
    expect(onSearch).not.toHaveBeenCalled()
    
    // Add more characters
    fireEvent.change(input, { target: { value: 'test' } })
    
    // Fast-forward time
    vi.advanceTimersByTime(500)
    
    expect(onSearch).toHaveBeenCalledWith('test')
  })
  
  it('shows clear button when input has value', () => {
    const onSearch = vi.fn()
    render(<SearchBar onSearch={onSearch} />)
    
    const input = screen.getByTestId('search-input')
    
    // Initially, clear button should not be visible
    expect(screen.queryByTestId('clear-search-button')).not.toBeInTheDocument()
    
    // Type something
    fireEvent.change(input, { target: { value: 'test' } })
    
    // Clear button should be visible
    expect(screen.getByTestId('clear-search-button')).toBeInTheDocument()
  })
  
  it('clears input and calls onSearch when clear button is clicked', () => {
    const onSearch = vi.fn()
    render(<SearchBar onSearch={onSearch} initialValue="test" />)
    
    const clearButton = screen.getByTestId('clear-search-button')
    fireEvent.click(clearButton)
    
    expect(screen.getByTestId('search-input')).toHaveValue('')
    expect(onSearch).toHaveBeenCalledWith('')
  })
  
  it('is disabled when disabled prop is true', () => {
    const onSearch = vi.fn()
    render(<SearchBar onSearch={onSearch} disabled={true} />)
    
    expect(screen.getByTestId('search-input')).toBeDisabled()
  })
}) 