#!/bin/bash
set -e

echo "Stopping existing containers..."
docker compose down

echo "Building and deploying Docker containers..."
docker compose up -d --build

echo "Deployment complete!"
echo "You can check status with: docker compose ps"
echo "Logs: docker compose logs -f"
