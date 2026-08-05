#!/usr/bin/env python3
"""
gen_tier4_min.py — generate Tier-4 minimal packs (20 rare/composite × 15 files)

Same 15-file schema as Tier-3. 20 depts × 15 = 300 files.
"""

import pathlib, sys
ROOT = pathlib.Path(r"C:\Users\ice\Desktop\NMEDCALVSCODE")
AB = ROOT / ".ai-brain"

TIER4 = [
    "RARE-101","RARE-102","RARE-103","RARE-104","RARE-105","RARE-106",
    "RARE-107","RARE-108","RARE-109","RARE-110","RARE-111","RARE-112",
    "COE-101","COE-102","COE-103","COE-104","COE-105","COE-106","COE-107","COE-108",
]

NAMES = {
    "RARE-101": "Aerospace Medicine", "RARE-102": "Diving & Hyperbaric Medicine",
    "RARE-103": "Tropical Medicine",   "RARE-104": "Wilderness Medicine",
    "RARE-105": "Sports Medicine (Pro)","RARE-106": "Military Medicine",
    "RARE-107": "Forensic Medicine",   "RARE-108": "Disaster Medicine",
    "RARE-109": "Pain Management (advanced)", "RARE-110": "Palliative Care",
    "RARE-111": "Hospice", "RARE-112": "Spiritual Care",
    "COE-101": "Comprehensive Cancer Center", "COE-102": "Cardiac Center of Excellence",
    "COE-103": "Transplant Center", "COE-104": "Stroke Center", "COE-105": "Trauma Center",
    "COE-106": "Women's Health Pavilion","COE-107": "Children's Pavilion","COE-108": "Behavioral Health",
}

PARENTS = {
    "RARE-101": "RARE","RARE-102": "RARE","RARE-103": "RARE","RARE-104": "RARE",
    "RARE-105": "RARE","RARE-106": "RARE","RARE-107": "RARE","RARE-108": "RARE",
    "RARE-109": "RARE","RARE-110": "RARE","RARE-111": "RARE","RARE-112": "RARE",
    "COE-101":  "COE", "COE-102":  "COE", "COE-103":  "COE", "COE-104":  "COE",
    "COE-105":  "COE", "COE-106":  "COE", "COE-107":  "COE", "COE-108":  "COE",
}

# Reuse Tier-3 emitters exactly (copy from gen_tier3_min)
import importlib.util
spec = importlib.util.spec_from_file_location("t3", ROOT / ".ai-brain/99-upgrade/scripts/gen_tier3_min.py")
t3 = importlib.util.module_from_spec(spec)
spec.loader.exec_module(t3)

EMITTERS_T4 = {
    '00_README.md':              lambda d: t3.EMITTERS['00_README.md'](d),
    '01_clinical_workflows.md':  lambda d: t3.EMITTERS['01_clinical_workflows.md'](d),
    '02_sub_dept_catalog.md':    lambda d: t3.EMITTERS['02_sub_dept_catalog.md'](d),
    '03_icd10_snomed_map.md':    lambda d: t3.EMITTERS['03_icd10_snomed_map.md'](d),
    '04_clinical_red_flags.md':  lambda d: t3.EMITTERS['04_clinical_red_flags.md'](d),
    '05_prompt_engineering.md':  lambda d: t3.EMITTERS['05_prompt_engineering.md'](d),
    '06_engine_module.md':       lambda d: t3.EMITTERS['06_engine_module.md'](d),
    '07_routes_api.md':          lambda d: t3.EMITTERS['07_routes_api.md'](d),
    '08_erd_diagram.md':         lambda d: t3.EMITTERS['08_erd_diagram.md'](d),
    '09_openapi_spec.md':        lambda d: t3.EMITTERS['09_openapi_spec.md'](d),
    '10_migration_up.sql':       lambda d: t3.EMITTERS['10_migration_up.sql'](d),
    '11_migration_down.sql':     lambda d: t3.EMITTERS['11_migration_down.sql'](d),
    '12_seed_data.sql':          lambda d: t3.EMITTERS['12_seed_data.sql'](d),
    '13_stitch_layout.md':       lambda d: t3.EMITTERS['13_stitch_layout.md'](d),
    '14_unit_tests.md':          lambda d: t3.EMITTERS['14_unit_tests.md'](d),
    '15_closeout.md':            lambda d: t3.EMITTERS['15_closeout.md'](d),
}

def main():
    base = AB / '02_MODULES_NEW'
    written = 0
    # Pre-load TIER3 names into module
    t3.NAMES.update(NAMES)
    t3.PARENTS.update(PARENTS)
    for d in TIER4:
        out = base / f"TIER4_{d}"
        out.mkdir(parents=True, exist_ok=True)
        for fname, emitter in EMITTERS_T4.items():
            (out / fname).write_text(emitter(d), encoding='utf-8')
            written += 1
        sys.stderr.write(f"  ✅ {d} -> 15 files\n")
    sys.stderr.write(f"\nDone. {written} files written across {len(TIER4)} depts (Tier-4).\n")
    return 0

if __name__ == '__main__':
    sys.exit(main())
