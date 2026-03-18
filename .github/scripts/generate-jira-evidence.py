#!/usr/bin/env python3
"""
Generate jira.json and jira.md for JFrog AppTrust Jira evidence (pseudo tickets from run id).
Run from repo root. Reads GITHUB_RUN_NUMBER, GITHUB_RUN_ATTEMPT.
"""
import json
import os
from pathlib import Path
from string import Template

ROOT = Path(__file__).resolve().parents[2]
TEMPLATE = ROOT / ".jfrog" / "evidence" / "jira-release-notes.md.template"


def main() -> None:
    run = int(os.environ.get("GITHUB_RUN_NUMBER", "0"))
    att = int(os.environ.get("GITHUB_RUN_ATTEMPT", "0"))
    t1 = f"BV-{(run % 200) + 100}"
    t2 = f"BV-{((run + att) % 200) + 300}"
    t3 = f"BV-{((run * 3 + att) % 200) + 500}"
    types = ("feature", "bug", "improvement")
    t1_type = types[run % 3]
    t2_type = types[(run + 1) % 3]
    t3_type = types[(run + 2) % 3]

    payload = {
        "jira": {
            "tickets": [
                {"id": t1, "type": t1_type},
                {"id": t2, "type": t2_type},
                {"id": t3, "type": t3_type},
            ]
        }
    }
    Path("jira.json").write_text(json.dumps(payload, indent=2), encoding="utf-8")

    text = TEMPLATE.read_text(encoding="utf-8")
    md = Template(text).substitute(
        T1=t1,
        T2=t2,
        T3=t3,
        T1_TYPE=t1_type,
        T2_TYPE=t2_type,
        T3_TYPE=t3_type,
    )
    Path("jira.md").write_text(md, encoding="utf-8")


if __name__ == "__main__":
    main()
