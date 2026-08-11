#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
nm-migration-generator.py
Generates forward + reverse migrations per dept.
Uses simple string concat (no str.format) to avoid brace issues.
"""
import io
import os
import sys
import yaml
from pathlib import Path
from datetime import datetime

if hasattr(sys.stdout, 'buffer'):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

WORKSPACE = Path(r"c:\Users\ice\Desktop\NMEDCALVSCODE")
MIG_DIR = WORKSPACE / "namaweb/migrations"


def make_up_migration(code_short, name_en, code, date):
    # Use %% in some places to be safe with .format
    return (
        "-- filepath: namaweb/migrations/e60_dept_" + code + "_up.sql\n"
        "-- " + name_en + " (" + code + ") Migration UP - Generated " + date + "\n"
        "-- Series: e60_dept_" + code_short + "\n"
        "BEGIN;\n\n"
        "CREATE TABLE IF NOT EXISTS " + code_short + "_encounters (\n"
        "  id BIGSERIAL PRIMARY KEY,\n"
        "  tenant_id BIGINT NOT NULL,\n"
        "  patient_id BIGINT NOT NULL,\n"
        "  encounter_type TEXT NOT NULL DEFAULT 'outpatient',\n"
        "  chief_complaint TEXT,\n"
        "  diagnosis_codes TEXT[] NOT NULL DEFAULT '{}',\n"
        "  status TEXT NOT NULL DEFAULT 'active',\n"
        "  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),\n"
        "  ended_at TIMESTAMPTZ,\n"
        "  notes TEXT,\n"
        "  signed_at TIMESTAMPTZ,\n"
        "  signed_by BIGINT,\n"
        "  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),\n"
        "  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),\n"
        "  deleted_at TIMESTAMPTZ\n"
        ");\n"
        "ALTER TABLE " + code_short + "_encounters ENABLE ROW LEVEL SECURITY;\n"
        "ALTER TABLE " + code_short + "_encounters FORCE ROW LEVEL SECURITY;\n"
        "DROP POLICY IF EXISTS " + code_short + "_enc_iso ON " + code_short + "_encounters;\n"
        "CREATE POLICY " + code_short + "_enc_iso ON " + code_short + "_encounters\n"
        "  USING (tenant_id = current_setting('app.tenant_id', true)::BIGINT);\n"
        "CREATE INDEX IF NOT EXISTS idx_" + code_short + "_enc_tenant ON " + code_short + "_encounters(tenant_id);\n"
        "CREATE INDEX IF NOT EXISTS idx_" + code_short + "_enc_patient ON " + code_short + "_encounters(tenant_id, patient_id);\n"
        "CREATE INDEX IF NOT EXISTS idx_" + code_short + "_enc_status ON " + code_short + "_encounters(tenant_id, status);\n\n"
        "CREATE TABLE IF NOT EXISTS " + code_short + "_orders (\n"
        "  id BIGSERIAL PRIMARY KEY,\n  tenant_id BIGINT NOT NULL,\n  patient_id BIGINT NOT NULL,\n"
        "  encounter_id BIGINT, order_type TEXT NOT NULL, order_code TEXT NOT NULL,\n"
        "  order_detail JSONB NOT NULL DEFAULT '{}'::jsonb,\n"
        "  priority TEXT NOT NULL DEFAULT 'routine',\n"
        "  status TEXT NOT NULL DEFAULT 'pending',\n"
        "  ordered_by BIGINT NOT NULL,\n"
        "  ordered_at TIMESTAMPTZ NOT NULL DEFAULT now(),\n"
        "  completed_at TIMESTAMPTZ, created_at TIMESTAMPTZ NOT NULL DEFAULT now(),\n"
        "  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()\n"
        ");\n"
        "ALTER TABLE " + code_short + "_orders ENABLE ROW LEVEL SECURITY;\n"
        "ALTER TABLE " + code_short + "_orders FORCE ROW LEVEL SECURITY;\n"
        "DROP POLICY IF EXISTS " + code_short + "_orders_iso ON " + code_short + "_orders;\n"
        "CREATE POLICY " + code_short + "_orders_iso ON " + code_short + "_orders\n"
        "  USING (tenant_id = current_setting('app.tenant_id', true)::BIGINT);\n"
        "CREATE INDEX IF NOT EXISTS idx_" + code_short + "_orders_tenant ON " + code_short + "_orders(tenant_id);\n"
        "CREATE INDEX IF NOT EXISTS idx_" + code_short + "_orders_patient ON " + code_short + "_orders(tenant_id, patient_id);\n\n"
        "CREATE TABLE IF NOT EXISTS " + code_short + "_results (\n"
        "  id BIGSERIAL PRIMARY KEY,\n  tenant_id BIGINT NOT NULL,\n  patient_id BIGINT NOT NULL,\n"
        "  encounter_id BIGINT, order_id BIGINT, result_type TEXT NOT NULL,\n"
        "  result_value TEXT, result_unit TEXT, reference_range TEXT, abnormal_flag TEXT,\n"
        "  result_at TIMESTAMPTZ NOT NULL DEFAULT now(),\n"
        "  created_at TIMESTAMPTZ NOT NULL DEFAULT now()\n"
        ");\n"
        "ALTER TABLE " + code_short + "_results ENABLE ROW LEVEL SECURITY;\n"
        "ALTER TABLE " + code_short + "_results FORCE ROW LEVEL SECURITY;\n"
        "DROP POLICY IF EXISTS " + code_short + "_results_iso ON " + code_short + "_results;\n"
        "CREATE POLICY " + code_short + "_results_iso ON " + code_short + "_results\n"
        "  USING (tenant_id = current_setting('app.tenant_id', true)::BIGINT);\n"
        "CREATE INDEX IF NOT EXISTS idx_" + code_short + "_results_tenant ON " + code_short + "_results(tenant_id);\n\n"
        "CREATE TABLE IF NOT EXISTS " + code_short + "_notes (\n"
        "  id BIGSERIAL PRIMARY KEY,\n  tenant_id BIGINT NOT NULL,\n  patient_id BIGINT NOT NULL,\n"
        "  encounter_id BIGINT, note_type TEXT NOT NULL DEFAULT 'progress',\n"
        "  note_text TEXT NOT NULL, signed_at TIMESTAMPTZ, signed_by BIGINT,\n"
        "  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),\n"
        "  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()\n"
        ");\n"
        "ALTER TABLE " + code_short + "_notes ENABLE ROW LEVEL SECURITY;\n"
        "ALTER TABLE " + code_short + "_notes FORCE ROW LEVEL SECURITY;\n"
        "DROP POLICY IF EXISTS " + code_short + "_notes_iso ON " + code_short + "_notes;\n"
        "CREATE POLICY " + code_short + "_notes_iso ON " + code_short + "_notes\n"
        "  USING (tenant_id = current_setting('app.tenant_id', true)::BIGINT);\n"
        "CREATE INDEX IF NOT EXISTS idx_" + code_short + "_notes_tenant ON " + code_short + "_notes(tenant_id);\n\n"
        "CREATE TABLE IF NOT EXISTS " + code_short + "_audit (\n"
        "  id BIGSERIAL PRIMARY KEY,\n  tenant_id BIGINT NOT NULL,\n  actor_id BIGINT NOT NULL,\n"
        "  action TEXT NOT NULL, entity TEXT NOT NULL, entity_id BIGINT,\n"
        "  prev_hash TEXT, curr_hash TEXT NOT NULL,\n"
        "  payload JSONB NOT NULL DEFAULT '{}'::jsonb,\n"
        "  created_at TIMESTAMPTZ NOT NULL DEFAULT now()\n"
        ");\n"
        "ALTER TABLE " + code_short + "_audit ENABLE ROW LEVEL SECURITY;\n"
        "ALTER TABLE " + code_short + "_audit FORCE ROW LEVEL SECURITY;\n"
        "DROP POLICY IF EXISTS " + code_short + "_audit_iso ON " + code_short + "_audit;\n"
        "CREATE POLICY " + code_short + "_audit_iso ON " + code_short + "_audit\n"
        "  USING (tenant_id = current_setting('app.tenant_id', true)::BIGINT);\n"
        "CREATE INDEX IF NOT EXISTS idx_" + code_short + "_audit_tenant ON " + code_short + "_audit(tenant_id, created_at);\n"
        "COMMIT;\n"
    )


def make_down_migration(code_short, name_en, code, date):
    return (
        "-- filepath: namaweb/migrations/e60_dept_" + code + "_down.sql\n"
        "-- " + name_en + " (" + code + ") Migration DOWN - Generated " + date + "\n"
        "-- Reverse of e60_dept_" + code + "_up.sql (NON-DESTRUCTIVE)\n"
        "BEGIN;\n"
        "DROP POLICY IF EXISTS " + code_short + "_audit_iso ON " + code_short + "_audit;\n"
        "ALTER TABLE IF EXISTS " + code_short + "_audit DISABLE ROW LEVEL SECURITY;\n"
        "DROP TABLE IF EXISTS " + code_short + "_audit;\n"
        "DROP POLICY IF EXISTS " + code_short + "_notes_iso ON " + code_short + "_notes;\n"
        "ALTER TABLE IF EXISTS " + code_short + "_notes DISABLE ROW LEVEL SECURITY;\n"
        "DROP TABLE IF EXISTS " + code_short + "_notes;\n"
        "DROP POLICY IF EXISTS " + code_short + "_results_iso ON " + code_short + "_results;\n"
        "ALTER TABLE IF EXISTS " + code_short + "_results DISABLE ROW LEVEL SECURITY;\n"
        "DROP TABLE IF EXISTS " + code_short + "_results;\n"
        "DROP POLICY IF EXISTS " + code_short + "_orders_iso ON " + code_short + "_orders;\n"
        "ALTER TABLE IF EXISTS " + code_short + "_orders DISABLE ROW LEVEL SECURITY;\n"
        "DROP TABLE IF EXISTS " + code_short + "_orders;\n"
        "DROP POLICY IF EXISTS " + code_short + "_enc_iso ON " + code_short + "_encounters;\n"
        "ALTER TABLE IF EXISTS " + code_short + "_encounters DISABLE ROW LEVEL SECURITY;\n"
        "DROP TABLE IF EXISTS " + code_short + "_encounters;\n"
        "COMMIT;\n"
    )


def main():
    cfg_path = WORKSPACE / ".ai-brain/03_AUTOPILOT/dept_config_all.yaml"
    with open(cfg_path, "r", encoding="utf-8") as f:
        cfg = yaml.safe_load(f)

    date = datetime.now().strftime("%Y-%m-%d")
    up_count, down_count, skipped = 0, 0, 0
    for dept in cfg["depts"]:
        code = dept["code"]
        code_short = dept["code_short"]
        name_en = dept["name_en"]
        up_path = MIG_DIR / f"e60_dept_{code}_up.sql"
        if up_path.exists():
            skipped += 1
            continue
        up_path.write_text(make_up_migration(code_short, name_en, code, date), encoding="utf-8")
        down_path = MIG_DIR / f"e60_dept_{code}_down.sql"
        down_path.write_text(make_down_migration(code_short, name_en, code, date), encoding="utf-8")
        up_count += 1
        down_count += 1

    print(f"[STATS] Migrations generated: {up_count} up, {down_count} down")
    print(f"[STATS] Skipped (existing): {skipped}")


if __name__ == "__main__":
    main()
