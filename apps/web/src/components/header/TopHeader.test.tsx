import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import TopHeader from './TopHeader'

describe('TopHeader Component', () => {
  const mockUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
  }

  it('renders correctly with minimum props', () => {
    render(<TopHeader />)
    
    expect(screen.getByTestId('top-header')).toBeInTheDocument()
    expect(screen.getByTestId('help-button')).toBeInTheDocument()
  })
  
  it('renders logo when provided', () => {
    const logo = <div data-testid="test-logo">Logo</div>
    
    render(<TopHeader logo={logo} />)
    
    expect(screen.getByTestId('top-header-logo')).toBeInTheDocument()
    expect(screen.getByTestId('test-logo')).toBeInTheDocument()
  })
  
  it('renders middle content when provided', () => {
    const middleContent = <div data-testid="test-middle-content">Middle Content</div>
    
    render(<TopHeader middleContent={middleContent} />)
    
    expect(screen.getByTestId('top-header-middle')).toBeInTheDocument()
    expect(screen.getByTestId('test-middle-content')).toBeInTheDocument()
  })
  
  it('renders actions when provided', () => {
    const actions = <button data-testid="test-action">Action</button>
    
    render(<TopHeader actions={actions} />)
    
    expect(screen.getByTestId('top-header-actions')).toBeInTheDocument()
    expect(screen.getByTestId('test-action')).toBeInTheDocument()
  })
  
  it('renders user menu when user is provided', () => {
    render(<TopHeader user={mockUser} />)
    
    expect(screen.getByTestId('top-header-user-menu')).toBeInTheDocument()
    expect(screen.getByTestId('user-menu')).toBeInTheDocument()
  })
  
  it('renders sidebar toggle button when onToggleSidebar is provided', () => {
    const handleToggleSidebar = vi.fn()
    
    render(<TopHeader onToggleSidebar={handleToggleSidebar} />)
    
    const toggleButton = screen.getByTestId('toggle-sidebar-button')
    expect(toggleButton).toBeInTheDocument()
    
    fireEvent.click(toggleButton)
    expect(handleToggleSidebar).toHaveBeenCalledTimes(1)
  })
  
  it('passes user action handlers to UserMenu', () => {
    const handleLogout = vi.fn()
    const handleProfile = vi.fn()
    const handleSettings = vi.fn()
    
    render(
      <TopHeader 
        user={mockUser} 
        onLogout={handleLogout}
        onProfile={handleProfile}
        onSettings={handleSettings}
      />
    )
    
    // Open user menu
    fireEvent.click(screen.getByTestId('user-menu-trigger'))
    
    // Click logout
    fireEvent.click(screen.getByTestId('user-menu-logout'))
    expect(handleLogout).toHaveBeenCalledTimes(1)
    
    // Open user menu again
    fireEvent.click(screen.getByTestId('user-menu-trigger'))
    
    // Click profile
    fireEvent.click(screen.getByTestId('user-menu-profile'))
    expect(handleProfile).toHaveBeenCalledTimes(1)
    
    // Open user menu again
    fireEvent.click(screen.getByTestId('user-menu-trigger'))
    
    // Click settings
    fireEvent.click(screen.getByTestId('user-menu-settings'))
    expect(handleSettings).toHaveBeenCalledTimes(1)
  })
  
  it('applies custom className when provided', () => {
    render(<TopHeader className="custom-class" />)
    
    expect(screen.getByTestId('top-header')).toHaveClass('custom-class')
  })
}) 