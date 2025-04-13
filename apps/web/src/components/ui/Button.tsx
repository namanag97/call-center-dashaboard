import React from 'react'
import { twMerge } from 'tailwind-merge'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  children: React.ReactNode
  className?: string
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  isLoading = false, 
  children, 
  className = '',
  disabled,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98]'
  
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-secondary-500 text-white hover:bg-secondary-600 focus:ring-secondary-400',
    outline: 'border border-primary-600 text-primary-600 bg-transparent hover:bg-primary-50 focus:ring-primary-500',
    ghost: 'text-primary-600 bg-transparent hover:bg-primary-50 focus:ring-primary-500'
  }
  
  const sizeClasses = {
    sm: 'text-sm py-1.5 px-3',
    md: 'text-base py-2 px-4',
    lg: 'text-lg py-2.5 px-5'
  }
  
  const isDisabled = disabled || isLoading
  
  return (
    <button
      type="button"
      disabled={isDisabled}
      className={twMerge(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        isDisabled ? 'opacity-70 cursor-not-allowed' : 'shadow-sm hover:shadow transform',
        className
      )}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {children}
        </>
      ) : (
        children
      )}
    </button>
  )
}

export default Button
