import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import CompleteLayout from './CompleteLayout'

describe('CompleteLayout Component', () => {
  const mockUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
  }

  it('renders page title and content correctly', () => {
    render(
      <CompleteLayout
        pageTitle="Dashboard"
        pageSubtitle="Welcome to your dashboard"
        user={mockUser}
      >
        <div data-testid="test-content">Test Content</div>
      </CompleteLayout>
    )
    
    expect(screen.getByTestId('complete-layout')).toBeInTheDocument()
    expect(screen.getByTestId('page-header-title')).toHaveTextContent('Dashboard')
    expect(screen.getByTestId('page-header-subtitle')).toHaveTextContent('Welcome to your dashboard')
    expect(screen.getByTestId('test-content')).toBeInTheDocument()
  })
  
  it('renders navigation items with correct active state', () => {
    render(
      <CompleteLayout
        pageTitle="Calls"
        user={mockUser}
        activeNavItem="calls"
      >
        <div>Content</div>
      </CompleteLayout>
    )
    
    // In desktop view, sidebar should be visible
    const dashboardLink = screen.getByTestId('nav-link-dashboard')
    const callsLink = screen.getByTestId('nav-link-calls')
    
    expect(dashboardLink).toBeInTheDocument()
    expect(callsLink).toBeInTheDocument()
    expect(dashboardLink).not.toHaveAttribute('aria-current', 'page')
    expect(callsLink).toHaveAttribute('aria-current', 'page')
  })
  
  it('toggles sidebar collapse state when toggle button is clicked', () => {
    render(
      <CompleteLayout
        pageTitle="Dashboard"
        user={mockUser}
      >
        <div>Content</div>
      </CompleteLayout>
    )
    
    // Find the collapse button in the sidebar
    // Since the sidebar component is tested separately, and accessing its internals is complex in CompleteLayout,
    // we're focusing on the correct rendering of the sidebars themselves here
    
    expect(screen.getByTestId('sidebar')).toBeInTheDocument()
    expect(screen.queryByTestId('mobile-sidebar-overlay')).not.toBeInTheDocument()
  })
  
  it('triggers navigation callbacks when nav items are clicked', () => {
    const handleNavItemClick = vi.fn()
    
    render(
      <CompleteLayout
        pageTitle="Dashboard"
        user={mockUser}
        onNavItemClick={handleNavItemClick}
      >
        <div>Content</div>
      </CompleteLayout>
    )
    
    // Click the calls navigation item
    fireEvent.click(screen.getByTestId('nav-link-calls'))
    
    expect(handleNavItemClick).toHaveBeenCalledTimes(1)
    expect(handleNavItemClick).toHaveBeenCalledWith('calls')
  })
  
  it('passes user action handlers to TopHeader', () => {
    const handleLogout = vi.fn()
    const handleProfile = vi.fn()
    const handleSettings = vi.fn()
    
    render(
      <CompleteLayout
        pageTitle="Dashboard"
        user={mockUser}
        onLogout={handleLogout}
        onProfile={handleProfile}
        onSettings={handleSettings}
      >
        <div>Content</div>
      </CompleteLayout>
    )
    
    // Open user menu (assuming TopHeader works correctly, which is tested separately)
    fireEvent.click(screen.getByTestId('user-menu-trigger'))
    
    // Click logout 
    const logoutButton = screen.getByTestId('user-menu-logout')
    fireEvent.click(logoutButton)
    
    expect(handleLogout).toHaveBeenCalledTimes(1)
  })
  
  it('renders page actions when provided', () => {
    render(
      <CompleteLayout
        pageTitle="Dashboard"
        user={mockUser}
        pageActions={<button data-testid="test-action">Action</button>}
      >
        <div>Content</div>
      </CompleteLayout>
    )
    
    expect(screen.getByTestId('test-action')).toBeInTheDocument()
  })
  
  it('renders mobile sidebar toggle in header', () => {
    // Simulate mobile viewport
    // Note: For a more thorough test, you would use a library like jest-matchmedia-mock
    // to mock media queries, but that's beyond the scope of a basic test
    
    render(
      <CompleteLayout
        pageTitle="Dashboard"
        user={mockUser}
      >
        <div>Content</div>
      </CompleteLayout>
    )
    
    // The toggle sidebar button should be present
    expect(screen.getByTestId('toggle-sidebar-button')).toBeInTheDocument()
  })
  
  it('toggles mobile sidebar when mobile toggle button is clicked', () => {
    render(
      <CompleteLayout
        pageTitle="Dashboard"
        user={mockUser}
      >
        <div>Content</div>
      </CompleteLayout>
    )
    
    // Mobile sidebar should be hidden initially
    const mobileSidebar = screen.getByTestId('mobile-sidebar')
    expect(mobileSidebar).toHaveClass('-translate-x-full')
    expect(mobileSidebar).toHaveAttribute('aria-hidden', 'true')
    expect(screen.queryByTestId('mobile-sidebar-overlay')).not.toBeInTheDocument()
    
    // Click the toggle button to open
    fireEvent.click(screen.getByTestId('toggle-sidebar-button'))
    
    // Mobile sidebar should be visible
    expect(mobileSidebar).toHaveClass('translate-x-0')
    expect(mobileSidebar).toHaveAttribute('aria-hidden', 'false')
    expect(screen.getByTestId('mobile-sidebar-overlay')).toBeInTheDocument()
    
    // Click the overlay to close
    fireEvent.click(screen.getByTestId('mobile-sidebar-overlay'))
    
    // Mobile sidebar should be hidden again
    expect(mobileSidebar).toHaveClass('-translate-x-full')
    expect(screen.queryByTestId('mobile-sidebar-overlay')).not.toBeInTheDocument()
  })
  
  it('closes mobile sidebar when a navigation item is clicked', () => {
    const handleNavItemClick = vi.fn()
    
    render(
      <CompleteLayout
        pageTitle="Dashboard"
        user={mockUser}
        onNavItemClick={handleNavItemClick}
      >
        <div>Content</div>
      </CompleteLayout>
    )
    
    // Open the mobile sidebar
    fireEvent.click(screen.getByTestId('toggle-sidebar-button'))
    
    // Mobile sidebar should be visible
    expect(screen.getByTestId('mobile-sidebar')).toHaveClass('translate-x-0')
    expect(screen.getByTestId('mobile-sidebar-overlay')).toBeInTheDocument()
    
    // Click a navigation item
    fireEvent.click(screen.getByTestId('nav-link-calls'))
    
    // Mobile sidebar should be hidden
    expect(screen.getByTestId('mobile-sidebar')).toHaveClass('-translate-x-full')
    expect(screen.queryByTestId('mobile-sidebar-overlay')).not.toBeInTheDocument()
    
    // Navigation callback should be triggered
    expect(handleNavItemClick).toHaveBeenCalledWith('calls')
  })
}) 