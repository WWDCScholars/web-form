#!/bin/sh
# Add node_modules/.bin to PATH
PATH=$PATH:node_modules/.bin

# Bump version, update CHANGELOG, etc.
standard-version

# Get version (current tag)
VERSION=`git describe --tags`

# Push (current tag)
git push origin $VERSION
