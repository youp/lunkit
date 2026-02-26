#!/bin/bash
set -e

PROJECT_REF="yetuercjsexgfhbvkcmq"

echo "=== Lunkit DB Migration ==="

# Link project (if not already linked)
npx supabase link --project-ref "$PROJECT_REF" 2>/dev/null || true

# Push migrations
echo "Pushing migrations..."
npx supabase db push

echo "=== Done! ==="
