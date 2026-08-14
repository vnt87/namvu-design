#!/bin/bash
set -e

echo "Stopping existing containers..."
docker compose -f deploy/docker-compose.yml down

echo "Building and deploying Docker containers..."
docker compose -f deploy/docker-compose.yml up -d --build

echo "Deployment complete!"
echo "You can check status with: docker compose -f deploy/docker-compose.yml ps"
echo "Logs: docker compose -f deploy/docker-compose.yml logs -f"
