import React from 'react'
import { twMerge } from 'tailwind-merge'
import { IconProps } from './types'

const Icon: React.FC<IconProps> = ({
  variant = 'primary',
  size = 'md',
  color,
  className = '',
  children,
  ...props
}) => {
  const baseClasses = 'inline-block transition-colors'
  
  const variantClasses = {
    primary: 'text-neutral-900',
    secondary: 'text-neutral-600',
    outline: 'text-neutral-500',
    ghost: 'text-neutral-400',
    link: 'text-primary-600'
  }
  
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  }
  
  const colorClass = color ? `text-${color}` : ''

  return (
    <span
      className={twMerge(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        colorClass,
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export default Icon 