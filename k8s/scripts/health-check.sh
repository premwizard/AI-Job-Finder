#!/bin/bash
set -e

echo "Checking health of AI Job Finder cluster..."

kubectl get pods -l app.kubernetes.io/instance=ai-job-finder

echo ""
echo "Fetching backend health endpoint..."
# Wait for backend to be ready
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=ai-job-finder-backend --timeout=60s || echo "Backend not ready yet."

BACKEND_POD=$(kubectl get pod -l app.kubernetes.io/name=ai-job-finder-backend -o jsonpath="{.items[0].metadata.name}")

if [ ! -z "$BACKEND_POD" ]; then
    kubectl exec $BACKEND_POD -- curl -s http://localhost:8000/api/v1/health | grep -o '"status":"ok"' || echo "Backend healthcheck failed."
fi
