import type { Meta, StoryObj } from '@storybook/react'
import UserMenu from './UserMenu'
import { User, UserRole } from '@conista/shared-types'

// Interface for the user with avatarUrl (for story purposes)
interface UserWithAvatar extends User {
  avatarUrl?: string;
}

const meta: Meta<typeof UserMenu> = {
  component: UserMenu,
  title: 'Header/UserMenu',
  tags: ['autodocs'],
  argTypes: {
    onLogout: { action: 'logged out' },
    onProfile: { action: 'profile clicked' },
    onSettings: { action: 'settings clicked' },
  },
  decorators: [
    (Story) => (
      <div className="flex justify-end p-4">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof UserMenu>

const defaultUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: UserRole.Agent,
}

export const Default: Story = {
  args: {
    user: defaultUser,
  },
}

export const WithAvatar: Story = {
  args: {
    user: {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: UserRole.Manager,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    } as UserWithAvatar,
  },
}

export const Admin: Story = {
  args: {
    user: {
      ...defaultUser,
      name: 'Admin User',
      email: 'admin@example.com',
      role: UserRole.Admin,
    },
  },
}

export const WithAllOptions: Story = {
  args: {
    user: {
      ...defaultUser,
      name: 'Alex Johnson',
      email: 'alex.johnson@example.com',
      role: UserRole.Viewer,
    },
    onLogout: async () => { console.log('Logged out') },
    onProfile: () => { console.log('Profile clicked') },
    onSettings: () => { console.log('Settings clicked') },
  },
  parameters: {
    docs: {
      description: {
        story: 'UserMenu with all action handlers provided. Click to see the dropdown and interact with the menu items.',
      },
    },
  },
}

export const LoggingOut: Story = {
  args: {
    user: defaultUser,
    isLoggingOut: true,
    onLogout: async () => { 
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Logged out') 
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'UserMenu showing the logging out state, with a spinner in the dropdown',
      },
    },
  },
}

export const WithoutOptions: Story = {
  args: {
    user: {
      ...defaultUser,
      name: 'Tom Wilson',
      email: 'tom.wilson@example.com',
    },
    // No action handlers
  },
} 