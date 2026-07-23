# 03 Technical Architecture — Rare Specialties & Orphan Diseases

## 1. API Endpoints
- `POST /api/rare-specialties/case`
- `POST /api/rare-specialties/registry`
- `POST /api/rare-specialties/mdt`
- `POST /api/rare-specialties/protocol`

## 2. Data Model
- `rare_disease_cases` (id, patient_id, tenant_id, suspected_condition, status, mdt_date).
- `rare_disease_registry` (id, patient_id, tenant_id, registry_name, enrollment_date, consent_id).
- `rare_disease_mdt` (id, case_id, tenant_id, meeting_date, decisions, action_items).

## 3. Integration
- Internal medicine subspecialties, genetics, lab, pharmacy, research registry.

## 4. Security
- `requireRole('rare_disease_specialist')`, `requireTenantScope`.

## 5. Migration
- `eXX_rare_specialties_up.sql` / `_down.sql`.
