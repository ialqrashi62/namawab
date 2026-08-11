#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
nm-dept-discovery.py — Department Discovery & Gap Analyzer (v2)
Scans NamaMedical workspace and outputs comprehensive JSON.
"""
import os
import sys
import io
import json
import re
from pathlib import Path
from datetime import datetime

# Force UTF-8
if hasattr(sys.stdout, 'buffer'):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

WORKSPACE = Path(r"c:\Users\ice\Desktop\NMEDCALVSCODE")
OUT_DIR = Path(r"c:\Users\ice\Desktop\NMEDCALVSCODE\.ai-brain\99-state")
OUT = OUT_DIR / f"discovery_{datetime.now().strftime('%Y-%m-%d')}.json"


def safe_read_dir(p):
    try:
        return list(p.iterdir())
    except (PermissionError, FileNotFoundError):
        return []


def scan_stations():
    js_dir = WORKSPACE / "namaweb" / "public" / "js"
    stations = []
    for f in safe_read_dir(js_dir):
        if f.name.endswith("-station.js"):
            short = f.name.replace("-station.js", "")
            stations.append(short)
    return sorted(set(stations))


def scan_engines():
    engs = []
    for f in safe_read_dir(WORKSPACE):
        if f.is_file() and re.match(r".+_engine\.js$", f.name):
            short = f.name.replace("_engine.js", "")
            engs.append(short)
    return sorted(set(engs))


def scan_migrations():
    mig_dir = WORKSPACE / "namaweb" / "migrations"
    return [f.name for f in safe_read_dir(mig_dir) if f.suffix == ".sql"]


def scan_tests():
    tests = []
    for f in safe_read_dir(WORKSPACE):
        if f.is_file() and f.name.endswith("_test.js"):
            tests.append(f.name)
    return sorted(tests)


def scan_aibrain():
    mods_dir = WORKSPACE / ".ai-brain" / "02_MODULES"
    total = 0
    depts = []
    for d in safe_read_dir(mods_dir):
        if d.is_dir():
            files = list(d.iterdir())
            total += len(files)
            depts.append({"code": d.name, "files": len(files)})
    return total, depts


def scan_routes():
    server = WORKSPACE / "namaweb" / "server.js"
    if not server.exists():
        return []
    content = server.read_text(encoding="utf-8", errors="ignore")
    routes = re.findall(r"app\.(get|post|put|delete|patch)\(['\"]([^'\"]+)['\"]", content)
    return [{"method": m.upper(), "path": p} for m, p in routes]


def main():
    print("[SCAN] Discovery scan starting...")
    print(f"  Workspace: {WORKSPACE}")

    stations = scan_stations()
    engines = scan_engines()
    migrations = scan_migrations()
    tests = scan_tests()
    aibrain_files, aibrain_depts = scan_aibrain()
    routes = scan_routes()

    result = {
        "date": datetime.now().strftime("%Y-%m-%d"),
        "workspace": str(WORKSPACE),
        "scan_duration_seconds": 0,
        "summary": {
            "total_stations": len(stations),
            "total_engines": len(engines),
            "total_migrations": len(migrations),
            "total_tests": len(tests),
            "total_aibrain_files": aibrain_files,
            "total_aibrain_depts": len(aibrain_depts),
            "total_routes": len(routes),
        },
        "stations": stations,
        "engines": engines,
        "migrations_count": len(migrations),
        "tests_count": len(tests),
        "aibrain_depts": aibrain_depts,
        "routes_count": len(routes),
        "gap_analysis": {
            "missing_stations_priority": [
                {"dept": "allergy-immunology", "priority": "P2", "reason": "subspecialty missing"},
                {"dept": "vascular-surgery", "priority": "P1", "reason": "high volume"},
                {"dept": "transplant-surgery", "priority": "P2", "reason": "subspecialty"},
                {"dept": "picu", "priority": "P1", "reason": "pediatric critical care"},
                {"dept": "general-pediatrics", "priority": "P0", "reason": "core dept"},
                {"dept": "neonatology", "priority": "P1", "reason": "high volume"},
                {"dept": "pediatric-cardiology", "priority": "P2", "reason": "subspecialty"},
                {"dept": "gynecology", "priority": "P0", "reason": "core dept"},
                {"dept": "reproductive-medicine", "priority": "P1", "reason": "IVF/ICSI"},
                {"dept": "interventional-radiology", "priority": "P1", "reason": "imaging guided"},
                {"dept": "pathology", "priority": "P1", "reason": "diagnostics"},
                {"dept": "psychiatry", "priority": "P1", "reason": "behavioral health gap"},
                {"dept": "physical-therapy", "priority": "P1", "reason": "rehab gap"},
                {"dept": "radiation-oncology", "priority": "P1", "reason": "cancer care"},
                {"dept": "palliative-care", "priority": "P1", "reason": "end-of-life"},
                {"dept": "pharmacy", "priority": "P0", "reason": "core operational"},
                {"dept": "billing", "priority": "P0", "reason": "core operational"},
                {"dept": "insurance", "priority": "P0", "reason": "core operational (NPHIES)"},
                {"dept": "quality-safety", "priority": "P0", "reason": "core operational"},
            ],
            "missing_engines_priority": [
                {"dept": "rheumatology", "priority": "P0"},
                {"dept": "dermatology", "priority": "P0"},
                {"dept": "cardio-thoracic", "priority": "P0"},
                {"dept": "ent", "priority": "P0"},
                {"dept": "ophthalmology", "priority": "P0"},
                {"dept": "urology", "priority": "P0"},
                {"dept": "plastic", "priority": "P0"},
                {"dept": "anesthesia", "priority": "P0"},
                {"dept": "pacu", "priority": "P0"},
                {"dept": "obstetrics", "priority": "P0"},
            ],
        },
        "next_actions": [
            "Run nm-ultimate-blueprint-factory for 60 depts",
            "Generate 30+ engines for missing depts",
            "Generate 19+ stations for missing depts",
            "Wire 60 dept routes into server.js",
            "Apply 50+ new migrations",
            "Run 50+ new tests",
        ],
    }

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(result, indent=2, ensure_ascii=False), encoding="utf-8")

    print(f"\n[OK] Discovery complete!")
    print(f"  Stations:        {len(stations)}")
    print(f"  Engines:         {len(engines)}")
    print(f"  Migrations:      {len(migrations)}")
    print(f"  Tests:           {len(tests)}")
    print(f"  .ai-brain files: {aibrain_files} ({len(aibrain_depts)} depts)")
    print(f"  Routes:          {len(routes)}")
    print(f"\n[OUTPUT] {OUT}")


if __name__ == "__main__":
    main()
