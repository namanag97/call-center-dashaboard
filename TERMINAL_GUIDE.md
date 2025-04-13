# Developer Terminal Quick Reference Guide

This guide provides a quick reference for all the tools and shortcuts available in your enhanced terminal setup.

## Table of Contents
- [Theme & Prompt](#theme--prompt)
- [Modern CLI Tools](#modern-cli-tools)
- [Git Commands](#git-commands)
- [Directory Navigation](#directory-navigation)
- [Node.js Shortcuts](#nodejs-shortcuts)
- [Python Shortcuts](#python-shortcuts)
- [Docker Shortcuts](#docker-shortcuts)
- [Utility Functions](#utility-functions)
- [Project Creation](#project-creation)
- [File Operations](#file-operations)
- [Search & Find](#search--find)
- [Fuzzy Finder (FZF)](#fuzzy-finder-fzf)

## Theme & Prompt

Your terminal uses **Powerlevel10k** theme which shows:
- Current Git branch and status
- Command execution time
- Python virtual environments
- Node.js version
- Current directory

**Customization:**
```bash
p10k configure  # Run the configuration wizard
```

## Modern CLI Tools

### Improved File Viewing
| Command | Description |
|---------|-------------|
| `cat <file>` | View file with syntax highlighting (using `bat`) |
| `ls` | List files with icons (using `eza`) |
| `ll` | List files in long format with Git status |
| `la` | List all files (including hidden) with Git status |
| `lt` | Show directory tree |
| `lta` | Show directory tree with hidden files |

### Search & Find
| Command | Description |
|---------|-------------|
| `find <pattern>` | Find files (using `fd`) |
| `grep <pattern>` | Search for pattern in files (using `ripgrep`) |
| `rg <pattern>` | Directly use ripgrep for searching |

### System Monitoring
| Command | Description |
|---------|-------------|
| `top` | Interactive process viewer (using `htop`) |
| `ping <host>` | Ping with visual output (using `prettyping`) |

### Other Tools
| Command | Description |
|---------|-------------|
| `help <command>` | Show simplified help (using `tldr`) |
| `jq` | Process JSON data |
| `http` | Make HTTP requests (using `httpie`) |

## Git Commands

### Basic Git
| Command | Description |
|---------|-------------|
| `gs` | Git status |
| `ga <file>` | Git add file |
| `gc -m "message"` | Git commit with message |
| `gp` | Git push |
| `gl` | Git pull |
| `gd` | Git diff (with improved formatting) |
| `gco <branch>` | Git checkout branch |
| `gb` | List branches |
| `glog` | Git log with graph |

### Advanced Git
| Command | Description |
|---------|-------------|
| `gca "message"` | Git add all and commit |
| `gcp "message"` | Git add all, commit, and push |
| `gcb <name>` | Create and checkout new branch |
| `gclean` | Remove merged branches |

## Directory Navigation

| Command | Description |
|---------|-------------|
| `..` | Go up one directory |
| `...` | Go up two directories |
| `....` | Go up three directories |
| `.....` | Go up four directories |
| `~` | Go to home directory |
| `-` | Go to previous directory |
| `mkd <dir>` | Create directory and enter it |

## Node.js Shortcuts

| Command | Description |
|---------|-------------|
| `ni` | npm install |
| `nid <pkg>` | npm install --save-dev |
| `nig <pkg>` | npm install -g |
| `ns` | npm start |
| `nt` | npm test |
| `nr <script>` | npm run script |
| `nrb` | npm run build |
| `nrd` | npm run dev |

## Python Shortcuts

| Command | Description |
|---------|-------------|
| `py` | python |
| `py3` | python3 |
| `pip` | pip3 |
| `ve` | Create virtual environment |
| `va` | Activate virtual environment |
| `vd` | Deactivate virtual environment |

## Docker Shortcuts

| Command | Description |
|---------|-------------|
| `dc` | docker-compose |
| `dcu` | docker-compose up |
| `dcd` | docker-compose down |
| `dcr` | docker-compose restart |
| `dps` | docker ps |

## Utility Functions

| Command | Description |
|---------|-------------|
| `sep "text"` | Display a separator with text |
| `reload` | Reload zsh configuration |
| `show` | Show hidden files in Finder |
| `hide` | Hide hidden files in Finder |
| `c` | Clear terminal |
| `h` | Show history |
| `j` | List jobs |
| `path` | Show PATH entries one per line |
| `now` | Show current time |
| `nowdate` | Show current date |
| `ports` | Show open ports |
| `ip` | Show public IP address |
| `weather` | Show weather forecast |

## Project Creation

| Command | Description |
|---------|-------------|
| `init-project <name>` | Initialize a new project directory with Git |
| `create-react-app <name>` | Create a new React project |
| `create-next-app <name>` | Create a new Next.js project |
| `create-node-app <name>` | Create a new Node.js project |

## File Operations

| Command | Description |
|---------|-------------|
| `code.` | Open current directory in VS Code |
| `copypath` | Copy the current directory path to clipboard |
| `copyfile <file>` | Copy file contents to clipboard |
| `extract <archive>` | Extract any archive file |

## Search & Find

### Ripgrep (rg)
```bash
rg "pattern"                # Search for pattern
rg -i "pattern"             # Case-insensitive search
rg -w "word"                # Search for whole words only
rg "pattern" --type=js      # Search only JavaScript files
rg "pattern" -g "*.{js,ts}" # Search only in specific file types
```

### FD (find)
```bash
fd pattern                  # Find files matching pattern
fd -e js                    # Find files with .js extension
fd -t d pattern             # Find directories matching pattern
fd -H pattern               # Include hidden files
```

## Fuzzy Finder (FZF)

| Shortcut | Description |
|----------|-------------|
| `Ctrl+T` | Paste selected files/folders onto command line |
| `Ctrl+R` | Search command history |
| `Alt+C` | CD into selected directory |

**FZF Search Syntax:**
```
^word    # Match line beginning with "word"
word$    # Match line ending with "word"
'word    # Exact match of "word"
!word    # Lines not containing "word"
```

## Tips & Tricks

1. **Tab Completion**: Press Tab to auto-complete commands, file paths, and options

2. **Command History**: 
   - Press Up/Down arrows to navigate through history
   - Type part of a command and press Up/Down to search history for matching commands

3. **Directory History**:
   - Press Alt+Left/Right to navigate directory history

4. **Command Editing**:
   - Ctrl+A: Move cursor to beginning of line
   - Ctrl+E: Move cursor to end of line
   - Ctrl+W: Delete word before cursor
   - Ctrl+K: Delete from cursor to end of line
   - Ctrl+U: Delete from cursor to beginning of line

5. **Auto-suggestions**: As you type, you'll see suggestions from your history in gray. Press right arrow to accept.

6. **Syntax Highlighting**: Commands are colored based on validity and type.

7. **Git Integration**: The prompt shows Git information automatically.

---

To update this guide in the future, edit the file at:
`~/Documents/augment-projects/call/TERMINAL_GUIDE.md`
