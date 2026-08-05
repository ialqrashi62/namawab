"""
gen_rls_force_migration.py
==========================
Phase: Wave 19 - FORCE ROW LEVEL SECURITY on the 69 specialty-station tables
Project: NamaMedical ERP (jumanaMedical / namaweb)
Branch: integration/all-epics
Hetzner: 204.168.144.74 / /var/www/namaweb

Purpose
-------
The 69 specialty tables listed below were each created with `ENABLE ROW LEVEL SECURITY`
and given a single permissive `FOR ALL TO PUBLIC USING (tenant_id = current_setting('app.tenant_id')::uuid)`
policy. They were NEVER upgraded to `FORCE ROW LEVEL SECURITY`, which means a
table owner (or superuser using a non-RLS-aware path) can still read every row
by switching `app.tenant_id` to NULL or a different tenant's UUID.

This script generates a NON-DESTRUCTIVE pair of SQL migrations
(forward + reverse) that:
  1. ALTER TABLE ... FORCE ROW LEVEL SECURITY  on each of the 69 tables
  2. Also adds a `BYPASSRLS` exception for the app role IF it is a privileged role
     (it is `nama_medical_app` which is a normal role, not a superuser/owner, so
     FORCE will apply to it as expected - we will not grant BYPASSRLS).
  3. Verifies after the up-migration that every table has both
     relrowsecurity=true AND relforcerowsecurity=true.

Safety rails (from AGENTS.md §2.2)
---------------------------------
  * No DROP, no DELETE, no RLS removal - this is FORCE only.
  * RLS context: app sets `app.tenant_id` via SET LOCAL inside a transaction;
     `getPatientActiveMeds` and other engines fail-closed on missing tenantId.
  * Money routes are unaffected - this only changes RLS enforcement strength.
  * Idempotent: each ALTER is wrapped in a DO block that checks
     pg_class.relforcerowsecurity first.
  * Forward + Reverse pair: `_down.sql` is the exact mirror (FORCE -> ENABLE,
     i.e. sets relforcerowsecurity=false via ALTER TABLE ... NO FORCE).

Run
---
  python gen_rls_force_migration.py
  # produces:
  #   namaweb/migrations/p1_10_wave19_force_rls_69_specialty_up.sql
  #   namaweb/migrations/p1_10_wave19_force_rls_69_specialty_down.sql
  #   namaweb/migrations/p1_10_wave19_force_rls_69_specialty_validate.sql
  #   deploy/wave19_force_rls_69.sh   (caller ssh + apply)
  #   deploy/wave19_force_rls_69_apply.sql (psql-side)
  # Then SCP + run on Hetzner.
"""

from __future__ import annotations
import os
import sys
from pathlib import Path
from textwrap import dedent

# -----------------------------------------------------------------------------
# 1. The exact 69 tables discovered via discover_rls.sh
#    Source-of-truth: live catalog at 204.168.144.74 on 2026-08-03
#    All have RLS enabled (relrowsecurity=true) and 1-2 ALL/PUBLIC policies.
# -----------------------------------------------------------------------------
TABLES: list[str] = [
    "admin_resource_logs",
    "audiometry_metrics",
    "burn_resuscitation_logs",
    "cardiac_medications",
    "cardio_thoracic_metrics",
    "cardiology_visits",
    "cochlear_implant_registry",
    "crit_care_hemodynamics",
    "crit_care_ventilation_logs",
    "diag_molecular_logs",
    "ecg_reports",
    "ent_surgical_logs",
    "ep_ablation_logs",
    "financial_integrity_logs",
    "flap_monitoring_metrics",
    "fracture_management_logs",
    "gastro_encounters",
    "gastro_endoscopy_reports",
    "gastro_hepatic_markers",
    "glaucoma_metrics",
    "gyn_oncology_registry",
    "hcm_credentialing_logs",
    "intracranial_pressure_logs",
    "iol_registry",
    "joint_replacement_registry",
    "maternal_fetal_metrics",
    "neonatal_transition_logs",
    "neuro_surgical_logs",
    "nicu_ventilation_logs",
    "nuclear_med_logs",
    "obgyn_anc_tracking",
    "obgyn_delivery_logs",
    "obgyn_delivery_records",
    "obgyn_encounters",
    "obgyn_ivf_lab_logs",
    "ophthalmic_surgical_logs",
    "ortho_surgical_logs",
    "pathology_digital_logs",
    "pci_hemodynamics",
    "pci_sessions",
    "peds_cardio_logs",
    "peds_growth_logs",
    "peds_milestone_tracking",
    "peds_nephro_logs",
    "peds_neuro_logs",
    "plastic_burns_surgical_logs",
    "psychosocial_support_logs",
    "pulmonology_bronchoscopy",
    "pulmonology_encounters",
    "pulmonology_pft_results",
    "pulmonology_sleep_studies",
    "radiology_advanced_metrics",
    "rehab_occupational_logs",
    "rehab_physical_logs",
    "rehab_speech_logs",
    "sepsis_bundle_tracking",
    "shock_titration_logs",
    "spine_stability_metrics",
    "stent_registry",
    "supply_chain_metrics",
    "surgery_encounters",
    "surgery_implants",
    "surgery_wound_logs",
    "surgical_intra_op_logs",
    "surgical_robotic_logs",
    "urology_oncology_metrics",
    "urology_stone_registry",
    "urology_surgical_logs",
    "vascular_graft_registry",
]
assert len(TABLES) == 69, f"Expected 69 tables, got {len(TABLES)}"

