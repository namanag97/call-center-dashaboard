import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { twMerge } from 'tailwind-merge'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnEsc?: boolean
  closeOnOverlayClick?: boolean
  initialFocusRef?: React.RefObject<HTMLElement>
  className?: string
  overlayClassName?: string
  contentClassName?: string
  headerClassName?: string
  bodyClassName?: string
  footerClassName?: string
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnEsc = true,
  closeOnOverlayClick = true,
  initialFocusRef,
  overlayClassName = '',
  contentClassName = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
}) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const prevFocusRef = useRef<HTMLElement | null>(null)

  // Size classes for the modal
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4'
  }

  // Handle ESC key press
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEsc) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, closeOnEsc, onClose])

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Store the current active element
      prevFocusRef.current = document.activeElement as HTMLElement | null

      // Set focus to the initial element or the modal itself
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus()
      } else if (modalRef.current) {
        modalRef.current.focus()
      }

      // Prevent body scroll
      document.body.style.overflow = 'hidden'
    } else {
      // Restore focus when modal closes
      if (prevFocusRef.current) {
        prevFocusRef.current.focus()
      }

      // Re-enable body scroll
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen, initialFocusRef])

  // Don't render anything if not open
  if (!isOpen) return null

  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose()
    }
  }

  const modalContent = (
    <div 
      className={twMerge(
        'fixed inset-0 z-modal flex items-center justify-center',
        overlayClassName
      )}
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop/overlay with improved animation */}
      <div className="absolute inset-0 bg-neutral-900 bg-opacity-50 transition-opacity duration-300 ease-in-out opacity-100" />
      
      {/* Modal content with improved animation */}
      <div
        ref={modalRef}
        className={twMerge(
          'relative z-10 w-full rounded-lg bg-white shadow-xl transform transition-all duration-300 ease-out scale-100 opacity-100',
          sizeClasses[size],
          contentClassName
        )}
        tabIndex={-1}
      >
        {/* Header with close button */}
        <div className={twMerge(
          'flex items-center justify-between px-6 py-4 border-b border-neutral-200',
          headerClassName
        )}>
          {title && (
            <h3 className="text-lg font-medium text-neutral-900">
              {title}
            </h3>
          )}
          {!title && <div />} {/* Empty div to maintain layout when no title */}
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md transition-colors duration-200"
            aria-label="Close"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Body */}
        <div className={twMerge(
          'px-6 py-4',
          bodyClassName
        )}>
          {children}
        </div>
        
        {/* Footer */}
        {footer && (
          <div className={twMerge(
            'px-6 py-4 border-t border-neutral-200 bg-neutral-50 rounded-b-lg',
            footerClassName
          )}>
            {footer}
          </div>
        )}
      </div>
    </div>
  )

  // Use Portal to render at body level
  return createPortal(
    modalContent,
    document.body
  )
}

export default Modal 