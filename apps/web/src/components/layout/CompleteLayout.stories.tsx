import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import CompleteLayout from './CompleteLayout'
import { Button, Text } from '../ui'

const meta: Meta<typeof CompleteLayout> = {
  component: CompleteLayout,
  title: 'Layout/CompleteLayout',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
## Complete Layout System

The CompleteLayout component serves as the main application shell, integrating all layout components into a cohesive system:

- **AppLayout**: Main container with slots for sidebar, header, and content
- **Sidebar**: Navigation sidebar with collapsible functionality
- **TopHeader**: Header with user menu, actions, and mobile sidebar toggle
- **PageHeader**: Page title area with optional actions
- **NavLink**: Individual navigation items with active states

### Features

- Fully responsive layout that adapts to all screen sizes
- Collapsible sidebar on desktop for space optimization
- Slide-out mobile navigation on smaller screens
- Context-aware navigation items that highlight based on current page
- Support for page actions and title/subtitle in the header
- Complete keyboard navigation support for accessibility
- Proper ARIA attributes for screen readers

### Usage Guidelines

Use this component as the main wrapper for your application pages. It provides a consistent layout structure while allowing customization through props.
`
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    onNavItemClick: { action: 'navigation clicked' },
    onLogout: { action: 'logged out' },
    onProfile: { action: 'profile clicked' },
    onSettings: { action: 'settings clicked' },
    activeNavItem: {
      control: 'radio',
      options: ['dashboard', 'calls', 'upload', 'settings'],
      description: 'Currently active navigation item'
    },
    pageTitle: {
      description: 'Main title displayed in the page header'
    },
    pageSubtitle: {
      description: 'Optional subtitle displayed below the main title'
    },
    pageActions: {
      description: 'Optional actions to display in the header (buttons, etc.)'
    },
    user: {
      description: 'User information for the user menu'
    }
  },
}

export default meta
type Story = StoryObj<typeof CompleteLayout>

// Sample content component
const SampleContent = () => (
  <div className="space-y-4">
    <div>
      <Text size="lg">
        This is a sample content area to demonstrate the CompleteLayout component.
      </Text>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div
          key={item}
          className="bg-white p-4 rounded-md shadow-sm border border-neutral-200"
        >
          <Text weight="semibold">Card {item}</Text>
          <Text variant="secondary" size="sm" className="mt-1">
            Sample card content
          </Text>
        </div>
      ))}
    </div>
  </div>
)

// Sample mock user
const mockUser = {
  name: 'John Doe',
  email: 'john.doe@example.com',
}

export const Dashboard: Story = {
  args: {
    pageTitle: 'Dashboard',
    pageSubtitle: 'Welcome to your personalized dashboard',
    user: mockUser,
    activeNavItem: 'dashboard',
    children: <SampleContent />,
  },
  parameters: {
    docs: {
      description: {
        story: 'The default dashboard view showing the complete layout with dashboard as the active navigation item.'
      }
    }
  }
}

export const CallsList: Story = {
  args: {
    pageTitle: 'Call List',
    pageSubtitle: 'Browse and manage your recorded calls',
    pageActions: (
      <>
        <Button variant="outline" size="sm">
          Export
        </Button>
        <Button variant="primary" size="sm">
          Upload New
        </Button>
      </>
    ),
    user: mockUser,
    activeNavItem: 'calls',
    children: <SampleContent />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the layout with the Calls page active and demonstrates page actions in the header.'
      }
    }
  }
}

export const Settings: Story = {
  args: {
    pageTitle: 'Settings',
    pageSubtitle: 'Configure your account and application preferences',
    user: mockUser,
    activeNavItem: 'settings',
    children: <SampleContent />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the layout with the Settings page active.'
      }
    }
  }
}

export const WithAvatar: Story = {
  args: {
    pageTitle: 'Dashboard',
    pageSubtitle: 'Welcome to your personalized dashboard',
    user: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    activeNavItem: 'dashboard',
    children: <SampleContent />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the layout with a user who has an avatar image in the user menu.'
      }
    }
  }
}

export const Interactive = {
  render: () => {
    const [activeNavItem, setActiveNavItem] = useState('dashboard');
    
    const handleNavItemClick = (id: string) => {
      setActiveNavItem(id);
    };
    
    return (
      <CompleteLayout
        pageTitle={activeNavItem.charAt(0).toUpperCase() + activeNavItem.slice(1)}
        pageSubtitle={`This is the ${activeNavItem} page`}
        pageActions={
          activeNavItem === 'calls' && (
            <>
              <Button variant="outline" size="sm">
                Export
              </Button>
              <Button variant="primary" size="sm">
                Upload New
              </Button>
            </>
          )
        }
        user={mockUser}
        activeNavItem={activeNavItem}
        onNavItemClick={handleNavItemClick}
      >
        <div className="p-4">
          <Text size="lg" weight="bold" className="mb-4">
            {activeNavItem.charAt(0).toUpperCase() + activeNavItem.slice(1)} Content
          </Text>
          <Text>
            Click on the navigation items to change pages. This demonstrates the CompleteLayout
            component with interactive navigation.
          </Text>
        </div>
      </CompleteLayout>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'An interactive example that demonstrates real navigation between different sections of the application, with dynamic content and page actions based on the current section.'
      }
    }
  }
}

export const Mobile = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Shows how the layout adapts to mobile screen sizes. The sidebar is hidden by default and can be opened with the menu button in the header.'
      }
    }
  },
  render: () => (
    <CompleteLayout
      pageTitle="Mobile View"
      pageSubtitle="This demonstrates the responsive layout on mobile devices"
      user={mockUser}
      activeNavItem="dashboard"
    >
      <SampleContent />
    </CompleteLayout>
  ),
}

export const Accessibility = {
  render: () => (
    <CompleteLayout
      pageTitle="Accessibility"
      pageSubtitle="This example focuses on accessibility features"
      user={mockUser}
      activeNavItem="dashboard"
    >
      <div className="p-4 space-y-4">
        <Text size="lg" weight="bold">Accessibility Features</Text>
        <ul className="list-disc pl-5 space-y-2">
          <li>Keyboard navigation support for all interactive elements</li>
          <li>Proper ARIA attributes for sidebar and navigation</li>
          <li>Semantic HTML structure with main content area</li>
          <li>Focus management for mobile sidebar</li>
          <li>High contrast text and interactive elements</li>
        </ul>
        <Text>Try navigating this layout using only your keyboard.</Text>
      </div>
    </CompleteLayout>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Highlights the accessibility features of the CompleteLayout component, including keyboard navigation, ARIA attributes, and semantic HTML structure.'
      }
    }
  }
} 