DB_NAME = "nama_medical_web"
APP_ROLE = "nama_medical_app"
MIG_PREFIX = "p1_10_wave19_force_rls_69_specialty"

# -----------------------------------------------------------------------------
# 2. Up migration: FORCE RLS on each of the 69 tables (idempotent)
# -----------------------------------------------------------------------------
def build_up() -> str:
    header = dedent(f"""\
        -- =====================================================================
        -- {MIG_PREFIX}_up.sql
        -- Wave 19 - FORCE ROW LEVEL SECURITY on the 69 specialty-station tables.
        --
        -- Source-of-truth discovery (2026-08-03, Hetzner 204.168.144.74):
        --   SELECT c.relname FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
        --    WHERE n.nspname='public' AND c.relkind='r' AND c.relrowsecurity=true
        --    AND COALESCE(c.relforcerowsecurity,false)=false
        --    ORDER BY c.relname;
        --  -> 69 tables.
        --
        -- All 69 already have ENABLE ROW LEVEL SECURITY plus at least one
        -- FOR ALL TO PUBLIC USING (tenant_id = current_setting('app.tenant_id')::uuid)
        -- policy. They lack FORCE - so a table-owner path can still read across
        -- tenants. FORCE closes that gap without touching any policy.
        --
        -- Idempotency: each ALTER is wrapped in a DO block that checks
        --   pg_class.relforcerowsecurity first. Re-running this migration is a no-op.
        --
        -- Safety: FORCE does NOT remove RLS, does NOT drop any policy, does NOT
        -- grant BYPASSRLS to any role. The app role ({APP_ROLE}) is a normal
        -- role (not superuser, not owner) so FORCE applies to it.
        -- =====================================================================
        SET search_path = public;
        SET LOCAL app.tenant_id = '__migration_force_rls__';
        BEGIN;

        """)
    body_lines: list[str] = []
    for t in TABLES:
        # Idempotent: only FORCE if not already forced.
        body_lines.append(dedent(f"""\
            -- {t}
            DO $do$
            DECLARE
                already_forced boolean;
            BEGIN
                SELECT c.relforcerowsecurity
                  INTO already_forced
                  FROM pg_class c
                  JOIN pg_namespace n ON n.oid = c.relnamespace
                 WHERE n.nspname = 'public' AND c.relname = '{t}';
                IF already_forced IS DISTINCT FROM true THEN
                    EXECUTE format('ALTER TABLE public.%I FORCE ROW LEVEL SECURITY', '{t}');
                    RAISE NOTICE 'FORCE enabled on public.%', '{t}';
                ELSE
                    RAISE NOTICE 'FORCE already enabled on public.%, skipped', '{t}';
                END IF;
            END
            $do$;
            """))
    tail = dedent("""\

        COMMIT;

        -- Verification block (runs only inside this migration; safe to ignore in
        -- normal app context because app.tenant_id is reset at commit).
        DO $verify$
        DECLARE
            not_forced_count int;
        BEGIN
            SELECT count(*)
              INTO not_forced_count
              FROM pg_class c
              JOIN pg_namespace n ON n.oid = c.relnamespace
             WHERE n.nspname = 'public'
               AND c.relkind = 'r'
               AND c.relrowsecurity = true
               AND COALESCE(c.relforcerowsecurity, false) = false;
            IF not_forced_count > 0 THEN
                RAISE WARNING 'Wave 19 FORCE: % public RLS-enabled tables still NOT forced', not_forced_count;
            ELSE
                RAISE NOTICE 'Wave 19 FORCE: all public RLS-enabled tables are now FORCED';
            END IF;
        END
        $verify$;
        """)
    return header + "\n".join(body_lines) + tail


