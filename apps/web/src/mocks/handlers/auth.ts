import { http, HttpResponse, delay } from 'msw'
import { User, UserRole, AuthErrorCode } from '@conista/shared-types'

// Sample user data
const users: User[] = [
  {
    id: '1',
    name: 'John Admin',
    email: 'admin@example.com',
    role: UserRole.Admin,
    avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    createdAt: '2023-01-15T08:30:00Z',
    lastLogin: '2023-06-02T14:45:00Z',
  },
  {
    id: '2',
    name: 'Sarah Manager',
    email: 'manager@example.com',
    role: UserRole.Manager,
    avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    createdAt: '2023-02-20T10:15:00Z',
    lastLogin: '2023-06-01T09:30:00Z',
  },
  {
    id: '3',
    name: 'Mike Agent',
    email: 'agent@example.com',
    role: UserRole.Agent,
    avatarUrl: 'https://randomuser.me/api/portraits/men/76.jpg',
    createdAt: '2023-03-10T11:45:00Z',
    lastLogin: '2023-05-30T16:20:00Z',
  },
]

// Login attempt tracking for rate limiting simulation
const loginAttempts: Record<string, { count: number; lastAttempt: number }> = {}

// Simulated locked accounts
const lockedAccounts: string[] = []

// Authentication handlers
export const authHandlers = [
  // Login endpoint
  http.post('/api/auth/login', async ({ request }) => {
    // Add a realistic delay (300-800ms)
    await delay(Math.floor(Math.random() * 500) + 300)

    try {
      const { email, password, rememberMe } = await request.json()
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!email || !emailRegex.test(email)) {
        return HttpResponse.json(
          {
            code: AuthErrorCode.ValidationError,
            message: 'Please enter a valid email address',
            field: 'email'
          },
          { status: 400 }
        )
      }
      
      // Validate password
      if (!password || password.length < 6) {
        return HttpResponse.json(
          {
            code: AuthErrorCode.ValidationError,
            message: 'Password must be at least 6 characters',
            field: 'password'
          },
          { status: 400 }
        )
      }
      
      // Check for locked account
      if (lockedAccounts.includes(email)) {
        return HttpResponse.json(
          {
            code: AuthErrorCode.AccountLocked,
            message: 'Your account has been locked due to too many failed login attempts. Please reset your password or contact support.'
          },
          { status: 403 }
        )
      }
      
      // Track login attempts for rate limiting
      const now = Date.now()
      if (!loginAttempts[email]) {
        loginAttempts[email] = { count: 0, lastAttempt: now }
      }
      
      // Reset counter if last attempt was more than 15 minutes ago
      if (now - loginAttempts[email].lastAttempt > 15 * 60 * 1000) {
        loginAttempts[email].count = 0
      }
      
      loginAttempts[email].lastAttempt = now
      loginAttempts[email].count += 1
      
      // Check for too many attempts
      if (loginAttempts[email].count > 5) {
        lockedAccounts.push(email)
        return HttpResponse.json(
          {
            code: AuthErrorCode.TooManyAttempts,
            message: 'Too many failed login attempts. Your account has been temporarily locked.'
          },
          { status: 429 }
        )
      }

      // Find user by email (in a real scenario, also check password)
      const user = users.find(u => u.email === email)

      // Demo credential check (accept any password for demo users, but require "password" for non-existing emails)
      const isValidPassword = user ? true : password === 'password'

      if (!user && !isValidPassword) {
        return HttpResponse.json(
          {
            code: AuthErrorCode.InvalidCredentials,
            message: 'The email or password you entered is incorrect'
          },
          { status: 401 }
        )
      }
      
      // Create a temporary user if email doesn't exist in our demo data
      const authUser = user || {
        id: 'temp-' + Math.floor(Math.random() * 1000),
        name: email.split('@')[0],
        email: email,
        role: UserRole.Viewer,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      }
      
      // Reset login attempts on successful login
      loginAttempts[email] = { count: 0, lastAttempt: now }
      
      // Token expires in 24 hours (or 30 days if remember me is checked)
      const expiresIn = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000
      const expiresAt = new Date(now + expiresIn).toISOString()

      // Successful login response
      return HttpResponse.json({
        user: authUser,
        token: 'mock-jwt-token-' + authUser.id,
        expiresAt
      })
    } catch (error) {
      return HttpResponse.json(
        {
          code: AuthErrorCode.ServerError,
          message: 'An unexpected error occurred. Please try again.'
        },
        { status: 500 }
      )
    }
  }),

  // Logout endpoint
  http.post('/api/auth/logout', async () => {
    await delay(Math.floor(Math.random() * 200) + 100)
    return new HttpResponse(null, { status: 204 })
  }),

  // Get current user endpoint
  http.get('/api/auth/me', async ({ request }) => {
    await delay(Math.floor(Math.random() * 300) + 100)

    // Check for auth header
    const authHeader = request.headers.get('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        {
          code: AuthErrorCode.InvalidCredentials,
          message: 'Authentication required. Please log in.'
        },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    const userId = token.split('-').pop()

    // Handle temporary users (created during login)
    if (userId?.startsWith('temp-')) {
      // Extract email from token (would be handled differently in a real app)
      const email = token.split('-')[2] || 'user@example.com'
      
      return HttpResponse.json({
        user: {
          id: userId,
          name: email.split('@')[0],
          email: email,
          role: UserRole.Viewer,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        }
      })
    }

    // Find user by ID from token
    const user = users.find(u => u.id === userId)

    if (!user) {
      return HttpResponse.json(
        {
          code: AuthErrorCode.InvalidCredentials,
          message: 'Invalid or expired session. Please log in again.'
        },
        { status: 401 }
      )
    }

    // Update last login time
    user.lastLogin = new Date().toISOString()

    return HttpResponse.json({ user })
  }),

  // Get current user session
  http.get('/api/auth/session', async ({ request }) => {
    await delay(Math.floor(Math.random() * 300) + 100)

    // Check for auth header
    const authHeader = request.headers.get('Authorization')

    // Check for auth token in cookies (for browsers that automatically include cookies)
    const cookies = request.headers.get('Cookie') || ''
    const hasAuthCookie = cookies.includes('auth_token=')

    if ((!authHeader || !authHeader.startsWith('Bearer ')) && !hasAuthCookie) {
      return HttpResponse.json(
        {
          code: AuthErrorCode.InvalidCredentials,
          message: 'No valid session found. Please log in.',
          authenticated: false
        },
        { status: 401 }
      )
    }

    // Extract token from header or cookie
    let token = ''
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1]
    } else if (hasAuthCookie) {
      const tokenMatch = cookies.match(/auth_token=([^;]+)/)
      token = tokenMatch ? tokenMatch[1] : ''
    }

    // Check for valid token format
    if (!token || !token.includes('mock-jwt-token-')) {
      return HttpResponse.json(
        {
          code: AuthErrorCode.InvalidCredentials,
          message: 'Invalid session token. Please log in again.',
          authenticated: false
        },
        { status: 401 }
      )
    }

    const userId = token.split('-').pop()
    let user = users.find(u => u.id === userId)

    // Handle temporary users (created during login)
    if (!user && userId?.startsWith('temp-')) {
      // Extract email from token (would be handled differently in a real app)
      const email = token.split('-')[2] || 'user@example.com'
      
      user = {
        id: userId,
        name: email.split('@')[0],
        email: email,
        role: UserRole.Viewer,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        lastLogin: new Date().toISOString(),
        avatarUrl: 'https://randomuser.me/api/portraits/lego/1.jpg' // Default avatar for temp users
      }
    }

    if (!user) {
      return HttpResponse.json(
        {
          code: AuthErrorCode.InvalidCredentials,
          message: 'Session expired. Please log in again.',
          authenticated: false
        },
        { status: 401 }
      )
    }

    // Update last login time
    user.lastLogin = new Date().toISOString()

    // Return authenticated user
    return HttpResponse.json({
      user,
      authenticated: true,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
    })
  }),
]
