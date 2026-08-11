#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
nm-fix-stations-v3.py
Fixes all station files:
1. Replace {{code_short_pascal}} -> PascalCase
2. Collapse leftover {{ ... }} (JS escaped object braces) -> { ... }
"""
import io
import re
import sys
from pathlib import Path

if hasattr(sys.stdout, 'buffer'):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

WORKSPACE = Path(r"c:\Users\ice\Desktop\NMEDCALVSCODE")
STATIONS_DIR = WORKSPACE / "namaweb/public/js"


def to_pascal(code_short):
    return "".join(p.capitalize() for p in code_short.split("_"))


def fix_station(file_path):
    code_short = file_path.stem.replace("-station", "")
    pascal = to_pascal(code_short)
    content = file_path.read_text(encoding="utf-8")
    original = content

    # 1) Replace the placeholder
    content = content.replace("{{code_short_pascal}}", pascal)

    # 2) Collapse all leftover {{ ... }} (Python f-string escape leaks)
    # Need to be careful: only collapse when there's nothing between them or it's JS code
    # Strategy: find all {{ ... }} where content looks like JS (identifiers, commas, colons)
    def collapse_double_braces(match):
        inner = match.group(1)
        # Only collapse if it looks like JS object/code (contains identifiers or operators)
        if re.search(r'[a-zA-Z]', inner):
            return '{' + inner + '}'
        return match.group(0)

    # Match {{ ... }} (non-greedy, including newlines)
    content = re.sub(r'\{\{(.*?)\}\}', collapse_double_braces, content, flags=re.DOTALL)

    # 3) Fix ${{...}} -> ${...}  (template literal placeholders)
    content = re.sub(r'\$\{\{(\w+)\}\}', r'${\1}', content)

    if content != original:
        file_path.write_text(content, encoding="utf-8")


def main():
    count = 0
    for f in STATIONS_DIR.glob("*-station.js"):
        fix_station(f)
        count += 1
    print(f"[STATS] Stations processed: {count}")


if __name__ == "__main__":
    main()
