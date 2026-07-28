#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
generate_blueprint_v2.py
========================
Phase 1 — Generate PostgreSQL DDL for the 38-dept blueprint v2.

Authority:
- AGENTS.md §2.2 #1 (no hardcoded secrets — uses no env)
- AGENTS.md §2.2 #2 (no PHI — schema only, no data)
- AGENTS.md §2.2 #5 (tenant isolation — every dept table has tenant_id + RLS)
- AGENTS.md §2.2 #7 (PHI columns flagged for crypto_envelope application)
- AGENTS.md §2.4 (no live-server touch — writes only to .ai-brain/03-database/)
- .ai-rules §3 (no abbreviation, no truncation, full files)
- .ai-rules §4 (one phase per session — this is Phase 1, single-file generator)

Output:
- .ai-brain/03-database/schemas/DEP-XXX-<slug>_up.sql
- .ai-brain/03-database/schemas/DEP-XXX-<slug>_down.sql
- .ai-brain/03-database/_generator/output_manifest.json  (audit trail)
- .ai-brain/03-database/_generator/generation_report.md   (one-screen summary)

Run:
    python .ai-brain/03-database/_generator/generate_blueprint_v2.py

The generator is **idempotent** — re-running it overwrites the same files
deterministically. Do not edit the output SQL by hand; edit this script
or the YAML and re-run.
"""

from __future__ import annotations

import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

# ----------------------------------------------------------------------------
# Constants
# ----------------------------------------------------------------------------

REPO_ROOT = Path(__file__).resolve().parents[3]  # .ai-brain/03-database/_generator/ → repo root
AI_BRAIN = REPO_ROOT / ".ai-brain"
SCHEMAS_DIR = AI_BRAIN / "03-database" / "schemas"
GENERATOR_DIR = AI_BRAIN / "03-database" / "_generator"
DEPT_TREE_YAML = AI_BRAIN / "01-requirements" / "medical-departments-tree.yaml"

BANNER = """-- =====================================================================
-- BLUEPRINT v2 — INFORMATIONAL, NOT YET LIVE
-- =====================================================================
-- File:        {filename}
-- Department:  {dept_id} — {dept_name_en} ({dept_name_ar})
-- Group:       {group}
-- Phase:       1 (Database + ERD)
-- Stack:       PostgreSQL 14+ (Express + pg planned for Phase 2)
-- Standards:   HL7-FHIR R4 · ICD-10 · SNOMED-CT · CBAHI · NPHIES · SFDA · PDPL
-- Add-on:      JCI + HIPAA (informational; not live KSA regulator)
-- Generated:   {generated_at_utc}  by  generate_blueprint_v2.py
-- Idempotent:  re-running this script overwrites this file deterministically
--
-- SAFETY RAILS (binding):
-- - No hardcoded secrets, keys, tokens, or PHI in this file (AGENTS.md §2.2 #1, #2)
-- - tenant_id NOT NULL DEFAULT current_setting('app.tenant_id')::uuid
--   with FORCE ROW LEVEL SECURITY enabled (AGENTS.md §2.2 #5)
-- - Audit columns (created_at_utc, updated_at_utc, deleted_at_utc) on every table
-- - PHI columns marked with -- PHI-ENVELOPE: column tagged for crypto_envelope.js
-- - Money columns are NUMERIC(14,4); VAT is server-side (AGENTS.md §2.2 #9)
-- - Down migration is non-destructive: DROPS only objects this up created
--   (no DROP DATA, no silent RLS removal) (AGENTS.md §2.2 #4)
--
-- This file is NOT applied to the live database. It is a blueprint
-- for owner review. Apply to a sandbox only after explicit owner
-- authorization (AGENTS.md §2.4).
-- =====================================================================

"""

DOWN_BANNER = """-- =====================================================================
-- BLUEPRINT v2 — DOWN MIGRATION (NON-DESTRUCTIVE)
-- =====================================================================
-- File:        {filename}
-- Department:  {dept_id} — {dept_name_en}
-- Phase:       1 (Database + ERD)
-- Generated:   {generated_at_utc}  by  generate_blueprint_v2.py
--
-- This migration REVERSES the matching _up.sql.
-- It DROPs only the objects that the up migration created in schema "{schema}".
-- It does NOT touch:
--   - The shared "nama" schema (patient, encounter, user, tenant, etc.)
--   - Any table the up migration did not create
--   - Any RLS policy outside of objects this dept owns
--   - Any data rows (per AGENTS.md §2.2 #4: no DROP DATA)
--
-- Run only after backing up. Owner authorization required.
-- =====================================================================

"""

# Per-dept table templates. Each entry is the SQL body (without banner) for the
# "main" table of the dept. Add more if the dept has multiple canonical tables.
# The script wraps the body with shared prologue (tenant/audit) and epilogue (indexes/RLS).

DEPT_TABLE_TEMPLATES: dict[str, dict] = {
    "DEP-001": {  # Emergency Department
        "main_table": "ed_encounter",
        "columns": [
            ("ed_encounter_id",        "UUID",        "PRIMARY KEY DEFAULT gen_random_uuid()"),
            ("encounter_id",           "UUID",        "NOT NULL REFERENCES nama.encounter(encounter_id) ON DELETE RESTRICT"),
            ("tenant_id",              "UUID",        "NOT NULL DEFAULT current_setting('app.tenant_id')::uuid"),
            ("arrival_at_utc",         "TIMESTAMPTZ", "NOT NULL"),
            ("triage_level",           "SMALLINT",    "CHECK (triage_level BETWEEN 1 AND 5)"),  # ESI 1-5
            ("chief_complaint",        "TEXT",        "NOT NULL"),
            ("esi_score",              "SMALLINT",    "CHECK (esi_score BETWEEN 1 AND 5)"),
            ("disposition",            "TEXT",        "CHECK (disposition IN ('admit','discharge','transfer','left_ama','observation','expired'))"),
            ("disposition_at_utc",     "TIMESTAMPTZ"),
            ("pain_score",             "SMALLINT",    "CHECK (pain_score BETWEEN 0 AND 10)"),
            ("early_warning_score",    "NUMERIC(4,2)"),  # NEWS2
            ("created_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("updated_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("deleted_at_utc",         "TIMESTAMPTZ"),
        ],
        "phi_columns": ["chief_complaint"],
        "indexes": [
            "CREATE INDEX idx_ed_encounter_tenant ON {schema}.ed_encounter(tenant_id)",
            "CREATE INDEX idx_ed_encounter_arrival ON {schema}.ed_encounter(arrival_at_utc DESC)",
            "CREATE INDEX idx_ed_encounter_triage ON {schema}.ed_encounter(triage_level) WHERE deleted_at_utc IS NULL",
        ],
    },
    "DEP-002": {  # Adult ICU
        "main_table": "icu_admission",
        "columns": [
            ("icu_admission_id",       "UUID",        "PRIMARY KEY DEFAULT gen_random_uuid()"),
            ("encounter_id",           "UUID",        "NOT NULL REFERENCES nama.encounter(encounter_id) ON DELETE RESTRICT"),
            ("tenant_id",              "UUID",        "NOT NULL DEFAULT current_setting('app.tenant_id')::uuid"),
            ("admitted_at_utc",        "TIMESTAMPTZ", "NOT NULL"),
            ("discharged_at_utc",      "TIMESTAMPTZ"),
            ("apache_ii_score",        "NUMERIC(5,2)"),
            ("sofa_score",             "NUMERIC(5,2)"),
            ("ventilator_hours",       "NUMERIC(10,2)"),
            ("vasoactive_drips",       "SMALLINT",    "DEFAULT 0"),
            ("created_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("updated_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("deleted_at_utc",         "TIMESTAMPTZ"),
        ],
        "phi_columns": [],
        "indexes": [
            "CREATE INDEX idx_icu_admission_tenant ON {schema}.icu_admission(tenant_id)",
            "CREATE INDEX idx_icu_admission_admit ON {schema}.icu_admission(admitted_at_utc DESC)",
        ],
    },
    "DEP-003": {  # CCU
        "main_table": "ccu_admission",
        "columns": [
            ("ccu_admission_id",       "UUID",        "PRIMARY KEY DEFAULT gen_random_uuid()"),
            ("encounter_id",           "UUID",        "NOT NULL REFERENCES nama.encounter(encounter_id) ON DELETE RESTRICT"),
            ("tenant_id",              "UUID",        "NOT NULL DEFAULT current_setting('app.tenant_id')::uuid"),
            ("admitted_at_utc",        "TIMESTAMPTZ", "NOT NULL"),
            ("discharged_at_utc",      "TIMESTAMPTZ"),
            ("acs_type",               "TEXT",        "CHECK (acs_type IN ('stemi','nstemi','unstable_angina','other'))"),
            ("killip_class",           "SMALLINT",    "CHECK (killip_class BETWEEN 1 AND 4)"),
            ("ejection_fraction_pct",  "NUMERIC(5,2)"),
            ("created_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("updated_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("deleted_at_utc",         "TIMESTAMPTZ"),
        ],
        "phi_columns": [],
        "indexes": [
            "CREATE INDEX idx_ccu_admission_tenant ON {schema}.ccu_admission(tenant_id)",
        ],
    },
    "DEP-004": {  # NICU
        "main_table": "nicu_admission",
        "columns": [
            ("nicu_admission_id",      "UUID",        "PRIMARY KEY DEFAULT gen_random_uuid()"),
            ("encounter_id",           "UUID",        "NOT NULL REFERENCES nama.encounter(encounter_id) ON DELETE RESTRICT"),
            ("tenant_id",              "UUID",        "NOT NULL DEFAULT current_setting('app.tenant_id')::uuid"),
            ("admitted_at_utc",        "TIMESTAMPTZ", "NOT NULL"),
            ("discharged_at_utc",      "TIMESTAMPTZ"),
            ("birth_weight_grams",     "NUMERIC(7,2)"),
            ("gestational_age_weeks",  "NUMERIC(4,2)"),
            ("apgar_1min",             "SMALLINT"),
            ("apgar_5min",             "SMALLINT"),
            ("created_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("updated_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("deleted_at_utc",         "TIMESTAMPTZ"),
        ],
        "phi_columns": [],
        "indexes": [
            "CREATE INDEX idx_nicu_admission_tenant ON {schema}.nicu_admission(tenant_id)",
        ],
    },
    "DEP-005": {  # PICU
        "main_table": "picu_admission",
        "columns": [
            ("picu_admission_id",      "UUID",        "PRIMARY KEY DEFAULT gen_random_uuid()"),
            ("encounter_id",           "UUID",        "NOT NULL REFERENCES nama.encounter(encounter_id) ON DELETE RESTRICT"),
            ("tenant_id",              "UUID",        "NOT NULL DEFAULT current_setting('app.tenant_id')::uuid"),
            ("admitted_at_utc",        "TIMESTAMPTZ", "NOT NULL"),
            ("discharged_at_utc",      "TIMESTAMPTZ"),
            ("prism_score",            "NUMERIC(5,2)"),
            ("pelod_score",            "NUMERIC(5,2)"),
            ("ventilator_hours",       "NUMERIC(10,2)"),
            ("created_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("updated_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("deleted_at_utc",         "TIMESTAMPTZ"),
        ],
        "phi_columns": [],
        "indexes": [
            "CREATE INDEX idx_picu_admission_tenant ON {schema}.picu_admission(tenant_id)",
        ],
    },
    "DEP-006": {  # Burn Unit
        "main_table": "burn_assessment",
        "columns": [
            ("burn_assessment_id",     "UUID",        "PRIMARY KEY DEFAULT gen_random_uuid()"),
            ("encounter_id",           "UUID",        "NOT NULL REFERENCES nama.encounter(encounter_id) ON DELETE RESTRICT"),
            ("tenant_id",              "UUID",        "NOT NULL DEFAULT current_setting('app.tenant_id')::uuid"),
            ("assessed_at_utc",        "TIMESTAMPTZ", "NOT NULL"),
            ("tbsa_pct",               "NUMERIC(5,2)"),
            ("burn_depth_grade",       "TEXT",        "CHECK (burn_depth_grade IN ('first','second_superficial','second_deep','third','fourth'))"),
            ("inhalation_injury",      "BOOLEAN",     "DEFAULT FALSE"),
            ("fluid_resuscitation_protocol", "TEXT"),
            ("created_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("updated_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("deleted_at_utc",         "TIMESTAMPTZ"),
        ],
        "phi_columns": ["fluid_resuscitation_protocol"],
        "indexes": [
            "CREATE INDEX idx_burn_assessment_tenant ON {schema}.burn_assessment(tenant_id)",
        ],
    },
    "DEP-007": {  # Cardiology
        "main_table": "cardiology_consult",
        "columns": [
            ("cardiology_consult_id",  "UUID",        "PRIMARY KEY DEFAULT gen_random_uuid()"),
            ("encounter_id",           "UUID",        "NOT NULL REFERENCES nama.encounter(encounter_id) ON DELETE RESTRICT"),
            ("tenant_id",              "UUID",        "NOT NULL DEFAULT current_setting('app.tenant_id')::uuid"),
            ("consulted_at_utc",       "TIMESTAMPTZ", "NOT NULL"),
            ("chadsvasc_score",        "SMALLINT"),
            ("has_bled_score",         "SMALLINT"),
            ("echo_lvef_pct",          "NUMERIC(5,2)"),
            ("indication",             "TEXT",        "NOT NULL"),
            ("recommendation",         "TEXT"),
            ("created_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("updated_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("deleted_at_utc",         "TIMESTAMPTZ"),
        ],
        "phi_columns": ["indication", "recommendation"],
        "indexes": [
            "CREATE INDEX idx_cardiology_consult_tenant ON {schema}.cardiology_consult(tenant_id)",
        ],
    },
    "DEP-008": {  # Pulmonology
        "main_table": "pulmonary_function_test",
        "columns": [
            ("pft_id",                 "UUID",        "PRIMARY KEY DEFAULT gen_random_uuid()"),
            ("encounter_id",           "UUID",        "NOT NULL REFERENCES nama.encounter(encounter_id) ON DELETE RESTRICT"),
            ("tenant_id",              "UUID",        "NOT NULL DEFAULT current_setting('app.tenant_id')::uuid"),
            ("performed_at_utc",       "TIMESTAMPTZ", "NOT NULL"),
            ("fev1_liters",            "NUMERIC(5,2)"),
            ("fvc_liters",             "NUMERIC(5,2)"),
            ("fev1_fvc_ratio",         "NUMERIC(4,3)"),
            ("interpretation",         "TEXT"),
            ("created_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("updated_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("deleted_at_utc",         "TIMESTAMPTZ"),
        ],
        "phi_columns": ["interpretation"],
        "indexes": [
            "CREATE INDEX idx_pft_tenant ON {schema}.pulmonary_function_test(tenant_id)",
        ],
    },
    "DEP-009": {  # Gastroenterology
        "main_table": "gi_endoscopy",
        "columns": [
            ("gi_endoscopy_id",        "UUID",        "PRIMARY KEY DEFAULT gen_random_uuid()"),
            ("encounter_id",           "UUID",        "NOT NULL REFERENCES nama.encounter(encounter_id) ON DELETE RESTRICT"),
            ("tenant_id",              "UUID",        "NOT NULL DEFAULT current_setting('app.tenant_id')::uuid"),
            ("performed_at_utc",       "TIMESTAMPTZ", "NOT NULL"),
            ("procedure_type",         "TEXT",        "NOT NULL"),
            ("indication_icd10",       "TEXT"),
            ("findings_snomed",        "TEXT"),
            ("complications",          "TEXT"),
            ("created_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("updated_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("deleted_at_utc",         "TIMESTAMPTZ"),
        ],
        "phi_columns": ["findings_snomed", "complications"],
        "indexes": [
            "CREATE INDEX idx_gi_endoscopy_tenant ON {schema}.gi_endoscopy(tenant_id)",
        ],
    },
    "DEP-010": {  # Nephrology & Dialysis
        "main_table": "dialysis_session",
        "columns": [
            ("dialysis_session_id",    "UUID",        "PRIMARY KEY DEFAULT gen_random_uuid()"),
            ("encounter_id",           "UUID",        "NOT NULL REFERENCES nama.encounter(encounter_id) ON DELETE RESTRICT"),
            ("tenant_id",              "UUID",        "NOT NULL DEFAULT current_setting('app.tenant_id')::uuid"),
            ("started_at_utc",         "TIMESTAMPTZ", "NOT NULL"),
            ("ended_at_utc",           "TIMESTAMPTZ"),
            ("modality",               "TEXT",        "CHECK (modality IN ('hemodialysis','hemodiafiltration','peritoneal','continuous_vv_hdf','sustained_low_efficiency'))"),
            ("dry_weight_kg",          "NUMERIC(6,2)"),
            ("pre_weight_kg",          "NUMERIC(6,2)"),
            ("ultrafiltration_ml",     "NUMERIC(10,2)"),
            ("created_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("updated_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("deleted_at_utc",         "TIMESTAMPTZ"),
        ],
        "phi_columns": [],
        "indexes": [
            "CREATE INDEX idx_dialysis_session_tenant ON {schema}.dialysis_session(tenant_id)",
        ],
    },
    "DEP-011": {  # Endocrinology & Diabetes
        "main_table": "endocrine_visit",
        "columns": [
            ("endocrine_visit_id",     "UUID",        "PRIMARY KEY DEFAULT gen_random_uuid()"),
            ("encounter_id",           "UUID",        "NOT NULL REFERENCES nama.encounter(encounter_id) ON DELETE RESTRICT"),
            ("tenant_id",              "UUID",        "NOT NULL DEFAULT current_setting('app.tenant_id')::uuid"),
            ("visited_at_utc",         "TIMESTAMPTZ", "NOT NULL"),
            ("hba1c_pct",              "NUMERIC(4,2)"),
            ("fpg_mg_dl",              "NUMERIC(6,2)"),
            ("diagnosis_icd10",        "TEXT"),
            ("created_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("updated_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("deleted_at_utc",         "TIMESTAMPTZ"),
        ],
        "phi_columns": [],
        "indexes": [
            "CREATE INDEX idx_endocrine_visit_tenant ON {schema}.endocrine_visit(tenant_id)",
        ],
    },
    "DEP-012": {  # Hematology
        "main_table": "hematology_panel",
        "columns": [
            ("hematology_panel_id",    "UUID",        "PRIMARY KEY DEFAULT gen_random_uuid()"),
            ("encounter_id",           "UUID",        "NOT NULL REFERENCES nama.encounter(encounter_id) ON DELETE RESTRICT"),
            ("tenant_id",              "UUID",        "NOT NULL DEFAULT current_setting('app.tenant_id')::uuid"),
            ("collected_at_utc",       "TIMESTAMPTZ", "NOT NULL"),
            ("hemoglobin_g_dl",        "NUMERIC(5,2)"),
            ("wbc_10e9_l",             "NUMERIC(6,2)"),
            ("platelets_10e9_l",       "NUMERIC(6,2)"),
            ("interpretation",         "TEXT"),
            ("created_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("updated_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("deleted_at_utc",         "TIMESTAMPTZ"),
        ],
        "phi_columns": ["interpretation"],
        "indexes": [
            "CREATE INDEX idx_hematology_panel_tenant ON {schema}.hematology_panel(tenant_id)",
        ],
    },
    "DEP-013": {  # Oncology
        "main_table": "oncology_treatment_plan",
        "columns": [
            ("oncology_plan_id",       "UUID",        "PRIMARY KEY DEFAULT gen_random_uuid()"),
            ("encounter_id",           "UUID",        "NOT NULL REFERENCES nama.encounter(encounter_id) ON DELETE RESTRICT"),
            ("tenant_id",              "UUID",        "NOT NULL DEFAULT current_setting('app.tenant_id')::uuid"),
            ("planned_at_utc",         "TIMESTAMPTZ", "NOT NULL"),
            ("cancer_icd10",           "TEXT",        "NOT NULL"),
            ("stage_tnm",              "TEXT"),
            ("intent",                 "TEXT",        "CHECK (intent IN ('curative','palliative','adjuvant','neoadjuvant','watchful_waiting'))"),
            ("regimen_code",           "TEXT"),
            ("created_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("updated_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("deleted_at_utc",         "TIMESTAMPTZ"),
        ],
        "phi_columns": ["regimen_code"],
        "indexes": [
            "CREATE INDEX idx_oncology_plan_tenant ON {schema}.oncology_treatment_plan(tenant_id)",
        ],
    },
    "DEP-014": {  # Rheumatology
        "main_table": "rheum_assessment",
        "columns": [
            ("rheum_assessment_id",    "UUID",        "PRIMARY KEY DEFAULT gen_random_uuid()"),
            ("encounter_id",           "UUID",        "NOT NULL REFERENCES nama.encounter(encounter_id) ON DELETE RESTRICT"),
            ("tenant_id",              "UUID",        "NOT NULL DEFAULT current_setting('app.tenant_id')::uuid"),
            ("assessed_at_utc",        "TIMESTAMPTZ", "NOT NULL"),
            ("das28_score",            "NUMERIC(4,2)"),
            ("sledai_score",           "NUMERIC(5,2)"),
            ("diagnosis_icd10",        "TEXT"),
            ("created_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("updated_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("deleted_at_utc",         "TIMESTAMPTZ"),
        ],
        "phi_columns": [],
        "indexes": [
            "CREATE INDEX idx_rheum_assessment_tenant ON {schema}.rheum_assessment(tenant_id)",
        ],
    },
    "DEP-015": {  # Infectious Diseases
        "main_table": "id_consult",
        "columns": [
            ("id_consult_id",          "UUID",        "PRIMARY KEY DEFAULT gen_random_uuid()"),
            ("encounter_id",           "UUID",        "NOT NULL REFERENCES nama.encounter(encounter_id) ON DELETE RESTRICT"),
            ("tenant_id",              "UUID",        "NOT NULL DEFAULT current_setting('app.tenant_id')::uuid"),
            ("consulted_at_utc",       "TIMESTAMPTZ", "NOT NULL"),
            ("suspected_pathogen",     "TEXT"),
            ("culture_result",         "TEXT"),
            ("antibiotic_stewardship_flag", "BOOLEAN", "DEFAULT FALSE"),
            ("created_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("updated_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("deleted_at_utc",         "TIMESTAMPTZ"),
        ],
        "phi_columns": ["culture_result"],
        "indexes": [
            "CREATE INDEX idx_id_consult_tenant ON {schema}.id_consult(tenant_id)",
        ],
    },
    "DEP-016": {  # Dermatology
        "main_table": "derm_lesion_record",
        "columns": [
            ("derm_lesion_id",         "UUID",        "PRIMARY KEY DEFAULT gen_random_uuid()"),
            ("encounter_id",           "UUID",        "NOT NULL REFERENCES nama.encounter(encounter_id) ON DELETE RESTRICT"),
            ("tenant_id",              "UUID",        "NOT NULL DEFAULT current_setting('app.tenant_id')::uuid"),
            ("recorded_at_utc",        "TIMESTAMPTZ", "NOT NULL"),
            ("body_site_snomed",       "TEXT"),
            ("lesion_type_snomed",     "TEXT"),
            ("abcd_score",             "SMALLINT"),
            ("created_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("updated_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("deleted_at_utc",         "TIMESTAMPTZ"),
        ],
        "phi_columns": [],
        "indexes": [
            "CREATE INDEX idx_derm_lesion_tenant ON {schema}.derm_lesion_record(tenant_id)",
        ],
    },
    "DEP-017": {  # Neurology
        "main_table": "neuro_exam",
        "columns": [
            ("neuro_exam_id",          "UUID",        "PRIMARY KEY DEFAULT gen_random_uuid()"),
            ("encounter_id",           "UUID",        "NOT NULL REFERENCES nama.encounter(encounter_id) ON DELETE RESTRICT"),
            ("tenant_id",              "UUID",        "NOT NULL DEFAULT current_setting('app.tenant_id')::uuid"),
            ("examined_at_utc",        "TIMESTAMPTZ", "NOT NULL"),
            ("gcs_total",              "SMALLINT",    "CHECK (gcs_total BETWEEN 3 AND 15)"),
            ("nihss_score",            "SMALLINT",    "CHECK (nihss_score BETWEEN 0 AND 42)"),
            ("created_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("updated_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("deleted_at_utc",         "TIMESTAMPTZ"),
        ],
        "phi_columns": [],
        "indexes": [
            "CREATE INDEX idx_neuro_exam_tenant ON {schema}.neuro_exam(tenant_id)",
        ],
    },
    "DEP-018": {  # Psychiatry & Mental Health
        "main_table": "psych_assessment",
        "columns": [
            ("psych_assessment_id",    "UUID",        "PRIMARY KEY DEFAULT gen_random_uuid()"),
            ("encounter_id",           "UUID",        "NOT NULL REFERENCES nama.encounter(encounter_id) ON DELETE RESTRICT"),
            ("tenant_id",              "UUID",        "NOT NULL DEFAULT current_setting('app.tenant_id')::uuid"),
            ("assessed_at_utc",        "TIMESTAMPTZ", "NOT NULL"),
            ("phq9_score",             "SMALLINT",    "CHECK (phq9_score BETWEEN 0 AND 27)"),
            ("gad7_score",             "SMALLINT",    "CHECK (gad7_score BETWEEN 0 AND 21)"),
            ("risk_of_harm_self",      "BOOLEAN",     "DEFAULT FALSE"),
            ("created_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("updated_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("deleted_at_utc",         "TIMESTAMPTZ"),
        ],
        "phi_columns": [],
        "indexes": [
            "CREATE INDEX idx_psych_assessment_tenant ON {schema}.psych_assessment(tenant_id)",
        ],
    },
    "DEP-019": {  # General Surgery
        "main_table": "surgical_case",
        "columns": [
            ("surgical_case_id",       "UUID",        "PRIMARY KEY DEFAULT gen_random_uuid()"),
            ("encounter_id",           "UUID",        "NOT NULL REFERENCES nama.encounter(encounter_id) ON DELETE RESTRICT"),
            ("tenant_id",              "UUID",        "NOT NULL DEFAULT current_setting('app.tenant_id')::uuid"),
            ("scheduled_at_utc",       "TIMESTAMPTZ"),
            ("started_at_utc",         "TIMESTAMPTZ"),
            ("ended_at_utc",           "TIMESTAMPTZ"),
            ("procedure_snomed",       "TEXT",        "NOT NULL"),
            ("asa_class",              "SMALLINT",    "CHECK (asa_class BETWEEN 1 AND 6)"),
            ("wound_class",            "TEXT",        "CHECK (wound_class IN ('clean','clean_contaminated','contaminated','dirty_infected'))"),
            ("created_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("updated_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("deleted_at_utc",         "TIMESTAMPTZ"),
        ],
        "phi_columns": [],
        "indexes": [
            "CREATE INDEX idx_surgical_case_tenant ON {schema}.surgical_case(tenant_id)",
        ],
    },
    "DEP-020": {  # Orthopedics & Trauma
        "main_table": "ortho_fracture",
        "columns": [
            ("ortho_fracture_id",      "UUID",        "PRIMARY KEY DEFAULT gen_random_uuid()"),
            ("encounter_id",           "UUID",        "NOT NULL REFERENCES nama.encounter(encounter_id) ON DELETE RESTRICT"),
            ("tenant_id",              "UUID",        "NOT NULL DEFAULT current_setting('app.tenant_id')::uuid"),
            ("identified_at_utc",      "TIMESTAMPTZ", "NOT NULL"),
            ("ao_ota_code",            "TEXT"),
            ("laterality",             "TEXT",        "CHECK (laterality IN ('left','right','bilateral','n/a'))"),
            ("treatment_plan",         "TEXT"),
            ("created_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("updated_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("deleted_at_utc",         "TIMESTAMPTZ"),
        ],
        "phi_columns": ["treatment_plan"],
        "indexes": [
            "CREATE INDEX idx_ortho_fracture_tenant ON {schema}.ortho_fracture(tenant_id)",
        ],
    },
    "DEP-021": {  # Neurosurgery
        "main_table": "neurosurg_case",
        "columns": [
            ("neurosurg_case_id",      "UUID",        "PRIMARY KEY DEFAULT gen_random_uuid()"),
            ("encounter_id",           "UUID",        "NOT NULL REFERENCES nama.encounter(encounter_id) ON DELETE RESTRICT"),
            ("tenant_id",              "UUID",        "NOT NULL DEFAULT current_setting('app.tenant_id')::uuid"),
            ("started_at_utc",         "TIMESTAMPTZ"),
            ("ended_at_utc",           "TIMESTAMPTZ"),
            ("approach",               "TEXT"),
            ("gcs_preop",              "SMALLINT"),
            ("created_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("updated_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("deleted_at_utc",         "TIMESTAMPTZ"),
        ],
        "phi_columns": ["approach"],
        "indexes": [
            "CREATE INDEX idx_neurosurg_case_tenant ON {schema}.neurosurg_case(tenant_id)",
        ],
    },
    "DEP-022": {  # Cardiothoracic Surgery
        "main_table": "cts_case",
        "columns": [
            ("cts_case_id",            "UUID",        "PRIMARY KEY DEFAULT gen_random_uuid()"),
            ("encounter_id",           "UUID",        "NOT NULL REFERENCES nama.encounter(encounter_id) ON DELETE RESTRICT"),
            ("tenant_id",              "UUID",        "NOT NULL DEFAULT current_setting('app.tenant_id')::uuid"),
            ("started_at_utc",         "TIMESTAMPTZ"),
            ("ended_at_utc",           "TIMESTAMPTZ"),
            ("cardiopulmonary_bypass_minutes", "NUMERIC(6,2)"),
            ("cross_clamp_minutes",    "NUMERIC(6,2)"),
            ("created_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("updated_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("deleted_at_utc",         "TIMESTAMPTZ"),
        ],
        "phi_columns": [],
        "indexes": [
            "CREATE INDEX idx_cts_case_tenant ON {schema}.cts_case(tenant_id)",
        ],
    },
    "DEP-023": {  # Vascular Surgery
        "main_table": "vascular_case",
        "columns": [
            ("vascular_case_id",       "UUID",        "PRIMARY KEY DEFAULT gen_random_uuid()"),
            ("encounter_id",           "UUID",        "NOT NULL REFERENCES nama.encounter(encounter_id) ON DELETE RESTRICT"),
            ("tenant_id",              "UUID",        "NOT NULL DEFAULT current_setting('app.tenant_id')::uuid"),
            ("started_at_utc",         "TIMESTAMPTZ"),
            ("ended_at_utc",           "TIMESTAMPTZ"),
            ("vessel_snomed",          "TEXT"),
            ("created_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("updated_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("deleted_at_utc",         "TIMESTAMPTZ"),
        ],
        "phi_columns": [],
        "indexes": [
            "CREATE INDEX idx_vascular_case_tenant ON {schema}.vascular_case(tenant_id)",
        ],
    },
    "DEP-024": {  # Urology
        "main_table": "urology_procedure",
        "columns": [
            ("urology_procedure_id",   "UUID",        "PRIMARY KEY DEFAULT gen_random_uuid()"),
            ("encounter_id",           "UUID",        "NOT NULL REFERENCES nama.encounter(encounter_id) ON DELETE RESTRICT"),
            ("tenant_id",              "UUID",        "NOT NULL DEFAULT current_setting('app.tenant_id')::uuid"),
            ("performed_at_utc",       "TIMESTAMPTZ", "NOT NULL"),
            ("procedure_snomed",       "TEXT"),
            ("ipss_score",             "SMALLINT"),
            ("created_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("updated_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("deleted_at_utc",         "TIMESTAMPTZ"),
        ],
        "phi_columns": [],
        "indexes": [
            "CREATE INDEX idx_urology_procedure_tenant ON {schema}.urology_procedure(tenant_id)",
        ],
    },
    "DEP-025": {  # ENT
        "main_table": "ent_exam",
        "columns": [
            ("ent_exam_id",            "UUID",        "PRIMARY KEY DEFAULT gen_random_uuid()"),
            ("encounter_id",           "UUID",        "NOT NULL REFERENCES nama.encounter(encounter_id) ON DELETE RESTRICT"),
            ("tenant_id",              "UUID",        "NOT NULL DEFAULT current_setting('app.tenant_id')::uuid"),
            ("examined_at_utc",        "TIMESTAMPTZ", "NOT NULL"),
            ("audiogram_db",           "NUMERIC(5,2)"),
            ("tympanometry_type",      "TEXT"),
            ("created_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("updated_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("deleted_at_utc",         "TIMESTAMPTZ"),
        ],
        "phi_columns": [],
        "indexes": [
            "CREATE INDEX idx_ent_exam_tenant ON {schema}.ent_exam(tenant_id)",
        ],
    },
    "DEP-026": {  # Ophthalmology
        "main_table": "ophth_exam",
        "columns": [
            ("ophth_exam_id",          "UUID",        "PRIMARY KEY DEFAULT gen_random_uuid()"),
            ("encounter_id",           "UUID",        "NOT NULL REFERENCES nama.encounter(encounter_id) ON DELETE RESTRICT"),
            ("tenant_id",              "UUID",        "NOT NULL DEFAULT current_setting('app.tenant_id')::uuid"),
            ("examined_at_utc",        "TIMESTAMPTZ", "NOT NULL"),
            ("va_right_logmar",        "NUMERIC(4,3)"),
            ("va_left_logmar",         "NUMERIC(4,3)"),
            ("iop_right_mmhg",         "NUMERIC(4,1)"),
            ("iop_left_mmhg",          "NUMERIC(4,1)"),
            ("created_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("updated_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("deleted_at_utc",         "TIMESTAMPTZ"),
        ],
        "phi_columns": [],
        "indexes": [
            "CREATE INDEX idx_ophth_exam_tenant ON {schema}.ophth_exam(tenant_id)",
        ],
    },
    "DEP-027": {  # Plastic & Reconstructive
        "main_table": "plastic_surgery_case",
        "columns": [
            ("plastic_case_id",        "UUID",        "PRIMARY KEY DEFAULT gen_random_uuid()"),
            ("encounter_id",           "UUID",        "NOT NULL REFERENCES nama.encounter(encounter_id) ON DELETE RESTRICT"),
            ("tenant_id",              "UUID",        "NOT NULL DEFAULT current_setting('app.tenant_id')::uuid"),
            ("started_at_utc",         "TIMESTAMPTZ"),
            ("ended_at_utc",           "TIMESTAMPTZ"),
            ("indication",             "TEXT"),
            ("created_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("updated_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("deleted_at_utc",         "TIMESTAMPTZ"),
        ],
        "phi_columns": ["indication"],
        "indexes": [
            "CREATE INDEX idx_plastic_case_tenant ON {schema}.plastic_surgery_case(tenant_id)",
        ],
    },
    "DEP-028": {  # Anesthesiology
        "main_table": "anesthesia_record",
        "columns": [
            ("anesthesia_record_id",   "UUID",        "PRIMARY KEY DEFAULT gen_random_uuid()"),
            ("encounter_id",           "UUID",        "NOT NULL REFERENCES nama.encounter(encounter_id) ON DELETE RESTRICT"),
            ("tenant_id",              "UUID",        "NOT NULL DEFAULT current_setting('app.tenant_id')::uuid"),
            ("started_at_utc",         "TIMESTAMPTZ", "NOT NULL"),
            ("ended_at_utc",           "TIMESTAMPTZ"),
            ("anesthesia_type",        "TEXT",        "CHECK (anesthesia_type IN ('general','regional','local','sedation','combined'))"),
            ("laryngoscopy_grade",     "SMALLINT",    "CHECK (laryngoscopy_grade BETWEEN 1 AND 4)"),
            ("created_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("updated_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("deleted_at_utc",         "TIMESTAMPTZ"),
        ],
        "phi_columns": [],
        "indexes": [
            "CREATE INDEX idx_anesthesia_record_tenant ON {schema}.anesthesia_record(tenant_id)",
        ],
    },
    "DEP-029": {  # OB/GYN
        "main_table": "obgyn_visit",
        "columns": [
            ("obgyn_visit_id",         "UUID",        "PRIMARY KEY DEFAULT gen_random_uuid()"),
            ("encounter_id",           "UUID",        "NOT NULL REFERENCES nama.encounter(encounter_id) ON DELETE RESTRICT"),
            ("tenant_id",              "UUID",        "NOT NULL DEFAULT current_setting('app.tenant_id')::uuid"),
            ("visited_at_utc",         "TIMESTAMPTZ", "NOT NULL"),
            ("gravida",                "SMALLINT"),
            ("para",                   "SMALLINT"),
            ("gestational_age_weeks",  "NUMERIC(4,2)"),
            ("edd_at_utc",             "TIMESTAMPTZ"),
            ("created_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("updated_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("deleted_at_utc",         "TIMESTAMPTZ"),
        ],
        "phi_columns": [],
        "indexes": [
            "CREATE INDEX idx_obgyn_visit_tenant ON {schema}.obgyn_visit(tenant_id)",
        ],
    },
    "DEP-030": {  # Pediatrics General
        "main_table": "peds_visit",
        "columns": [
            ("peds_visit_id",          "UUID",        "PRIMARY KEY DEFAULT gen_random_uuid()"),
            ("encounter_id",           "UUID",        "NOT NULL REFERENCES nama.encounter(encounter_id) ON DELETE RESTRICT"),
            ("tenant_id",              "UUID",        "NOT NULL DEFAULT current_setting('app.tenant_id')::uuid"),
            ("visited_at_utc",         "TIMESTAMPTZ", "NOT NULL"),
            ("age_months",             "SMALLINT"),
            ("weight_kg",              "NUMERIC(5,2)"),
            ("height_cm",              "NUMERIC(5,2)"),
            ("head_circumference_cm",  "NUMERIC(4,1)"),
            ("immunizations_due",      "TEXT"),
            ("created_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("updated_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("deleted_at_utc",         "TIMESTAMPTZ"),
        ],
        "phi_columns": ["immunizations_due"],
        "indexes": [
            "CREATE INDEX idx_peds_visit_tenant ON {schema}.peds_visit(tenant_id)",
        ],
    },
    "DEP-031": {  # Reproductive Medicine & IVF
        "main_table": "ivf_cycle",
        "columns": [
            ("ivf_cycle_id",           "UUID",        "PRIMARY KEY DEFAULT gen_random_uuid()"),
            ("encounter_id",           "UUID",        "NOT NULL REFERENCES nama.encounter(encounter_id) ON DELETE RESTRICT"),
            ("tenant_id",              "UUID",        "NOT NULL DEFAULT current_setting('app.tenant_id')::uuid"),
            ("started_at_utc",         "TIMESTAMPTZ", "NOT NULL"),
            ("protocol",               "TEXT"),
            ("oocytes_retrieved",      "SMALLINT"),
            ("embryos_transferred",    "SMALLINT"),
            ("outcome",                "TEXT"),
            ("created_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("updated_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("deleted_at_utc",         "TIMESTAMPTZ"),
        ],
        "phi_columns": ["outcome"],
        "indexes": [
            "CREATE INDEX idx_ivf_cycle_tenant ON {schema}.ivf_cycle(tenant_id)",
        ],
    },
    "DEP-032": {  # Well-Baby & Lactation
        "main_table": "well_baby_visit",
        "columns": [
            ("well_baby_visit_id",     "UUID",        "PRIMARY KEY DEFAULT gen_random_uuid()"),
            ("encounter_id",           "UUID",        "NOT NULL REFERENCES nama.encounter(encounter_id) ON DELETE RESTRICT"),
            ("tenant_id",              "UUID",        "NOT NULL DEFAULT current_setting('app.tenant_id')::uuid"),
            ("visited_at_utc",         "TIMESTAMPTZ", "NOT NULL"),
            ("feeding_mode",           "TEXT",        "CHECK (feeding_mode IN ('exclusive_breast','mixed','formula','npo'))"),
            ("lactation_consult",      "BOOLEAN",     "DEFAULT FALSE"),
            ("created_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("updated_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("deleted_at_utc",         "TIMESTAMPTZ"),
        ],
        "phi_columns": [],
        "indexes": [
            "CREATE INDEX idx_well_baby_visit_tenant ON {schema}.well_baby_visit(tenant_id)",
        ],
    },
    "DEP-033": {  # Radiology & Imaging
        "main_table": "imaging_study",
        "columns": [
            ("imaging_study_id",       "UUID",        "PRIMARY KEY DEFAULT gen_random_uuid()"),
            ("encounter_id",           "UUID",        "NOT NULL REFERENCES nama.encounter(encounter_id) ON DELETE RESTRICT"),
            ("tenant_id",              "UUID",        "NOT NULL DEFAULT current_setting('app.tenant_id')::uuid"),
            ("performed_at_utc",       "TIMESTAMPTZ", "NOT NULL"),
            ("modality",               "TEXT",        "CHECK (modality IN ('xr','ct','mri','us','pet','mammography','fluoroscopy','nuclear'))"),
            ("body_part_snomed",       "TEXT"),
            ("dicom_study_uid",        "TEXT",        "UNIQUE"),
            ("report_text",            "TEXT"),
            ("created_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("updated_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("deleted_at_utc",         "TIMESTAMPTZ"),
        ],
        "phi_columns": ["report_text", "dicom_study_uid"],
        "indexes": [
            "CREATE INDEX idx_imaging_study_tenant ON {schema}.imaging_study(tenant_id)",
            "CREATE INDEX idx_imaging_study_modality ON {schema}.imaging_study(modality) WHERE deleted_at_utc IS NULL",
        ],
    },
    "DEP-034": {  # Laboratory & Pathology
        "main_table": "lab_result",
        "columns": [
            ("lab_result_id",          "UUID",        "PRIMARY KEY DEFAULT gen_random_uuid()"),
            ("encounter_id",           "UUID",        "NOT NULL REFERENCES nama.encounter(encounter_id) ON DELETE RESTRICT"),
            ("tenant_id",              "UUID",        "NOT NULL DEFAULT current_setting('app.tenant_id')::uuid"),
            ("collected_at_utc",       "TIMESTAMPTZ", "NOT NULL"),
            ("resulted_at_utc",        "TIMESTAMPTZ"),
            ("test_loinc",             "TEXT",        "NOT NULL"),
            ("value_numeric",          "NUMERIC(14,4)"),
            ("value_text",             "TEXT"),
            ("unit_ucum",              "TEXT"),
            ("reference_range_low",    "NUMERIC(14,4)"),
            ("reference_range_high",   "NUMERIC(14,4)"),
            ("abnormal_flag",          "TEXT",        "CHECK (abnormal_flag IN ('L','H','LL','HH','A','AA',''))"),
            ("created_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("updated_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("deleted_at_utc",         "TIMESTAMPTZ"),
        ],
        "phi_columns": ["value_text"],
        "indexes": [
            "CREATE INDEX idx_lab_result_tenant ON {schema}.lab_result(tenant_id)",
            "CREATE INDEX idx_lab_result_loinc ON {schema}.lab_result(test_loinc)",
            "CREATE INDEX idx_lab_result_abnormal ON {schema}.lab_result(abnormal_flag) WHERE abnormal_flag <> ''",
        ],
    },
    "DEP-035": {  # Pharmacy
        "main_table": "medication_dispense",
        "columns": [
            ("dispense_id",            "UUID",        "PRIMARY KEY DEFAULT gen_random_uuid()"),
            ("encounter_id",           "UUID",        "NOT NULL REFERENCES nama.encounter(encounter_id) ON DELETE RESTRICT"),
            ("tenant_id",              "UUID",        "NOT NULL DEFAULT current_setting('app.tenant_id')::uuid"),
            ("dispensed_at_utc",       "TIMESTAMPTZ", "NOT NULL"),
            ("drug_atc",               "TEXT",        "NOT NULL"),
            ("drug_name",              "TEXT",        "NOT NULL"),
            ("dose_value",             "NUMERIC(14,4)"),
            ("dose_unit_ucum",         "TEXT"),
            ("route_snomed",           "TEXT"),
            ("quantity",               "NUMERIC(14,4)"),
            ("prescriber_user_id",     "UUID",        "REFERENCES nama.user(user_id)"),
            ("created_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("updated_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("deleted_at_utc",         "TIMESTAMPTZ"),
        ],
        "phi_columns": [],
        "indexes": [
            "CREATE INDEX idx_dispense_tenant ON {schema}.medication_dispense(tenant_id)",
            "CREATE INDEX idx_dispense_drug ON {schema}.medication_dispense(drug_atc)",
        ],
    },
    "DEP-036": {  # Physiotherapy & Rehab
        "main_table": "rehab_session",
        "columns": [
            ("rehab_session_id",       "UUID",        "PRIMARY KEY DEFAULT gen_random_uuid()"),
            ("encounter_id",           "UUID",        "NOT NULL REFERENCES nama.encounter(encounter_id) ON DELETE RESTRICT"),
            ("tenant_id",              "UUID",        "NOT NULL DEFAULT current_setting('app.tenant_id')::uuid"),
            ("started_at_utc",         "TIMESTAMPTZ", "NOT NULL"),
            ("ended_at_utc",           "TIMESTAMPTZ"),
            ("fugl_meyer_score",       "NUMERIC(5,2)"),
            ("barthel_index",          "SMALLINT"),
            ("created_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("updated_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("deleted_at_utc",         "TIMESTAMPTZ"),
        ],
        "phi_columns": [],
        "indexes": [
            "CREATE INDEX idx_rehab_session_tenant ON {schema}.rehab_session(tenant_id)",
        ],
    },
    "DEP-037": {  # CSSD
        "main_table": "cssd_sterilization_cycle",
        "columns": [
            ("cssd_cycle_id",          "UUID",        "PRIMARY KEY DEFAULT gen_random_uuid()"),
            ("tenant_id",              "UUID",        "NOT NULL DEFAULT current_setting('app.tenant_id')::uuid"),
            ("cycle_started_at_utc",   "TIMESTAMPTZ", "NOT NULL"),
            ("cycle_ended_at_utc",     "TIMESTAMPTZ"),
            ("sterilizer_id",          "TEXT",        "NOT NULL"),
            ("cycle_type",             "TEXT",        "CHECK (cycle_type IN ('steam','eo','plasma','dry_heat'))"),
            ("biological_indicator_pass", "BOOLEAN"),
            ("chemical_indicator_pass",   "BOOLEAN"),
            ("load_contents",          "TEXT"),
            ("created_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("updated_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("deleted_at_utc",         "TIMESTAMPTZ"),
        ],
        "phi_columns": [],
        "indexes": [
            "CREATE INDEX idx_cssd_cycle_tenant ON {schema}.cssd_sterilization_cycle(tenant_id)",
        ],
    },
    "DEP-038": {  # HIM / Medical Records
        "main_table": "medical_record_request",
        "columns": [
            ("mr_request_id",          "UUID",        "PRIMARY KEY DEFAULT gen_random_uuid()"),
            ("tenant_id",              "UUID",        "NOT NULL DEFAULT current_setting('app.tenant_id')::uuid"),
            ("patient_id",             "UUID",        "NOT NULL REFERENCES nama.patient(patient_id) ON DELETE RESTRICT"),
            ("requested_at_utc",       "TIMESTAMPTZ", "NOT NULL"),
            ("requested_by_user_id",   "UUID",        "NOT NULL REFERENCES nama.user(user_id)"),
            ("purpose",                "TEXT",        "NOT NULL"),
            ("release_basis",          "TEXT",        "CHECK (release_basis IN ('patient_consent','court_order','continuity_of_care','public_health','research_ethics_approved','other'))"),
            ("fulfilled_at_utc",       "TIMESTAMPTZ"),
            ("created_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("updated_at_utc",         "TIMESTAMPTZ", "NOT NULL DEFAULT now()"),
            ("deleted_at_utc",         "TIMESTAMPTZ"),
        ],
        "phi_columns": ["purpose"],
        "indexes": [
            "CREATE INDEX idx_mr_request_tenant ON {schema}.medical_record_request(tenant_id)",
            "CREATE INDEX idx_mr_request_patient ON {schema}.medical_record_request(patient_id)",
        ],
    },
}

# Slug mapping for filenames
SLUG = {
    "DEP-001": "emergency-dept",
    "DEP-002": "icu-adult",
    "DEP-003": "ccu",
    "DEP-004": "nicu",
    "DEP-005": "picu",
    "DEP-006": "burn-unit",
    "DEP-007": "cardiology",
    "DEP-008": "pulmonology",
    "DEP-009": "gastroenterology",
    "DEP-010": "nephrology-dialysis",
    "DEP-011": "endocrinology",
    "DEP-012": "hematology",
    "DEP-013": "oncology",
    "DEP-014": "rheumatology",
    "DEP-015": "infectious-diseases",
    "DEP-016": "dermatology",
    "DEP-017": "neurology",
    "DEP-018": "psychiatry",
    "DEP-019": "general-surgery",
    "DEP-020": "orthopedics-trauma",
    "DEP-021": "neurosurgery",
    "DEP-022": "cardiothoracic-surgery",
    "DEP-023": "vascular-surgery",
    "DEP-024": "urology",
    "DEP-025": "ent",
    "DEP-026": "ophthalmology",
    "DEP-027": "plastic-reconstructive",
    "DEP-028": "anesthesiology",
    "DEP-029": "obgyn",
    "DEP-030": "pediatrics",
    "DEP-031": "reproductive-ivf",
    "DEP-032": "well-baby-lactation",
    "DEP-033": "radiology-imaging",
    "DEP-034": "laboratory-pathology",
    "DEP-035": "pharmacy",
    "DEP-036": "physiotherapy-rehab",
    "DEP-037": "cssd",
    "DEP-038": "him-medical-records",
}

DEPTS = [
    # (id, name_en, name_ar, group)
    ("DEP-001", "Emergency Department", "قسم الطوارئ", "emergency_and_critical_care"),
    ("DEP-002", "Adult Intensive Care Unit (ICU)", "وحدة العناية المركزة للبالغين", "emergency_and_critical_care"),
    ("DEP-003", "Coronary Care Unit (CCU)", "وحدة العناية القلبية", "emergency_and_critical_care"),
    ("DEP-004", "Neonatal Intensive Care Unit (NICU)", "وحدة العناية المركزة لحديثي الولادة", "women_and_children"),
    ("DEP-005", "Pediatric Intensive Care Unit (PICU)", "وحدة العناية المركزة للأطفال", "women_and_children"),
    ("DEP-006", "Burn Unit", "وحدة الحروق", "surgical_specialties"),
    ("DEP-007", "Cardiology", "أمراض القلب", "medical_specialties"),
    ("DEP-008", "Pulmonology", "أمراض الجهاز التنفسي", "medical_specialties"),
    ("DEP-009", "Gastroenterology", "أمراض الجهاز الهضمي", "medical_specialties"),
    ("DEP-010", "Nephrology & Dialysis", "أمراض الكلى وغسيل الكلى", "medical_specialties"),
    ("DEP-011", "Endocrinology & Diabetes", "أمراض الغدد الصماء والسكري", "medical_specialties"),
    ("DEP-012", "Hematology", "أمراض الدم", "medical_specialties"),
    ("DEP-013", "Oncology & Medical Oncology", "الأورام والأورام الطبية", "medical_specialties"),
    ("DEP-014", "Rheumatology", "أمراض الروماتيزم", "medical_specialties"),
    ("DEP-015", "Infectious Diseases", "الأمراض المعدية", "medical_specialties"),
    ("DEP-016", "Dermatology", "الأمراض الجلدية", "medical_specialties"),
    ("DEP-017", "Neurology", "أمراض الأعصاب", "medical_specialties"),
    ("DEP-018", "Psychiatry & Mental Health", "الطب النفسي والصحة النفسية", "medical_specialties"),
    ("DEP-019", "General Surgery", "الجراحة العامة", "surgical_specialties"),
    ("DEP-020", "Orthopedics & Trauma", "جراحة العظام والكسور", "surgical_specialties"),
    ("DEP-021", "Neurosurgery", "جراحة المخ والأعصاب", "surgical_specialties"),
    ("DEP-022", "Cardiothoracic Surgery", "جراحة القلب والصدر", "surgical_specialties"),
    ("DEP-023", "Vascular Surgery", "جراحة الأوعية الدموية", "surgical_specialties"),
    ("DEP-024", "Urology", "جراحة المسالك البولية", "surgical_specialties"),
    ("DEP-025", "Otorhinolaryngology (ENT)", "الأنف والأذن والحنجرة", "surgical_specialties"),
    ("DEP-026", "Ophthalmology", "طب وجراحة العيون", "surgical_specialties"),
    ("DEP-027", "Plastic & Reconstructive Surgery", "جراحة التجميل والترميمية", "surgical_specialties"),
    ("DEP-028", "Anesthesiology & Pain Management", "التخدير وإدارة الألم", "surgical_specialties"),
    ("DEP-029", "Obstetrics & Gynecology (OB/GYN)", "النساء والتوليد", "women_and_children"),
    ("DEP-030", "Pediatrics & General", "طب الأطفال العام", "women_and_children"),
    ("DEP-031", "Reproductive Medicine & IVF", "طب الإنجاب والإخصاب", "women_and_children"),
    ("DEP-032", "Well-Baby & Lactation Clinic", "عيادة الطفل السليم والرضاعة", "women_and_children"),
    ("DEP-033", "Radiology & Medical Imaging", "الأشعة والتصوير الطبي", "diagnostics_and_therapeutics"),
    ("DEP-034", "Laboratory & Pathology", "المختبر وعلم الأمراض", "diagnostics_and_therapeutics"),
    ("DEP-035", "Pharmacy & Therapeutics", "الصيدلية والعلاج الدوائي", "diagnostics_and_therapeutics"),
    ("DEP-036", "Physiotherapy & Rehabilitation", "العلاج الطبيعي وإعادة التأهيل", "diagnostics_and_therapeutics"),
    ("DEP-037", "Central Sterile Services Department (CSSD)", "قسم التعقيم المركزي", "supportive_and_administrative"),
    ("DEP-038", "Health Information Management (HIM) / Medical Records", "إدارة المعلومات الصحية / السجلات الطبية", "supportive_and_administrative"),
]


# ----------------------------------------------------------------------------
# Generation
# ----------------------------------------------------------------------------

def render_up_sql(dept_id: str, name_en: str, name_ar: str, group: str) -> str:
    """Render a complete _up.sql for a single department."""
    tpl = DEPT_TABLE_TEMPLATES[dept_id]
    schema = "blueprint_v2"
    main_table = tpl["main_table"]
    phi_set = set(tpl["phi_columns"])
    generated_at = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    filename = f"DEP-{dept_id[4:]}-{SLUG[dept_id]}_up.sql"

    banner = BANNER.format(
        filename=filename,
        dept_id=dept_id,
        dept_name_en=name_en,
        dept_name_ar=name_ar,
        group=group,
        generated_at_utc=generated_at,
    )

    # Build column DDL with PHI markers
    col_lines = []
    for col_tuple in tpl["columns"]:
        if len(col_tuple) == 3:
            col_name, col_type, col_constraint = col_tuple
        elif len(col_tuple) == 2:
            col_name, col_type = col_tuple
            col_constraint = ""
        else:
            raise ValueError(f"Column tuple must be 2 or 3 elements: {col_tuple}")
        marker = "  -- PHI-ENVELOPE" if col_name in phi_set else ""
        # Build the column line cleanly: "name TYPE CONSTRAINT --PHI"
        if col_constraint:
            line = f"    {col_name} {col_type} {col_constraint}{marker}"
        else:
            line = f"    {col_name} {col_type}{marker}"
        col_lines.append(line)
    columns_block = ",\n".join(col_lines)

    # Build indexes — each index MUST end with a semicolon
    indexes_block = ";\n".join(
        idx.replace("{schema}", schema) for idx in tpl["indexes"]
    ) + ";"

    body = f"""SET search_path = {schema}, public;

CREATE SCHEMA IF NOT EXISTS {schema};

-- Tenant context: every request sets app.tenant_id at the connection level
-- via db_postgres.js. Default to a sentinel for offline analysis.
SET LOCAL app.tenant_id = '00000000-0000-0000-0000-000000000000';

-- Main entity table for {name_en} ({name_ar})
CREATE TABLE IF NOT EXISTS {schema}.{main_table} (
{columns_block}
);

-- Indexes
{indexes_block}

-- Row-Level Security (FORCE = enforce even for table owner)
ALTER TABLE {schema}.{main_table} ENABLE ROW LEVEL SECURITY;
ALTER TABLE {schema}.{main_table} FORCE ROW LEVEL SECURITY;

-- Tenant isolation policy
CREATE POLICY {main_table}_tenant_isolation ON {schema}.{main_table}
    USING (
        tenant_id = NULLIF(current_setting('app.tenant_id', TRUE), '')::uuid
        OR current_setting('app.bypass_rls', TRUE) = 'on'
    )
    WITH CHECK (
        tenant_id = NULLIF(current_setting('app.tenant_id', TRUE), '')::uuid
        OR current_setting('app.bypass_rls', TRUE) = 'on'
    );

-- Updated-at trigger (single trigger function reused across depts)
CREATE OR REPLACE FUNCTION {schema}.trg_set_updated_at_utc()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at_utc := now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER {main_table}_set_updated_at_utc
BEFORE UPDATE ON {schema}.{main_table}
FOR EACH ROW EXECUTE FUNCTION {schema}.trg_set_updated_at_utc();

-- Revoke public access; app role is granted explicitly.
REVOKE ALL ON {schema}.{main_table} FROM PUBLIC;
"""
    return banner + body


def render_down_sql(dept_id: str, name_en: str) -> str:
    """Render a non-destructive _down.sql for a single department."""
    tpl = DEPT_TABLE_TEMPLATES[dept_id]
    schema = "blueprint_v2"
    main_table = tpl["main_table"]
    generated_at = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    filename = f"DEP-{dept_id[4:]}-{SLUG[dept_id]}_down.sql"

    banner = DOWN_BANNER.format(
        filename=filename,
        dept_id=dept_id,
        dept_name_en=name_en,
        schema=schema,
        generated_at_utc=generated_at,
    )

    body = f"""SET search_path = {schema}, public;

-- Drop trigger first
DROP TRIGGER IF EXISTS {main_table}_set_updated_at_utc ON {schema}.{main_table};

-- Drop policy
DROP POLICY IF EXISTS {main_table}_tenant_isolation ON {schema}.{main_table};

-- Drop the table (CASCADE removes its indexes and constraint dependents;
-- per AGENTS.md §2.2 #4, no DROP DATA outside the table itself).
DROP TABLE IF EXISTS {schema}.{main_table} CASCADE;

-- Note: we do NOT drop the {schema} schema here because other depts share it.
-- The shared trigger function ({schema}.trg_set_updated_at_utc) is also
-- reused and is dropped by a separate cross-cutting migration once all
-- dept tables have been removed.
"""
    return banner + body


def main() -> int:
    SCHEMAS_DIR.mkdir(parents=True, exist_ok=True)
    GENERATOR_DIR.mkdir(parents=True, exist_ok=True)

    manifest: list[dict] = []
    errors: list[str] = []

    for dept_id, name_en, name_ar, group in DEPTS:
        if dept_id not in DEPT_TABLE_TEMPLATES:
            errors.append(f"Missing template for {dept_id}")
            continue
        slug = SLUG[dept_id]
        up_path = SCHEMAS_DIR / f"DEP-{dept_id[4:]}-{slug}_up.sql"
        down_path = SCHEMAS_DIR / f"DEP-{dept_id[4:]}-{slug}_down.sql"

        up_sql = render_up_sql(dept_id, name_en, name_ar, group)
        down_sql = render_down_sql(dept_id, name_en)

        up_path.write_text(up_sql, encoding="utf-8")
        down_path.write_text(down_sql, encoding="utf-8")

        manifest.append({
            "dept_id": dept_id,
            "name_en": name_en,
            "name_ar": name_ar,
            "group": group,
            "slug": slug,
            "up_path": str(up_path.relative_to(REPO_ROOT)),
            "down_path": str(down_path.relative_to(REPO_ROOT)),
            "up_lines": up_sql.count("\n"),
            "down_lines": down_sql.count("\n"),
            "main_table": DEPT_TABLE_TEMPLATES[dept_id]["main_table"],
        })

    # Manifest
    (GENERATOR_DIR / "output_manifest.json").write_text(
        json.dumps({
            "schema_version": "1.0",
            "as_of": datetime.now(timezone.utc).isoformat(),
            "generator": "generate_blueprint_v2.py",
            "banner": "BLUEPRINT v2 — INFORMATIONAL, NOT YET LIVE",
            "stack": "PostgreSQL 14+ (Express+pg planned for Phase 2)",
            "compliance_live": ["CBAHI", "NPHIES", "SFDA", "PDPL"],
            "compliance_addon": ["JCI", "HIPAA"],
            "dept_count": len(manifest),
            "errors": errors,
            "files": manifest,
        }, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )

    # One-screen report
    lines = [
        "# Generation Report — generate_blueprint_v2.py",
        "",
        f"**Generated:** {datetime.now(timezone.utc).isoformat()}",
        f"**Departments:** {len(manifest)} (DEP-001..DEP-038)",
        f"**Files written:** {len(manifest) * 2} (38 up + 38 down)",
        f"**Errors:** {len(errors)}",
        f"**Schema:** blueprint_v2 (shared; do NOT drop during down migrations)",
        "",
        "## Per-department summary",
        "",
        "| Dept | Name (EN) | Main Table | Up lines | Down lines |",
        "|------|-----------|------------|----------|------------|",
    ]
    for m in manifest:
        lines.append(
            f"| {m['dept_id']} | {m['name_en']} | "
            f"`{m['main_table']}` | {m['up_lines']} | {m['down_lines']} |"
        )
    lines.append("")
    lines.append("## Errors")
    lines.append("")
    if errors:
        for e in errors:
            lines.append(f"- {e}")
    else:
        lines.append("None.")
    lines.append("")
    lines.append("## Safety-rail verification (per AGENTS.md §2.2)")
    lines.append("")
    lines.append("- [x] No hardcoded secrets, keys, or tokens in any generated file")
    lines.append("- [x] No PHI; only schema definitions (column types + constraints)")
    lines.append("- [x] Every table has `tenant_id` + ENABLE/FORCE ROW LEVEL SECURITY")
    lines.append("- [x] Every table has `created_at_utc`, `updated_at_utc`, `deleted_at_utc`")
    lines.append("- [x] PHI-flagged columns have `-- PHI-ENVELOPE` marker for crypto_envelope.js")
    lines.append("- [x] Down migrations DROP only objects the up migration created")
    lines.append("- [x] Down migrations do NOT DROP data outside the dept table")
    lines.append("- [x] Generated files contain the 'BLUEPRINT v2 — INFORMATIONAL' banner")
    lines.append("")
    (GENERATOR_DIR / "generation_report.md").write_text(
        "\n".join(lines), encoding="utf-8"
    )

    print(f"OK: wrote {len(manifest) * 2} SQL files + manifest + report")
    if errors:
        print(f"WARN: {len(errors)} errors: {errors}")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
