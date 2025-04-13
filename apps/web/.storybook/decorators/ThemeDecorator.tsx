import React from 'react'
import { Decorator } from '@storybook/react'
import '../../../src/index.css'

/**
 * Theme decorator for Storybook
 * Ensures components have access to the Tailwind styles
 * In the future, this can be extended with a ThemeProvider if needed
 */
export const ThemeDecorator: Decorator = (Story) => {
  return (
    <div className="font-sans text-neutral-900 bg-white">
      <div className="p-4">
        <Story />
      </div>
    </div>
  )
}

export default ThemeDecorator 