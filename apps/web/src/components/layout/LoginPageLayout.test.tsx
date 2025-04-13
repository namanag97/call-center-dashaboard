import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import LoginPageLayout from './LoginPageLayout'

describe('LoginPageLayout Component', () => {
  it('renders the layout container', () => {
    render(
      <LoginPageLayout>
        Content
      </LoginPageLayout>
    )
    
    expect(screen.getByTestId('login-page-layout')).toBeInTheDocument()
    expect(screen.getByTestId('login-container')).toBeInTheDocument()
    expect(screen.getByTestId('login-content')).toBeInTheDocument()
  })

  it('renders children content', () => {
    render(
      <LoginPageLayout>
        <div data-testid="test-content">Test Content</div>
      </LoginPageLayout>
    )
    
    expect(screen.getByTestId('login-content')).toBeInTheDocument()
    expect(screen.getByTestId('test-content')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })
  
  it('renders logo when provided', () => {
    const logoElement = <img src="/logo.png" alt="Logo" data-testid="logo-img" />
    
    render(
      <LoginPageLayout logo={logoElement}>
        Content
      </LoginPageLayout>
    )
    
    expect(screen.getByTestId('login-logo')).toBeInTheDocument()
    expect(screen.getByTestId('logo-img')).toBeInTheDocument()
  })
  
  it('renders title when provided', () => {
    render(
      <LoginPageLayout title="Test Title">
        Content
      </LoginPageLayout>
    )
    
    expect(screen.getByTestId('login-title')).toBeInTheDocument()
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })
  
  it('renders description when provided', () => {
    render(
      <LoginPageLayout description="Test Description">
        Content
      </LoginPageLayout>
    )
    
    expect(screen.getByTestId('login-description')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })
  
  it('renders all optional elements when provided', () => {
    const logoElement = <img src="/logo.png" alt="Logo" data-testid="logo-img" />
    
    render(
      <LoginPageLayout 
        logo={logoElement}
        title="Test Title"
        description="Test Description"
      >
        Content
      </LoginPageLayout>
    )
    
    expect(screen.getByTestId('login-logo')).toBeInTheDocument()
    expect(screen.getByTestId('login-title')).toBeInTheDocument()
    expect(screen.getByTestId('login-description')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })
  
  it('applies custom className when provided', () => {
    render(
      <LoginPageLayout className="custom-class">
        Content
      </LoginPageLayout>
    )
    
    const container = screen.getByTestId('login-page-layout')
    expect(container).toHaveClass('custom-class')
  })
  
  it('renders copyright information in footer', () => {
    render(
      <LoginPageLayout>
        Content
      </LoginPageLayout>
    )
    
    const footer = screen.getByTestId('login-footer')
    expect(footer).toBeInTheDocument()
    
    const currentYear = new Date().getFullYear()
    expect(screen.getByText(`© ${currentYear} Call Analysis Platform. All rights reserved.`)).toBeInTheDocument()
  })
}) 