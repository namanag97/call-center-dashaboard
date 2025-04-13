import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import AppLayout from './AppLayout'

describe('AppLayout Component', () => {
  it('renders children content', () => {
    render(
      <AppLayout>
        <div data-testid="test-content">Test Content</div>
      </AppLayout>
    )
    
    expect(screen.getByTestId('app-content')).toBeInTheDocument()
    expect(screen.getByTestId('test-content')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })
  
  it('renders sidebar when provided', () => {
    render(
      <AppLayout
        sidebar={<div data-testid="test-sidebar">Sidebar Content</div>}
      >
        Main Content
      </AppLayout>
    )
    
    expect(screen.getByTestId('app-sidebar')).toBeInTheDocument()
    expect(screen.getByTestId('test-sidebar')).toBeInTheDocument()
    expect(screen.getByText('Sidebar Content')).toBeInTheDocument()
  })
  
  it('renders header when provided', () => {
    render(
      <AppLayout
        header={<div data-testid="test-header">Header Content</div>}
      >
        Main Content
      </AppLayout>
    )
    
    expect(screen.getByTestId('app-header')).toBeInTheDocument()
    expect(screen.getByTestId('test-header')).toBeInTheDocument()
    expect(screen.getByText('Header Content')).toBeInTheDocument()
  })
  
  it('applies collapsed class to sidebar when isSidebarCollapsed is true', () => {
    render(
      <AppLayout
        sidebar={<div>Sidebar Content</div>}
        isSidebarCollapsed={true}
      >
        Main Content
      </AppLayout>
    )
    
    const sidebar = screen.getByTestId('app-sidebar')
    expect(sidebar).toHaveClass('w-16')
    expect(sidebar).not.toHaveClass('w-64')
  })
  
  it('applies expanded class to sidebar when isSidebarCollapsed is false', () => {
    render(
      <AppLayout
        sidebar={<div>Sidebar Content</div>}
        isSidebarCollapsed={false}
      >
        Main Content
      </AppLayout>
    )
    
    const sidebar = screen.getByTestId('app-sidebar')
    expect(sidebar).toHaveClass('w-64')
    expect(sidebar).not.toHaveClass('w-16')
  })
  
  it('applies custom className when provided', () => {
    render(
      <AppLayout className="custom-class">
        Main Content
      </AppLayout>
    )
    
    // The first div is the main container
    const container = document.querySelector('.custom-class')
    expect(container).toBeInTheDocument()
  })
}) 