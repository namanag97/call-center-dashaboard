import React, { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import { Text } from '../ui'

export interface PageHeaderProps {
  /**
   * The main title of the page
   */
  title: string
  /**
   * Optional subtitle or description
   */
  subtitle?: string
  /**
   * Optional actions to display on the right side (e.g., buttons)
   */
  actions?: ReactNode
  /**
   * Whether to add a bottom border
   */
  hasBorder?: boolean
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * PageHeader component provides a consistent header for all pages
 */
const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actions,
  hasBorder = true,
  className = '',
}) => {
  return (
    <div
      className={twMerge(
        'px-4 py-4 sm:px-6',
        hasBorder && 'border-b border-neutral-200',
        className
      )}
      data-testid="page-header"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <Text
            as="h1"
            size="xl"
            weight="bold"
            className="text-neutral-900"
            data-testid="page-header-title"
          >
            {title}
          </Text>
          
          {subtitle && (
            <Text
              as="p"
              size="sm"
              className="mt-1 text-neutral-600"
              data-testid="page-header-subtitle"
            >
              {subtitle}
            </Text>
          )}
        </div>
        
        {actions && (
          <div className="mt-4 flex sm:mt-0 sm:ml-4" data-testid="page-header-actions">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}

export default PageHeader 