import React from 'react'
import { twMerge } from 'tailwind-merge'
import { LabelProps } from './types'

const Label: React.FC<LabelProps> = ({
  variant = 'primary',
  size = 'md',
  isRequired,
  className = '',
  children,
  ...props
}) => {
  const baseClasses = 'block font-medium transition-colors'
  
  const variantClasses = {
    primary: 'text-neutral-800',
    secondary: 'text-neutral-700',
    outline: 'text-neutral-600',
    ghost: 'text-neutral-600',
    link: 'text-primary-600 hover:text-primary-700'
  }
  
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }

  return (
    <label
      className={twMerge(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
      {isRequired && <span className="ml-1 text-error-500">*</span>}
    </label>
  )
}

export default Label 