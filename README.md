# nba-app

## Deploy Helm Hello World to GKE

The workflow `.github/workflows/deploy-helm-hello.yaml` deploys a minimal "hello world" Helm chart to a GKE cluster on push to `main` or when run manually (`workflow_dispatch`).

### Required GitHub Secrets (Settings > Secrets and variables > Actions)

| Secret | Description |
|--------|-------------|
| `GCP_SA_KEY` | GCP service account JSON key (entire key file content). Used for authentication. |
| `GCP_PROJECT_ID` | GCP project ID. |
| `GCP_REGION` | GKE cluster **region** (e.g. `us-central1`). Use for regional clusters. |
| `GKE_CLUSTER_NAME` | GKE cluster name. |
| `HELM_NAMESPACE` | Kubernetes namespace for the Helm release (e.g. `default` or `hello-world`). Created if it does not exist. |

### Optional (for zonal clusters)

| Secret | Description |
|--------|-------------|
| `GCP_ZONE` | GKE cluster **zone** (e.g. `us-central1-a`). If set, the workflow uses `--zone` instead of `--region` for `get-credentials`. Leave `GCP_REGION` set to any value if you use region. |

### Alternative: Workload Identity Federation

Instead of `GCP_SA_KEY`, you can use Workload Identity Federation: configure `GCP_WORKLOAD_IDENTITY_PROVIDER` and `GCP_SERVICE_ACCOUNT` and change the "Authenticate to Google Cloud" step to use `workload_identity_provider` and `service_account` (see [google-github-actions/auth](https://github.com/google-github-actions/auth)).

