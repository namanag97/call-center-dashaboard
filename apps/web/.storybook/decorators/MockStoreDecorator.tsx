import React from 'react'
import { Decorator } from '@storybook/react'

/**
 * Decorator that provides mock stores for Storybook
 * This is a placeholder for future Zustand store integration
 * Once Zustand is set up, this will be replaced with actual store providers
 */
export const MockStoreDecorator: Decorator = (Story) => {
  return (
    <div data-testid="mock-store-decorator">
      <Story />
    </div>
  )
}

export default MockStoreDecorator 