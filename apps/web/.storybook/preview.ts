import type { Preview } from '@storybook/react'
import { RouterDecorator } from './decorators/RouterDecorator'
import { MockStoreDecorator } from './decorators/MockStoreDecorator'
import { ThemeDecorator } from './decorators/ThemeDecorator'
import { MSWDecorator } from './decorators/MSWDecorator'
import '../src/index.css'

// Apply all decorators to Storybook
const preview: Preview = {
  decorators: [
    ThemeDecorator,
    RouterDecorator,
    MockStoreDecorator,
    MSWDecorator,
  ],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1440px',
            height: '900px',
          },
        },
      },
    },
  },
};

export default preview;