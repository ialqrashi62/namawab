# E2 Stitch Specialist Stations — Migration Plan (e70+)

> Created 2026-07-22. Status: **planning document** — no DB schema changes have
> been executed yet. All current state is UI-only (stations + 18 calculator engines).

## Goal

Add the persistence layer behind the 28 Stitch specialist stations + 18 clinical
calculators so that:

1. The current "pure engine" calculators can be **persisted** (encounter-attached
   results) instead of being throwaway previews in the UI.
2. The 28 stations have a shared **`station_encounter_record`** table that every
   station can read/write (with tenant_id + encounter_id columns so FORCE RLS keeps
   cross-tenant traffic out — the same model as `medical_records`).
3. The calculation history is auditable (the audit chain rule still holds; each
   record carries `created_by`, `signed_by_user_id`, `created_at`, `updated_at`).

## Why a plan, not a migration right now

The 28 stations currently render successfully on top of `app.js`'s monolithic
mock data. Pushing the schema before the UI is fully interactive would create
orphaned rows. The existing 80+ table migrations already follow the `e0`–`e84`
naming convention; this plan is a **forward-looking** inventory of the next wave
so future engineers can pick it up.

## Candidate migration series

| Migration | Area | Tables | Rationale |
|---|---|---|---|
| `e70_calculator_results.sql` | Calculators | `calculator_results` (single shared) | One row per calculator invocation; columns: `id`, `tenant_id`, `facility_id`, `patient_id`, `encounter_id`, `function_name`, `input_jsonb`, `value_numeric`, `severity_text`, `notes_text`, `citations_text`, `created_by_user_id`, `created_at`. Indexes: `(tenant_id, patient_id, function_name, created_at DESC)`, `(tenant_id, encounter_id)`. FORCE RLS enabled. |
| `e71_station_records.sql` | Stations | `station_encounter_record` | Universal record store: `id`, `tenant_id`, `facility_id`, `patient_id`, `encounter_id`, `station_code` (text: 'cardiology' | 'pulmonology' | …), `record_type` (text: 'note' | 'order' | 'observation' | 'score'), `record_data` (jsonb), `signed_by_user_id`, `signed_at`, `integrity_hash` (sha256 for tamper detection), `emr_status` ('draft' | 'locked'). FORCE RLS. |
| `e72_station_scores.sql` | Stations | `station_score` | Pre-aggregated scores with values + severity per station (e.g. `cardiology` HAS-BLED, `pulmonology` CURB-65). FK → `station_encounter_record`. |
| `e73_consult_signatures.sql` | Stations | `consult_signature` | Doctor signoff record with PIN-hash + nonce. Closes the loop on the E2 surgical/telemed consults. |
| `e74_station_orders.sql` | Stations | `station_order` | Generic order store (medication / lab / rad / procedure / consult / referral). Polymorphic by `order_type`. |
| `e75_station_vitals.sql` | Stations | `station_vital` | Per-station vital sign snapshots (e.g. surgery vitals vs ICU flowsheet vs OBGYN antenatal). |
| `e76_calculator_favorites.sql` | Calculators | `calculator_user_pref` | Per-user most-used calculators list (for UI dashboard "recent"). |
| `e77_station_attachments.sql` | Stations | `station_attachment` | A3A-aware file vault: documents, images, PDFs attached to station records. Same `phi_vault/` outside webroot, same `phi_files` integration as `/api/phi-files/:id`. |
| `e78_audit_partition.sql` | Cross-cutting | partition `station_audit` (monthly) | Keeps the per-station audit trail queryable beyond 7 years. Hash-chained (matches the existing audit-middleware pattern). |
| `e79_calculator_seed.sql` | Calculators | `seed_calculator_taxonomy` | Seed rows for the 18 calculator IDs (so the calculator_results.notes can FK to a canonical lookup). |
| `e80_station_seed.sql` | Stations | `seed_station_catalog` | Seed the 28 stations with their config (display name, color, icons, allowed facilities). |
| `e81_consult_template.sql` | Stations | `station_consult_template` | Per-station consult-note templates (Stitch Google card-grid templates). |
| `e82_consult_pin_attempt.sql` | Stations | `station_consult_pin_attempt` | Track PIN entry attempts (lockout 5/15min, mirrors system_users failed_login_attempts). |
| `e83_sign_workflow.sql` | Stations | `station_sign_workflow` | State machine: `draft → pending_sign → signed → locked → amended` (mirrors existing EMR lock/amend pattern in `medical_records`). |
| `e84_crash_recovery.sql` | Stations | `station_session_snapshot` | Periodic per-station client state (e.g. last opened patient, scroll position) so refresh doesn't drop context. |

## Safety rails that MUST be preserved

1. **All new tables must have `tenant_id` NOT NULL** + FORCE RLS enabled.
2. **Money/VAT calculations stay server-side** in `finance_engine.vatFromInclusive` (already
   the case for invoices — extend the same pattern to any consult that creates a charge).
3. **PHI at rest stays encrypted** via `crypto_envelope` (A3) — for any column that
   could contain free-text from the patient (chief_complaint, history, etc.).
4. **Patient identification on every row** — `patient_id` is required (not nullable).
5. **Audit chain stays hash-chained** via `audit_middleware.makeAuditMiddleware` (already
   in place for `/api/*` mutations).
6. **No hardcoded secrets** in any migration; `.env.example` placeholders only.
7. **No PHI in fixtures** — seed data must use clearly-marked fake values.

## Out of scope (intentionally)

- No redesign of `medical_records` (already e12-style signed/locked).
- No breaking change to existing 28 stations — they continue to render mock data
  until each station is wired to `station_encounter_record` station-by-station.
- No RAG / knowledge-graph changes (existing `clinical_knowledge_rag` covers it).

## Execution order (when ready)

1. Land `e70` first — single-purpose table for calculator persistence; this is the
   safest first step (no UI risk, no schema relationships).
2. Land `e71` next — universal station record store.
3. Land `e72` through `e77` in one batch (per-station features).
4. Land `e78` last (cross-cutting audit partition).
5. Station-by-station migration of UI: each station is updated to read/write
   through the new tables one at a time. No "big bang" migration.

## Test plan

- For each new table, add a `*_test.js` that exercises:
  - Cross-tenant isolation (FORCE RLS or explicit `AND tenant_id`).
  - Default values (defaults match the production code path).
  - Sign/lock state machine (state transitions are server-enforced).
  - Pin-attempt lockout (5 attempts / 15 minutes, matches `system_users`).
- Add 28 `*_station_test.js` files (one per station) that boot the station
  on a mock patient and assert that the right engines + endpoints get called.
- Re-run `clinical_calculators_test.js` (already 69/69 PASS) as a regression
  baseline.
