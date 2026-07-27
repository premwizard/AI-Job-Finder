#!/bin/bash
set -e

echo "Deploying Crown Atlas via Helm..."

# Ensure we are in the scripts directory context
cd "$(dirname "$0")/.."

ENVIRONMENT=${1:-dev}

if [ "$ENVIRONMENT" == "prod" ]; then
    echo "Using Production Values..."
    helm upgrade --install ai-job-finder ./helm/ai-job-finder -f ./helm/ai-job-finder/values.yaml -f ./helm/ai-job-finder/values-prod.yaml
else
    echo "Using Development Values..."
    helm upgrade --install ai-job-finder ./helm/ai-job-finder -f ./helm/ai-job-finder/values.yaml
fi

echo "Deployment submitted successfully!"
