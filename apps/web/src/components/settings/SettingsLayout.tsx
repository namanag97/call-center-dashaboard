import React, { useState } from 'react';
import { Provider, Category, SystemSettings } from '@conista/shared-types';

/**
 * Settings tab identifier
 */
type SettingsTab = 'general' | 'providers' | 'categories';

/**
 * Props for the SettingsLayout component
 */
interface SettingsLayoutProps {
  /**
   * Initial active tab
   */
  initialTab?: SettingsTab;
  /**
   * Child components to render
   */
  children?: React.ReactNode;
  /**
   * Custom class name
   */
  className?: string;
  /**
   * General settings tab content
   */
  generalContent?: React.ReactNode;
  /**
   * Providers tab content
   */
  providersContent?: React.ReactNode;
  /**
   * Categories tab content
   */
  categoriesContent?: React.ReactNode;
  /**
   * Current loading state
   */
  isLoading?: boolean;
  /**
   * Error message to display
   */
  error?: string;
}

/**
 * Layout component for the settings page with tab navigation
 */
export const SettingsLayout: React.FC<SettingsLayoutProps> = ({
  initialTab = 'general',
  children,
  className = '',
  generalContent,
  providersContent,
  categoriesContent,
  isLoading = false,
  error
}) => {
  // State for the active tab
  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab);

  /**
   * Get tab button classes based on active state
   */
  const getTabClasses = (tab: SettingsTab) => {
    return `px-4 py-2 text-sm font-medium ${
      activeTab === tab
        ? 'text-primary-700 border-b-2 border-primary-500'
        : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300'
    }`;
  };

  /**
   * Render the active tab content
   */
  const renderTabContent = () => {
    if (children) {
      return children;
    }

    switch (activeTab) {
      case 'general':
        return generalContent || <div>General Settings Content</div>;
      case 'providers':
        return providersContent || <div>Provider Settings Content</div>;
      case 'categories':
        return categoriesContent || <div>Categories Settings Content</div>;
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm ${className}`}>
      {/* Header and Tabs */}
      <div className="border-b border-gray-200">
        <div className="px-6 pt-6 pb-0">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Settings</h1>
          <div className="flex border-b border-gray-200">
            <button
              type="button"
              className={getTabClasses('general')}
              onClick={() => setActiveTab('general')}
              aria-current={activeTab === 'general' ? 'page' : undefined}
            >
              General
            </button>
            <button
              type="button"
              className={getTabClasses('providers')}
              onClick={() => setActiveTab('providers')}
              aria-current={activeTab === 'providers' ? 'page' : undefined}
            >
              Providers
            </button>
            <button
              type="button"
              className={getTabClasses('categories')}
              onClick={() => setActiveTab('categories')}
              aria-current={activeTab === 'categories' ? 'page' : undefined}
            >
              Categories
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <p className="font-medium">Error loading settings</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : (
          renderTabContent()
        )}
      </div>
    </div>
  );
};

export default SettingsLayout; 