#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Browser Logs to IDE Setup ===${NC}"
echo -e "${BLUE}This script will set up tools to pipe browser console logs to your IDE.${NC}"
echo ""

# Create necessary directories
mkdir -p logs
mkdir -p .vscode
mkdir -p src/utils

echo -e "${GREEN}Created necessary directories${NC}"

# Install dependencies
echo -e "${BLUE}Installing dependencies...${NC}"
npm install --save-dev browser-sync concurrently ws chalk vite-plugin-terminal

echo -e "${GREEN}Dependencies installed!${NC}"

# Make sure the WebSocket server is executable
chmod +x ide-log-server.js

echo -e "${YELLOW}Setup complete! Here's how to use the different methods:${NC}"
echo ""
echo -e "${GREEN}1. VS Code/Cursor Debug Integration:${NC}"
echo "   - Start your dev server: npm run dev"
echo "   - Go to Debug panel in VS Code/Cursor"
echo "   - Select 'Launch Chrome against localhost' and click play"
echo ""
echo -e "${GREEN}2. Browser-Sync Method:${NC}"
echo "   - Run: npm run dev:sync"
echo "   - For Storybook: npm run storybook:sync"
echo ""
echo -e "${GREEN}3. Vite Plugin Terminal:${NC}"
echo "   - Copy the config: cp vite.config.terminal.ts vite.config.ts"
echo "   - Run: npm run dev"
echo ""
echo -e "${GREEN}4. Custom WebSocket Logger:${NC}"
echo "   - Start the WebSocket server: node ide-log-server.js"
echo "   - Import the logger in your code: import logger from './utils/logger'"
echo ""
echo -e "${BLUE}For detailed instructions, see BROWSER_LOGS_TO_IDE.md${NC}"
