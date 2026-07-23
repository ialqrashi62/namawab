# 03 Technical Architecture — Critical Care & Emergency Suite
**Expert: Principal Software Architect**

## 1. API Endpoints
- `POST /api/critical-care/er/triage`
- `POST /api/critical-care/icu/admission`
- `POST /api/critical-care/icu/ventilator`
- `POST /api/critical-care/anesthesia/pre-op`
- `POST /api/critical-care/pacu/assessment`
- `POST /api/critical-care/nicu/admit`

## 2. Data Model
- `er_visits`, `er_triage_logs`, `er_bed_assignments`.
- `icu_admissions`, `icu_vitals`, `icu_ventilator_logs`, `sepsis_bundle_tracking`.
- `anesthesia_records`, `anesthesia_drug_logs`, `airway_assessments`.
- `pacu_records`, `pacu_vitals`, `pacu_alerte_scores`.
- `nicu_admissions`, `nicu_vitals`, `nicu_tpn_logs`, `neonatal_growth_logs`.

## 3. Integration
- ADT, OR, LIS, RIS, pharmacy, blood bank, transport.

## 4. Security
- `requireRole('emergency_physician')` / `requireRole('intensivist')` / `requireRole('anesthesiologist')` / `requireRole('neonatologist')`, `requireTenantScope`.
- Golden Access Rule: Owner/Admin full access; critical-care clinicians access `critical_*` routes; others denied.

## 5. Migration
- `eXX_critical_care_hub_up.sql` / `_down.sql`.
