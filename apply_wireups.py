#!/usr/bin/env python3
"""
apply_wireups.py — Surgical additive wire-ups to /var/www/namaweb/server.js.

Phase 3 implementation (additive only, no removals, no reordering):
  Wire-up #1: Mount /api/portal → portal_api (requireAuth at outer mount)
  Wire-up #2: Pass idempotencyGuard into makePlansRouter (reuses module-scope var)
  Wire-up #3: SKIPPED — /api/csp-report already exists at line 135
  Wire-up #4: VERIFIED — /__tests__/ served as HTTP 200

Safety:
  - Creates .bak-pre-edit-2026-07-29 marker (idempotent, refuses to re-edit if exists)
  - Only INSERT / REPLACE on exact multi-line strings (no fuzzy matches)
  - Verifies with `node -c` at the end
  - Prints diff stats
"""
import os
import re
import subprocess
import sys
import hashlib
from pathlib import Path

SERVER = "/var/www/namaweb/server.js"
BAK = "/var/www/namaweb/server.js.bak-pre-wireup-2026-07-29"
EDIT_MARK = "/var/www/namaweb/server.js.bak-pre-edit-2026-07-29"


def read(path):
    return Path(path).read_text(encoding="utf-8")


def write(path, txt):
    Path(path).write_text(txt, encoding="utf-8")


def md5(path):
    return hashlib.md5(Path(path).read_bytes()).hexdigest()


def main():
    # 0) Refuse to run twice
    if os.path.exists(EDIT_MARK):
        print(f"FATAL: edit marker already exists: {EDIT_MARK}", file=sys.stderr)
        print("       refusing to re-apply wire-ups to a possibly already-edited file", file=sys.stderr)
        sys.exit(2)

    # 1) Snapshot current server.js
    print("=== Pre-edit snapshot ===")
    print(f"  server.js: {os.path.getsize(SERVER)} bytes, md5={md5(SERVER)}")
    print(f"  backup  : {os.path.getsize(BAK)} bytes, md5={md5(BAK)}")
    if md5(SERVER) != md5(BAK):
        print("FATAL: server.js hash differs from backup — aborting", file=sys.stderr)
        sys.exit(3)

    src = read(SERVER)
    orig_len = len(src)
    n_edits = 0

    # ----- EDIT 1: Mount /api/portal -----
    # Insert AFTER the public plans mount, BEFORE the clinical calculators block.
    # Anchor: the comment "// ===== CLINICAL CALCULATOR ROUTERS" which is unique
    # in the file. We insert a labeled section immediately before that comment.
    edit1_anchor = (
        "// ===== CLINICAL CALCULATOR ROUTERS — Phase 2E2 (18 fns) + Phase 3 (48 fns across 26 engines) ====="
    )
    edit1_insert = (
        "// ===== Patient Portal API (wired 2026-07-29, owner-authorized, additive) =====\n"
        "// portal_api.js does its own per-route tenant + Patient-role RBAC checks internally;\n"
        "// we only enforce requireAuth at the outer mount (defense-in-depth).\n"
        "const portalApi = require('./portal_api');\n"
        "app.use('/api/portal', requireAuth, portalApi);\n"
        "\n"
    )
    if edit1_anchor not in src:
        print("FATAL: edit-1 anchor not found", file=sys.stderr)
        sys.exit(4)
    if "app.use('/api/portal', requireAuth, portalApi);" in src:
        print("WARN edit-1: already wired (idempotent skip)")
    else:
        src = src.replace(edit1_anchor, edit1_insert + edit1_anchor, 1)
        n_edits += 1
        print(f"  edit-1: portal_api mount inserted ({len(edit1_insert.splitlines())} lines added)")

    # ----- EDIT 2: Pass idempotencyGuard into makePlansRouter -----
    # The existing 4-line block at line 17993-17997 is:
    #     app.use('/api/super-admin', requireAuth, requireSuperAdmin(process.env.SUPER_ADMIN_USERS), makePlansRouter({
    #         pool,
    #         getActor: (req) => req.session && req.session.user,
    #         logAudit
    #     }));
    # We add `idempotencyGuard,` as a 4th property of the deps object, between
    # `logAudit` and the closing `}));`. We REUSE the module-scope const
    # `idempotencyGuard` declared at line 533 (idempotency.js exports
    # makeIdempotencyGuard as a factory; the brief's `require('./idempotency').idempotencyGuard`
    # is undefined at runtime — we use the pre-built instance instead).
    edit2_old = (
        "    app.use('/api/super-admin', requireAuth, requireSuperAdmin(process.env.SUPER_ADMIN_USERS), makePlansRouter({\n"
        "        pool,\n"
        "        getActor: (req) => req.session && req.session.user,\n"
        "        logAudit\n"
        "    }));\n"
    )
    edit2_new = (
        "    // ===== Wire-up 2026-07-29: pass module-scope idempotencyGuard (declared at line ~533) =====\n"
        "    // into makePlansRouter — plans.js (line ~190) wraps PUT/DELETE money routes via withIdem(...).\n"
        "    // OPT-IN: only engages when the client sends an Idempotency-Key header (Rail 6, GATE 7).\n"
        "    app.use('/api/super-admin', requireAuth, requireSuperAdmin(process.env.SUPER_ADMIN_USERS), makePlansRouter({\n"
        "        pool,\n"
        "        getActor: (req) => req.session && req.session.user,\n"
        "        logAudit,\n"
        "        idempotencyGuard\n"
        "    }));\n"
    )
    if edit2_new in src:
        print("WARN edit-2: already applied (idempotent skip)")
    elif edit2_old not in src:
        print("FATAL: edit-2 old block not found exactly", file=sys.stderr)
        print("--- searching for makePlansRouter anchor ---", file=sys.stderr)
        for i, line in enumerate(src.splitlines(), 1):
            if "makePlansRouter" in line:
                print(f"  L{i}: {line}", file=sys.stderr)
        sys.exit(5)
    else:
        src = src.replace(edit2_old, edit2_new, 1)
        n_edits += 1
        added = len(edit2_new.splitlines()) - len(edit2_old.splitlines())
        print(f"  edit-2: idempotencyGuard passed into makePlansRouter (+{added} lines)")

    # 2) Write the modified file
    write(SERVER, src)
    new_len = len(src)
    print()
    print("=== Post-edit summary ===")
    print(f"  edits applied: {n_edits}")
    print(f"  bytes before : {orig_len}")
    print(f"  bytes after  : {new_len}")
    print(f"  delta        : +{new_len - orig_len} bytes ({new_len - orig_len} chars)")
    print(f"  new md5      : {md5(SERVER)}")

    # 3) Create the edit marker
    Path(EDIT_MARK).write_text(
        f"Applied at 2026-07-29: portal_api mount + idempotencyGuard passed to makePlansRouter.\n"
        f"Original backup: {BAK}\n"
        f"New md5: {md5(SERVER)}\n",
        encoding="utf-8",
    )
    print(f"  marker file : {EDIT_MARK}")

    # 4) node -c syntax check
    print()
    print("=== node -c syntax check ===")
    r = subprocess.run(["node", "-c", SERVER], capture_output=True, text=True)
    if r.returncode == 0:
        print(f"  OK (exit 0, stderr empty) — JS is syntactically valid")
    else:
        print(f"  FAIL (exit {r.returncode})", file=sys.stderr)
        print(r.stderr, file=sys.stderr)
        sys.exit(6)

    # 5) Final line count
    new_lines = src.count("\n") + 1
    print()
    print(f"  new line count: {new_lines}")


if __name__ == "__main__":
    main()
