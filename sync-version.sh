#!/bin/bash
# Script to sync version from package.json to version.ts

VERSION=$(node -p "require('./package.json').version")

# Update version.ts
sed -i.bak "s/export const APP_VERSION = '.*';/export const APP_VERSION = '$VERSION';/" src/lib/version.ts

rm -f src/lib/version.ts.bak

echo "✅ Synced version to $VERSION"
