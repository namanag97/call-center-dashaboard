import React, { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export interface NavItemGroup {
  /**
   * Title of the group (optional)
   */
  title?: string
  /**
   * Navigation items in the group
   */
  items: ReactNode[]
}

export interface SidebarProps {
  /**
   * Array of navigation item groups to display
   */
  navGroups: NavItemGroup[]
  /**
   * Whether the sidebar is collapsed
   */
  isCollapsed?: boolean
  /**
   * Logo or brand component to display at the top
   */
  logo?: ReactNode
  /**
   * Component to display at the bottom (e.g., logout button)
   */
  footer?: ReactNode
  /**
   * Function to toggle the sidebar between collapsed and expanded
   */
  onToggleCollapse?: () => void
  /**
   * Additional CSS classes to apply
   */
  className?: string
}

/**
 * Sidebar component that contains navigation items and can be collapsed/expanded
 */
const Sidebar: React.FC<SidebarProps> = ({
  navGroups,
  isCollapsed = false,
  logo,
  footer,
  onToggleCollapse,
  className = '',
}) => {
  return (
    <div
      className={twMerge(
        'flex h-full flex-col bg-white',
        className
      )}
      data-testid="sidebar"
    >
      {/* Logo area */}
      {logo && (
        <div className={twMerge(
          'flex items-center p-4 border-b border-neutral-200',
          isCollapsed ? 'justify-center' : 'justify-between'
        )}>
          <div className="flex-shrink-0">
            {logo}
          </div>
          
          {!isCollapsed && onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="rounded-md p-1 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
              aria-label="Collapse sidebar"
              data-testid="collapse-sidebar-button"
            >
              {/* Collapse icon (chevron-left) */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          
          {isCollapsed && onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="rounded-md p-1 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
              aria-label="Expand sidebar"
              data-testid="expand-sidebar-button"
            >
              {/* Expand icon (chevron-right) */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      )}
      
      {/* Navigation groups */}
      <div className="flex-1 overflow-y-auto py-4">
        {navGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-6 px-3">
            {group.title && !isCollapsed && (
              <h3 className="mb-2 px-3 text-xs font-semibold uppercase text-neutral-500">
                {group.title}
              </h3>
            )}
            
            <div className="space-y-1">
              {group.items}
            </div>
          </div>
        ))}
      </div>
      
      {/* Footer */}
      {footer && (
        <div className={twMerge(
          'border-t border-neutral-200 p-4',
          isCollapsed ? 'flex justify-center' : ''
        )}>
          {footer}
        </div>
      )}
    </div>
  )
}

export default Sidebar 