import React, { useState } from 'react'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { LoginCredentials } from '@conista/shared-types'

interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => Promise<void>
  isLoading?: boolean
  error?: string
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  onSubmit, 
  isLoading = false,
  error
}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formErrors, setFormErrors] = useState<{
    email?: string
    password?: string
  }>({})

  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string } = {}
    
    if (!email) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid'
    }
    
    if (!password) {
      errors.password = 'Password is required'
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      try {
        await onSubmit({ email, password })
      } catch (err) {
        // Form submission error is handled by the parent component
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        type="email"
        label="Email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={formErrors.email}
        isRequired
        status={formErrors.email ? 'error' : 'default'}
      />
      
      <Input
        type="password"
        label="Password"
        placeholder="********"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={formErrors.password}
        isRequired
        status={formErrors.password ? 'error' : 'default'}
      />
      
      {error && (
        <div className="py-2 px-3 bg-error-50 text-error-700 text-sm rounded-md">
          {error}
        </div>
      )}
      
      <Button 
        type="submit"
        variant="primary"
        className="w-full"
        isLoading={isLoading}
      >
        Sign In
      </Button>
    </form>
  )
}

export default LoginForm 