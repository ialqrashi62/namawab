#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
nm-i18n-merger.py
Merges all 26_i18n_ar.json + 27_i18n_en.json into a unified
.namaweb/public/js/i18n_{code_short}.json (or similar).
"""
import io
import os
import sys
import json
import yaml
from pathlib import Path
from datetime import datetime

if hasattr(sys.stdout, 'buffer'):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

WORKSPACE = Path(r"c:\Users\ice\Desktop\NMEDCALVSCODE")
MODULES_DIR = WORKSPACE / ".ai-brain/02_MODULES"
JS_I18N_DIR = WORKSPACE / "namaweb/public/js"


def merge_i18n():
    """Merge all dept i18n into one file."""
    merged_ar = {}
    merged_en = {}

    for dept_dir in sorted(MODULES_DIR.iterdir()):
        if not dept_dir.is_dir():
            continue
        ar_path = dept_dir / "26_i18n_ar.json"
        en_path = dept_dir / "27_i18n_en.json"
        if not ar_path.exists() or not en_path.exists():
            continue
        try:
            ar_data = json.loads(ar_path.read_text(encoding="utf-8"))
            en_data = json.loads(en_path.read_text(encoding="utf-8"))
            merged_ar.update(ar_data)
            merged_en.update(en_data)
        except Exception as e:
            print(f"  [WARN] {dept_dir.name}: {e}")

    # Write merged file
    out_path = JS_I18N_DIR / "i18n_medical.json"
    out_data = {"ar": merged_ar, "en": merged_en, "_generated": datetime.now().isoformat()}
    out_path.write_text(json.dumps(out_data, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"[STATS] Merged AR: {len(merged_ar)} keys, EN: {len(merged_en)} keys")
    print(f"[OUTPUT] {out_path}")


def main():
    merge_i18n()


if __name__ == "__main__":
    main()
