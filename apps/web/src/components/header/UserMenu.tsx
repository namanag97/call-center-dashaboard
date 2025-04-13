import React, { useState, useRef, useEffect } from 'react'
import { User, UserRole } from '@conista/shared-types'

// For TypeScript compatibility, define a local interface that includes avatarUrl
interface UserWithAvatar {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface UserMenuProps {
  /**
   * The currently logged in user
   */
  user: User
  /**
   * Function to call when the user clicks logout
   * Returns a promise to handle loading state
   */
  onLogout?: () => Promise<void>
  /**
   * Function to call when the user clicks settings
   */
  onSettings?: () => void
  /**
   * Function to call when the user clicks profile
   */
  onProfile?: () => void
  /**
   * Whether the logout operation is in progress
   */
  isLoggingOut?: boolean
}

/**
 * UserMenu component displays the current user with a dropdown menu
 */
const UserMenu: React.FC<UserMenuProps> = ({
  user,
  onLogout,
  onSettings,
  onProfile,
  isLoggingOut = false
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  
  // Cast user to UserWithAvatar to avoid TypeScript errors
  const userWithAvatar = user as UserWithAvatar

  // Get user initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  // Handle clicking outside to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        triggerRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  const handleLogout = async () => {
    if (onLogout && !isLoggingOut) {
      try {
        await onLogout()
      } catch (error) {
        console.error('Logout failed:', error)
      } finally {
        setIsOpen(false)
      }
    }
  }

  return (
    <div className="relative" data-testid="user-menu">
      <button
        ref={triggerRef}
        type="button"
        className="flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        onClick={handleToggle}
        aria-expanded={isOpen}
        data-testid="user-menu-trigger"
      >
        <span className="sr-only">Open user menu</span>
        {userWithAvatar.avatarUrl ? (
          <img
            className="h-8 w-8 rounded-full"
            src={userWithAvatar.avatarUrl}
            alt={`${userWithAvatar.name}'s profile`}
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-medium text-primary-700">
            {getInitials(userWithAvatar.name)}
          </div>
        )}
      </button>

      {isOpen && (
        <div 
          ref={menuRef}
          className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu-button"
          data-testid="user-menu-dropdown"
        >
          {/* User info */}
          <div className="border-b border-neutral-200 px-4 py-2">
            <p className="text-sm font-medium text-neutral-900">{userWithAvatar.name}</p>
            <p className="truncate text-xs text-neutral-500">{userWithAvatar.email}</p>
            <p className="text-xs text-neutral-500 mt-1 capitalize">{userWithAvatar.role}</p>
          </div>

          {/* Menu items */}
          {onProfile && (
            <button
              className="block w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100"
              onClick={() => {
                onProfile()
                setIsOpen(false)
              }}
              role="menuitem"
              data-testid="user-menu-profile"
            >
              Profile
            </button>
          )}

          {onSettings && (
            <button
              className="block w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100"
              onClick={() => {
                onSettings()
                setIsOpen(false)
              }}
              role="menuitem"
              data-testid="user-menu-settings"
            >
              Settings
            </button>
          )}

          {onLogout && (
            <button
              className="block w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100"
              onClick={handleLogout}
              disabled={isLoggingOut}
              role="menuitem"
              data-testid="user-menu-logout"
            >
              {isLoggingOut ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-neutral-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging out...
                </div>
              ) : (
                'Sign out'
              )}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default UserMenu 