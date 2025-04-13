import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Sidebar from './Sidebar'
import NavLink from './NavLink'

describe('Sidebar Component', () => {
  const mockNavGroups = [
    {
      title: 'Main',
      items: [
        <NavLink key="dashboard" id="dashboard" label="Dashboard" isActive />,
        <NavLink key="calls" id="calls" label="Calls" />
      ]
    },
    {
      title: 'Settings',
      items: [
        <NavLink key="profile" id="profile" label="Profile" />,
        <NavLink key="preferences" id="preferences" label="Preferences" />
      ]
    }
  ]

  it('renders navigation groups correctly', () => {
    render(<Sidebar navGroups={mockNavGroups} />)
    
    expect(screen.getByTestId('sidebar')).toBeInTheDocument()
    expect(screen.getByText('Main')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.getByTestId('nav-link-dashboard')).toBeInTheDocument()
    expect(screen.getByTestId('nav-link-calls')).toBeInTheDocument()
    expect(screen.getByTestId('nav-link-profile')).toBeInTheDocument()
    expect(screen.getByTestId('nav-link-preferences')).toBeInTheDocument()
  })
  
  it('hides group titles when collapsed', () => {
    render(<Sidebar navGroups={mockNavGroups} isCollapsed />)
    
    expect(screen.queryByText('Main')).not.toBeInTheDocument()
    expect(screen.queryByText('Settings')).not.toBeInTheDocument()
    expect(screen.getByTestId('nav-link-dashboard')).toBeInTheDocument()
  })
  
  it('renders logo when provided', () => {
    const logo = <div data-testid="test-logo">Logo</div>
    render(<Sidebar navGroups={mockNavGroups} logo={logo} />)
    
    expect(screen.getByTestId('test-logo')).toBeInTheDocument()
  })
  
  it('renders footer when provided', () => {
    const footer = <div data-testid="test-footer">Footer</div>
    render(<Sidebar navGroups={mockNavGroups} footer={footer} />)
    
    expect(screen.getByTestId('test-footer')).toBeInTheDocument()
  })
  
  it('shows collapse button when not collapsed and onToggleCollapse is provided', () => {
    const handleToggle = vi.fn()
    render(
      <Sidebar 
        navGroups={mockNavGroups} 
        isCollapsed={false} 
        onToggleCollapse={handleToggle}
        logo={<div>Logo</div>}
      />
    )
    
    expect(screen.getByTestId('collapse-sidebar-button')).toBeInTheDocument()
    expect(screen.queryByTestId('expand-sidebar-button')).not.toBeInTheDocument()
  })
  
  it('shows expand button when collapsed and onToggleCollapse is provided', () => {
    const handleToggle = vi.fn()
    render(
      <Sidebar 
        navGroups={mockNavGroups} 
        isCollapsed={true} 
        onToggleCollapse={handleToggle}
        logo={<div>Logo</div>}
      />
    )
    
    expect(screen.queryByTestId('collapse-sidebar-button')).not.toBeInTheDocument()
    expect(screen.getByTestId('expand-sidebar-button')).toBeInTheDocument()
  })
  
  it('calls onToggleCollapse when collapse button is clicked', () => {
    const handleToggle = vi.fn()
    render(
      <Sidebar 
        navGroups={mockNavGroups} 
        isCollapsed={false} 
        onToggleCollapse={handleToggle}
        logo={<div>Logo</div>}
      />
    )
    
    fireEvent.click(screen.getByTestId('collapse-sidebar-button'))
    expect(handleToggle).toHaveBeenCalledTimes(1)
  })
  
  it('calls onToggleCollapse when expand button is clicked', () => {
    const handleToggle = vi.fn()
    render(
      <Sidebar 
        navGroups={mockNavGroups} 
        isCollapsed={true} 
        onToggleCollapse={handleToggle}
        logo={<div>Logo</div>}
      />
    )
    
    fireEvent.click(screen.getByTestId('expand-sidebar-button'))
    expect(handleToggle).toHaveBeenCalledTimes(1)
  })
  
  it('applies custom className when provided', () => {
    render(<Sidebar navGroups={mockNavGroups} className="custom-class" />)
    
    const sidebar = screen.getByTestId('sidebar')
    expect(sidebar).toHaveClass('custom-class')
  })
}) 