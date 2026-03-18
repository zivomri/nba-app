#!/usr/bin/env python3
"""Write slsa.json and slsa.md from GitHub Actions env (SLSA-style workflow provenance)."""
import json
import os

repo = os.environ.get("GITHUB_REPOSITORY", "")
ref = os.environ.get("GITHUB_REF", "")
sha = os.environ.get("GITHUB_SHA", "")
run_id = os.environ.get("GITHUB_RUN_ID", "")
attempt = os.environ.get("GITHUB_RUN_ATTEMPT", "1")
event_name = os.environ.get("GITHUB_EVENT_NAME", "")
repo_id = os.environ.get("GITHUB_REPOSITORY_ID", "")
owner_id = os.environ.get("GITHUB_REPOSITORY_OWNER_ID") or "unknown"
repo_url = f"https://github.com/{repo}"
builder_id = f"{repo_url}/.github/workflows/ci.yml@{ref}"
invocation_id = f"{repo_url}/actions/runs/{run_id}/attempts/{attempt}"
git_uri = f"git+https://github.com/{repo}@{ref}"

slsa = {
    "buildDefinition": {
        "buildType": "https://actions.github.io/buildtypes/workflow/v1",
        "externalParameters": {
            "workflow": {
                "path": ".github/workflows/ci.yml",
                "ref": ref,
                "repository": repo_url,
            }
        },
        "internalParameters": {
            "github": {
                "event_name": event_name,
                "repository_id": repo_id,
                "repository_owner_id": owner_id,
                "runner_environment": "github-hosted",
            }
        },
        "resolvedDependencies": [
            {"digest": {"gitCommit": sha}, "uri": git_uri}
        ],
    },
    "runDetails": {
        "builder": {"id": builder_id},
        "metadata": {"invocationId": invocation_id},
    },
}

open("slsa.json", "w", encoding="utf-8").write(json.dumps(slsa, indent=2))

md = f"""# SLSA Provenance Overview 🛠️

## Builder

- **ID**: `{builder_id}`

## Build Type

- **Build Type**: https://actions.github.io/buildtypes/workflow/v1

## Metadata

### Build Invocation Info
- **Invocation ID**: {invocation_id}

## Resolved Dependencies

**Dependency:**
- **uri**: `{git_uri}`
- **digest**:
  - **gitCommit**: `{sha}`

## External Parameters
- **workflow**:
  - **path**: .github/workflows/ci.yml
  - **ref**: {ref}
  - **repository**: {repo_url}

## Internal Parameters
- **github**:
  - **event_name**: {event_name}
  - **repository_id**: {repo_id}
  - **repository_owner_id**: {owner_id}
  - **runner_environment**: github-hosted
"""
open("slsa.md", "w", encoding="utf-8").write(md)
