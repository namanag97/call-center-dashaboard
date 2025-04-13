import React, { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export interface LoginPageLayoutProps {
  /**
   * The main content to display (usually a login form)
   */
  children: ReactNode
  /**
   * Optional logo or branding element to display
   */
  logo?: ReactNode
  /**
   * Optional title to display above the content
   */
  title?: string
  /**
   * Optional description to display below the title
   */
  description?: string
  /**
   * Additional CSS classes to apply to the component
   */
  className?: string
}

/**
 * LoginPageLayout component provides a centered layout for authentication screens
 * with optional branding elements.
 */
const LoginPageLayout: React.FC<LoginPageLayoutProps> = ({
  children,
  logo,
  title,
  description,
  className = '',
}) => {
  return (
    <div 
      className={twMerge('min-h-screen bg-neutral-50 flex items-center justify-center p-4', className)}
      data-testid="login-page-layout"
    >
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 sm:p-10" data-testid="login-container">
        <div className="flex flex-col items-center mb-6">
          {logo && <div className="mb-6" data-testid="login-logo">{logo}</div>}
          
          {title && (
            <h1 className="text-2xl font-bold text-neutral-900 text-center" data-testid="login-title">
              {title}
            </h1>
          )}
          
          {description && (
            <p className="mt-2 text-neutral-600 text-center" data-testid="login-description">
              {description}
            </p>
          )}
        </div>
        
        <div className="w-full" data-testid="login-content">
          {children}
        </div>
        
        <div className="mt-8 text-center text-sm text-neutral-500" data-testid="login-footer">
          <p>© {new Date().getFullYear()} Call Analysis Platform. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default LoginPageLayout 