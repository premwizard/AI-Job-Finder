# Kubernetes Deployment

This directory contains the production-ready Kubernetes infrastructure for Crown Atlas.

## Architecture

We provide a dual-deployment strategy:
1. **Raw Manifests (`base/`)**: A Kustomize-compatible directory for simple deployments.
2. **Helm Chart (`helm/Crown Atlas/`)**: The recommended standard for parameterized, scalable environments.

## Deployment with Helm

We recommend Helm for all environments. It supports Horizontal Pod Autoscaling, dynamic resources, and secrets management.

### Development Deployment
```bash
./scripts/deploy.sh dev
```

### Production Deployment
```bash
./scripts/deploy.sh prod
```

### Health Check
Ensure your cluster is healthy:
```bash
./scripts/health-check.sh
```

## Secrets Management
The current configuration embeds default secrets in `values.yaml` for structural demonstration. 
**Before deploying to a true production cluster:**
1. Do NOT commit production secrets to Git.
2. Inject secrets during deployment:
   ```bash
   helm upgrade --install Crown Atlas ./helm/Crown Atlas \
       --set postgres.password="SUPER_SECRET" \
       --set redis.password="SUPER_SECRET"
   ```
   Or use external secret operators (like AWS Secrets Manager or HashiCorp Vault).
