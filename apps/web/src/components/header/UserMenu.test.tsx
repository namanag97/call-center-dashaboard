import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import UserMenu from './UserMenu'

describe('UserMenu Component', () => {
  const mockUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
  }

  it('renders user menu button with initials when no avatar URL is provided', () => {
    render(<UserMenu user={mockUser} />)
    
    expect(screen.getByTestId('user-menu')).toBeInTheDocument()
    expect(screen.getByTestId('user-menu-trigger')).toBeInTheDocument()
    expect(screen.getByText('JD')).toBeInTheDocument()
  })
  
  it('renders user menu button with avatar when URL is provided', () => {
    render(<UserMenu user={{ ...mockUser, avatarUrl: 'https://example.com/avatar.jpg' }} />)
    
    const avatar = screen.getByAltText(`${mockUser.name}'s profile`)
    expect(avatar).toBeInTheDocument()
    expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg')
  })
  
  it('toggles dropdown when clicking the button', () => {
    render(<UserMenu user={mockUser} />)
    
    // Dropdown should be closed initially
    expect(screen.queryByTestId('user-menu-dropdown')).not.toBeInTheDocument()
    
    // Click to open
    fireEvent.click(screen.getByTestId('user-menu-trigger'))
    expect(screen.getByTestId('user-menu-dropdown')).toBeInTheDocument()
    
    // User info should be displayed
    expect(screen.getByText(mockUser.name)).toBeInTheDocument()
    expect(screen.getByText(mockUser.email)).toBeInTheDocument()
    
    // Click again to close
    fireEvent.click(screen.getByTestId('user-menu-trigger'))
    expect(screen.queryByTestId('user-menu-dropdown')).not.toBeInTheDocument()
  })
  
  it('renders logout button when onLogout is provided', () => {
    const handleLogout = vi.fn()
    render(<UserMenu user={mockUser} onLogout={handleLogout} />)
    
    // Open dropdown
    fireEvent.click(screen.getByTestId('user-menu-trigger'))
    
    const logoutButton = screen.getByTestId('user-menu-logout')
    expect(logoutButton).toBeInTheDocument()
    expect(logoutButton).toHaveTextContent('Sign out')
    
    // Click logout button
    fireEvent.click(logoutButton)
    expect(handleLogout).toHaveBeenCalledTimes(1)
    
    // Dropdown should be closed after clicking
    expect(screen.queryByTestId('user-menu-dropdown')).not.toBeInTheDocument()
  })
  
  it('renders profile and settings buttons when handlers are provided', () => {
    const handleProfile = vi.fn()
    const handleSettings = vi.fn()
    
    render(
      <UserMenu 
        user={mockUser} 
        onProfile={handleProfile} 
        onSettings={handleSettings} 
      />
    )
    
    // Open dropdown
    fireEvent.click(screen.getByTestId('user-menu-trigger'))
    
    const profileButton = screen.getByTestId('user-menu-profile')
    const settingsButton = screen.getByTestId('user-menu-settings')
    
    expect(profileButton).toBeInTheDocument()
    expect(settingsButton).toBeInTheDocument()
    
    // Click profile button
    fireEvent.click(profileButton)
    expect(handleProfile).toHaveBeenCalledTimes(1)
    
    // Open dropdown again
    fireEvent.click(screen.getByTestId('user-menu-trigger'))
    
    // Click settings button
    fireEvent.click(screen.getByTestId('user-menu-settings'))
    expect(handleSettings).toHaveBeenCalledTimes(1)
  })
  
  it('closes the dropdown when clicking outside', () => {
    render(<UserMenu user={mockUser} />)
    
    // Open dropdown
    fireEvent.click(screen.getByTestId('user-menu-trigger'))
    expect(screen.getByTestId('user-menu-dropdown')).toBeInTheDocument()
    
    // Click outside
    fireEvent.mouseDown(document.body)
    
    // Dropdown should be closed
    expect(screen.queryByTestId('user-menu-dropdown')).not.toBeInTheDocument()
  })
}) 