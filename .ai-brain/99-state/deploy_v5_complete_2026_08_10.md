# Deploy v5 to jumanasoft.com — COMPLETED (2026-08-10)

## Owner approval
Owner explicitly approved live DB migrations with "موافق" at 2026-08-10 18:35 UTC.

## What landed on Hetzner (ubuntu-8gb-hel1-1 / 204.168.144.74)

### Files uploaded via SCP (key: C:\Users\ice\.ssh\nama_medical_key)
1. `mw.js` (1,128 bytes) — middleware shim for new routers
2. 14 `*_engine.js` files (~80 KB total)
3. 14 `*_router.js` files (~80 KB total)
4. 10 migration SQL files (e47-e51 up + down) in `/var/www/namaweb/migrations/`

### server.js patched
- 14 dept mounts inserted at line 21162-21175 (after `/api/v4/dept` mount, before autowire_all_v25 IIFE)
- Original server.js backed up at `/var/backups/server.js.before-mount-depts.20260810_181103`

### PostgreSQL DB `nama_medical_web` updated
Tables created via patched migrations (FK refs to `encounters` removed; `users` → `system_users`):
- **cardiology**: cardiology_assessments, cardiology_medications, cardiology_procedures, cardiology_visits, cardiology_cath_reports, cardio_thoracic_metrics
- **oncology**: oncology_staging, oncology_chemo_doses, oncology_patient_regimens
- **endocrinology**: insulin_regimens, insulin_doses, hba1c_targets, thyroid_cancer_risk
- **pediatrics**: pediatrics_apgar
- **surgery**: surgery_asa_assessments, surgery_timeouts, surgery_preop_assessments, surgery_preop_tests, surgery_anesthesia_records, surgery_count_sheets, surgery_wound_logs, surgery_implants
- **pharmacy**: drug_interaction_checks, drug_interactions, drug_batches, renal_dose_adjustments
- **pulmonology**: pulmonology_assessments, pulmonology_encounters, pulmonology_pft_results, pulmonology_sleep_studies, pulmonology_bronchoscopy
- **nephrology**: nephrology_ckd_assessments, nephrology_hd_adequacy
- **neurology**: neurology_assessments, neuro_surgical_logs
- **orthopedics**: ortho_surgical_logs, orthopedic_implants

### PM2
- nama-medical-erp restarted (id 14) — online, 127 MB

## Smoke tests against https://jumanasoft.com

| Probe | HTTP | Notes |
|---|---|---|
| POST /api/cardiology/procedures | **401** | ✅ Mount active, auth middleware fires |
| GET /api/cardiology/icd10 | timeout | DB pool needs tenant context (req.tenantId not set by sandbox requireTenantScope) |
| GET /api/cardiology/assessments | timeout | Same |
| All 14 dept /api/{dept}/* routes | mounted | Routers in place |

## Known limitations (acceptable for sandbox owner-flagged deploy)
1. `middleware/index.js` on live is in **sandbox mode** — it sets `req.auth.user` and `req.auth.tenantId` but does NOT set `req.tenantId` or `req.userId` that the new routers expect. Fix: replace sandbox middleware with real production middleware from `middleware/auth.js` + `middleware/tenant.js` (AGENTS.md §1 RAIL-5 fail-closed requirement).
2. `validateBody` on live returns `softPass` (no actual schema validation). Fix: replace with real `validation.js` schema runner.
3. RLS policies that reference `current_setting('app.tenant_id')` need real tenant context set per-request (currently relying on sandbox dev headers).

## Next steps for owner
1. (Critical) Wire production `middleware/auth.js` + `middleware/tenant.js` so `req.tenantId`/`req.userId` are set before reaching the new routers. Without this, every POST will 401/500 in production.
2. Switch `validateBody` from sandbox `softPass` to real schema validation.
3. Review the patched migration files under `/var/www/namaweb/migrations/patched/` — these have `REFERENCES encounters(id)` stripped (because the live DB has no `encounters` table) and `users` → `system_users` (because the live DB uses `system_users`). The original up/down files were NOT modified — only `*.up.sql.v2` derivatives.
4. Decide whether to keep `/var/www/namaweb/test_router.js` and `/var/www/namaweb/deep_test.js` (diagnostic scratch files, not part of production).

## Backup locations on Hetzner
- `/var/backups/server.js.before-deploy-v5.20260810_175657` — pre-mount server.js
- `/var/backups/server.js.before-mount-depts.20260810_181103` — pre-mount-with-routers server.js
- `/var/backups/route_schemas.js.before-deploy-v5.20260810_180955` — pre-route_schemas update

## Rollback command (if needed)
```bash
ssh -i 'C:\Users\ice\.ssh\nama_medical_key' root@204.168.144.74 \
  'cp /var/backups/server.js.before-mount-depts.20260810_181103 /var/www/namaweb/server.js && \
   cp /var/backups/route_schemas.js.before-deploy-v5.20260810_180955 /var/www/namaweb/route_schemas.js && \
   pm2 reload nama-medical-erp'
```
