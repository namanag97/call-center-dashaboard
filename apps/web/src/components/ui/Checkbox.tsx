import React from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * Props for the Checkbox component
 */
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  /**
   * ID for the checkbox
   */
  id?: string;
  /**
   * Whether the checkbox is checked
   */
  checked?: boolean;
  /**
   * Called when the checkbox value changes
   */
  onChange?: (checked: boolean) => void;
  /**
   * Label text
   */
  label?: string;
  /**
   * Description text
   */
  description?: string;
  /**
   * Whether the checkbox is disabled
   */
  disabled?: boolean;
  /**
   * Error message
   */
  error?: string;
  /**
   * Custom class for the container
   */
  className?: string;
}

/**
 * Checkbox component
 */
export const Checkbox: React.FC<CheckboxProps> = ({
  id,
  checked = false,
  onChange,
  label,
  description,
  disabled = false,
  error,
  className = '',
  ...rest
}) => {
  /**
   * Handle checkbox change
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.checked);
    }
  };

  return (
    <div className={twMerge('flex', className)}>
      <div className="flex items-center h-5">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className={twMerge(
            'w-4 h-4 rounded border text-primary-600 focus:ring-primary-500',
            disabled ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer',
            error ? 'border-red-500' : 'border-gray-300',
            className
          )}
          {...rest}
        />
      </div>
      {(label || description) && (
        <div className="ml-2">
          {label && (
            <label 
              htmlFor={id}
              className={twMerge(
                'text-sm font-medium', 
                disabled ? 'text-gray-400' : 'text-gray-700',
                error ? 'text-red-500' : ''
              )}
            >
              {label}
            </label>
          )}
          {description && (
            <p className={`text-xs mt-1 ${disabled ? 'text-gray-400' : 'text-gray-500'}`}>
              {description}
            </p>
          )}
          {error && (
            <p className="text-xs text-red-500 mt-1">{error}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Checkbox; 