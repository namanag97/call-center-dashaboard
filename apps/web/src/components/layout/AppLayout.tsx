import React, { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export interface AppLayoutProps {
  /**
   * The sidebar content to display
   */
  sidebar?: ReactNode
  /**
   * The header content to display
   */
  header?: ReactNode
  /**
   * The main content to display
   */
  children: ReactNode
  /**
   * Whether the sidebar is collapsed
   */
  isSidebarCollapsed?: boolean
  /**
   * Additional CSS classes to apply to the component
   */
  className?: string
}

/**
 * AppLayout component serves as the main container for the application
 * providing slots for sidebar, header, and main content areas.
 */
const AppLayout: React.FC<AppLayoutProps> = ({
  sidebar,
  header,
  children,
  isSidebarCollapsed = false,
  className = '',
}) => {
  return (
    <div className={twMerge('flex min-h-screen bg-neutral-50', className)}>
      {/* Sidebar */}
      {sidebar && (
        <aside
          className={twMerge(
            'bg-white shadow-md transition-all duration-300 ease-in-out',
            isSidebarCollapsed ? 'w-16' : 'w-64'
          )}
          data-testid="app-sidebar"
        >
          {sidebar}
        </aside>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        {header && (
          <header className="bg-white shadow-sm z-10" data-testid="app-header">
            {header}
          </header>
        )}

        {/* Content */}
        <main className="flex-1 overflow-auto p-6" data-testid="app-content">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AppLayout 