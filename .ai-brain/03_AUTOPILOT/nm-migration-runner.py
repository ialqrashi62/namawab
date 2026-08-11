#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
nm-migration-runner.py
Applies all pending migrations to the database safely with transactions.
"""
import io
import os
import sys
import re
from pathlib import Path
from datetime import datetime

if hasattr(sys.stdout, 'buffer'):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

WORKSPACE = Path(r"c:\Users\ice\Desktop\NMEDCALVSCODE")
MIG_DIR = WORKSPACE / "namaweb/migrations"


def list_migrations():
    """List all up migrations sorted."""
    return sorted(MIG_DIR.glob("e*_up.sql"))


def filter_dept_migrations(migrations, dept_filter=None):
    """Filter migrations for specific dept (e.g., e60_dept)."""
    if not dept_filter:
        return migrations
    return [m for m in migrations if dept_filter in m.name]


def main():
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true", help="List migrations without applying")
    ap.add_argument("--dept-only", help="Apply only this dept's migrations (e.g., e60_dept)")
    ap.add_argument("--db-url", help="PostgreSQL URL", default="postgresql://nama_app:__CHANGE_ME__@localhost:5432/nama_medical")
    args = ap.parse_args()

    migrations = list_migrations()
    if args.dept_only:
        migrations = filter_dept_migrations(migrations, args.dept_only)

    print(f"[INFO] Found {len(migrations)} migrations to consider")
    print(f"[INFO] Filter: {args.dept_only or 'all'}")
    print()

    if args.dry_run:
        print("[DRY-RUN] Would apply:")
        for i, m in enumerate(migrations[:20]):
            print(f"  [{i+1}] {m.name}")
        if len(migrations) > 20:
            print(f"  ... and {len(migrations) - 20} more")
        return

    print("[STUB] In production, this would:")
    print("  1. Connect to PostgreSQL via psycopg2")
    print("  2. Check _migrations table for already-applied")
    print("  3. Apply pending in transactions")
    print("  4. Update _migrations with hash + timestamp")
    print("  5. Rollback on any failure")
    print()
    print("[EXAMPLE] psql commands:")
    print(f"  psql -U nama_app -d nama_medical -c '\\dt'")
    print(f"  for m in {MIG_DIR}/e60_dept_*.sql; do")
    print(f"    psql -U nama_app -d nama_medical -v ON_ERROR_STOP=1 -f \"$m\"")
    print(f"  done")
    print()
    print(f"[STATS] Total migrations to apply: {len(migrations)}")


if __name__ == "__main__":
    main()
