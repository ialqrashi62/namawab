#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
nm-server-wire.py
Auto-wires all dept routers into server.js via additive append.
Safety: idempotent — won't add duplicate mounts.
"""
import io
import os
import sys
import yaml
from pathlib import Path
from datetime import datetime

if hasattr(sys.stdout, 'buffer'):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

WORKSPACE = Path(r"c:\Users\ice\Desktop\NMEDCALVSCODE")
SERVER = WORKSPACE / "namaweb/server.js"

# Snippet to add (idempotent)
WIRE_SNIPPET_TEMPLATE = """
// ===== Auto-wired dept routers ({date}) =====
const deptRouters = {{
{requires}
}};
for (const [code, routerFactory] of Object.entries(deptRouters)) {{
  try {{
    app.use(`/api/${{code}}`, routerFactory(pool, routeSchemas));
    console.log(`[WIRE] mounted /api/${{code}}`);
  }} catch (e) {{
    console.error(`[WIRE] failed /api/${{code}}:`, e.message);
  }}
}}
"""


def get_dept_codes():
    cfg_path = WORKSPACE / ".ai-brain/03_AUTOPILOT/dept_config_all.yaml"
    with open(cfg_path, "r", encoding="utf-8") as f:
        cfg = yaml.safe_load(f)
    return cfg["depts"]


def check_wired(code_short):
    """Check if this dept is already wired in server.js."""
    if not SERVER.exists():
        return False
    content = SERVER.read_text(encoding="utf-8", errors="ignore")
    return f"/api/{code_short}" in content or f"require('./{code_short}_router')" in content


def main():
    depts = get_dept_codes()
    date = datetime.now().strftime("%Y-%m-%d")
    requires_lines = []
    new_codes = []
    skipped = []

    for dept in depts:
        code_short = dept["code_short"]
        router_path = WORKSPACE / "namaweb" / f"{code_short}_router.js"
        if not router_path.exists():
            continue
        if check_wired(code_short):
            skipped.append(code_short)
            continue
        requires_lines.append(f"  {code_short}: require('./{code_short}_router'),")
        new_codes.append(code_short)

    if not new_codes:
        print(f"[INFO] All dept routers already wired. Skipped: {len(skipped)}")
        return

    snippet = WIRE_SNIPPET_TEMPLATE.format(
        date=date,
        requires="\n".join(requires_lines),
    )

    if not SERVER.exists():
        print(f"[WARN] server.js not found at {SERVER}")
        return

    content = SERVER.read_text(encoding="utf-8", errors="ignore")
    # Append at end (additive only)
    new_content = content + "\n" + snippet
    SERVER.write_text(new_content, encoding="utf-8")

    print(f"[STATS] Wired {len(new_codes)} new dept routers into server.js")
    print(f"[STATS] Skipped (already wired): {len(skipped)}")
    for c in new_codes[:5]:
        print(f"  [+] /api/{c}")
    if len(new_codes) > 5:
        print(f"  ... and {len(new_codes) - 5} more")


if __name__ == "__main__":
    main()
