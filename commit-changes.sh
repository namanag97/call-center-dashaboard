#!/bin/bash

# Add all changes
git add .

# Commit with a descriptive message
git commit -m "Enhance development environment and testing setup

- Improve Vitest configuration with better coverage settings
- Add comprehensive test utilities and helpers
- Set up API mocking with MSW
- Create example component and API tests
- Add detailed testing documentation
- Update package.json with additional test scripts
- Add terminal customization with Oh My Posh"

# Push to remote repository
git push origin main

echo "Changes committed and pushed to remote repository."
