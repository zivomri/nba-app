# nba-app

## Deploy Helm Hello World to GKE

The workflow `.github/workflows/deploy-helm-hello.yaml` deploys a minimal "hello world" Helm chart to a GKE cluster on push to `main` or when run manually (`workflow_dispatch`).

### Required GitHub Secrets (Settings > Secrets and variables > Actions)

| Secret | Description |
|--------|-------------|
| `GCP_SA_KEY` | GCP service account JSON key. Paste the **entire** key file as-is, or base64-encode it first (`base64 -i key.json`) and paste the result to avoid newline/encoding issues. |
| `GCP_PROJECT_ID` | GCP project ID. |
| `GCP_REGION` | GKE cluster **region** (e.g. `us-central1`). Use for regional clusters. |
| `GKE_CLUSTER_NAME` | GKE cluster name. |
| `HELM_NAMESPACE` | Kubernetes namespace for the Helm release (e.g. `default` or `hello-world`). Created if it does not exist. |

### Optional (for zonal clusters)

| Secret | Description |
|--------|-------------|
| `GCP_ZONE` | GKE cluster **zone** (e.g. `us-central1-a`). If set, the workflow uses `--zone` instead of `--region` for `get-credentials`. Leave `GCP_REGION` set to any value if you use region. |

### Deploy to GKE with Workload Identity Federation (no keys)

The workflow `.github/workflows/deploy-gke.yml` deploys the same Helm chart using **Workload Identity Federation** only (no service account JSON keys). Use this for keyless, federated auth.

#### Required GitHub Secrets for WIF workflow

| Secret | Description |
|--------|-------------|
| `GCP_PROJECT_ID` | GCP project ID. |
| `GCP_REGION` | GKE cluster region (e.g. `us-central1`). For zonal clusters, optional if `GCP_ZONE` is set. |
| `GKE_CLUSTER_NAME` | GKE cluster name. |
| `HELM_NAMESPACE` | Kubernetes namespace for the Helm release (e.g. `default` or `hello-world`). Created if it does not exist. |
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | Full Workload Identity Federation provider resource name, e.g. `projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/POOL_NAME/providers/PROVIDER_NAME`. |
| `GCP_SERVICE_ACCOUNT` | GCP service account email used for the federation (e.g. `my-sa@my-project.iam.gserviceaccount.com`). |

#### Optional (zonal clusters)

| Secret | Description |
|--------|-------------|
| `GCP_ZONE` | GKE cluster zone (e.g. `us-central1-a`). If set, the workflow uses `--zone` instead of `--region` for `get-credentials`. |

---

### Alternative: Key-based auth (deploy-helm-hello.yaml)

Instead of WIF, the workflow `deploy-helm-hello.yaml` uses a GCP service account JSON key in secret `GCP_SA_KEY` (see table above). Use that workflow if you prefer key-based auth.

