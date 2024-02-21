#!/bin/bash

# Check if version argument is provided
if [ $# -ne 1 ]; then
  echo "Usage: $0 <new_version>"
  exit 1
fi

new_version=$1

# Check if package.json exists
if [ ! -f package.json ]; then
  echo "Error: package.json not found in the current directory."
  exit 1
fi

# Replace the version in package.json
sed -i "s/\"version\": \".*\",/\"version\": \"$new_version\",/" package.json

if [ $? -eq 0 ]; then
  echo "Version updated to $new_version"
else
  echo "Error: Failed to update version."
fi
