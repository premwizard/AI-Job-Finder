#!/bin/bash
set -e

echo "Destroying Crown Atlas deployment..."

helm uninstall ai-job-finder || echo "Release not found."

echo "Cleaning up persistent volumes (Optional, uncomment below to delete data)"
# kubectl delete pvc -l app.kubernetes.io/name=ai-job-finder-postgres
# kubectl delete pvc -l app.kubernetes.io/name=ai-job-finder-redis
# kubectl delete pvc -l app.kubernetes.io/name=ai-job-finder-chroma
# kubectl delete pvc -l app.kubernetes.io/name=ai-job-finder-uploads

echo "Cleanup complete."
