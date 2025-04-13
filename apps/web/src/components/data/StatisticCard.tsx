import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Icon, Text } from '../ui';
const ProgressBar = require('../ui/ProgressBar');

export interface StatisticCardProps {
  /**
   * The main title of the statistic card
   */
  title: string;

  /**
   * The main value to display
   */
  value: string | number;

  /**
   * A description or subtitle for context
   */
  description?: string;

  /**
   * The percentage change (positive or negative)
   */
  changePercentage?: number;

  /**
   * Icon to display in the top-right corner
   */
  icon?: React.ReactNode;

  /**
   * Progress value (0-100)
   */
  progress?: number;

  /**
   * Type of statistic to control color scheme
   */
  type?: 'default' | 'success' | 'warning' | 'error' | 'info';

  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Custom CSS class names
   */
  className?: string;

  /**
   * Additional content to display at the bottom of the card
   */
  footer?: React.ReactNode;

  /**
   * Click handler for the card
   */
  onClick?: () => void;
}

/**
 * StatisticCard component for displaying dashboard metrics
 */
const StatisticCard: React.FC<StatisticCardProps> = ({
  title,
  value,
  description,
  changePercentage,
  icon,
  progress,
  type = 'default',
  size = 'md',
  className = '',
  footer,
  onClick,
}) => {
  // Determine style based on type
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          iconBg: 'bg-success-100',
          iconColor: 'text-success-600',
          changeColor: 'text-success-600',
        };
      case 'warning':
        return {
          iconBg: 'bg-warning-100',
          iconColor: 'text-warning-600',
          changeColor: 'text-warning-600',
        };
      case 'error':
        return {
          iconBg: 'bg-error-100',
          iconColor: 'text-error-600',
          changeColor: 'text-error-600',
        };
      case 'info':
        return {
          iconBg: 'bg-info-100',
          iconColor: 'text-info-600',
          changeColor: 'text-info-600',
        };
      default:
        return {
          iconBg: 'bg-primary-100',
          iconColor: 'text-primary-600',
          changeColor: 'text-neutral-600',
        };
    }
  };

  // Determine style based on size
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          padding: 'p-3',
          valueSize: 'text-lg',
          titleSize: 'text-xs',
        };
      case 'lg':
        return {
          padding: 'p-6',
          valueSize: 'text-3xl',
          titleSize: 'text-base',
        };
      default:
        return {
          padding: 'p-4',
          valueSize: 'text-2xl',
          titleSize: 'text-sm',
        };
    }
  };

  const typeStyles = getTypeStyles();
  const sizeStyles = getSizeStyles();

  return (
    <div
      className={twMerge(
        'bg-white rounded-lg border border-neutral-200 shadow-sm hover:shadow-md transition-shadow',
        sizeStyles.padding,
        onClick ? 'cursor-pointer' : '',
        className
      )}
      onClick={onClick}
      aria-label={`${title} statistic: ${value}`}
    >
      <div className="flex justify-between items-start mb-2">
        <Text 
          size="sm" 
          className={twMerge('text-neutral-500 font-medium', sizeStyles.titleSize)}
        >
          {title}
        </Text>
        {icon && (
          <div className={twMerge('p-2 rounded-full', typeStyles.iconBg, typeStyles.iconColor)}>
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline mb-1">
        <Text 
          as="h3" 
          className={twMerge('font-bold text-neutral-900', sizeStyles.valueSize)}
        >
          {value}
        </Text>
        {changePercentage !== undefined && (
          <div className={`ml-2 flex items-center ${changePercentage >= 0 ? 'text-success-600' : 'text-error-600'}`}>
            <span className="text-sm font-medium">
              {changePercentage >= 0 ? '+' : ''}{changePercentage}%
            </span>
            <span className="ml-1">
              {changePercentage >= 0 ? (
                <Icon name="arrow-up" className="h-3 w-3" />
              ) : (
                <Icon name="arrow-down" className="h-3 w-3" />
              )}
            </span>
          </div>
        )}
      </div>

      {description && (
        <Text className="text-neutral-500 text-sm mb-3">{description}</Text>
      )}

      {progress !== undefined && (
        <div className="mt-3">
          <ProgressBar 
            value={progress} 
            max={100} 
            variant={type === 'default' ? 'primary' : type as 'success' | 'warning' | 'error' | 'info'} 
            size="sm"
            showValue
          />
        </div>
      )}

      {footer && <div className="mt-3 pt-3 border-t border-neutral-200">{footer}</div>}
    </div>
  );
};

export default StatisticCard; 