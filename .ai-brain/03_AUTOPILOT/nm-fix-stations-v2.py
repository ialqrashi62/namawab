#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
nm-fix-stations-v2.py
Properly fixes the {{code_short_pascal}} placeholder in station files.
Reads the dept code from filename and substitutes with correct PascalCase.
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


def to_pascal(code_short):
    """Convert snake_case to PascalCase."""
    return "".join(p.capitalize() for p in code_short.split("_"))


def fix_station(file_path):
    """Fix {{code_short_pascal}} in station file."""
    # Extract code_short from filename: cardiology-station.js -> cardiology
    code_short = file_path.stem.replace("-station", "")
    pascal = to_pascal(code_short)

    content = file_path.read_text(encoding="utf-8")

    # Replace double-brace placeholders
    content = content.replace("{{code_short_pascal}}", pascal)
    # Also fix any leftover ${{...}} artifacts
    content = re.sub(r'\$\{\{(\w+)\}\}', r'${\1}', content)

    file_path.write_text(content, encoding="utf-8")


def main():
    fixed = 0
    for f in STATIONS_DIR.glob("*-station.js"):
        fix_station(f)
        fixed += 1

    print(f"[STATS] Stations fixed: {fixed}")


if __name__ == "__main__":
    main()
