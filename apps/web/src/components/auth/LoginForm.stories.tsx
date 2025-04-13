import type { Meta, StoryObj } from '@storybook/react'
import { HttpResponse, http, delay } from 'msw'
import LoginForm from './LoginForm'

const meta: Meta<typeof LoginForm> = {
  component: LoginForm,
  title: 'Auth/LoginForm',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onSubmit: { action: 'submitted' },
  },
}

export default meta
type Story = StoryObj<typeof LoginForm>

export const Default: Story = {
  args: {},
  parameters: {
    msw: {
      handlers: [
        http.post('/api/auth/login', async () => {
          await delay(1000);
          return HttpResponse.json({
            user: {
              id: '1',
              email: 'user@example.com',
              name: 'John Doe',
            },
            token: 'fake-jwt-token',
          })
        }),
      ],
    },
  },
}

export const Loading: Story = {
  args: {
    isLoading: true,
  },
}

export const WithError: Story = {
  args: {
    error: 'Invalid email or password. Please try again.',
  },
  parameters: {
    msw: {
      handlers: [
        http.post('/api/auth/login', async () => {
          await delay(500);
          return new HttpResponse(
            JSON.stringify({ message: 'Invalid email or password' }),
            {
              status: 401,
              headers: {
                'Content-Type': 'application/json',
              }
            }
          )
        }),
      ],
    },
  },
}

export const SuccessfulLogin: Story = {
  args: {},
  play: async () => {
    // You can add play functions for interaction testing if needed
  },
  parameters: {
    msw: {
      handlers: [
        http.post('/api/auth/login', async ({ request }) => {
          const data = await request.json();
          const { email, password } = data as { email: string, password: string };
          
          await delay(500);
          
          if (email === 'admin@example.com' && password === 'password123') {
            return HttpResponse.json({
              user: {
                id: '1',
                email: 'admin@example.com',
                name: 'Admin User',
                role: 'admin',
              },
              token: 'fake-jwt-token',
            })
          }
          
          return new HttpResponse(
            JSON.stringify({ message: 'Invalid email or password' }),
            {
              status: 401,
              headers: {
                'Content-Type': 'application/json',
              }
            }
          )
        }),
      ],
    },
  },
} 