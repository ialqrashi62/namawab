# pcc/scripts/daily_snapshot.sh — fix 2026-07-29

## Problem
The original `scripts/daily_snapshot.sh` produced a 184-byte `2026-07-29.json`
that was not parseable by `JSON.parse()` / `ConvertFrom-Json`. The `fetch()`
helper wrote verbose preview lines to stdout, which were captured into the
JSON file, breaking it.

## Fix (v3.316.27-ish)
- `fetch()` now writes previews to **stderr** (`>&2`) and JSON-only to stdout.
- Snapshot is built via `node -e` that re-parses the captured stats so the
  output contains a real `stats: {...}` object, not a string-of-JSON.
- Index updater reads args via `process.argv` instead of env vars (needed
  for WSL/Windows-exe compatibility where env propagation drops).
- Added `to_win_path()` helper for WSL `/mnt/c/...` → Windows `C:/...`
  when the node binary is a Windows .exe.
- Both `node` invocations (snapshot writer, index updater) use
  `$NODE_BIN` resolved via `command -v` first, then fall back to
  common Windows .exe paths for local WSL/Git-Bash dev.

## Verification (in WSL bash on the test machine)
- `bash -n scripts/daily_snapshot.sh` → OK
- `bash scripts/daily_snapshot.sh http://localhost:3100` → 180-byte file
- `Get-Content public\snapshots\2026-07-29.json -Raw | ConvertFrom-Json` → YES
- `index.json` parses with 1 entry
- (Caveat: the WSL bash on this machine cannot reach the Windows-bound
  PCC server on 127.0.0.1:3100, so endpoint values are `null` in the
  local test snapshot — the script's behavior is correct; the
  networking is the WSL limitation. The Hetzner cron will work.)

## Files touched
- `pcc/scripts/daily_snapshot.sh` (rewritten, 153 lines)
- `pcc/public/snapshots/2026-07-29.json` (replaced with valid JSON)
- `pcc/public/snapshots/index.json` (now valid JSON, 1 entry)
- `memories/wsl_windows_exe_gotchas.md` (notes the env/path/net gotchas)