# -----------------------------------------------------------------------------
# 3. Down migration: NO FORCE (mirror of up; RLS still enabled, just not forced)
# -----------------------------------------------------------------------------
def build_down() -> str:
    header = dedent(f"""\
        -- =====================================================================
        -- {MIG_PREFIX}_down.sql
        -- Reverse of {MIG_PREFIX}_up.sql.
        -- Disables FORCE on the 69 tables (ALTER TABLE ... NO FORCE ROW LEVEL SECURITY).
        -- Does NOT disable RLS itself. Does NOT drop any policy.
        -- Idempotent.
        -- =====================================================================
        SET search_path = public;
        BEGIN;

        """)
    body_lines: list[str] = []
    for t in TABLES:
        body_lines.append(dedent(f"""\
            -- {t}
            DO $do$
            DECLARE
                is_forced boolean;
            BEGIN
                SELECT c.relforcerowsecurity
                  INTO is_forced
                  FROM pg_class c
                  JOIN pg_namespace n ON n.oid = c.relnamespace
                 WHERE n.nspname = 'public' AND c.relname = '{t}';
                IF is_forced = true THEN
                    EXECUTE format('ALTER TABLE public.%I NO FORCE ROW LEVEL SECURITY', '{t}');
                    RAISE NOTICE 'FORCE disabled on public.%', '{t}';
                ELSE
                    RAISE NOTICE 'FORCE already disabled on public.%, skipped', '{t}';
                END IF;
            END
            $do$;
            """))
    tail = dedent("""\

        COMMIT;
        """)
    return header + "\n".join(body_lines) + tail


# -----------------------------------------------------------------------------
# 4. Validate migration: post-apply health check (idempotent, read-only)
# -----------------------------------------------------------------------------
def build_validate() -> str:
    return dedent(f"""\
        -- =====================================================================
        -- {MIG_PREFIX}_validate.sql
        -- Read-only validation: confirms every public RLS-enabled table is also
        -- FORCE-enabled. Run after the up migration. Safe to re-run.
        -- =====================================================================
        SET search_path = public;

        DO $v$
        DECLARE
            total_rls  int;
            not_forced int;
            r          record;
        BEGIN
            SELECT count(*)
              INTO total_rls
              FROM pg_class c
              JOIN pg_namespace n ON n.oid = c.relnamespace
             WHERE n.nspname='public' AND c.relkind='r' AND c.relrowsecurity=true;

            SELECT count(*)
              INTO not_forced
              FROM pg_class c
              JOIN pg_namespace n ON n.oid = c.relnamespace
             WHERE n.nspname='public' AND c.relkind='r' AND c.relrowsecurity=true
               AND COALESCE(c.relforcerowsecurity,false)=false;

            RAISE NOTICE 'Wave 19 validate: total RLS-enabled public tables = %', total_rls;
            RAISE NOTICE 'Wave 19 validate: RLS-enabled but NOT FORCED        = %', not_forced;

            IF not_forced > 0 THEN
                FOR r IN
                    SELECT c.relname
                      FROM pg_class c
                      JOIN pg_namespace n ON n.oid = c.relnamespace
                     WHERE n.nspname='public' AND c.relkind='r' AND c.relrowsecurity=true
                       AND COALESCE(c.relforcerowsecurity,false)=false
                     ORDER BY c.relname
                LOOP
                    RAISE WARNING '  -> % still NOT forced', r.relname;
                END LOOP;
                RAISE EXCEPTION 'Wave 19 validate FAILED: % tables not forced', not_forced;
            END IF;

            RAISE NOTICE 'Wave 19 validate: PASS - every RLS-enabled public table is FORCED';
        END
        $v$;
        """)


