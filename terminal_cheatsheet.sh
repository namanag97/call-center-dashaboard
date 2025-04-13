#!/bin/bash
# Terminal Cheatsheet - Quick Reference
# Run this script to display a quick reference of terminal commands

# Colors
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Header
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                 ${GREEN}TERMINAL QUICK REFERENCE${BLUE}                  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Modern CLI Tools
echo -e "${GREEN}MODERN CLI TOOLS${NC}"
echo -e "${YELLOW}cat <file>${NC} - View file with syntax highlighting"
echo -e "${YELLOW}ls, ll, la${NC} - List files (with icons and git status)"
echo -e "${YELLOW}lt, lta${NC} - Show directory tree"
echo -e "${YELLOW}find <pattern>${NC} - Find files (using fd)"
echo -e "${YELLOW}grep <pattern>${NC} - Search in files (using ripgrep)"
echo -e "${YELLOW}top${NC} - Process viewer (using htop)"
echo -e "${YELLOW}ping <host>${NC} - Ping with visual output"
echo -e "${YELLOW}help <command>${NC} - Show simplified help"
echo ""

# Git Commands
echo -e "${GREEN}GIT COMMANDS${NC}"
echo -e "${YELLOW}gs${NC} - Git status"
echo -e "${YELLOW}ga <file>${NC} - Git add"
echo -e "${YELLOW}gc -m \"msg\"${NC} - Git commit"
echo -e "${YELLOW}gp${NC} - Git push"
echo -e "${YELLOW}gl${NC} - Git pull"
echo -e "${YELLOW}gd${NC} - Git diff"
echo -e "${YELLOW}gco <branch>${NC} - Git checkout"
echo -e "${YELLOW}gb${NC} - List branches"
echo -e "${YELLOW}gca \"msg\"${NC} - Add all & commit"
echo -e "${YELLOW}gcp \"msg\"${NC} - Add, commit & push"
echo -e "${YELLOW}gcb <name>${NC} - Create & checkout branch"
echo ""

# Directory Navigation
echo -e "${GREEN}DIRECTORY NAVIGATION${NC}"
echo -e "${YELLOW}..${NC} - Up one directory"
echo -e "${YELLOW}...${NC} - Up two directories"
echo -e "${YELLOW}~${NC} - Home directory"
echo -e "${YELLOW}-${NC} - Previous directory"
echo -e "${YELLOW}mkd <dir>${NC} - Create & enter directory"
echo ""

# Node.js & Python
echo -e "${GREEN}NODE.JS & PYTHON${NC}"
echo -e "${YELLOW}ni, nid, nig${NC} - npm install (dev/global)"
echo -e "${YELLOW}ns, nt, nr${NC} - npm start/test/run"
echo -e "${YELLOW}py, py3${NC} - python/python3"
echo -e "${YELLOW}ve, va, vd${NC} - Create/activate/deactivate venv"
echo ""

# Docker
echo -e "${GREEN}DOCKER${NC}"
echo -e "${YELLOW}dc, dcu, dcd${NC} - docker-compose (up/down)"
echo -e "${YELLOW}dps${NC} - docker ps"
echo ""

# Utility Functions
echo -e "${GREEN}UTILITY FUNCTIONS${NC}"
echo -e "${YELLOW}sep \"text\"${NC} - Display separator"
echo -e "${YELLOW}reload${NC} - Reload zsh config"
echo -e "${YELLOW}code.${NC} - Open in VS Code"
echo -e "${YELLOW}init-project <name>${NC} - Init new project"
echo -e "${YELLOW}create-react-app <name>${NC} - New React project"
echo -e "${YELLOW}create-next-app <name>${NC} - New Next.js project"
echo -e "${YELLOW}create-node-app <name>${NC} - New Node.js project"
echo ""

# FZF
echo -e "${GREEN}FUZZY FINDER (FZF)${NC}"
echo -e "${YELLOW}Ctrl+T${NC} - Paste selected files"
echo -e "${YELLOW}Ctrl+R${NC} - Search command history"
echo -e "${YELLOW}Alt+C${NC} - CD into selected directory"
echo ""

# Footer
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  ${PURPLE}For full documentation: cat ~/Documents/augment-projects/call/TERMINAL_GUIDE.md${BLUE}  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
