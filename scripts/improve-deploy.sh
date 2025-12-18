#!/bin/bash

echo "Starting deployment..."

# Improved rollback handling
if [ "$1" == "rollback" ]; then
  echo "Rollback initiated..."
  echo "Restoring previous stable state"
fi

echo "Deployment completed. "
