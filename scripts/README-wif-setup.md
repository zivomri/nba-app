# GCP & K8s setup for jfrog/nba-app (Workload Identity)

After moving the repo to **https://github.com/jfrog/nba-app**, use these scripts so GitHub Actions can authenticate to GCP and GKE using Workload Identity Federation (WIF) with provider/audience **jfrog-org**.

## 1. GCP: Workload Identity Federation for jfrog org

This configures GCP so that **only** the **jfrog** organization (and repo `jfrog/nba-app`) can exchange GitHub OIDC tokens for GCP credentials—not `zivomri` or other repos.

**Run once per GCP project:**

```bash
chmod +x scripts/gcp-wif-setup-jfrog-org.sh
./scripts/gcp-wif-setup-jfrog-org.sh YOUR_PROJECT_ID your-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

Or with env vars:

```bash
export GCP_PROJECT_ID=your-project-id
export GCP_SA_EMAIL=your-sa@your-project.iam.gserviceaccount.com
./scripts/gcp-wif-setup-jfrog-org.sh
```

The script will:

- Create a Workload Identity Pool and an OIDC provider named **jfrog-org** (issuer: `https://token.actions.githubusercontent.com`).
- Set attribute mapping and condition so only `repository_owner == 'jfrog'` and `repository == 'jfrog/nba-app'` can use it.
- Grant the WIF principal `roles/iam.workloadIdentityUser` on your GCP service account.
- Grant the service account `roles/container.developer` on the project (for `gcloud container clusters get-credentials` and deploy).

**Output:** Use the printed `GCP_WORKLOAD_IDENTITY_PROVIDER` value and `GCP_SA_EMAIL` in GitHub repo **Settings → Secrets and variables → Actions** for the **jfrog/nba-app** repo.

## 2. K8s: Optional Workload Identity + RBAC

Use this if you want a Kubernetes Service Account (KSA) bound to the same GCP Service Account (GSA) for in-cluster workloads, or to create the deploy namespace and RBAC.

**Prerequisites:** `kubectl` already configured (e.g. `gcloud container clusters get-credentials ...`).

```bash
export GCP_PROJECT_ID=your-gcp-project-id
export GCP_SA_EMAIL=your-sa@your-gcp-project.iam.gserviceaccount.com
export K8S_NAMESPACE=hello-world   # same as HELM_NAMESPACE in GitHub secret
export K8S_SA_NAME=github-actions-deploy
chmod +x scripts/k8s-wif-and-rbac.sh
./scripts/k8s-wif-and-rbac.sh
```

This will:

- Create the namespace (if missing).
- Create a K8s Service Account and annotate it for GKE Workload Identity (binding to the GSA).
- Add IAM binding so the KSA can impersonate the GSA.
- Create a Role and RoleBinding so that K8s SA can manage resources in the namespace.

**Note:** The **Deploy to GKE** workflow authenticates as the **GCP** service account (via WIF) and runs `gcloud get-credentials` + `helm upgrade --install` on the runner. It does **not** run as this K8s SA. The K8s script is for in-cluster workloads or future use.

## Summary

| What | Where |
|------|--------|
| OIDC provider name & audience | Workflows use `oidc-provider-name: jfrog-org` and `oidc-audience: jfrog-org` (JFrog CLI in ci.yml) and GCP WIF (deploy-gke.yml) with a provider named **jfrog-org**. |
| Restrict to jfrog org | GCP WIF attribute condition in `gcp-wif-setup-jfrog-org.sh`: `repository_owner == 'jfrog'` and `repository == 'jfrog/nba-app'`. |
| GitHub secrets | Set `GCP_WORKLOAD_IDENTITY_PROVIDER`, `GCP_SERVICE_ACCOUNT`, `GCP_PROJECT_ID`, `GKE_CLUSTER_NAME`, `GCP_REGION`, `HELM_NAMESPACE` (and optionally `GCP_ZONE`) in the **jfrog/nba-app** repo. |
