#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
nm-fix-stations.py
Fixes the syntax errors in station files caused by ${{...}} template placeholders.
Replaces ${{var}} with ${var} (proper template literal syntax).
"""
import io
import os
import re
import sys
from pathlib import Path

if hasattr(sys.stdout, 'buffer'):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

WORKSPACE = Path(r"c:\Users\ice\Desktop\NMEDCALVSCODE")
STATIONS_DIR = WORKSPACE / "namaweb/public/js"


def fix_station(file_path):
    """Fix ${{var}} -> ${var} in station files."""
    content = file_path.read_text(encoding="utf-8")

    # The pattern: ${{identifier}} should become ${identifier}
    # This was caused by PowerShell expanding ${{...}} incorrectly
    fixed = re.sub(r'\$\{\{(\w+)\}\}', r'${\1}', content)

    if fixed != content:
        file_path.write_text(fixed, encoding="utf-8")
        return True
    return False


def main():
    fixed_count = 0
    for f in STATIONS_DIR.glob("*-station.js"):
        if fix_station(f):
            fixed_count += 1

    print(f"[STATS] Stations fixed: {fixed_count}")
    print(f"[STATS] Total stations: {len(list(STATIONS_DIR.glob('*-station.js')))}")


if __name__ == "__main__":
    main()
