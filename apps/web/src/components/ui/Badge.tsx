import React from 'react'
import { twMerge } from 'tailwind-merge'

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral'
export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  size?: BadgeSize
  rounded?: boolean
  outlined?: boolean
  children: React.ReactNode
  className?: string
}

const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  size = 'md',
  rounded = false,
  outlined = false,
  children,
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center font-medium'
  
  const sizeClasses = {
    xs: 'text-xs px-1.5 py-0.5',
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-sm px-3 py-1'
  }
  
  const shapeClasses = rounded ? 'rounded-full' : 'rounded-md'
  
  const variantClasses = {
    primary: outlined
      ? 'bg-transparent text-primary-600 border border-primary-600'
      : 'bg-primary-100 text-primary-800',
    secondary: outlined
      ? 'bg-transparent text-secondary-600 border border-secondary-600'
      : 'bg-secondary-100 text-secondary-800',
    success: outlined
      ? 'bg-transparent text-success-600 border border-success-600'
      : 'bg-success-100 text-success-800',
    warning: outlined
      ? 'bg-transparent text-warning-600 border border-warning-600'
      : 'bg-warning-100 text-warning-800',
    error: outlined
      ? 'bg-transparent text-error-600 border border-error-600'
      : 'bg-error-100 text-error-800',
    info: outlined
      ? 'bg-transparent text-info-600 border border-info-600'
      : 'bg-info-100 text-info-800',
    neutral: outlined
      ? 'bg-transparent text-neutral-600 border border-neutral-600'
      : 'bg-neutral-100 text-neutral-800'
  }

  return (
    <span
      className={twMerge(
        baseClasses,
        sizeClasses[size],
        shapeClasses,
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export default Badge 