# -----------------------------------------------------------------------------
# 5. Remote apply script (rsync-style SCP + ssh)
# -----------------------------------------------------------------------------
def build_remote_apply_script() -> str:
    return dedent(f"""\
        #!/usr/bin/env bash
        # ====================================================================
        # Wave 19 - apply FORCE RLS on the 69 specialty tables
        # Generated by gen_rls_force_migration.py on $(date -u +%Y-%m-%dT%H:%M:%SZ)
        # Hetzner: /var/www/namaweb, db: {DB_NAME}, role: {APP_ROLE}
        # ====================================================================
        set -euo pipefail

        MIG="{MIG_PREFIX}"
        REMOTE_DIR="/var/www/namaweb"
        BACKUP_DIR="/var/backups/namaweb/wave19_$(date -u +%Y%m%dT%H%M%SZ)"
        LOG="/var/log/namaweb/wave19_force_rls.log"

        echo "[1/6] pre-flight: write backup marker + ensure dirs"
        mkdir -p "${{BACKUP_DIR}}" "${{LOG%/*}}"
        echo "backup_started=$(date -u +%Y-%m-%dT%H:%M:%SZ)" > "${{BACKUP_DIR}}/marker.txt"
        echo "migration=${{MIG}}" >> "${{BACKUP_DIR}}/marker.txt"

        echo "[2/6] pre-flight: list tables that are RLS-enabled but NOT forced"
        sudo -u postgres psql -d {DB_NAME} -tA -c \\
          "SELECT c.relname FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace \\
            WHERE n.nspname='public' AND c.relkind='r' AND c.relrowsecurity=true \\
              AND COALESCE(c.relforcerowsecurity,false)=false ORDER BY c.relname;" \\
          | tee "${{LOG}}.pre.list"
        PRE_COUNT=$(wc -l < "${{LOG}}.pre.list")
        echo "pre_count=${{PRE_COUNT}} (expect 69)"
        if [ "${{PRE_COUNT}}" -ne 69 ]; then
            echo "WARN: expected 69, got ${{PRE_COUNT}} - review before continuing" >&2
        fi

        echo "[3/6] apply UP migration"
        sudo -u postgres psql -d {DB_NAME} -v ON_ERROR_STOP=1 -f "${{REMOTE_DIR}}/migrations/${{MIG}}_up.sql" 2>&1 | tee -a "${{LOG}}"

        echo "[4/6] apply VALIDATE"
        sudo -u postgres psql -d {DB_NAME} -v ON_ERROR_STOP=1 -f "${{REMOTE_DIR}}/migrations/${{MIG}}_validate.sql" 2>&1 | tee -a "${{LOG}}"

        echo "[5/6] post-flight: confirm zero non-forced RLS-enabled tables remain"
        POST=$(sudo -u postgres psql -d {DB_NAME} -tA -c \\
          "SELECT count(*) FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace \\
            WHERE n.nspname='public' AND c.relkind='r' AND c.relrowsecurity=true \\
              AND COALESCE(c.relforcerowsecurity,false)=false;")
        echo "post_count=${{POST}} (expect 0)"
        if [ "${{POST}}" -ne 0 ]; then
            echo "ERROR: ${{POST}} tables still not forced - rolling back" >&2
            sudo -u postgres psql -d {DB_NAME} -v ON_ERROR_STOP=1 -f "${{REMOTE_DIR}}/migrations/${{MIG}}_down.sql" 2>&1 | tee -a "${{LOG}}"
            exit 1
        fi

        echo "[6/6] done"
        echo "backup_completed=$(date -u +%Y-%m-%dT%H:%M:%SZ)" >> "${{BACKUP_DIR}}/marker.txt"
        echo "OK"
        """)


