#!/usr/bin/env bash
# Generate dummy SonarQube evidence files when real results are not present.
# Usage: run from repo root (e.g. in GitHub Actions).

set -euo pipefail
COVERAGE_PERCENT="${COVERAGE_PERCENT:-87.5}"
NOW_TS="${NOW_TS:-$(date -u +"%Y-%m-%dT%H:%M:%SZ")}"

mkdir -p .jfrog/evidence
# Single-line predicate to avoid heredoc delimiter issues
echo '{"predicateType":"https://jfrog.com/evidence/sonarqube/v1","predicate":{"projectStatus":{"status":"ERROR","ignoredConditions":false,"caycStatus":"non-compliant","conditions":[{"status":"ERROR","metricKey":"new_coverage","comparator":"LT","errorThreshold":"85","actualValue":"82.50562381034781"},{"status":"OK","metricKey":"skipped_tests","comparator":"GT","actualValue":"0"}],"period":{"mode":"last_version","date":"2000-04-27T00:45:23+0200","parameter":"2015-12-07"}},"createdAt":"2222-01-01T00:00:00.000Z","createdBy":"SonarQube","markdown":"# SVG in Markdown example\n\n## Details\n\n- **Type**: svg examples\n\nThis demonstrates the syntax for embedding an SVG without a separate file.\n\n!"}}' > .jfrog/evidence/sonarqube-coverage.json

{
  echo "# SVG in Markdown example"
  echo ""
  echo "## Details"
  echo ""
  echo "- **Type**: svg examples"
  echo ""
  echo "This demonstrates the syntax for embedding an SVG without a separate file."
} > .jfrog/evidence/sonarqube-coverage.md
