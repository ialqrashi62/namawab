#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
nm-fix-stations-v5.py
Last resort: aggressively remove ALL {{ and }} from station files
after placeholder substitution.
"""
import io
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

    # Step 1: placeholder substitution
    content = content.replace("{{code_short_pascal}}", pascal)

    # Step 2: brute force - replace ALL {{...}} pairs iteratively
    prev = None
    while content != prev:
        prev = content
        # Find innermost {{...}} (no nested braces inside)
        idx_open = content.find("{{")
        while idx_open != -1:
            # Find matching }}
            depth = 2
            i = idx_open + 2
            while i < len(content):
                if content[i:i+2] == "{{":
                    depth += 2
                    i += 2
                elif content[i:i+2] == "}}":
                    depth -= 2
                    if depth == 0:
                        # Replace {{...}} -> {inner}
                        inner = content[idx_open+2:i]
                        content = content[:idx_open] + "{" + inner + "}" + content[i+2:]
                        break
                    i += 2
                else:
                    i += 1
            if depth != 0:
                break
            idx_open = content.find("{{", idx_open)

    # Step 3: Fix ${{...}} -> ${...}
    import re
    content = re.sub(r'\$\{\{(\w+)\}\}', r'${\1}', content)

    file_path.write_text(content, encoding="utf-8")


def main():
    count = 0
    for f in STATIONS_DIR.glob("*-station.js"):
        fix_station(f)
        count += 1
    print(f"[STATS] Stations processed: {count}")


if __name__ == "__main__":
    main()
