#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Cursor Setup for Vite and TypeScript Projects ===${NC}"
echo -e "${BLUE}This script will set up Cursor with optimal settings for Vite and TypeScript development.${NC}"
echo ""

# Check if Cursor is installed
if ! command -v cursor &> /dev/null; then
    echo -e "${RED}Cursor is not installed or not in PATH.${NC}"
    echo -e "${RED}Please install Cursor from https://cursor.sh/ and try again.${NC}"
    exit 1
fi

echo -e "${BLUE}Cursor is installed. Proceeding with setup...${NC}"
echo ""

# Define paths
CURSOR_SETTINGS_DIR="$HOME/Library/Application Support/Cursor/User"
CURSOR_SETTINGS_FILE="$CURSOR_SETTINGS_DIR/settings.json"
CURSOR_KEYBINDINGS_FILE="$CURSOR_SETTINGS_DIR/keybindings.json"
BACKUP_SUFFIX=".backup-$(date +%Y%m%d%H%M%S)"

# Create backup of existing settings
if [ -f "$CURSOR_SETTINGS_FILE" ]; then
    echo -e "${BLUE}Creating backup of existing settings...${NC}"
    cp "$CURSOR_SETTINGS_FILE" "$CURSOR_SETTINGS_FILE$BACKUP_SUFFIX"
    echo -e "${GREEN}Backup created at $CURSOR_SETTINGS_FILE$BACKUP_SUFFIX${NC}"
fi

# Create backup of existing keybindings
if [ -f "$CURSOR_KEYBINDINGS_FILE" ]; then
    echo -e "${BLUE}Creating backup of existing keybindings...${NC}"
    cp "$CURSOR_KEYBINDINGS_FILE" "$CURSOR_KEYBINDINGS_FILE$BACKUP_SUFFIX"
    echo -e "${GREEN}Backup created at $CURSOR_KEYBINDINGS_FILE$BACKUP_SUFFIX${NC}"
fi

# Copy settings
echo -e "${BLUE}Applying custom settings...${NC}"
mkdir -p "$CURSOR_SETTINGS_DIR"
cp "$(dirname "$0")/cursor-settings.json" "$CURSOR_SETTINGS_FILE"

# Copy keybindings
echo -e "${BLUE}Applying custom keybindings...${NC}"
cp "$(dirname "$0")/cursor-keybindings.json" "$CURSOR_KEYBINDINGS_FILE"

echo -e "${GREEN}Settings and keybindings applied successfully!${NC}"
echo ""

# Install recommended extensions
echo -e "${BLUE}Installing recommended extensions...${NC}"
echo -e "${BLUE}This may take a few minutes...${NC}"

extensions=(
    "dbaeumer.vscode-eslint"
    "esbenp.prettier-vscode"
    "mattpocock.ts-error-translator"
    "wix.vscode-import-cost"
    "christian-kohler.path-intellisense"
    "pkief.material-icon-theme"
    "zhuangtongfa.material-theme"
    "eamodio.gitlens"
    "bradlc.vscode-tailwindcss"
    "antfu.vite"
)

for extension in "${extensions[@]}"; do
    echo -e "${BLUE}Installing $extension...${NC}"
    cursor --install-extension "$extension" || echo -e "${RED}Failed to install $extension. Continuing...${NC}"
done

echo -e "${GREEN}Extensions installed!${NC}"
echo ""

echo -e "${BLUE}Setup complete!${NC}"
echo -e "${BLUE}Please restart Cursor to apply all changes.${NC}"
echo -e "${BLUE}For more information, see the CURSOR_SETUP_GUIDE.md file.${NC}"
echo ""
echo -e "${GREEN}Happy coding!${NC}"
