import React from 'react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { Decorator } from '@storybook/react'

/**
 * Decorator that provides React Router context to stories
 * Wraps components in a MemoryRouter to simulate navigation
 */
export const RouterDecorator: Decorator = (Story) => {
  return (
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<Story />} />
      </Routes>
    </MemoryRouter>
  )
}

export default RouterDecorator 