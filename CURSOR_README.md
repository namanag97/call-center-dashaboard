# Cursor Configuration for Vite and TypeScript Projects

This directory contains configuration files and guides to optimize your Cursor editor (VS Code fork) for Vite and TypeScript development.

## Files Included

1. **cursor-settings.json** - Optimized settings for Cursor
2. **cursor-keybindings.json** - Enhanced keyboard shortcuts
3. **tsconfig.vite-template.json** - TypeScript configuration template for Vite projects
4. **tsconfig.node-template.json** - Node-specific TypeScript configuration
5. **vite.config-template.ts** - Optimized Vite configuration
6. **CURSOR_SETUP_GUIDE.md** - Detailed guide for setting up Cursor
7. **setup-cursor.sh** - Script to automatically apply settings

## Manual Setup Instructions

### 1. Apply Cursor Settings

1. Open Cursor
2. Press `Cmd+Shift+P` to open the Command Palette
3. Type "Preferences: Open Settings (JSON)" and select it
4. Copy the contents from `cursor-settings.json`
5. Paste and save

### 2. Apply Cursor Keybindings

1. Open Cursor
2. Press `Cmd+Shift+P` to open the Command Palette
3. Type "Preferences: Open Keyboard Shortcuts (JSON)" and select it
4. Copy the contents from `cursor-keybindings.json`
5. Paste and save

### 3. Make the Setup Script Executable

```bash
chmod +x setup-cursor.sh
```

### 4. Run the Setup Script

```bash
./setup-cursor.sh
```

This script will:
- Back up your existing Cursor settings
- Apply the optimized settings and keybindings
- Install recommended extensions

## Using the Configuration Templates

### For a New Vite + TypeScript Project

1. Create a new Vite project:
   ```bash
   npm create vite@latest my-app -- --template react-ts
   cd my-app
   ```

2. Copy the TypeScript configuration:
   ```bash
   cp /path/to/tsconfig.vite-template.json ./tsconfig.json
   cp /path/to/tsconfig.node-template.json ./tsconfig.node.json
   ```

3. Copy the Vite configuration:
   ```bash
   cp /path/to/vite.config-template.ts ./vite.config.ts
   ```

4. Install additional dependencies:
   ```bash
   npm install --save-dev rollup-plugin-visualizer
   ```

## Key Features

The provided configuration enhances your development experience with:

1. **Improved Cursor Movement and Editing**
   - Multi-cursor editing
   - Enhanced line manipulation
   - Better selection and navigation

2. **TypeScript-Specific Optimizations**
   - Strict type checking
   - Inlay hints for types
   - Auto-imports and organization

3. **Vite-Specific Enhancements**
   - Path aliases (@/ for src/)
   - Optimized build configuration
   - Development server settings

4. **Visual Improvements**
   - Syntax highlighting
   - Code folding
   - Minimap configuration

5. **AI Features** (Cursor-specific)
   - Code completion
   - AI chat integration
   - Custom AI commands

## For More Information

Please refer to the `CURSOR_SETUP_GUIDE.md` file for detailed instructions and tips on using Cursor effectively with Vite and TypeScript projects.
