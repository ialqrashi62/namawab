#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
nm-fix-stations-v6.py
Final fix: replaces remaining {PascalCase}Station artifacts.
"""
import io
import re
import sys
from pathlib import Path

if hasattr(sys.stdout, 'buffer'):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

WORKSPACE = Path(r"c:\Users\ice\Desktop\NMEDCALVSCODE")
STATIONS_DIR = WORKSPACE / "namaweb/public/js"


def fix_station(file_path):
    code_short = file_path.stem.replace("-station", "")
    pascal = "".join(p.capitalize() for p in code_short.split("_"))

    content = file_path.read_text(encoding="utf-8")
    original = content

    # Fix {PascalCase}Station -> PascalCaseStation
    content = re.sub(r'\{(\w+)\}Station', r'\1Station', content)

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
