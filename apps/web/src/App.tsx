import { Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import { User } from '@conista/shared-types'
import { Button } from './components/ui'
import './App.css'

// Placeholder components for routes
const Dashboard = () => (
  <div className="page">
    <h1 className="text-primary-800 mb-6 text-3xl font-bold">Dashboard</h1>
    <div className="space-y-4">
      <p className="text-neutral-700">Welcome to the Conista dashboard!</p>
      <div className="flex space-x-4">
        <Button variant="primary">Primary Button</Button>
        <Button variant="secondary">Secondary Button</Button>
        <Button variant="outline">Outline Button</Button>
        <Button variant="ghost">Ghost Button</Button>
      </div>
      <div className="mt-4 flex space-x-4">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </div>
      <div className="mt-4">
        <Button isLoading>Loading Button</Button>
      </div>
    </div>
  </div>
)

const Login = () => (
  <div className="page flex items-center justify-center">
    <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
      <h1 className="text-primary-800 mb-6 text-2xl font-bold">Login</h1>
      <div className="space-y-4">
        <Button variant="primary" className="w-full">
          Sign In
        </Button>
      </div>
    </div>
  </div>
)

const CallList = () => <div className="page">Call List</div>
const NotFound = () => <div className="page">404 - Page Not Found</div>

function App() {
  const [user] = useState<User | null>(null)
  const isAuthenticated = Boolean(user)

  return (
    <div className="app">
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />

        {/* Protected routes */}
        <Route path="/" element={isAuthenticated ? <Dashboard /> : <Dashboard />} />
        <Route path="/calls" element={isAuthenticated ? <CallList /> : <Navigate to="/login" />} />

        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
