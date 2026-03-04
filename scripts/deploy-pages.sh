#!/usr/bin/env sh
set -e

cd "$(dirname "$0")/.."

npm run build

# Publish dist to gh-pages branch
TEMP_DIR=$(mktemp -d)
cp -R dist/* "$TEMP_DIR/"

git checkout --orphan gh-pages

git rm -rf . >/dev/null 2>&1 || true
cp -R "$TEMP_DIR"/* .
rm -rf "$TEMP_DIR"

git add .

git commit -m "Deploy to GitHub Pages"

git push -f origin gh-pages

git checkout main

echo "Deployed dist/ to gh-pages."
