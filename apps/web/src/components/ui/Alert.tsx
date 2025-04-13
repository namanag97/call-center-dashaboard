import React from 'react'
import { twMerge } from 'tailwind-merge'
import { AlertProps } from './types'
import Icon from './Icon'

const Alert: React.FC<AlertProps> = ({
  variant = 'primary',
  size = 'md',
  status = 'info',
  title,
  children,
  isClosable = false,
  onClose,
  icon,
  className = '',
  ...props
}) => {
  const baseClasses = 'flex items-start p-4 rounded-md border'
  
  const variantClasses = {
    primary: '',
    secondary: 'bg-opacity-80',
    outline: 'bg-transparent',
    ghost: 'border-transparent bg-opacity-50',
    link: 'border-transparent'
  }
  
  const sizeClasses = {
    xs: 'text-xs p-2',
    sm: 'text-sm p-3',
    md: 'text-base p-4',
    lg: 'text-lg p-5',
    xl: 'text-xl p-6'
  }
  
  const statusClasses = {
    success: 'bg-success-50 text-success-800 border-success-200',
    error: 'bg-error-50 text-error-800 border-error-200',
    warning: 'bg-warning-50 text-warning-800 border-warning-200',
    info: 'bg-info-50 text-info-800 border-info-200',
    default: 'bg-neutral-50 text-neutral-800 border-neutral-200'
  }
  
  const statusIcons = {
    success: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    error: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    warning: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    info: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z" clipRule="evenodd" />
      </svg>
    ),
    default: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z" clipRule="evenodd" />
      </svg>
    )
  }

  return (
    <div
      className={twMerge(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        statusClasses[status],
        className
      )}
      role="alert"
      {...props}
    >
      {(icon || statusIcons[status]) && (
        <div className="flex-shrink-0 mr-3 mt-0.5">
          {icon || statusIcons[status]}
        </div>
      )}
      
      <div className="flex-grow">
        {title && (
          <div className="font-medium mb-1">{title}</div>
        )}
        <div>{children}</div>
      </div>
      
      {isClosable && (
        <button
          type="button"
          className="flex-shrink-0 ml-3 -mt-1 -mr-1 p-1 rounded-md hover:bg-opacity-20 hover:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500"
          onClick={onClose}
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}

export default Alert 