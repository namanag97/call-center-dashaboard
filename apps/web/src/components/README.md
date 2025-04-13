# Component Library

This directory contains all React components used in the Conista call analytics application.

## Directory Structure

- `/ui`: Primitive UI components that form the foundation of the design system
- `/layout`: Layout components for structuring the application
- `/auth`: Authentication-related components
- `/data`: Components for displaying and interacting with call data
- `/upload`: Components related to uploading call recordings
- `/settings`: Components for application settings

## Design Tokens

Our design system is based on the following tokens defined in Tailwind:

### Colors

- **Primary**: Used for primary actions and navigation elements
- **Secondary**: Used for secondary actions and accents
- **Neutral**: Used for text, backgrounds, and borders
- **Feedback Colors**:
  - **Success**: Indicates successful operations (#22c55e)
  - **Warning**: Indicates warnings or caution required (#f59e0b)
  - **Error**: Indicates errors or destructive actions (#ef4444)
  - **Info**: Indicates informational content (#3b82f6)

### Typography

- **Font Families**:
  - `sans`: Inter font for body text
  - `heading`: Montserrat font for headings
  
- **Font Sizes**:
  - `xs` to `5xl` with appropriate line heights

### Spacing

Standard spacing scale following Tailwind defaults, with extensions:
- `72`: 18rem
- `80`: 20rem
- `96`: 24rem
- `128`: 32rem

### Borders & Shadows

- **Border Radius**: `sm`, `default`, `md`, `lg`, `xl`, `2xl`, `full`
- **Box Shadows**: `sm`, `default`, `md`, `lg`, `xl`, `inner`, `none`

### Z-Index

Predefined z-index scale:
- `negative` to `50` for stacking context
- Named values like `dropdown`, `modal`, `tooltip` for common UI elements

### Animations & Transitions

- **Animations**: Predefined animations like `fade-in`, `slide-in`
- **Transition Timing**: Custom easing functions for smoother interactions
- **Transition Durations**: Custom durations for consistent motion

## Component Guidelines

1. **Primitive Components**: All primitive UI components should:
   - Be as simple as possible, focused on a single responsibility
   - Accept standard HTML props plus component-specific props
   - Support appropriate accessibility attributes
   - Include comprehensive Storybook documentation
   - Have proper TypeScript typing

2. **Composition**: Prefer composition over complex single components

3. **State Management**: Keep state as local as possible, lifting it up only when necessary

4. **Testing**:
   - Include basic rendering tests for all components
   - Test interactions for interactive components
   - Test accessibility requirements

## Usage Example

```tsx
import { Button } from '../components/ui/Button';

function MyComponent() {
  return (
    <Button variant="primary" size="md" onClick={() => console.log('Clicked!')}>
      Click Me
    </Button>
  );
}
``` 