/**
 * Common types for UI components
 */

import { ButtonHTMLAttributes, InputHTMLAttributes, LabelHTMLAttributes, ReactNode } from 'react';

// Common variants for components
export type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type Status = 'success' | 'error' | 'warning' | 'info' | 'default';

// Common props for components with variants
export interface VariantProps {
  variant?: Variant;
  className?: string;
}

// Size props separated to avoid conflicts with HTML attributes
export interface SizeProps {
  size?: ComponentSize;
}

// Button component props
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps, SizeProps {
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

// Input component props - Omit size from HTML input attributes
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>, VariantProps, SizeProps {
  label?: string;
  error?: string;
  helperText?: string;
  status?: Status;
  leftElement?: ReactNode;
  rightElement?: ReactNode;
  isRequired?: boolean;
}

// Label component props
export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement>, VariantProps, SizeProps {
  isRequired?: boolean;
}

// Text component props
export interface TextProps extends VariantProps, SizeProps {
  children: ReactNode;
  as?: 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  truncate?: boolean;
  color?: string;
}

// Alert component props
export interface AlertProps extends VariantProps, SizeProps {
  children: ReactNode;
  status?: Status;
  title?: string;
  isClosable?: boolean;
  onClose?: () => void;
  icon?: ReactNode;
}

// Spinner component props
export interface SpinnerProps extends VariantProps, SizeProps {
  thickness?: string;
  speed?: string;
  color?: string;
  label?: string;
}

// Icon component props
export interface IconProps extends VariantProps, SizeProps {
  name?: string;
  color?: string;
  children?: ReactNode;
}

// Badge component props
export interface BadgeProps extends VariantProps, SizeProps {
  children: ReactNode;
  status?: Status;
}

// Dropdown/Select component props
export interface DropdownProps extends VariantProps, SizeProps {
  options: Array<{ value: string; label: string }>;
  value?: string | string[];
  placeholder?: string;
  isMulti?: boolean;
  isSearchable?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  error?: string;
  helperText?: string;
  label?: string;
  name?: string;
  onChange?: (value: string | string[]) => void;
  onBlur?: () => void;
  maxHeight?: string;
} 