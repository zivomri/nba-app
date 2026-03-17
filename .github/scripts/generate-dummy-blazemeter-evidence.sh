#!/usr/bin/env bash
# Generate dummy BlazeMeter evidence files when real results are not present.
# Usage: run from repo root; optional env: GITHUB_RUN_ID, GITHUB_WORKFLOW, GITHUB_REPOSITORY.

set -euo pipefail
RUN_ID="${GITHUB_RUN_ID:-}"
WORKFLOW="${GITHUB_WORKFLOW:-CI}"
REPO="${GITHUB_REPOSITORY:-}"

if [[ ! -f blazemeter-predicate.json ]]; then
  echo '{"summary":{"totalRequests":0,"avgResponseTime":0,"p95":0,"throughput":0,"errors":0},"run":{"startTime":"","endTime":""}}' > blazemeter-predicate.json
fi
if [[ ! -f blazemeter-results.md ]]; then
  {
    echo "# BlazeMeter Performance Results"
    echo ""
    echo "Dummy report for BlazeMeter Evidence (Docker). Replace with real BlazeMeter output when available."
    echo ""
    echo "- **Run**: ${RUN_ID}"
    echo "- **Workflow**: ${WORKFLOW}"
    echo "- **Repository**: ${REPO}"
  } > blazemeter-results.md
fi
