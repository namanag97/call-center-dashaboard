import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import Sidebar from './Sidebar'
import NavLink from './NavLink'
import { Text } from '../ui'

const meta: Meta<typeof Sidebar> = {
  component: Sidebar,
  title: 'Navigation/Sidebar',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    isCollapsed: { control: 'boolean' },
    onToggleCollapse: { action: 'toggled' },
  },
}

export default meta
type Story = StoryObj<typeof Sidebar>

// Sample icon components
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

const UploadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className="h-5 w-5"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
)

const SettingsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className="h-5 w-5"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
)

const LogoutIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className="h-5 w-5"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)

// Sample logo component
const Logo = ({ collapsed = false }: { collapsed?: boolean }) => (
  <div className="flex items-center">
    <div className="h-8 w-8 bg-primary-600 rounded-md flex items-center justify-center">
      <Text as="span" className="text-white font-bold">
        C
      </Text>
    </div>
    {!collapsed && (
      <Text as="span" size="lg" weight="bold" className="ml-2">
        CallApp
      </Text>
    )}
  </div>
)

// Sample footer component
const Footer = ({ collapsed = false }: { collapsed?: boolean }) => (
  <NavLink
    id="logout"
    label="Logout"
    icon={<LogoutIcon />}
    iconOnly={collapsed}
    title="Logout"
  />
)

const createNavGroups = (iconOnly = false) => [
  {
    title: 'Main',
    items: [
      <NavLink
        key="dashboard"
        id="dashboard"
        label="Dashboard"
        icon={<DashboardIcon />}
        isActive
        iconOnly={iconOnly}
      />,
      <NavLink
        key="calls"
        id="calls"
        label="Calls"
        icon={<CallsIcon />}
        iconOnly={iconOnly}
      />,
      <NavLink
        key="upload"
        id="upload"
        label="Upload"
        icon={<UploadIcon />}
        iconOnly={iconOnly}
      />,
    ],
  },
  {
    title: 'Settings',
    items: [
      <NavLink
        key="settings"
        id="settings"
        label="Settings"
        icon={<SettingsIcon />}
        iconOnly={iconOnly}
      />,
    ],
  },
];

export const Default: Story = {
  args: {
    navGroups: createNavGroups(),
    logo: <Logo />,
    footer: <Footer />,
    isCollapsed: false,
  },
}

export const Collapsed: Story = {
  args: {
    navGroups: createNavGroups(true),
    logo: <Logo collapsed />,
    footer: <Footer collapsed />,
    isCollapsed: true,
  },
}

export const WithoutLogo: Story = {
  args: {
    navGroups: createNavGroups(),
    footer: <Footer />,
    isCollapsed: false,
  },
}

export const WithoutFooter: Story = {
  args: {
    navGroups: createNavGroups(),
    logo: <Logo />,
    isCollapsed: false,
  },
}

export const Interactive = {
  render: () => {
    // Using useState hook for interactive story
    const [isCollapsed, setIsCollapsed] = useState(false);
    
    return (
      <div className="h-[500px] flex border border-neutral-200">
        <Sidebar
          navGroups={createNavGroups(isCollapsed)}
          logo={<Logo collapsed={isCollapsed} />}
          footer={<Footer collapsed={isCollapsed} />}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          className="h-full"
        />
        <div className="flex-1 bg-neutral-50 p-6">
          <Text as="h1" size="xl" weight="bold">
            Main Content Area
          </Text>
          <Text as="p" className="mt-2">
            Click the chevron icon in the sidebar to collapse/expand it.
          </Text>
        </div>
      </div>
    );
  },
}

export const Mobile = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    
    return (
      <div className="h-[500px] flex border border-neutral-200">
        <Sidebar
          navGroups={createNavGroups(isCollapsed)}
          logo={<Logo collapsed={isCollapsed} />}
          footer={<Footer collapsed={isCollapsed} />}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          className="h-full"
        />
        <div className="flex-1 bg-neutral-50 p-4">
          <Text as="h1" size="lg" weight="bold">
            Mobile View
          </Text>
          <Text as="p" className="mt-2 text-sm">
            Sidebar defaults to collapsed on mobile.
          </Text>
        </div>
      </div>
    );
  },
} 