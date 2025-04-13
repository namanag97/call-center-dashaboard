import React, { useState, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import AppLayout from './AppLayout'
import { Sidebar, NavLink } from '../navigation'
import { TopHeader, PageHeader, User } from '../header'
import { Text } from '../ui'

// Sample icon components
const DashboardIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className="h-5 w-5"
  >
    <rect width="7" height="7" x="3" y="3" rx="1" />
    <rect width="7" height="7" x="14" y="3" rx="1" />
    <rect width="7" height="7" x="14" y="14" rx="1" />
    <rect width="7" height="7" x="3" y="14" rx="1" />
  </svg>
)

const CallsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className="h-5 w-5"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

const UploadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className="h-5 w-5"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
)

const SettingsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className="h-5 w-5"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
)

export interface CompleteLayoutProps {
  /**
   * The page title to display in the PageHeader
   */
  pageTitle: string
  /**
   * Optional page description to display in the PageHeader
   */
  pageSubtitle?: string
  /**
   * Optional actions to display in the PageHeader
   */
  pageActions?: ReactNode
  /**
   * Currently active navigation item ID
   */
  activeNavItem?: string
  /**
   * The user data for the UserMenu
   */
  user: User
  /**
   * The main content to display
   */
  children: ReactNode
  /**
   * Function to call when a navigation item is clicked
   */
  onNavItemClick?: (id: string) => void
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
   * Additional CSS classes to apply
   */
  className?: string
}

/**
 * CompleteLayout component integrates all layout components into a cohesive system
 */
const CompleteLayout: React.FC<CompleteLayoutProps> = ({
  pageTitle,
  pageSubtitle,
  pageActions,
  activeNavItem = 'dashboard',
  user,
  children,
  onNavItemClick,
  onLogout,
  onProfile,
  onSettings,
  className = '',
}) => {
  // State for sidebar collapse in desktop view
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  // State for sidebar visibility in mobile view
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  // Toggle sidebar collapse state (desktop)
  const handleToggleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  // Toggle sidebar visibility (mobile)
  const handleToggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen)
  }

  // Handle navigation item click
  const handleNavItemClick = (id: string) => {
    if (onNavItemClick) {
      onNavItemClick(id)
    }

    // Close mobile sidebar when an item is clicked
    if (isMobileSidebarOpen) {
      setIsMobileSidebarOpen(false)
    }
  }

  // Logo component for header and sidebar
  const Logo = () => (
    <div className="flex items-center">
      <div className="h-8 w-8 bg-primary-600 rounded-md flex items-center justify-center">
        <Text as="span" className="text-white font-bold">
          C
        </Text>
      </div>
      {!isSidebarCollapsed && (
        <Text as="span" size="lg" weight="bold" className="ml-2">
          CallApp
        </Text>
      )}
    </div>
  )

  // Create navigation items
  const createNavItems = (collapsed: boolean) => [
    {
      title: 'Main',
      items: [
        <NavLink
          key="dashboard"
          id="dashboard"
          label="Dashboard"
          icon={<DashboardIcon />}
          isActive={activeNavItem === 'dashboard'}
          iconOnly={collapsed}
          onClick={() => handleNavItemClick('dashboard')}
        />,
        <NavLink
          key="calls"
          id="calls"
          label="Calls"
          icon={<CallsIcon />}
          isActive={activeNavItem === 'calls'}
          iconOnly={collapsed}
          onClick={() => handleNavItemClick('calls')}
        />,
        <NavLink
          key="upload"
          id="upload"
          label="Upload"
          icon={<UploadIcon />}
          isActive={activeNavItem === 'upload'}
          iconOnly={collapsed}
          onClick={() => handleNavItemClick('upload')}
        />,
      ],
    },
    {
      title: 'Settings',
      items: [
        <NavLink
          key="settings"
          id="settings"
          label="Settings"
          icon={<SettingsIcon />}
          isActive={activeNavItem === 'settings'}
          iconOnly={collapsed}
          onClick={() => handleNavItemClick('settings')}
        />,
      ],
    },
  ]

  // Create the sidebar component
  const sidebar = (
    <Sidebar
      navGroups={createNavItems(isSidebarCollapsed)}
      isCollapsed={isSidebarCollapsed}
      logo={<Logo />}
      onToggleCollapse={handleToggleSidebarCollapse}
      className="h-full"
    />
  )

  // Create the header component
  const header = (
    <div className="flex flex-col">
      <TopHeader
        logo={<Logo />}
        user={user}
        onLogout={onLogout}
        onProfile={onProfile}
        onSettings={onSettings}
        onToggleSidebar={handleToggleMobileSidebar}
        isSidebarOpen={isMobileSidebarOpen}
      />
      <PageHeader
        title={pageTitle}
        subtitle={pageSubtitle}
        actions={pageActions}
      />
    </div>
  )

  return (
    <>
      {/* Mobile sidebar overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-neutral-900 bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
          data-testid="mobile-sidebar-overlay"
          aria-hidden="true"
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={twMerge(
          'fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out lg:hidden',
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        data-testid="mobile-sidebar"
        aria-label="Mobile navigation"
        aria-modal="true"
        aria-hidden={!isMobileSidebarOpen}
        role="dialog"
      >
        {sidebar}
      </div>

      {/* Main layout */}
      <AppLayout
        sidebar={
          <div className="hidden lg:block h-full" aria-label="Main navigation">
            {sidebar}
          </div>
        }
        header={header}
        isSidebarCollapsed={isSidebarCollapsed}
        className={className}
        data-testid="complete-layout"
      >
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
      </AppLayout>
    </>
  )
}

export default CompleteLayout 