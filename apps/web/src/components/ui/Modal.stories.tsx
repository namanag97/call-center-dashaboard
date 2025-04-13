import React, { useState, useRef } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import Modal from './Modal'
import Button from './Button'
import Text from './Text'

const meta: Meta<typeof Modal> = {
  component: Modal,
  title: 'UI/Modal',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Modal>

// Helper component for controlled modals in stories
const ControlledModal = ({ 
  children, 
  buttonText = 'Open Modal',
  ...props 
}: React.PropsWithChildren<{ buttonText?: string } & Partial<React.ComponentProps<typeof Modal>>>) => {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>{buttonText}</Button>
      <Modal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        {...props}
      >
        {children}
      </Modal>
    </div>
  )
}

export const Default: Story = {
  render: () => (
    <ControlledModal title="Sample Modal">
      <Text>This is a basic modal with a title and default styling.</Text>
    </ControlledModal>
  ),
}

export const WithFooter: Story = {
  render: () => (
    <ControlledModal 
      title="Confirmation"
      footer={
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => {}}>Cancel</Button>
          <Button onClick={() => {}}>Confirm</Button>
        </div>
      }
    >
      <Text>Are you sure you want to perform this action?</Text>
    </ControlledModal>
  ),
}

export const LargeSize: Story = {
  render: () => (
    <ControlledModal 
      title="Large Modal" 
      size="lg"
      buttonText="Open Large Modal"
    >
      <div className="space-y-4">
        <Text>This is a larger modal that provides more space for content.</Text>
        <Text>It's useful when you need to display more information or complex forms.</Text>
        <div className="h-40 bg-neutral-100 rounded flex items-center justify-center">
          <Text variant="secondary">Additional content area</Text>
        </div>
      </div>
    </ControlledModal>
  ),
}

export const SmallSize: Story = {
  render: () => (
    <ControlledModal 
      title="Small Modal" 
      size="sm"
      buttonText="Open Small Modal"
    >
      <Text>A compact modal for simple messages.</Text>
    </ControlledModal>
  ),
}

export const FullScreen: Story = {
  render: () => (
    <ControlledModal 
      title="Full-width Modal" 
      size="full"
      buttonText="Open Full-width Modal"
    >
      <div className="space-y-4">
        <Text>This modal takes up the full width of the screen (with small margins).</Text>
        <div className="h-40 bg-neutral-100 rounded flex items-center justify-center">
          <Text variant="secondary">Full-width content area</Text>
        </div>
      </div>
    </ControlledModal>
  ),
}

export const WithInitialFocus: Story = {
  render: () => {
    // Component with ref for demo purposes
    function WithFocusRef() {
      const inputRef = useRef<HTMLInputElement>(null)
      const [isOpen, setIsOpen] = useState(false)
      
      return (
        <div>
          <Button onClick={() => setIsOpen(true)}>Open with Auto Focus</Button>
          <Modal 
            isOpen={isOpen} 
            onClose={() => setIsOpen(false)}
            title="Focused Input"
            initialFocusRef={inputRef}
            footer={
              <div className="flex justify-end">
                <Button onClick={() => setIsOpen(false)}>Close</Button>
              </div>
            }
          >
            <div className="space-y-4">
              <Text>This input will receive focus when the modal opens:</Text>
              <input
                ref={inputRef}
                type="text"
                className="w-full p-2 border border-neutral-300 rounded-md"
                placeholder="This will be focused"
              />
              <Text variant="secondary">Try closing with ESC key</Text>
            </div>
          </Modal>
        </div>
      )
    }
    
    return <WithFocusRef />
  },
}

export const NestedModals: Story = {
  render: () => {
    // Component with nested modals for demo purposes
    function NestedModalExample() {
      const [isFirstOpen, setIsFirstOpen] = useState(false)
      const [isSecondOpen, setIsSecondOpen] = useState(false)
      
      return (
        <div>
          <Button onClick={() => setIsFirstOpen(true)}>Open First Modal</Button>
          
          <Modal 
            isOpen={isFirstOpen} 
            onClose={() => setIsFirstOpen(false)}
            title="First Modal"
          >
            <div className="space-y-4">
              <Text>This is the first modal. You can open another modal from here:</Text>
              <Button onClick={() => setIsSecondOpen(true)}>Open Second Modal</Button>
            </div>
            
            <Modal
              isOpen={isSecondOpen}
              onClose={() => setIsSecondOpen(false)}
              title="Second Modal"
            >
              <Text>This is a nested modal. Close me first!</Text>
            </Modal>
          </Modal>
        </div>
      )
    }
    
    return <NestedModalExample />
  },
}

export const WithCustomStyling: Story = {
  render: () => (
    <ControlledModal
      buttonText="Custom Styled Modal"
      title="Custom Styling"
      contentClassName="bg-neutral-50 border-2 border-primary-500"
      headerClassName="bg-primary-100"
      bodyClassName="bg-white rounded-md m-2 p-4 shadow-sm"
      footerClassName="bg-primary-50"
      footer={<Button size="sm">Action</Button>}
    >
      <Text>
        This modal has custom styling applied to different sections.
      </Text>
    </ControlledModal>
  ),
} 