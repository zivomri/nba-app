# nba-app

## Deploy to GKE (Workload Identity Federation)

The workflow `.github/workflows/deploy-gke.yml` deploys a minimal "hello world" Helm chart to a GKE cluster on push to `main` or when run manually (`workflow_dispatch`). It uses **Workload Identity Federation** only (no service account keys).

### Required GitHub Secrets (Settings > Secrets and variables > Actions)

| Secret | Description |
|--------|-------------|
| `GCP_PROJECT_ID` | GCP project ID. |
| `GCP_REGION` | GKE cluster region (e.g. `us-central1`). For zonal clusters, optional if `GCP_ZONE` is set. |
| `GKE_CLUSTER_NAME` | GKE cluster name. |
| `HELM_NAMESPACE` | Kubernetes namespace for the Helm release (e.g. `default` or `hello-world`). Created if it does not exist. |
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | Full Workload Identity Federation provider resource name, e.g. `projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/POOL_NAME/providers/PROVIDER_NAME`. |
| `GCP_SERVICE_ACCOUNT` | GCP service account email used for the federation (e.g. `my-sa@my-project.iam.gserviceaccount.com`). |

### Optional (zonal clusters)

| Secret | Description |
|--------|-------------|
| `GCP_ZONE` | GKE cluster zone (e.g. `us-central1-a`). If set, the workflow uses `--zone` instead of `--region` for `get-credentials`. |

