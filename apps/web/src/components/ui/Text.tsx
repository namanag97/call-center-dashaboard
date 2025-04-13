import React from 'react'
import { twMerge } from 'tailwind-merge'
import { TextProps } from './types'

const Text: React.FC<TextProps> = ({
  variant = 'primary',
  size = 'md',
  as: Component = 'p',
  weight = 'normal',
  truncate = false,
  color,
  className = '',
  children,
  ...props
}) => {
  const baseClasses = 'transition-colors'
  
  const variantClasses = {
    primary: 'text-neutral-900',
    secondary: 'text-neutral-700',
    outline: 'text-neutral-600',
    ghost: 'text-neutral-500',
    link: 'text-primary-600 hover:text-primary-700 underline cursor-pointer'
  }
  
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }
  
  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  }
  
  const truncateClasses = truncate && 'truncate'
  
  const colorClass = color ? `text-${color}` : ''

  return (
    <Component
      className={twMerge(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        weightClasses[weight],
        truncateClasses,
        colorClass,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

export default Text 