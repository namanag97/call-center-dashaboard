# UI Components

This directory contains the primitive UI components that are used throughout the application. These components are built with Tailwind CSS and follow a consistent design language.

## Component List

- `Button`: A versatile button component with multiple variants and states
- More components to be added as needed

## Usage

Import components from the UI directory:

```tsx
import { Button } from './components/ui';

const MyComponent = () => (
  <div>
    <Button variant="primary">Click Me</Button>
  </div>
);
```

Each component is designed to be fully typed with TypeScript and includes appropriate props for customization. 