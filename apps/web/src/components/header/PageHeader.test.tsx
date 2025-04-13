import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import PageHeader from './PageHeader'
import { Button } from '../ui'

describe('PageHeader Component', () => {
  it('renders title correctly', () => {
    render(<PageHeader title="Dashboard" />)
    
    expect(screen.getByTestId('page-header')).toBeInTheDocument()
    expect(screen.getByTestId('page-header-title')).toHaveTextContent('Dashboard')
  })
  
  it('renders subtitle when provided', () => {
    render(
      <PageHeader 
        title="Dashboard" 
        subtitle="Welcome to your personalized dashboard" 
      />
    )
    
    expect(screen.getByTestId('page-header-subtitle')).toBeInTheDocument()
    expect(screen.getByTestId('page-header-subtitle')).toHaveTextContent(
      'Welcome to your personalized dashboard'
    )
  })
  
  it('renders actions when provided', () => {
    const actions = (
      <>
        <Button data-testid="action-button-1">Action 1</Button>
        <Button data-testid="action-button-2">Action 2</Button>
      </>
    )
    
    render(<PageHeader title="Dashboard" actions={actions} />)
    
    expect(screen.getByTestId('page-header-actions')).toBeInTheDocument()
    expect(screen.getByTestId('action-button-1')).toBeInTheDocument()
    expect(screen.getByTestId('action-button-2')).toBeInTheDocument()
  })
  
  it('applies border by default', () => {
    render(<PageHeader title="Dashboard" />)
    
    expect(screen.getByTestId('page-header')).toHaveClass('border-b')
  })
  
  it('does not apply border when hasBorder is false', () => {
    render(<PageHeader title="Dashboard" hasBorder={false} />)
    
    expect(screen.getByTestId('page-header')).not.toHaveClass('border-b')
  })
  
  it('applies custom className when provided', () => {
    render(<PageHeader title="Dashboard" className="custom-class" />)
    
    expect(screen.getByTestId('page-header')).toHaveClass('custom-class')
  })
}) 