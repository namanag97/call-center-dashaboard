import React from 'react'
import { twMerge } from 'tailwind-merge'
import { InputProps } from './types'

const Input: React.FC<InputProps> = ({
  variant = 'primary',
  size = 'md',
  label,
  error,
  helperText,
  status = 'default',
  leftElement,
  rightElement,
  isRequired,
  disabled,
  className = '',
  ...props
}) => {
  // Enhanced base classes with better transitions and focus handling
  const baseClasses = 'w-full rounded-md border transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1 shadow-sm hover:shadow'
  
  const variantClasses = {
    primary: 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500',
    secondary: 'border-neutral-300 focus:border-secondary-500 focus:ring-secondary-500',
    outline: 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500 bg-transparent',
    ghost: 'border-transparent bg-neutral-100 focus:border-primary-500 focus:ring-primary-500',
    link: 'border-transparent focus:border-transparent focus:ring-transparent underline text-primary-600 p-0 hover:text-primary-700'
  }
  
  const sizeClasses = {
    xs: 'text-xs py-1 px-2 h-7',
    sm: 'text-sm py-1.5 px-3 h-8',
    md: 'text-base py-2 px-4 h-10',
    lg: 'text-lg py-2 px-4 h-12',
    xl: 'text-xl py-3 px-5 h-14'
  }
  
  const statusClasses = {
    default: '',
    success: 'border-success-500 focus:border-success-500 focus:ring-success-500',
    error: 'border-error-500 focus:border-error-500 focus:ring-error-500',
    warning: 'border-warning-500 focus:border-warning-500 focus:ring-warning-500',
    info: 'border-info-500 focus:border-info-500 focus:ring-info-500',
  }
  
  const inputClasses = twMerge(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    status !== 'default' && statusClasses[status],
    disabled ? 'bg-neutral-100 cursor-not-allowed opacity-60' : 'hover:border-neutral-400',
    (leftElement || rightElement) && 'pl-10',
    rightElement && 'pr-10',
    className
  )

  return (
    <div className="w-full">
      {label && (
        <label className="block mb-1 text-sm font-medium text-neutral-800 transition-colors duration-200">
          {label} {isRequired && <span className="text-error-500">*</span>}
        </label>
      )}
      <div className="relative">
        {leftElement && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500 transition-colors duration-200">
            {leftElement}
          </div>
        )}
        <input
          className={inputClasses}
          disabled={disabled}
          {...props}
          aria-invalid={status === 'error' ? 'true' : 'false'}
          aria-required={isRequired}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 transition-colors duration-200">
            {rightElement}
          </div>
        )}
      </div>
      {(error || helperText) && (
        <div className={`mt-1 text-sm ${error ? 'text-error-500' : 'text-neutral-500'} transition-all duration-200 ease-in-out`}>
          {error || helperText}
        </div>
      )}
    </div>
  )
}

export default Input 