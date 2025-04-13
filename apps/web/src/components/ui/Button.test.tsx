import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import Button from './Button'

describe('Button component', () => {
  it('renders correctly with default props', () => {
    render(<Button>Click me</Button>)
    
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('bg-primary-600')
  })

  it('applies the correct variant classes', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-primary-600')

    rerender(<Button variant="secondary">Secondary</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-secondary-500')

    rerender(<Button variant="outline">Outline</Button>)
    expect(screen.getByRole('button')).toHaveClass('border-primary-600')

    rerender(<Button variant="ghost">Ghost</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-transparent')
  })

  it('applies the correct size classes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>)
    expect(screen.getByRole('button')).toHaveClass('text-sm')

    rerender(<Button size="md">Medium</Button>)
    expect(screen.getByRole('button')).toHaveClass('text-base')

    rerender(<Button size="lg">Large</Button>)
    expect(screen.getByRole('button')).toHaveClass('text-lg')
  })

  it('renders loading state correctly', () => {
    render(<Button isLoading>Loading</Button>)
    
    const button = screen.getByRole('button', { name: /loading/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('disabled')
    expect(button).toContainHTML('svg')
  })

  it('handles click events', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    
    render(<Button onClick={handleClick}>Click me</Button>)
    
    const button = screen.getByRole('button', { name: /click me/i })
    await user.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('does not trigger click when disabled', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    
    render(<Button disabled onClick={handleClick}>Disabled Button</Button>)
    
    const button = screen.getByRole('button', { name: /disabled button/i })
    await user.click(button)
    
    expect(handleClick).not.toHaveBeenCalled()
  })
})