#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
nm-fix-stations-v4.py
Aggressive fix: collapse ALL leftover {{...}} -> {...} after placeholder substitution.
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

    # Step 1: placeholder substitution
    content = content.replace("{{code_short_pascal}}", pascal)

    # Step 2: iteratively collapse {{...}} until none remain
    # Use simple balanced-brace match
    while True:
        new_content = re.sub(r'\{\{([^{}]*?)\}\}', r'{\1}', content)
        if new_content == content:
            break
        content = new_content

    # Step 3: Fix ${{...}} -> ${...}
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
