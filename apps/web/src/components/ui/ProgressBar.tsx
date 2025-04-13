import React, { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { cn } from '../../lib/utils'

export type ProgressBarVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
export type ProgressBarSize = 'xs' | 'sm' | 'md' | 'lg'

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Current progress value (0-100)
   */
  value?: number
  /**
   * Maximum value
   */
  max?: number
  /**
   * Minimum value
   */
  min?: number
  /**
   * Whether to show the progress value
   */
  showValue?: boolean
  /**
   * Label for the progress bar
   */
  label?: string
  /**
   * Color variant of the progress bar
   */
  variant?: ProgressBarVariant
  /**
   * Format function for the value display
   */
  valueFormatter?: (value: number, max: number) => string
  /**
   * Size of the progress bar
   */
  size?: ProgressBarSize
  /**
   * Whether the progress bar is in indeterminate state
   */
  indeterminate?: boolean
  /**
   * Additional class names for specific parts
   */
  classNames?: {
    root?: string
    label?: string
    track?: string
    progress?: string
    value?: string
  }
  /**
   * Class name for the bar element
   */
  barClassName?: string
  /**
   * Class name for the label element
   */
  labelClassName?: string
  /**
   * Class name for the value element
   */
  valueClassName?: string
}

const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      value = 0,
      max = 100,
      min = 0,
      showValue = false,
      label,
      variant = 'primary',
      valueFormatter = (value, max) => `${Math.round((value / max) * 100)}%`,
      size = 'md',
      indeterminate = false,
      className = '',
      barClassName = '',
      labelClassName = '',
      valueClassName = '',
      classNames,
      ...props
    },
    ref
  ) => {
    // Ensure value is within bounds
    const boundedValue = Math.max(min, Math.min(value, max))
    
    // Calculate width percentage
    const percentage = ((boundedValue - min) / (max - min)) * 100
    
    // Define size classes
    const sizeClasses = {
      xs: 'h-1',
      sm: 'h-2',
      md: 'h-3',
      lg: 'h-4'
    }
    
    // Define variant classes
    const variantClasses = {
      primary: 'bg-primary-600',
      secondary: 'bg-secondary-600',
      success: 'bg-success-600',
      warning: 'bg-warning-600',
      error: 'bg-error-600',
      info: 'bg-info-600'
    }

    // Indeterminate animation class
    const indeterminateClass = indeterminate ? 'animate-progress-indeterminate' : ''

    return (
      <div className={twMerge('w-full', className, classNames?.root)} ref={ref} {...props}>
        {(label || showValue) && (
          <div className="flex justify-between mb-1">
            {label && (
              <span className={twMerge('text-sm font-medium text-neutral-700', labelClassName, classNames?.label)}>
                {label}
              </span>
            )}
            {showValue && (
              <span className={twMerge('text-sm font-medium text-neutral-600', valueClassName, classNames?.value)}>
                {valueFormatter(boundedValue, max)}
              </span>
            )}
          </div>
        )}
        
        <div className={twMerge('w-full bg-neutral-200 rounded-full overflow-hidden', sizeClasses[size], classNames?.track)}>
          <div 
            className={twMerge(
              'h-full transition-all duration-300 ease-in-out',
              variantClasses[variant],
              indeterminateClass,
              barClassName,
              classNames?.progress
            )}
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={boundedValue}
            aria-valuemin={min}
            aria-valuemax={max}
          />
        </div>
      </div>
    )
  }
)

ProgressBar.displayName = 'ProgressBar'

export default ProgressBar 