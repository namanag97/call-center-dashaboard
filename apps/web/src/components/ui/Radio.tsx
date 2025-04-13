import React, { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string
  description?: string
  error?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary'
  radioClassName?: string
  labelClassName?: string
  errorClassName?: string
  descriptionClassName?: string
  wrapperClassName?: string
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(({
  label,
  description,
  error,
  size = 'md',
  variant = 'primary',
  disabled = false,
  required = false,
  radioClassName = '',
  labelClassName = '',
  errorClassName = '',
  descriptionClassName = '',
  wrapperClassName = '',
  className = '',
  id,
  ...props
}, ref) => {
  // Generate a unique id if not provided
  const radioId = id || `radio-${Math.random().toString(36).substring(2, 9)}`
  
  const baseRadioClasses = 'form-radio border focus:ring-offset-1 focus:outline-none focus:ring-2'
  
  const variantClasses = {
    primary: 'text-primary-600 focus:border-primary-500 focus:ring-primary-500',
    secondary: 'text-secondary-500 focus:border-secondary-500 focus:ring-secondary-500',
  }
  
  const sizeClasses = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }
  
  const labelSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }
  
  const disabledClasses = disabled ? 'opacity-60 cursor-not-allowed' : ''
  
  return (
    <div className={twMerge('flex', wrapperClassName)}>
      <div className="flex h-5 items-center">
        <input
          type="radio"
          id={radioId}
          disabled={disabled}
          required={required}
          ref={ref}
          aria-describedby={description ? `${radioId}-description` : undefined}
          aria-invalid={error ? 'true' : 'false'}
          className={twMerge(
            baseRadioClasses,
            variantClasses[variant],
            sizeClasses[size],
            disabledClasses,
            error && 'border-error-500',
            radioClassName
          )}
          {...props}
        />
      </div>
      {(label || description || error) && (
        <div className="ml-2">
          {label && (
            <label 
              htmlFor={radioId}
              className={twMerge(
                'font-medium text-neutral-900',
                labelSizeClasses[size],
                disabled && 'opacity-60 cursor-not-allowed',
                labelClassName
              )}
            >
              {label}
              {required && <span className="ml-1 text-error-500">*</span>}
            </label>
          )}
          {description && (
            <p 
              id={`${radioId}-description`}
              className={twMerge(
                'text-sm text-neutral-500',
                descriptionClassName
              )}
            >
              {description}
            </p>
          )}
          {error && (
            <p 
              className={twMerge(
                'mt-1 text-sm text-error-500',
                errorClassName
              )}
            >
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  )
})

Radio.displayName = 'Radio'

export default Radio 