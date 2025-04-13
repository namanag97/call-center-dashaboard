import React, { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export interface NavLinkProps {
  /**
   * Unique identifier for the nav item
   */
  id: string
  /**
   * Whether the link is currently active
   */
  isActive?: boolean
  /**
   * Optional icon to display before the label
   */
  icon?: ReactNode
  /**
   * The text label for the navigation item
   */
  label: string
  /**
   * Whether to show only the icon (for collapsed state)
   */
  iconOnly?: boolean
  /**
   * Function to call when the link is clicked
   */
  onClick?: () => void
  /**
   * Additional CSS classes to apply
   */
  className?: string
  /**
   * Optional title attribute for tooltip when in icon-only mode
   */
  title?: string
}

/**
 * NavLink component for navigation items with active/inactive states
 */
const NavLink: React.FC<NavLinkProps> = ({
  id,
  isActive = false,
  icon,
  label,
  iconOnly = false,
  onClick,
  className = '',
  title,
}) => {
  const baseClasses = 'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500'
  
  const activeClasses = 'bg-primary-50 text-primary-700'
  const inactiveClasses = 'text-neutral-700 hover:bg-neutral-100'
  
  return (
    <button
      id={id}
      type="button"
      className={twMerge(
        baseClasses,
        isActive ? activeClasses : inactiveClasses,
        iconOnly ? 'justify-center' : 'justify-start',
        className
      )}
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      data-testid={`nav-link-${id}`}
      title={iconOnly ? title || label : title}
    >
      {icon && (
        <span className={twMerge('flex-shrink-0', iconOnly ? '' : 'mr-3')}>
          {icon}
        </span>
      )}
      {!iconOnly && <span>{label}</span>}
    </button>
  )
}

export default NavLink 