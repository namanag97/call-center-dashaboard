import React from 'react'
import { twMerge } from 'tailwind-merge'
import { SpinnerProps } from './types'

const Spinner: React.FC<SpinnerProps> = ({
  variant = 'primary',
  size = 'md',
  thickness = '2px',
  speed = '0.75s',
  color,
  label,
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-block rounded-full border-solid border-r-transparent animate-spin'
  
  const variantClasses = {
    primary: 'border-primary-600',
    secondary: 'border-secondary-500',
    outline: 'border-neutral-600',
    ghost: 'border-neutral-400',
    link: 'border-primary-500'
  }
  
  const sizeClasses = {
    xs: 'w-3 h-3 border',
    sm: 'w-4 h-4 border',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-2',
    xl: 'w-12 h-12 border-3'
  }
  
  const colorClass = color ? `border-${color}` : ''
  
  const animationStyle = {
    animationDuration: speed,
    borderWidth: thickness
  }

  return (
    <div className="inline-flex flex-col items-center" {...props}>
      <div 
        className={twMerge(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          colorClass,
          className
        )}
        style={animationStyle}
        role="status"
        aria-label={label || "Loading..."}
      />
      {label && (
        <div className="mt-2 text-sm text-neutral-600">{label}</div>
      )}
    </div>
  )
}

export default Spinner 