import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import Dropdown from './Dropdown'

const sampleOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
]

describe('Dropdown Component', () => {
  it('renders correctly with default props', () => {
    render(<Dropdown options={sampleOptions} />)
    
    // Check if the dropdown trigger is rendered
    const trigger = screen.getByTestId('dropdown-trigger')
    expect(trigger).toBeInTheDocument()
    
    // Should show placeholder initially
    expect(trigger).toHaveTextContent('Select an option')
  })
  
  it('renders with a label when provided', () => {
    render(<Dropdown options={sampleOptions} label="Test Label" />)
    
    // Check if the label is rendered
    const label = screen.getByText('Test Label')
    expect(label).toBeInTheDocument()
  })
  
  it('shows options when clicked', async () => {
    const user = userEvent.setup()
    render(<Dropdown options={sampleOptions} />)
    
    // Click to open dropdown
    const trigger = screen.getByTestId('dropdown-trigger')
    await user.click(trigger)
    
    // Check if options are visible
    const options = screen.getByTestId('dropdown-options')
    expect(options).toBeInTheDocument()
    
    // Check if all options are rendered
    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.getByText('Option 2')).toBeInTheDocument()
    expect(screen.getByText('Option 3')).toBeInTheDocument()
  })
  
  it('selects an option when clicked', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<Dropdown options={sampleOptions} onChange={handleChange} />)
    
    // Open dropdown
    const trigger = screen.getByTestId('dropdown-trigger')
    await user.click(trigger)
    
    // Click an option
    const option = screen.getByText('Option 2')
    await user.click(option)
    
    // Check if the selection is displayed
    expect(trigger).toHaveTextContent('Option 2')
    
    // Verify onChange was called with correct value
    expect(handleChange).toHaveBeenCalledWith('option2')
  })
  
  it('handles disabled state correctly', async () => {
    const user = userEvent.setup()
    render(<Dropdown options={sampleOptions} isDisabled />)
    
    // Check if trigger has disabled attributes
    const trigger = screen.getByTestId('dropdown-trigger')
    expect(trigger).toBeDisabled()
    
    // Clicking should not open dropdown
    await user.click(trigger)
    expect(screen.queryByTestId('dropdown-options')).not.toBeInTheDocument()
  })
  
  it('displays search input when isSearchable is true', async () => {
    const user = userEvent.setup()
    render(<Dropdown options={sampleOptions} isSearchable />)
    
    // Open dropdown
    const trigger = screen.getByTestId('dropdown-trigger')
    await user.click(trigger)
    
    // Check if search input is rendered
    const searchInput = screen.getByTestId('dropdown-search')
    expect(searchInput).toBeInTheDocument()
  })
  
  it('filters options when searching', async () => {
    const user = userEvent.setup()
    render(<Dropdown options={sampleOptions} isSearchable />)
    
    // Open dropdown
    const trigger = screen.getByTestId('dropdown-trigger')
    await user.click(trigger)
    
    // Type in search input
    const searchInput = screen.getByTestId('dropdown-search')
    await user.type(searchInput, 'Option 1')
    
    // Only Option 1 should be visible
    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.queryByText('Option 2')).not.toBeInTheDocument()
    expect(screen.queryByText('Option 3')).not.toBeInTheDocument()
  })
  
  it('supports multi-select mode', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<Dropdown options={sampleOptions} isMulti onChange={handleChange} />)
    
    // Open dropdown
    const trigger = screen.getByTestId('dropdown-trigger')
    await user.click(trigger)
    
    // Select first option
    const option1 = screen.getByText('Option 1')
    await user.click(option1)
    
    // Dropdown should stay open in multi-select mode
    expect(screen.getByTestId('dropdown-options')).toBeInTheDocument()
    
    // Select second option
    const option2 = screen.getByText('Option 2')
    await user.click(option2)
    
    // Check if onChange was called with array of values
    expect(handleChange).toHaveBeenLastCalledWith(['option1', 'option2'])
    
    // Trigger should show count of selected options
    expect(trigger).toHaveTextContent('2 options selected')
  })
  
  it('displays error message when provided', () => {
    render(<Dropdown options={sampleOptions} error="Error message" />)
    
    // Check if error message is displayed
    const errorMessage = screen.getByText('Error message')
    expect(errorMessage).toBeInTheDocument()
    expect(errorMessage).toHaveClass('text-error-500')
  })
}) 