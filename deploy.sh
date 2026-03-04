#!/usr/bin/env sh
set -e

cd "$(dirname "$0")"

if [ -z "$(git status --porcelain)" ]; then
  echo "No changes to deploy."
  exit 0
fi

git add .

git commit -m "Update"

git push

echo "Deployed. GitHub Pages will update shortly."
