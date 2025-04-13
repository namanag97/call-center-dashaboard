import React, { useEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { DropdownProps } from './types'
import Label from './Label'
import Text from './Text'

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  placeholder = 'Select an option',
  isMulti = false,
  isSearchable = false,
  isDisabled = false,
  isRequired = false,
  error,
  helperText,
  label,
  name,
  onChange,
  onBlur,
  maxHeight = '15rem',
  variant = 'primary',
  size = 'md',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [selectedValues, setSelectedValues] = useState<string[]>(
    isMulti 
      ? Array.isArray(value) ? value : value ? [value] : []
      : value ? [value as string] : []
  )
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    // Update internal state when external value changes
    setSelectedValues(
      isMulti 
        ? Array.isArray(value) ? value : value ? [value] : []
        : value ? [value as string] : []
    )
  }, [value, isMulti])
  
  useEffect(() => {
    // Handle clicking outside to close dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        if (onBlur) onBlur()
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onBlur])
  
  const handleSelect = (optionValue: string) => {
    let newValues: string[]
    
    if (isMulti) {
      newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter(v => v !== optionValue)
        : [...selectedValues, optionValue]
    } else {
      newValues = [optionValue]
      setIsOpen(false)
    }
    
    setSelectedValues(newValues)
    
    if (onChange) {
      onChange(isMulti ? newValues : newValues[0] || '')
    }
  }
  
  const filteredOptions = isSearchable && searchValue
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchValue.toLowerCase()))
    : options
  
  const displayValue = () => {
    if (selectedValues.length === 0) return placeholder
    
    if (isMulti) {
      return selectedValues.length === 1
        ? options.find(o => o.value === selectedValues[0])?.label || selectedValues[0]
        : `${selectedValues.length} options selected`
    }
    
    return options.find(o => o.value === selectedValues[0])?.label || selectedValues[0]
  }
  
  // Styling based on variants and states
  const baseClasses = 'relative w-full outline-none ring-0'
  
  const triggerVariantClasses = {
    primary: 'border border-neutral-300 bg-white text-neutral-800 hover:border-primary-500',
    secondary: 'border border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100',
    outline: 'border border-neutral-300 bg-transparent text-neutral-700 hover:border-primary-500',
    ghost: 'border border-transparent bg-transparent text-neutral-700 hover:bg-neutral-100',
    link: 'border-none bg-transparent text-primary-600 hover:text-primary-700 p-0'
  }
  
  const triggerSizeClasses = {
    xs: 'py-1 px-2 text-xs',
    sm: 'py-1.5 px-3 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-2.5 px-5 text-lg',
    xl: 'py-3 px-6 text-xl'
  }
  
  const optionSizeClasses = {
    xs: 'py-1 px-2 text-xs',
    sm: 'py-1.5 px-3 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-2.5 px-5 text-lg',
    xl: 'py-3 px-6 text-xl'
  }
  
  const errorClasses = error 
    ? 'border-error-500 focus:border-error-500 focus:ring-1 focus:ring-error-500' 
    : 'focus:border-primary-500 focus:ring-1 focus:ring-primary-500'
  
  const disabledClasses = isDisabled 
    ? 'opacity-60 cursor-not-allowed bg-neutral-100' 
    : 'cursor-pointer'

  return (
    <div className={twMerge(baseClasses, className)} ref={dropdownRef}>
      {label && (
        <Label 
          htmlFor={name} 
          className="mb-1"
          isRequired={isRequired}
          size={size}
        >
          {label}
        </Label>
      )}
      
      <div className="relative">
        <button
          type="button"
          className={twMerge(
            'flex w-full items-center justify-between rounded-md', 
            triggerVariantClasses[variant],
            triggerSizeClasses[size],
            errorClasses,
            disabledClasses,
            'transition-colors'
          )}
          onClick={() => !isDisabled && setIsOpen(!isOpen)}
          disabled={isDisabled}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          data-testid="dropdown-trigger"
        >
          <span className={`block truncate ${!selectedValues.length ? 'text-neutral-500' : ''}`}>
            {displayValue()}
          </span>
          <span className="pointer-events-none ml-2">
            <svg 
              className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </button>
        
        {isOpen && (
          <div
            className="absolute z-10 mt-1 w-full overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
            style={{ maxHeight }}
          >
            {isSearchable && (
              <div className="sticky top-0 z-10 p-2 bg-white border-b border-neutral-200">
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Search options..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  data-testid="dropdown-search"
                />
              </div>
            )}
            
            <ul
              className="py-1"
              role="listbox"
              aria-multiselectable={isMulti}
              data-testid="dropdown-options"
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => {
                  const isSelected = selectedValues.includes(option.value)
                  return (
                    <li
                      key={option.value}
                      className={twMerge(
                        optionSizeClasses[size],
                        'cursor-pointer hover:bg-primary-50 transition-colors',
                        isSelected && 'bg-primary-100 text-primary-800 font-medium'
                      )}
                      onClick={() => handleSelect(option.value)}
                      role="option"
                      aria-selected={isSelected}
                      data-testid={`dropdown-option-${option.value}`}
                    >
                      <div className="flex items-center">
                        {isMulti && (
                          <span className="mr-2 flex h-4 w-4 items-center justify-center">
                            {isSelected && (
                              <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </span>
                        )}
                        {option.label}
                      </div>
                    </li>
                  )
                })
              ) : (
                <li className="py-3 px-4 text-neutral-500 text-center">
                  No options found
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <Text
          size="sm"
          variant={error ? 'primary' : 'secondary'}
          className={error ? 'text-error-500 mt-1' : 'text-neutral-500 mt-1'}
        >
          {error || helperText}
        </Text>
      )}
    </div>
  )
}

export default Dropdown 