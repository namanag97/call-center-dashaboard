import React, { useEffect, useState } from 'react'
import { Decorator } from '@storybook/react'

// We need to conditionally import MSW because it might not be available in the Storybook build
let worker: any = null

/**
 * Decorator that sets up MSW for Storybook
 * Ensures API mocking is available in stories
 */
export const MSWDecorator: Decorator = (Story, context) => {
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Dynamically import MSW in the browser
    const setupMSW = async () => {
      try {
        if (typeof window !== 'undefined' && !worker) {
          // Dynamic import
          const msw = await import('msw/browser')
          // Import the handlers directory
          const handlersModule = await import('../../src/mocks/handlers/index')
          
          // Setup worker
          worker = msw.setupWorker(...handlersModule.handlers)
          await worker.start({
            onUnhandledRequest: 'bypass', // Don't warn for unhandled requests
          })
          
          console.log('[MSW] Setup complete for Storybook')
        }
        setIsInitialized(true)
      } catch (error) {
        console.error('[MSW] Failed to initialize in Storybook:', error)
        // Still render the story even if MSW fails
        setIsInitialized(true)
      }
    }

    setupMSW()
    
    // Cleanup
    return () => {
      if (worker) {
        worker.stop()
      }
    }
  }, [])

  // Show a loading state until MSW is initialized
  if (!isInitialized) {
    return <div>Loading MSW...</div>
  }

  return <Story />
}

export default MSWDecorator 