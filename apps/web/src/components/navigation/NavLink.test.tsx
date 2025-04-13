import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import NavLink from './NavLink'

describe('NavLink Component', () => {
  it('renders correctly with basic props', () => {
    render(<NavLink id="dashboard" label="Dashboard" />)
    
    const navLink = screen.getByTestId('nav-link-dashboard')
    expect(navLink).toBeInTheDocument()
    expect(navLink).toHaveTextContent('Dashboard')
  })
  
  it('applies active state classes when isActive is true', () => {
    render(<NavLink id="dashboard" label="Dashboard" isActive />)
    
    const navLink = screen.getByTestId('nav-link-dashboard')
    expect(navLink).toHaveClass('bg-primary-50')
    expect(navLink).toHaveClass('text-primary-700')
    expect(navLink).toHaveAttribute('aria-current', 'page')
  })
  
  it('applies inactive state classes when isActive is false', () => {
    render(<NavLink id="dashboard" label="Dashboard" isActive={false} />)
    
    const navLink = screen.getByTestId('nav-link-dashboard')
    expect(navLink).toHaveClass('text-neutral-700')
    expect(navLink).not.toHaveClass('bg-primary-50')
    expect(navLink).not.toHaveAttribute('aria-current')
  })
  
  it('displays an icon when provided', () => {
    const icon = <svg data-testid="test-icon" />
    render(<NavLink id="dashboard" label="Dashboard" icon={icon} />)
    
    expect(screen.getByTestId('test-icon')).toBeInTheDocument()
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })
  
  it('displays only icon when iconOnly is true', () => {
    const icon = <svg data-testid="test-icon" />
    render(<NavLink id="dashboard" label="Dashboard" icon={icon} iconOnly />)
    
    expect(screen.getByTestId('test-icon')).toBeInTheDocument()
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument()
  })
  
  it('includes a title when in iconOnly mode', () => {
    const icon = <svg data-testid="test-icon" />
    render(<NavLink id="dashboard" label="Dashboard" icon={icon} iconOnly />)
    
    const navLink = screen.getByTestId('nav-link-dashboard')
    expect(navLink).toHaveAttribute('title', 'Dashboard')
  })
  
  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn()
    render(<NavLink id="dashboard" label="Dashboard" onClick={handleClick} />)
    
    fireEvent.click(screen.getByTestId('nav-link-dashboard'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
  
  it('applies custom className when provided', () => {
    render(<NavLink id="dashboard" label="Dashboard" className="custom-class" />)
    
    const navLink = screen.getByTestId('nav-link-dashboard')
    expect(navLink).toHaveClass('custom-class')
  })
}) 