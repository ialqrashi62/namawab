#!/bin/bash
# cleanup_snapshots.sh — remove old daily snapshots (90-day retention)
# USAGE: ./cleanup_snapshots.sh [DAYS_OLD]
# DEFAULT: 90 days
# Designed for cron: 0 3 * * 0 /path/to/cleanup_snapshots.sh

set -u

DAYS="${1:-90}"
SNAPSHOT_DIR="$(cd "$(dirname "$0")/.." && pwd)/public/snapshots"
INDEX_FILE="${SNAPSHOT_DIR}/index.json"

echo "PCC snapshot cleanup → older than ${DAYS} days"
echo "============================================"

if [ ! -d "$SNAPSHOT_DIR" ]; then
  echo "  No snapshot directory found; nothing to do"
  exit 0
fi

# Find old snapshot files (YYYY-MM-DD.json pattern)
DELETED=0
while IFS= read -r -d '' old_file; do
  filename=$(basename "$old_file")
  echo "  Deleting: $filename"
  rm -f "$old_file"
  DELETED=$((DELETED + 1))
done < <(find "$SNAPSHOT_DIR" -maxdepth 1 -type f -name "20*-*-*.json" -mtime +"$DAYS" -print0)

echo "  Deleted $DELETED file(s)"

# Update index.json to remove deleted entries
if [ -f "$INDEX_FILE" ] && [ "$DELETED" -gt 0 ]; then
  IDX_PATH="$INDEX_FILE" node <<'EOF'
const fs = require('fs');
const path = require('path');
const idxPath = process.env.IDX_PATH;
const idxDir = path.dirname(idxPath);
let index;
try { index = JSON.parse(fs.readFileSync(idxPath, 'utf8')); }
catch (e) { index = []; }
if (!Array.isArray(index)) index = [];

const before = index.length;
// Keep only entries whose file still exists
index = index.filter(e => {
  if (!e || !e.filename) return false;
  try { fs.accessSync(path.join(idxDir, e.filename)); return true; }
  catch (_) { return false; }
});
const after = index.length;
const removed = before - after;
fs.writeFileSync(idxPath, JSON.stringify(index, null, 2));
console.log('  Updated index.json: removed ' + removed + ' entries (now ' + after + ')');
EOF
fi

echo "============================================"
echo "Cleanup complete. $DELETED snapshot(s) removed."
exit 0
