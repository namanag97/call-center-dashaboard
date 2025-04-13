# Cursor Setup Guide for Vite and TypeScript Projects

This guide will help you set up Cursor (VS Code fork) for optimal development experience with Vite and TypeScript projects.

## Table of Contents

- [Installation of Required Extensions](#installation-of-required-extensions)
- [Applying Custom Settings](#applying-custom-settings)
- [Applying Custom Keybindings](#applying-custom-keybindings)
- [Setting Up a New Vite + TypeScript Project](#setting-up-a-new-vite--typescript-project)
- [Cursor Movement and Editing Tips](#cursor-movement-and-editing-tips)
- [TypeScript-Specific Features](#typescript-specific-features)
- [Vite-Specific Features](#vite-specific-features)
- [AI Features in Cursor](#ai-features-in-cursor)

## Installation of Required Extensions

Install these essential extensions for Vite and TypeScript development:

1. **ESLint** - JavaScript/TypeScript linter
   - ID: `dbaeumer.vscode-eslint`

2. **Prettier** - Code formatter
   - ID: `esbenp.prettier-vscode`

3. **TypeScript Error Translator** - Explains TypeScript errors in plain English
   - ID: `mattpocock.ts-error-translator`

4. **Import Cost** - Display import package size
   - ID: `wix.vscode-import-cost`

5. **Path Intellisense** - Autocompletes filenames
   - ID: `christian-kohler.path-intellisense`

6. **Material Icon Theme** - File icons
   - ID: `pkief.material-icon-theme`

7. **One Dark Pro** - Theme
   - ID: `zhuangtongfa.material-theme`

8. **GitLens** - Git supercharged
   - ID: `eamodio.gitlens`

9. **Tailwind CSS IntelliSense** (if using Tailwind)
   - ID: `bradlc.vscode-tailwindcss`

10. **Vite** - Syntax highlighting for Vite config files
    - ID: `antfu.vite`

To install these extensions, you can:

1. Open Cursor
2. Press `Cmd+Shift+X` to open the Extensions view
3. Search for each extension by name or ID
4. Click "Install"

Alternatively, you can use the command line:

```bash
cursor --install-extension dbaeumer.vscode-eslint
cursor --install-extension esbenp.prettier-vscode
# ... and so on for each extension
```

## Applying Custom Settings

1. Open Cursor
2. Press `Cmd+Shift+P` to open the Command Palette
3. Type "Preferences: Open Settings (JSON)" and select it
4. Copy the contents from `cursor-settings.json` in this directory
5. Paste and save

Alternatively, you can directly edit the settings file:

```bash
# For macOS
open -a "Cursor" ~/Library/Application\ Support/Cursor/User/settings.json
```

## Applying Custom Keybindings

1. Open Cursor
2. Press `Cmd+Shift+P` to open the Command Palette
3. Type "Preferences: Open Keyboard Shortcuts (JSON)" and select it
4. Copy the contents from `cursor-keybindings.json` in this directory
5. Paste and save

## Setting Up a New Vite + TypeScript Project

### Creating a new project

```bash
# Create a new Vite project with React and TypeScript
npm create vite@latest my-app -- --template react-ts

# Navigate to the project directory
cd my-app

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Optimizing TypeScript Configuration

1. Copy the `tsconfig.vite-template.json` from this directory
2. Rename it to `tsconfig.json` in your project root
3. Copy the `tsconfig.node-template.json` from this directory
4. Rename it to `tsconfig.node.json` in your project root

### Optimizing Vite Configuration

1. Copy the `vite.config-template.ts` from this directory
2. Rename it to `vite.config.ts` in your project root
3. Install required dependencies:

```bash
npm install --save-dev rollup-plugin-visualizer
```

## Cursor Movement and Editing Tips

### Multi-Cursor Editing

- `Alt+Click`: Add cursor at click position
- `Alt+D`: Add cursor at next occurrence of selection
- `Alt+Shift+I`: Add cursor at the end of each selected line
- `Alt+Shift+Up/Down`: Add cursor above/below

### Line Manipulation

- `Alt+Up/Down`: Move line up/down
- `Alt+Shift+Up/Down`: Copy line up/down
- `Cmd+Shift+K`: Delete line
- `Cmd+Enter`: Insert line below
- `Cmd+Shift+Enter`: Insert line above

### Selection and Navigation

- `Cmd+D`: Select all occurrences of current selection
- `Alt+Left/Right`: Move cursor by word
- `Alt+Shift+Left/Right`: Select by word
- `Cmd+[/]`: Indent/outdent line

### Code Folding

- `Alt+Cmd+[/]`: Fold/unfold region
- `Cmd+K Cmd+0`: Fold all
- `Cmd+K Cmd+J`: Unfold all

## TypeScript-Specific Features

### Type Checking

- Hover over variables to see their types
- Red squiggly lines indicate type errors
- Use the Problems panel (`Cmd+Shift+M`) to see all errors

### Navigation

- `F12`: Go to definition
- `Alt+F12`: Peek definition
- `Shift+F12`: Find all references

### Refactoring

- `Alt+Shift+R`: Rename symbol
- `Alt+Shift+O`: Organize imports
- `Alt+Shift+F`: Format document

## Vite-Specific Features

### Fast Refresh

Vite provides fast refresh out of the box, which means your changes are reflected immediately without losing component state.

### Import Aliases

The provided configuration sets up `@/` as an alias to the `src/` directory:

```typescript
// Instead of
import Button from '../../components/Button';

// You can use
import Button from '@/components/Button';
```

### Environment Variables

Create a `.env` file in your project root:

```
VITE_API_URL=https://api.example.com
```

Access it in your code:

```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

## AI Features in Cursor

Cursor enhances VS Code with AI capabilities:

- `Alt+\`: Open the AI chat panel
- `Alt+Enter`: Accept AI suggestion
- Use `/` commands in the chat panel for specific actions

### Useful AI Commands

- `/explain`: Explain the selected code
- `/refactor`: Refactor the selected code
- `/test`: Generate tests for the selected code
- `/docs`: Generate documentation for the selected code

## Additional Resources

- [Vite Documentation](https://vitejs.dev/guide/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Cursor Documentation](https://cursor.sh/docs)

---

This guide was created to help you set up Cursor for optimal development experience with Vite and TypeScript projects. If you have any questions or suggestions, please feel free to reach out.
