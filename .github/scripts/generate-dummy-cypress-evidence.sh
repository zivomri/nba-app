#!/usr/bin/env bash
# Copy committed Cypress evidence into reports/ for JFrog attach.
# Usage: run from repo root.

set -euo pipefail

mkdir -p reports
for f in cypress-evidence.json cypress-results.md; do
  if [[ ! -f ".jfrog/evidence/$f" ]]; then
    echo "Missing .jfrog/evidence/$f" >&2
    exit 1
  fi
done
cp .jfrog/evidence/cypress-evidence.json reports/overall-report.json
cp .jfrog/evidence/cypress-results.md reports/cypress-results.md
