# Piping Browser Console Logs to Your IDE

This guide provides multiple methods to pipe browser console logs directly into your IDE (Cursor/VS Code) for more efficient web development.

## Table of Contents

1. [VS Code/Cursor Debug Integration](#1-vs-codecursor-debug-integration)
2. [Browser-Sync Method](#2-browser-sync-method)
3. [Vite Plugin Terminal](#3-vite-plugin-terminal)
4. [Custom WebSocket Logger](#4-custom-websocket-logger)
5. [Troubleshooting](#troubleshooting)

## 1. VS Code/Cursor Debug Integration

This method uses the built-in debugging capabilities of VS Code/Cursor with Chrome.

### Setup:

1. Install the required extension:
   ```bash
   code --install-extension msjsdiag.debugger-for-chrome
   ```

2. Create a `.vscode/launch.json` file in your project (already done).

3. Start your development server:
   ```bash
   npm run dev
   ```

4. In VS Code/Cursor, go to the Debug panel (Cmd+Shift+D), select "Launch Chrome against localhost" and click the play button.

5. All console logs will now appear in the Debug Console panel of your IDE.

### Pros:
- Native integration with VS Code/Cursor
- Full access to call stack and variable inspection
- No additional dependencies required

### Cons:
- Requires manual start of debugging session
- Only works with Chrome

## 2. Browser-Sync Method

This method uses Browser-Sync to proxy your development server and capture console logs.

### Setup:

1. Install required dependencies:
   ```bash
   npm install --save-dev browser-sync concurrently
   ```

2. Add the following scripts to your package.json:
   ```json
   "dev:sync": "node browser-sync-setup.js",
   "storybook:sync": "concurrently \"storybook dev -p 6006\" \"node browser-sync-setup.js --port 6007 --proxy http://localhost:6006\""
   ```

3. Run your development server with Browser-Sync:
   ```bash
   npm run dev:sync
   ```

4. For Storybook:
   ```bash
   npm run storybook:sync
   ```

5. Console logs will appear in your terminal and be saved to `logs/browser-console.log`.

### Pros:
- Works with any browser
- Logs are saved to a file for later reference
- Can be used with any development server

### Cons:
- Adds a proxy layer which might affect performance
- Requires additional dependencies

## 3. Vite Plugin Terminal

This method uses a Vite plugin to pipe console logs directly to your terminal.

### Setup:

1. Install the plugin:
   ```bash
   npm install --save-dev vite-plugin-terminal
   ```

2. Use the provided `vite.config.terminal.ts` configuration:
   ```bash
   cp vite.config.terminal.ts vite.config.ts
   ```

3. Start your development server:
   ```bash
   npm run dev
   ```

4. All console logs will appear in your terminal.

### Pros:
- Specifically designed for Vite
- No proxy layer needed
- Minimal configuration

### Cons:
- Only works with Vite
- Doesn't save logs to a file by default

## 4. Custom WebSocket Logger

This method uses a custom WebSocket-based logger for maximum flexibility.

### Setup:

1. Install required dependencies:
   ```bash
   npm install --save-dev ws chalk
   ```

2. Start the WebSocket server in a terminal:
   ```bash
   node ide-log-server.js
   ```

3. Import and use the logger in your application:
   ```typescript
   import logger from './utils/logger';
   
   // Use directly
   logger.info('This is a log message');
   logger.error('This is an error');
   
   // Or let it override console methods automatically
   console.log('This will be sent to the IDE');
   ```

4. All logs will appear in your terminal and be saved to `logs/browser-console.log`.

### Pros:
- Maximum flexibility and customization
- Works with any framework or browser
- Detailed log formatting and filtering options
- Logs are saved to a file

### Cons:
- More complex setup
- Requires running an additional server

## Troubleshooting

### Logs not appearing in the IDE

1. Make sure your development server is running
2. Check that the WebSocket server is running (for methods 2 and 4)
3. Verify that the correct port is being used
4. Check for any errors in the browser console

### WebSocket connection issues

1. Make sure nothing else is using the WebSocket port (default: 3310)
2. Check your firewall settings
3. Try a different port by setting the `LOG_SERVER_PORT` environment variable

### Browser-Sync not working

1. Make sure your development server is running before starting Browser-Sync
2. Check that the proxy URL is correct
3. Try a different port for Browser-Sync

## Recommended Approach

For most projects, the **Vite Plugin Terminal** method (#3) offers the best balance of simplicity and functionality. If you need more advanced features, the **Custom WebSocket Logger** (#4) provides the most flexibility.

For debugging specific issues, the **VS Code/Cursor Debug Integration** (#1) is the most powerful option as it provides full access to the call stack and variable inspection.
