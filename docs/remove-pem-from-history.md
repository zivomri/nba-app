# Removing public.pem and private.pem from Git History

These files were committed and later deleted. To purge them from **all** history (so no commit ever contains them), you have two options.

## Option A: git-filter-repo (recommended)

**Install** (one-time):

```bash
# macOS with Homebrew
brew install git-filter-repo

# Or with pip
pip3 install git-filter-repo
```

**Run** (from repo root):

```bash
git filter-repo --path public.pem --path private.pem --invert-paths --force
```

- `--invert-paths`: remove these paths from every commit.
- `--force`: required when the repo has a default remote (e.g. `origin`).

**Then:**

```bash
git remote add origin <your-remote-url>   # re-add remote if needed
git push --force-with-lease origin main    # overwrite remote history
```

---

## Option B: git filter-branch (no install)

**Run** (from repo root):

```bash
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch public.pem private.pem' \
  --prune-empty --tag-name-filter cat -- --all
```

**Clean up refs and push:**

```bash
rm -rf .git/refs/original/
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --force-with-lease origin main
```

---

## Important

- **History is rewritten**: Commit SHAs will change. Anyone who cloned the repo should re-clone or reset to the new history.
- **Force push required**: You must push with `--force-with-lease` (or `--force`) to update the remote.
- **Keys are still compromised**: If these keys were ever pushed to a remote (e.g. GitHub), assume they are exposed. Rotate/revoke them and generate new keys; removing from history does not undo the exposure.

---

## “Only creation” or “only deletion”?

- **Remove from entire history**: Use one of the options above. The files will not exist in any commit.
- **Only “undo” the deletion**: That would mean reverting the delete commit so the files exist again in the repo—not recommended for secrets.
- **Only “undo” the creation**: That would require rewriting history so the files never existed, which is exactly what Option A or B does (they remove the files from every commit, including the one that added them).
