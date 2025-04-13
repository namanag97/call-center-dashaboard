import { http, HttpResponse, delay } from 'msw'
import { User, UserRole } from '@conista/shared-types'

// Sample user data
const users: User[] = [
  {
    id: '1',
    name: 'John Admin',
    email: 'admin@example.com',
    role: UserRole.Admin,
  },
  {
    id: '2',
    name: 'Sarah Manager',
    email: 'manager@example.com',
    role: UserRole.Manager,
  },
  {
    id: '3',
    name: 'Mike Agent',
    email: 'agent@example.com',
    role: UserRole.Agent,
  },
]

// Authentication handlers
export const authHandlers = [
  // Login endpoint
  http.post('/api/auth/login', async ({ request }) => {
    // Add a realistic delay
    await delay(500)

    const { email, password } = await request.json()

    // Simple validation
    if (!email || !password) {
      return new HttpResponse(
        JSON.stringify({
          error: 'Email and password are required',
        }),
        { status: 400 }
      )
    }

    // Find user by email (in a real scenario, also check password)
    const user = users.find(u => u.email === email)

    if (!user) {
      return new HttpResponse(
        JSON.stringify({
          error: 'Invalid credentials',
        }),
        { status: 401 }
      )
    }

    // Successful login response
    return HttpResponse.json({
      user,
      token: 'mock-jwt-token-' + user.id,
    })
  }),

  // Logout endpoint
  http.post('/api/auth/logout', async () => {
    await delay(300)
    return new HttpResponse(null, { status: 204 })
  }),

  // Get current user endpoint
  http.get('/api/auth/me', async ({ request }) => {
    await delay(300)

    // Check for auth header
    const authHeader = request.headers.get('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new HttpResponse(null, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const userId = token.split('-').pop()

    // Find user by ID from token
    const user = users.find(u => u.id === userId)

    if (!user) {
      return new HttpResponse(null, { status: 401 })
    }

    return HttpResponse.json({ user })
  }),
]
