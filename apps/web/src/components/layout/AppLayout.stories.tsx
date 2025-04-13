import type { Meta, StoryObj } from '@storybook/react'
import AppLayout from './AppLayout'
import { Button, Text } from '../ui'

const meta: Meta<typeof AppLayout> = {
  component: AppLayout,
  title: 'Layout/AppLayout',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    isSidebarCollapsed: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof AppLayout>

const SampleSidebar = ({ collapsed = false }: { collapsed?: boolean }) => (
  <div className="p-4 h-full">
    <div className="mb-6">
      <Text size="lg" weight="bold">
        {collapsed ? 'App' : 'Application'}
      </Text>
    </div>
    <nav className="space-y-2">
      <div className={`p-2 rounded bg-primary-50 text-primary-700 ${collapsed ? 'text-center' : ''}`}>
        {collapsed ? 'D' : 'Dashboard'}
      </div>
      <div className={`p-2 rounded hover:bg-neutral-100 ${collapsed ? 'text-center' : ''}`}>
        {collapsed ? 'C' : 'Calls'}
      </div>
      <div className={`p-2 rounded hover:bg-neutral-100 ${collapsed ? 'text-center' : ''}`}>
        {collapsed ? 'U' : 'Upload'}
      </div>
      <div className={`p-2 rounded hover:bg-neutral-100 ${collapsed ? 'text-center' : ''}`}>
        {collapsed ? 'S' : 'Settings'}
      </div>
    </nav>
  </div>
)

const SampleHeader = () => (
  <div className="p-4 flex justify-between items-center">
    <Text size="lg" weight="bold">
      Dashboard
    </Text>
    <div className="flex items-center space-x-4">
      <Button variant="outline" size="sm">
        Help
      </Button>
      <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center">
        <Text size="sm">JD</Text>
      </div>
    </div>
  </div>
)

const SampleContent = () => (
  <div className="space-y-4">
    <div>
      <Text as="h1" size="xl" weight="bold">
        Welcome to the Dashboard
      </Text>
      <Text variant="secondary">
        This is a sample content area to demonstrate the AppLayout component.
      </Text>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div
          key={item}
          className="bg-white p-4 rounded-md shadow-sm border border-neutral-200"
        >
          <Text weight="semibold">Card {item}</Text>
          <Text variant="secondary">Sample card content</Text>
        </div>
      ))}
    </div>
  </div>
)

export const Default: Story = {
  args: {
    sidebar: <SampleSidebar />,
    header: <SampleHeader />,
    children: <SampleContent />,
    isSidebarCollapsed: false,
  },
}

export const CollapsedSidebar: Story = {
  args: {
    sidebar: <SampleSidebar collapsed />,
    header: <SampleHeader />,
    children: <SampleContent />,
    isSidebarCollapsed: true,
  },
}

export const WithoutSidebar: Story = {
  args: {
    header: <SampleHeader />,
    children: <SampleContent />,
  },
}

export const WithoutHeader: Story = {
  args: {
    sidebar: <SampleSidebar />,
    children: <SampleContent />,
  },
}

export const Responsive = {
  parameters: {
    viewport: {
      defaultViewport: 'responsive',
    },
  },
  render: () => (
    <AppLayout
      sidebar={<SampleSidebar />}
      header={<SampleHeader />}
    >
      <SampleContent />
    </AppLayout>
  ),
} 