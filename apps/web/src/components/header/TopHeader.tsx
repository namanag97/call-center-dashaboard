import React, { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import UserMenu, { User } from './UserMenu'
import { Button } from '../ui'

export interface TopHeaderProps {
  /**
   * The current logged in user
   */
  user?: User
  /**
   * Title or logo to display on the left side
   */
  logo?: ReactNode
  /**
   * Optional additional content to display in the center
   */
  middleContent?: ReactNode
  /**
   * Optional additional actions to display on the right (before the user menu)
   */
  actions?: ReactNode
  /**
   * Function to call when user clicks logout
   */
  onLogout?: () => void
  /**
   * Function to call when user clicks profile
   */
  onProfile?: () => void
  /**
   * Function to call when user clicks settings
   */
  onSettings?: () => void
  /**
   * Whether to toggle the sidebar (for responsive layouts)
   */
  onToggleSidebar?: () => void
  /**
   * Whether the sidebar is currently visible (for responsive layouts)
   */
  isSidebarOpen?: boolean
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * TopHeader component provides the main application header with navigation and user controls
 */
const TopHeader: React.FC<TopHeaderProps> = ({
  user,
  logo,
  middleContent,
  actions,
  onLogout,
  onProfile,
  onSettings,
  onToggleSidebar,
  isSidebarOpen,
  className = '',
}) => {
  return (
    <header
      className={twMerge(
        'bg-white px-4 py-2 sm:px-6 border-b border-neutral-200 shadow-sm',
        className
      )}
      data-testid="top-header"
    >
      <div className="flex items-center justify-between">
        {/* Left section: Logo and mobile menu button */}
        <div className="flex items-center">
          {/* Mobile menu button */}
          {onToggleSidebar && (
            <button
              type="button"
              className="mr-3 -ml-1 inline-flex items-center justify-center rounded-md p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500 lg:hidden"
              onClick={onToggleSidebar}
              aria-expanded={isSidebarOpen}
              data-testid="toggle-sidebar-button"
            >
              <span className="sr-only">
                {isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          )}

          {/* Logo */}
          {logo && (
            <div className="flex-shrink-0" data-testid="top-header-logo">
              {logo}
            </div>
          )}
        </div>

        {/* Middle content */}
        {middleContent && (
          <div className="hidden md:flex flex-1 items-center justify-center px-4" data-testid="top-header-middle">
            {middleContent}
          </div>
        )}

        {/* Right section: Actions and User menu */}
        <div className="flex items-center space-x-4">
          {/* Optional actions */}
          {actions && (
            <div className="flex space-x-2" data-testid="top-header-actions">
              {actions}
            </div>
          )}

          {/* Help button */}
          <Button
            variant="ghost"
            size="sm"
            aria-label="Help"
            data-testid="help-button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </Button>

          {/* User menu */}
          {user && (
            <div data-testid="top-header-user-menu">
              <UserMenu
                user={user}
                onLogout={onLogout}
                onProfile={onProfile}
                onSettings={onSettings}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default TopHeader 