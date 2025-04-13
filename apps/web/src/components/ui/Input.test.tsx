import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Input from './Input'

describe('Input Component', () => {
  it('renders correctly with default props', () => {
    render(<Input placeholder="Test placeholder" />)
    const input = screen.getByPlaceholderText('Test placeholder')
    expect(input).toBeInTheDocument()
  })

  it('renders label when provided', () => {
    render(<Input label="Test Label" />)
    const label = screen.getByText('Test Label')
    expect(label).toBeInTheDocument()
  })

  it('displays required indicator when isRequired is true', () => {
    render(<Input label="Required Field" isRequired />)
    const requiredSymbol = screen.getByText('*')
    expect(requiredSymbol).toBeInTheDocument()
  })

  it('shows error message when provided', () => {
    render(<Input error="This field is required" />)
    const error = screen.getByText('This field is required')
    expect(error).toBeInTheDocument()
    expect(error).toHaveClass('text-error-500')
  })

  it('shows helper text when provided', () => {
    render(<Input helperText="Enter your username" />)
    const helperText = screen.getByText('Enter your username')
    expect(helperText).toBeInTheDocument()
  })

  it('applies disabled attribute when disabled is true', () => {
    render(<Input disabled placeholder="Disabled input" />)
    const input = screen.getByPlaceholderText('Disabled input')
    expect(input).toBeDisabled()
  })

  it('allows typing in the input field', () => {
    render(<Input />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'Test value' } })
    expect(input).toHaveValue('Test value')
  })

  it('passes custom attributes to the input element', () => {
    render(<Input data-testid="custom-input" />)
    const input = screen.getByTestId('custom-input')
    expect(input).toBeInTheDocument()
  })

  it('renders left element when provided', () => {
    const leftElement = <span data-testid="left-element">🔍</span>
    render(<Input leftElement={leftElement} />)
    const element = screen.getByTestId('left-element')
    expect(element).toBeInTheDocument()
  })

  it('renders right element when provided', () => {
    const rightElement = <span data-testid="right-element">❌</span>
    render(<Input rightElement={rightElement} />)
    const element = screen.getByTestId('right-element')
    expect(element).toBeInTheDocument()
  })
}) 