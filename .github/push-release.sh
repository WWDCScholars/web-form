#!/bin/sh

# Get version (current tag)
VERSION=`git describe --tags`

# Push (current tag)
git push origin $VERSION
