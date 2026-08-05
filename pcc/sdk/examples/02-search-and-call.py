# =============================================================================
# 02-search-and-call.py
# -----------------------------------------------------------------------------
# Title:       Search the PCC catalog and invoke the first match's first function
# Description: Issues /api/v1/pcc-catalog/search?q=<term> for a clinical term
#              (default: "diabetes"), picks the top hit, fetches the module
#              detail to learn its function list, then calls that function with
#              a small stub payload. Prints both responses nicely.
# Language:    Python 3.8+ — stdlib only (urllib, json).
# SDK used:    None. Uses stdlib `urllib.request`.
# Run:         python sdk/examples/02-search-and-call.py
#              python sdk/examples/02-search-and-call.py hypertension
# =============================================================================

from __future__ import annotations

import json
import sys
import urllib.error
import urllib.parse
import urllib.request
from typing import Any, Dict, List, Tuple

BASE = "http://localhost:3201"
SEARCH_TERM = "diabetes" if len(sys.argv) < 2 else sys.argv[1]


def _request(method: str, path: str, body: Dict[str, Any] | None = None) -> Tuple[int, Any]:
    url = BASE + path
    data = None
    headers = {"Accept": "application/json"}
    if body is not None:
        data = json.dumps(body).encode("utf-8")
        headers["Content-Type"] = "application/json"
    req = urllib.request.Request(url, data=data, method=method, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            raw = resp.read().decode("utf-8")
            payload = json.loads(raw) if raw else None
            return (resp.status, payload)
    except urllib.error.HTTPError as exc:
        raw = exc.read().decode("utf-8", errors="replace")
        try:
            payload = json.loads(raw) if raw else None
        except json.JSONDecodeError:
            payload = raw
        return (exc.code, payload)


def _section(title: str) -> None:
    print()
    print("=" * 70)
    print(title)
    print("=" * 70)


def main() -> int:
    print(f"--- 02 Search-and-Call  (term = {SEARCH_TERM!r}) ---")
    print(f"Sandbox: {BASE}")

    # ---------- 1. Search ----------
    _section("STEP 1 — /api/v1/pcc-catalog/search")
    qs = urllib.parse.quote(SEARCH_TERM, safe="")
    status, search = _request("GET", f"/api/v1/pcc-catalog/search?q={qs}")
    print(f"HTTP {status}")
    print(json.dumps(search, indent=2, ensure_ascii=False))
    if status != 200 or not isinstance(search, dict) or not search.get("results"):
        print("No search results — aborting.")
        return 1

    top = search["results"][0]
    slug = top["slug"]
    print(f"\nTop hit: {slug}  (score={top['score']}, funcs={top['function_count']})")

    # ---------- 2. Module detail ----------
    _section(f"STEP 2 — /api/v1/pcc-catalog/module/{slug}")
    status, mod = _request("GET", f"/api/v1/pcc-catalog/module/{slug}")
    print(f"HTTP {status}")
    print(json.dumps(mod, indent=2, ensure_ascii=False))
    if status != 200 or not isinstance(mod, dict):
        print("Failed to fetch module detail — aborting.")
        return 1

    first_fn: str = mod["functions"][0]
    print(f"\nWill call first function: {first_fn}")

    # ---------- 3. Call ----------
    _section(f"STEP 3 — POST /api/v1/{slug}/call/{first_fn}")
    status, call = _request("POST", f"/api/v1/{slug}/call/{first_fn}", body={"_example": True})
    print(f"HTTP {status}")
    print(json.dumps(call, indent=2, ensure_ascii=False))

    _section("DONE")
    print(f"Searched  : {SEARCH_TERM!r}")
    print(f"Module    : {slug}")
    print(f"Function  : {first_fn}")
    print(f"Call HTTP : {status}")
    return 0 if status == 200 else 2


if __name__ == "__main__":
    try:
        sys.exit(main())
    except urllib.error.URLError as exc:
        print(f"Network error: {exc.reason}", file=sys.stderr)
        print("Is the PCC sandbox running on :3201 ?", file=sys.stderr)
        sys.exit(3)
