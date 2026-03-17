#!/usr/bin/env bash
# Optional: Bind GCP Service Account to a Kubernetes Service Account (Workload Identity) and ensure RBAC
# so that deployments from the jfrog org repo can run as a dedicated K8s identity.
#
# Use this if you want in-cluster workloads (e.g. pods) to use the same identity, or to create a
# namespace and RBAC for the GitHub Actions-deployed release.
#
# Prerequisites: kubectl configured (e.g. gcloud container clusters get-credentials ...).
#
# Usage:
#   export GCP_PROJECT_ID=your-gcp-project
#   export GCP_SA_EMAIL=your-sa@your-gcp-project.iam.gserviceaccount.com
#   export K8S_NAMESPACE=hello-world
#   export K8S_SA_NAME=github-actions-deploy
#   ./scripts/k8s-wif-and-rbac.sh

set -euo pipefail

GCP_PROJECT_ID="${GCP_PROJECT_ID:?Set GCP_PROJECT_ID}"
GCP_SA_EMAIL="${GCP_SA_EMAIL:?Set GCP_SA_EMAIL}"
K8S_NAMESPACE="${K8S_NAMESPACE:-hello-world}"
K8S_SA_NAME="${K8S_SA_NAME:-github-actions-deploy}"

echo "GCP SA: $GCP_SA_EMAIL"
echo "K8s namespace: $K8S_NAMESPACE, K8s SA: $K8S_SA_NAME"
echo ""

# 1. Create namespace if not exists
kubectl create namespace "$K8S_NAMESPACE" --dry-run=client -o yaml | kubectl apply -f -

# 2. Create Kubernetes Service Account
kubectl create serviceaccount "$K8S_SA_NAME" -n "$K8S_NAMESPACE" --dry-run=client -o yaml | kubectl apply -f -

# 3. Annotate K8s SA to bind to GCP SA (Workload Identity)
kubectl annotate serviceaccount "$K8S_SA_NAME" -n "$K8S_NAMESPACE" \
  "iam.gke.io/gcp-service-account=${GCP_SA_EMAIL}" \
  --overwrite

# 4. On GCP side: allow the K8s SA to impersonate the GSA (required for GKE Workload Identity)
#    Format: serviceAccount:PROJECT_ID.svc.id.goog[K8S_NAMESPACE/K8S_SA_NAME]
K8S_WI_MEMBER="serviceAccount:${GCP_PROJECT_ID}.svc.id.goog[${K8S_NAMESPACE}/${K8S_SA_NAME}]"
gcloud iam service-accounts add-iam-policy-binding "$GCP_SA_EMAIL" \
  --project="$GCP_PROJECT_ID" \
  --role="roles/iam.workloadIdentityUser" \
  --member="$K8S_WI_MEMBER" 2>/dev/null || true

# 5. RBAC: allow the SA to manage resources in the namespace (for helm deploy from Actions, the runner uses GSA;
#    this is for in-cluster use if you run something as this K8s SA)
kubectl apply -f - <<EOF
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: deploy-role
  namespace: $K8S_NAMESPACE
rules:
  - apiGroups: ["", "apps", "batch"]
    resources: ["*"]
    verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: deploy-role-binding
  namespace: $K8S_NAMESPACE
subjects:
  - kind: ServiceAccount
    name: $K8S_SA_NAME
    namespace: $K8S_NAMESPACE
roleRef:
  kind: Role
  name: deploy-role
  apiGroup: rbac.authorization.k8s.io
EOF

echo ""
echo "K8s SA $K8S_SA_NAME in namespace $K8S_NAMESPACE is bound to GCP SA $GCP_SA_EMAIL (Workload Identity)."
echo "RBAC Role/RoleBinding applied for deploy-role in $K8S_NAMESPACE."
