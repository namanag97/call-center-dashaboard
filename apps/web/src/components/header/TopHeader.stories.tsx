import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import TopHeader from './TopHeader'
import { Button, Text } from '../ui'

const meta: Meta<typeof TopHeader> = {
  component: TopHeader,
  title: 'Header/TopHeader',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    onLogout: { action: 'logged out' },
    onProfile: { action: 'profile clicked' },
    onSettings: { action: 'settings clicked' },
    onToggleSidebar: { action: 'sidebar toggled' },
  },
}

export default meta
type Story = StoryObj<typeof TopHeader>

// Sample logo component
const Logo = () => (
  <div className="flex items-center">
    <div className="h-8 w-8 bg-primary-600 rounded-md flex items-center justify-center">
      <Text as="span" className="text-white font-bold">
        C
      </Text>
    </div>
    <Text as="span" size="lg" weight="bold" className="ml-2">
      CallApp
    </Text>
  </div>
)

// Sample search component
const SearchBar = () => (
  <div className="relative w-full max-w-md">
    <input
      type="text"
      placeholder="Search..."
      className="w-full rounded-md border border-neutral-300 pl-10 pr-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
    />
    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="h-5 w-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  </div>
)

// Sample mock user
const mockUser = {
  name: 'John Doe',
  email: 'john.doe@example.com',
}

export const Default: Story = {
  args: {
    logo: <Logo />,
    user: mockUser,
  },
}

export const WithMiddleContent: Story = {
  args: {
    logo: <Logo />,
    middleContent: <SearchBar />,
    user: mockUser,
  },
}

export const WithActions: Story = {
  args: {
    logo: <Logo />,
    middleContent: <SearchBar />,
    actions: (
      <>
        <Button variant="outline" size="sm">
          Upgrade
        </Button>
      </>
    ),
    user: mockUser,
  },
}

export const MobileWithSidebar = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    return (
      <div>
        <TopHeader
          logo={<Logo />}
          user={mockUser}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
        />
        <div className="p-4">
          <Text>
            The sidebar toggle button appears in mobile view. Click it to toggle the sidebar state.
          </Text>
          <div className="mt-4 p-4 bg-neutral-100 rounded">
            Sidebar is: {isSidebarOpen ? 'Open' : 'Closed'}
          </div>
        </div>
      </div>
    );
  },
}

export const WithAllFeatures: Story = {
  args: {
    logo: <Logo />,
    middleContent: <SearchBar />,
    actions: (
      <>
        <Button variant="outline" size="sm">
          Docs
        </Button>
        <Button variant="primary" size="sm">
          Upgrade
        </Button>
      </>
    ),
    user: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    onProfile: undefined, // Using action from argTypes
    onSettings: undefined, // Using action from argTypes
    onLogout: undefined, // Using action from argTypes
  },
} 