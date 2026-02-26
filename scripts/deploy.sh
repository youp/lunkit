#!/bin/bash
set -e

echo "=== Lunkit Deploy ==="

# Build check
echo "1. Building..."
npm run build

# Deploy to Vercel
echo "2. Deploying to Vercel..."
npx vercel --prod

echo "=== Deploy complete! ==="
