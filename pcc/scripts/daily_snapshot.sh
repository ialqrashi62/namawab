#!/bin/bash
# daily_snapshot.sh — captures daily state snapshot of PCC Sandbox
# USAGE: ./daily_snapshot.sh [BASE_URL]
# DEFAULT: http://localhost:3100
# Designed to run via cron: 0 0 * * * /path/to/daily_snapshot.sh
#
# Output: writes strict JSON to public/snapshots/YYYY-MM-DD.json
#         prints human-readable summary to stdout
#         verbose preview lines go to stderr (not in JSON file)

set -u

# Resolve a working `node` binary.
# - Prefer the on-PATH `node` (Linux/cron use).
# - Fall back to common Windows .exe locations (WSL/Git-Bash local dev).
NODE_BIN="$(command -v node 2>/dev/null || true)"
if [ -z "$NODE_BIN" ] && [ -x /mnt/c/nvm4w/nodejs/node.exe ]; then
  NODE_BIN="/mnt/c/nvm4w/nodejs/node.exe"
fi
if [ -z "$NODE_BIN" ] && [ -x "/mnt/c/Program Files/nodejs/node.exe" ]; then
  NODE_BIN="/mnt/c/Program Files/nodejs/node.exe"
fi
if [ -z "$NODE_BIN" ]; then
  echo "ERROR: node binary not found on PATH or in known Windows locations" >&2
  exit 1
fi

BASE_URL="${1:-${PCC_BASE:-http://localhost:3100}}"
SNAPSHOT_DIR="$(cd "$(dirname "$0")/.." && pwd)/public/snapshots"
DATE=$(date -u +%Y-%m-%d)
TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ)
SNAPSHOT_FILE="${SNAPSHOT_DIR}/${DATE}.json"

# When invoking a Windows .exe (e.g. node.exe from /mnt/c/...) from WSL
# bash, the .exe sees WSL paths as Windows-relative paths ("C:\mnt\c\...").
# Translate /mnt/<drive>/... → <drive>:\... when the .exe is a Windows
# binary. On real Linux cron, this is a no-op.
to_win_path() {
  if [[ "$NODE_BIN" == *.exe ]] && [[ "$1" == /mnt/* ]]; then
    local drive="${1#/mnt/}"
    drive="${drive:0:1}"
    echo "${drive^^}:${1:6}"
  else
    echo "$1"
  fi
}
SNAPSHOT_FILE_W=$(to_win_path "$SNAPSHOT_FILE")

mkdir -p "$SNAPSHOT_DIR"

# fetch <label> <path> — writes preview to stderr, JSON-only to stdout
fetch() {
  local name="$1"
  local path="$2"
  local out
  out=$(curl -sS --max-time 10 "$BASE_URL$path" 2>/dev/null) || out='null'
  # Sanitize: if response is empty or invalid JSON, use null
  echo "$out" | "$NODE_BIN" -e "
    let d=''; process.stdin.on('data',c=>d+=c).on('end',()=>{
      try { console.log(JSON.stringify(JSON.parse(d))); }
      catch (e) { console.log('null'); }
    });
  " 2>/dev/null || echo "null"
  # Preview to stderr (not in JSON file)
  echo "  fetched $name from $path" >&2
}

echo "Daily PCC snapshot → $BASE_URL" >&2
echo "Output: $SNAPSHOT_FILE" >&2
echo "============================================" >&2

# Capture endpoints
STATS=$(fetch stats /api/v1/pcc-catalog/stats)
AUDIT_DATA=$(fetch audit /api/v1/pcc-catalog/audit?limit=1)
TOKENS=$(fetch tokens /api/v1/pcc-catalog/api-token)
READYZ=$(fetch readyz /readyz)
HEALTH=$(fetch health /health)

# Compute counts
AUDIT_COUNT=$(echo "$AUDIT_DATA" | "$NODE_BIN" -e "
  let d=''; process.stdin.on('data',c=>d+=c).on('end',()=>{
    try { console.log(JSON.parse(d).total_entries || 0); } catch (e) { console.log(0); }
  });
" 2>/dev/null || echo 0)
TOKEN_COUNT=$(echo "$TOKENS" | "$NODE_BIN" -e "
  let d=''; process.stdin.on('data',c=>d+=c).on('end',()=>{
    try { console.log(JSON.parse(d).count || 0); } catch (e) { console.log(0); }
  });
" 2>/dev/null || echo 0)

# Build strict JSON via node.
# All values are passed as a single JSON arg on the command line — this
# avoids the WSL/Windows-exe env-var propagation bug (where `node.exe`
# does not see the bash env) and keeps the script portable to real
# Linux cron too.
SNAP_INPUT="$TIMESTAMP|$BASE_URL|$HEALTH|$READYZ|$STATS|$AUDIT_COUNT|$TOKEN_COUNT|$SNAPSHOT_FILE_W"
"$NODE_BIN" -e "
const fs = require('fs');
const [ts, base, health, readyz, statsRaw, auditCount, tokenCount, snapFile] = process.argv[1].split('|');
// Re-parse the captured stats so the file contains a real object, not a JSON string.
let stats;
try { stats = JSON.parse(statsRaw); } catch (e) { stats = statsRaw; }
const snapshot = {
  captured_at: ts,
  base_url: base,
  health: health,
  readyz: readyz,
  stats: stats,
  audit_count: parseInt(auditCount || '0', 10),
  tokens_count: parseInt(tokenCount || '0', 10),
};
fs.writeFileSync(snapFile, JSON.stringify(snapshot, null, 2));
process.stderr.write('  saved ' + snapFile + ' (' + fs.statSync(snapFile).size + ' bytes)\n');
" "$SNAP_INPUT"

# Update index.json
INDEX_FILE="${SNAPSHOT_DIR}/index.json"
[ ! -f "$INDEX_FILE" ] && echo "[]" > "$INDEX_FILE"

# Pipe JSON to node via stdin (works in WSL, real Linux, Git-Bash).
# Index entry: {idxName, idxPath, snapPath, ts}
INDEX_FILE_W=$(to_win_path "$INDEX_FILE")
IDX_INPUT="$INDEX_FILE_W|${DATE}.json|$SNAPSHOT_FILE_W|$TIMESTAMP"
"$NODE_BIN" -e "
const fs = require('fs');
const [idxPath, idxName, snapPath, ts] = process.argv[1].split('|');
let index;
try { index = JSON.parse(fs.readFileSync(idxPath, 'utf8')); }
catch (e) { index = []; }
if (!Array.isArray(index)) index = [];

// Idempotent overwrite: drop any prior entry for today
index = index.filter(e => e.filename !== idxName);

let size = 0;
try { size = fs.statSync(snapPath).size; } catch (e) {}

index.unshift({
  filename: idxName,
  captured_at: ts,
  size_bytes: size,
  url: '/snapshots/' + idxName
});

while (index.length > 30) index.pop();

fs.writeFileSync(idxPath, JSON.stringify(index, null, 2));
process.stderr.write('  updated index.json (' + index.length + ' entries)\n');
" "$IDX_INPUT"

echo "============================================" >&2
echo "Snapshot saved: $SNAPSHOT_FILE" >&2
exit 0