# -----------------------------------------------------------------------------
# 6. Heredoc to print the up migration (so the user can run it locally + push)
# -----------------------------------------------------------------------------
HEREDOC_TEMPLATE = r'''#!/usr/bin/env python3
"""
Heredoc generator for Wave 19 FORCE RLS migration.
Generates the *_up.sql / *_down.sql / *_validate.sql and prints them to stdout.
Push step is left to the operator (scp + ssh).
"""
from pathlib import Path

OUT_DIR = Path("namaweb/migrations")
OUT_DIR.mkdir(parents=True, exist_ok=True)

# (function definitions are inlined into the heredoc body for the bash command)
{body_sections}

print(f"wrote {{OUT_DIR / up_name}}   ({{len(up_sql)}} bytes)")
print(f"wrote {{OUT_DIR / down_name}} ({len(down_sql)}} bytes)")
print(f"wrote {{OUT_DIR / validate_name}} ({{len(validate_sql)}} bytes)")
print("--- to push: ---")
print("  scp namaweb/migrations/{mig_prefix}_*.sql root@204.168.144.74:/var/www/namaweb/migrations/")
print("  scp deploy/{mig_prefix}_apply.sh        root@204.168.144.74:/tmp/")
print("  ssh root@204.168.144.74 'bash /tmp/{mig_prefix}_apply.sh'")
'''


# -----------------------------------------------------------------------------
# Main
# -----------------------------------------------------------------------------
def main() -> int:
    here = Path(__file__).resolve().parent
    mig_dir = here / "namaweb" / "migrations"
    deploy_dir = here / "deploy"
    mig_dir.mkdir(parents=True, exist_ok=True)
    deploy_dir.mkdir(parents=True, exist_ok=True)

    up_path = mig_dir / f"{MIG_PREFIX}_up.sql"
    down_path = mig_dir / f"{MIG_PREFIX}_down.sql"
    validate_path = mig_dir / f"{MIG_PREFIX}_validate.sql"
    remote_script_path = deploy_dir / f"{MIG_PREFIX}_apply.sh"

    up_path.write_text(build_up(), encoding="utf-8")
    down_path.write_text(build_down(), encoding="utf-8")
    validate_path.write_text(build_validate(), encoding="utf-8")
    remote_script_path.write_text(build_remote_apply_script(), encoding="utf-8")
    os.chmod(remote_script_path, 0o755)

    print(f"[ok] wrote {up_path.relative_to(here)}  ({len(up_path.read_text(encoding='utf-8'))} bytes)")
    print(f"[ok] wrote {down_path.relative_to(here)} ({len(down_path.read_text(encoding='utf-8'))} bytes)")
    print(f"[ok] wrote {validate_path.relative_to(here)}  ({len(validate_path.read_text(encoding='utf-8'))} bytes)")
    print(f"[ok] wrote {remote_script_path.relative_to(here)}  ({len(remote_script_path.read_text(encoding='utf-8'))} bytes)")
    print()
    print("---- HEREDOC for the operator ----")
    print(HEREDOC_TEMPLATE)
    print("---- end HEREDOC ----")
    print()
    print("---- PUSH COMMANDS ----")
    print("  # from repo root")
    print(f"  scp -i C:\\Users\\ice\\.ssh\\nama_medical_key -o BatchMode=yes "
          f"-o StrictHostKeyChecking=no -o ConnectTimeout=15 "
          f"namaweb/migrations/{MIG_PREFIX}_up.sql "
          f"namaweb/migrations/{MIG_PREFIX}_down.sql "
          f"namaweb/migrations/{MIG_PREFIX}_validate.sql "
          f"root@204.168.144.74:/var/www/namaweb/migrations/")
    print(f"  scp -i C:\\Users\\ice\\.ssh\\nama_medical_key -o BatchMode=yes "
          f"-o StrictHostKeyChecking=no -o ConnectTimeout=15 "
          f"deploy/{MIG_PREFIX}_apply.sh "
          f"root@204.168.144.74:/tmp/{MIG_PREFIX}_apply.sh")
    print(f"  ssh -i C:\\Users\\ice\\.ssh\\nama_medical_key -o BatchMode=yes "
          f"-o StrictHostKeyChecking=no -o ConnectTimeout=15 "
          f"root@204.168.144.74 \"bash /tmp/{MIG_PREFIX}_apply.sh\"")
    return 0


if __name__ == "__main__":
    sys.exit(main())
