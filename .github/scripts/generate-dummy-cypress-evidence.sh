#!/usr/bin/env bash
# Generate dummy Cypress evidence files when real results are not present.
# Usage: run from repo root; optional env: GITHUB_RUN_ID, GITHUB_WORKFLOW, GITHUB_REPOSITORY.

set -euo pipefail
RUN_ID="${GITHUB_RUN_ID:-}"
WORKFLOW="${GITHUB_WORKFLOW:-CI}"
REPO="${GITHUB_REPOSITORY:-}"

mkdir -p reports
if [[ ! -f reports/overall-report.json ]]; then
  echo '{"results":{"tool":{"name":"cypress"},"summary":{"tests":0,"passed":0,"failed":0,"pending":0,"skipped":0,"other":0,"start":0,"stop":0},"tests":[]}}' > reports/overall-report.json
fi
if [[ ! -f reports/cypress-results.md ]]; then
  {
    echo "# Cypress Test Results"
    echo ""
    echo "Dummy report for Cypress Evidence (NPM). Replace with real Cypress output when available."
    echo ""
    echo "- **Run**: ${RUN_ID}"
    echo "- **Workflow**: ${WORKFLOW}"
    echo "- **Repository**: ${REPO}"
  } > reports/cypress-results.md
fi
