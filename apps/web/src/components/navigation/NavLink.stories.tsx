import type { Meta, StoryObj } from '@storybook/react'
import NavLink from './NavLink'

const meta: Meta<typeof NavLink> = {
  component: NavLink,
  title: 'Navigation/NavLink',
  tags: ['autodocs'],
  argTypes: {
    isActive: { control: 'boolean' },
    iconOnly: { control: 'boolean' },
    onClick: { action: 'clicked' },
  },
}

export default meta
type Story = StoryObj<typeof NavLink>

// Sample icon component
const DashboardIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className="h-5 w-5"
  >
    <rect width="7" height="7" x="3" y="3" rx="1" />
    <rect width="7" height="7" x="14" y="3" rx="1" />
    <rect width="7" height="7" x="14" y="14" rx="1" />
    <rect width="7" height="7" x="3" y="14" rx="1" />
  </svg>
)

const CallsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className="h-5 w-5"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

export const Default: Story = {
  args: {
    id: 'dashboard',
    label: 'Dashboard',
  },
}

export const Active: Story = {
  args: {
    id: 'dashboard',
    label: 'Dashboard',
    isActive: true,
  },
}

export const WithIcon: Story = {
  args: {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <DashboardIcon />,
  },
}

export const ActiveWithIcon: Story = {
  args: {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <DashboardIcon />,
    isActive: true,
  },
}

export const IconOnly: Story = {
  args: {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <DashboardIcon />,
    iconOnly: true,
  },
}

export const MultipleNavLinks = {
  render: () => (
    <div className="flex flex-col space-y-2 w-64 p-4 bg-white">
      <NavLink id="dashboard" label="Dashboard" icon={<DashboardIcon />} isActive />
      <NavLink id="calls" label="Calls" icon={<CallsIcon />} />
      <NavLink id="settings" label="Settings" />
    </div>
  ),
}

export const CollapsedNavLinks = {
  render: () => (
    <div className="flex flex-col space-y-4 w-16 p-2 bg-white">
      <NavLink id="dashboard" label="Dashboard" icon={<DashboardIcon />} iconOnly isActive />
      <NavLink id="calls" label="Calls" icon={<CallsIcon />} iconOnly />
      <NavLink id="settings" label="Settings" iconOnly />
    </div>
  ),
} 