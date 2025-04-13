#!/bin/bash

# Build shared types first
echo "Building shared types..."
cd packages/shared-types
bun run build
cd ../..

# Run the web app
echo "Starting web app..."
cd apps/web
bun run dev