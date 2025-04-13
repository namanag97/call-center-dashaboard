import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { twMerge } from 'tailwind-merge'

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

export interface TooltipProps {
  children: React.ReactNode
  content: React.ReactNode
  placement?: TooltipPlacement
  delay?: number
  offset?: number
  tooltipClassName?: string
  arrowClassName?: string
  disabled?: boolean
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  placement = 'top',
  delay = 300,
  offset = 8,
  tooltipClassName = '',
  arrowClassName = '',
  disabled = false,
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [arrowPosition, setArrowPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Calculate position based on trigger element and placement
  const updatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const tooltipRect = tooltipRef.current.getBoundingClientRect()
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    let top = 0
    let left = 0
    let arrowTop = 0
    let arrowLeft = 0

    switch (placement) {
      case 'top':
        top = triggerRect.top - tooltipRect.height - offset + scrollTop
        left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2 + scrollLeft
        arrowTop = tooltipRect.height
        arrowLeft = tooltipRect.width / 2 - 6 // 6px is half the arrow width
        break
      case 'bottom':
        top = triggerRect.bottom + offset + scrollTop
        left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2 + scrollLeft
        arrowTop = -6 // Negative arrow height
        arrowLeft = tooltipRect.width / 2 - 6
        break
      case 'left':
        top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2 + scrollTop
        left = triggerRect.left - tooltipRect.width - offset + scrollLeft
        arrowTop = tooltipRect.height / 2 - 6
        arrowLeft = tooltipRect.width
        break
      case 'right':
        top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2 + scrollTop
        left = triggerRect.right + offset + scrollLeft
        arrowTop = tooltipRect.height / 2 - 6
        arrowLeft = -6
        break
    }

    // Adjust if off-screen
    const rightEdge = left + tooltipRect.width
    const bottomEdge = top + tooltipRect.height
    const viewportWidth = window.innerWidth + scrollLeft
    const viewportHeight = window.innerHeight + scrollTop

    if (rightEdge > viewportWidth) {
      left = viewportWidth - tooltipRect.width - 10 // 10px margin
      // Adjust arrow if needed
      if (placement === 'top' || placement === 'bottom') {
        arrowLeft = triggerRect.left - left + triggerRect.width / 2 - 6
      }
    }

    if (bottomEdge > viewportHeight) {
      top = viewportHeight - tooltipRect.height - 10
      // Adjust arrow if needed
      if (placement === 'left' || placement === 'right') {
        arrowTop = triggerRect.top - top + triggerRect.height / 2 - 6
      }
    }

    if (left < scrollLeft) {
      left = scrollLeft + 10
      // Adjust arrow if needed
      if (placement === 'top' || placement === 'bottom') {
        arrowLeft = triggerRect.left - left + triggerRect.width / 2 - 6
      }
    }

    if (top < scrollTop) {
      top = scrollTop + 10
      // Adjust arrow if needed
      if (placement === 'left' || placement === 'right') {
        arrowTop = triggerRect.top - top + triggerRect.height / 2 - 6
      }
    }

    setPosition({ top, left })
    setArrowPosition({ top: arrowTop, left: arrowLeft })
  }

  // Update position when visible changes
  useEffect(() => {
    if (isVisible) {
      updatePosition()
      // Add resize listener
      window.addEventListener('resize', updatePosition)
      window.addEventListener('scroll', updatePosition)
    }

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition)
    }
  }, [isVisible])

  // Handle mouse events
  const handleMouseEnter = () => {
    if (disabled) return
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setIsVisible(false), 100) // Small delay for better UX
  }

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  // Base classes for tooltip and arrow
  const tooltipBaseClasses = `
    absolute z-tooltip py-1.5 px-3 text-sm text-white bg-neutral-800 rounded-md shadow-md
    max-w-xs transition-opacity duration-150
  `
  // Arrow classes based on placement
  const arrowBaseClasses = 'absolute w-3 h-3 rotate-45 bg-neutral-800'
  const arrowPositionClasses = {
    top: 'bottom-0 transform translate-y-1/2',
    bottom: 'top-0 transform -translate-y-1/2',
    left: 'right-0 transform translate-x-1/2',
    right: 'left-0 transform -translate-x-1/2'
  }

  // Display state classes
  const displayClasses = isVisible ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'

  return (
    <>
      <div 
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
        className="inline-block"
      >
        {children}
      </div>

      {isVisible && createPortal(
        <div
          ref={tooltipRef}
          role="tooltip"
          className={twMerge(
            tooltipBaseClasses,
            displayClasses,
            tooltipClassName
          )}
          style={{ 
            top: `${position.top}px`, 
            left: `${position.left}px` 
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div 
            className={twMerge(
              arrowBaseClasses,
              arrowPositionClasses[placement],
              arrowClassName
            )}
            style={{
              top: `${arrowPosition.top}px`,
              left: `${arrowPosition.left}px`
            }}
          />
          {content}
        </div>,
        document.body
      )}
    </>
  )
}

export default Tooltip 