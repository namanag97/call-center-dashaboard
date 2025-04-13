import type { Meta, StoryObj } from '@storybook/react'
import PageHeader from './PageHeader'
import { Button } from '../ui'

const meta: Meta<typeof PageHeader> = {
  component: PageHeader,
  title: 'Header/PageHeader',
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof PageHeader>

export const Default: Story = {
  args: {
    title: 'Dashboard',
  },
}

export const WithSubtitle: Story = {
  args: {
    title: 'Analytics Dashboard',
    subtitle: 'View and analyze your data with powerful visualization tools',
  },
}

export const WithActions: Story = {
  args: {
    title: 'Call List',
    subtitle: 'Browse and manage your recorded calls',
    actions: (
      <>
        <Button variant="outline" size="sm">
          Export
        </Button>
        <Button variant="primary" size="sm">
          Upload New
        </Button>
      </>
    ),
  },
}

export const WithoutBorder: Story = {
  args: {
    title: 'Settings',
    subtitle: 'Configure your account and application preferences',
    hasBorder: false,
  },
}

export const Mobile = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => (
    <PageHeader
      title="Analytics Dashboard"
      subtitle="View and analyze your data with powerful visualization tools"
      actions={
        <>
          <Button variant="primary" size="sm">
            Action
          </Button>
        </>
      }
    />
  ),
} 