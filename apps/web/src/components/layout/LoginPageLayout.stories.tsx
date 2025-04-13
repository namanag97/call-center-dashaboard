import type { Meta, StoryObj } from '@storybook/react'
import LoginPageLayout from './LoginPageLayout'
import { Input, Button, Text } from '../ui'

const meta: Meta<typeof LoginPageLayout> = {
  component: LoginPageLayout,
  title: 'Layout/LoginPageLayout',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof LoginPageLayout>

const SampleLogo = () => (
  <div className="h-12 w-12 bg-primary-600 rounded-lg flex items-center justify-center">
    <Text as="span" size="xl" weight="bold" className="text-white">
      C
    </Text>
  </div>
)

const SampleLoginForm = () => (
  <form className="space-y-4">
    <div>
      <Input 
        type="email" 
        label="Email" 
        placeholder="your@email.com" 
        isRequired 
      />
    </div>
    <div>
      <Input 
        type="password" 
        label="Password" 
        placeholder="********" 
        isRequired 
      />
    </div>
    <div className="flex items-center justify-between">
      <label className="flex items-center">
        <input type="checkbox" className="h-4 w-4 text-primary-600 rounded" />
        <span className="ml-2 text-sm text-neutral-600">Remember me</span>
      </label>
      <a href="#" className="text-sm text-primary-600 hover:text-primary-700">
        Forgot password?
      </a>
    </div>
    <Button variant="primary" className="w-full mt-6">
      Sign in
    </Button>
  </form>
)

export const Default: Story = {
  args: {
    logo: <SampleLogo />,
    title: 'Welcome Back',
    description: 'Sign in to your account to access your dashboard.',
    children: <SampleLoginForm />,
  },
}

export const WithoutLogo: Story = {
  args: {
    title: 'Sign In',
    description: 'Enter your credentials to continue',
    children: <SampleLoginForm />,
  },
}

export const TitleOnly: Story = {
  args: {
    title: 'Account Login',
    children: <SampleLoginForm />,
  },
}

export const ContentOnly: Story = {
  args: {
    children: <SampleLoginForm />,
  },
}

export const Mobile = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => (
    <LoginPageLayout
      logo={<SampleLogo />}
      title="Mobile Login"
      description="Sign in to continue to your account."
    >
      <SampleLoginForm />
    </LoginPageLayout>
  ),
} 