#!/usr/bin/env bash
# Setup GCP Workload Identity Federation for GitHub Actions from the **jfrog** org (e.g. repo jfrog/nba-app).
# Run once per GCP project. Uses audience and provider name "jfrog-org" to match workflow OIDC settings.
#
# Prerequisites: gcloud installed and authenticated (gcloud auth login + application-default login).
#
# Usage:
#   ./scripts/gcp-wif-setup-jfrog-org.sh PROJECT_ID SA_EMAIL
#   # or with env vars:
#   export GCP_PROJECT_ID=your-project-id
#   export GCP_SA_EMAIL=your-sa@your-project.iam.gserviceaccount.com
#   ./scripts/gcp-wif-setup-jfrog-org.sh

set -euo pipefail

GCP_PROJECT_ID="${1:-${GCP_PROJECT_ID:-}}"
GCP_SA_EMAIL="${2:-${GCP_SA_EMAIL:-}}"

if [[ -z "$GCP_PROJECT_ID" || -z "$GCP_SA_EMAIL" ]]; then
  echo "Usage: $0 GCP_PROJECT_ID GCP_SA_EMAIL"
  echo "  e.g. $0 my-gcp-project github-actions@my-gcp-project.iam.gserviceaccount.com"
  exit 1
fi

if [[ "$GCP_PROJECT_ID" == *"your-gcp-project"* ]] || [[ "$GCP_SA_EMAIL" == *"your-gcp-project"* ]] || [[ "$GCP_SA_EMAIL" == *"your-sa@"* ]]; then
  echo "ERROR: Replace placeholder values with your real GCP project and service account."
  echo "  $0 your-actual-project-id your-sa@your-actual-project.iam.gserviceaccount.com"
  exit 1
fi

POOL_NAME="github-actions-pool"
PROVIDER_NAME="jfrog-org"
# Restrict to jfrog org and optionally to repo jfrog/nba-app (change to "*" to allow any repo under jfrog).
GITHUB_ORG="jfrog"
REPO_ALLOWLIST="${REPO_ALLOWLIST:-jfrog/nba-app}"

echo "Project: $GCP_PROJECT_ID"
echo "Service account: $GCP_SA_EMAIL"
echo "Pool: $POOL_NAME, Provider: $PROVIDER_NAME"
echo "GitHub org: $GITHUB_ORG, Repo allowlist: $REPO_ALLOWLIST"
echo ""

# 1. Enable required APIs
gcloud services enable iamcredentials.googleapis.com --project="$GCP_PROJECT_ID"

# 2. Create Workload Identity Pool (id for GitHub)
gcloud iam workload-identity-pools create "$POOL_NAME" \
  --project="$GCP_PROJECT_ID" \
  --location="global" \
  --display-name="GitHub Actions" \
  --description="Pool for GitHub Actions from jfrog org" \
  --disabled=false 2>/dev/null || echo "Pool $POOL_NAME already exists."

# 3. Create OIDC provider with attribute mapping so only jfrog org (and optional repo) can exchange tokens.
#    Audience in the token will be set by GitHub; we use attribute.audience for mapping.
#    See: https://cloud.google.com/iam/docs/workload-identity-federation-with-other-providers#github-actions
gcloud iam workload-identity-pools providers create-oidc "$PROVIDER_NAME" \
  --project="$GCP_PROJECT_ID" \
  --location="global" \
  --workload-identity-pool="$POOL_NAME" \
  --display-name="GitHub OIDC (jfrog-org)" \
  --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository,attribute.repository_owner=assertion.repository_owner,attribute.audience=assertion.aud" \
  --attribute-condition="assertion.repository_owner == '$GITHUB_ORG' && assertion.repository in ['$REPO_ALLOWLIST']" \
  --issuer-uri="https://token.actions.githubusercontent.com" 2>/dev/null || echo "Provider $PROVIDER_NAME already exists."

# 4. Get project number (needed for WIF principal)
PROJECT_NUMBER=$(gcloud projects describe "$GCP_PROJECT_ID" --format='value(projectNumber)')
WIF_PRINCIPAL="principalSet://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${POOL_NAME}/attribute.repository/${REPO_ALLOWLIST}"

# 5. Allow the WIF principal (GitHub Actions from jfrog/nba-app) to impersonate the GCP service account.
#    Use attribute.repository so only this repo can assume the SA (not every repo under jfrog).
REPO_SLASH="${REPO_ALLOWLIST//\//\%2F}"  # jfrog%2Fnba-app
gcloud iam service-accounts add-iam-policy-binding "$GCP_SA_EMAIL" \
  --project="$GCP_PROJECT_ID" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${POOL_NAME}/attribute.repository/${REPO_SLASH}"

# 6. Grant GSA roles needed for GKE (get-credentials, deploy)
gcloud projects add-iam-policy-binding "$GCP_PROJECT_ID" \
  --member="serviceAccount:${GCP_SA_EMAIL}" \
  --role="roles/container.developer"

echo ""
echo "Done. Use this value for GitHub secret GCP_WORKLOAD_IDENTITY_PROVIDER:"
echo "  projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${POOL_NAME}/providers/${PROVIDER_NAME}"
echo ""
echo "GitHub secret GCP_SERVICE_ACCOUNT should be: $GCP_SA_EMAIL"
