# Technical Architecture — Cardiology

> **Owner:** Architect
> **Date:** 2026-07-22
> **Cluster:** cardiology.dbml

---

## Backend (namaweb/)

### New tables (DBML fragment, append to `cardiology.dbml`)

```dbml
Table cardiac_procedures {
  id bigserial [pk]
  tenant_id bigint [not null, ref > tenants.id]
  patient_id bigint [not null, ref > patients.id]
  procedure_type varchar(64) [not null]  // 'cath', 'pci', 'tavr', 'ablation', 'device_implant'
  indication text [not null]
  status varchar(32) [not null, default 'scheduled']  // 'scheduled', 'in_progress', 'completed', 'cancelled'
  scheduled_at timestamptz
  started_at timestamptz
  completed_at timestamptz
  operator_id bigint [ref > system_users.id]
  findings text
  complications text
  cpt_code varchar(16)
  created_at timestamptz [default: `now()`]
  updated_at timestamptz [default: `now()`]
  
  Note: 'Cardiac procedures (cath, PCI, TAVR, ablation, device implant). RLS by tenant_id.'
}

Table echo_reports {
  id bigserial [pk]
  tenant_id bigint [not null]
  patient_id bigint [not null]
  study_date timestamptz [not null]
  study_type varchar(32) [not null]  // 'tte', 'tee', 'stress_echo'
  lvef_percent decimal(5,2)
  valve_assessment text
  wall_motion text
  pericardial_effusion text
  pulmonary_pressure_sys decimal(5,2)
  image_dicom_url text
  report_text text
  signed_by bigint [ref > system_users.id]
  signed_at timestamptz
  created_at timestamptz [default: `now()`]
}

Table ecg_archive {
  id bigserial [pk]
  tenant_id bigint [not null]
  patient_id bigint [not null]
  study_date timestamptz [not null]
  ecg_type varchar(32) [not null]  // '12_lead', 'rhythm', 'holter_24h', 'event'
  rhythm varchar(64)
  rate_bpm int
  intervals jsonb  // {pr, qrs, qt, qtc}
  interpretation text
  image_url text
  ai_interpretation text
  signed_by bigint [ref > system_users.id]
  created_at timestamptz [default: `now()`]
}

Table cardiac_rehab_enrollment {
  id bigserial [pk]
  tenant_id bigint [not null]
  patient_id bigint [not null]
  enrollment_date date [not null]
  indication varchar(64)  // 'post_mi', 'post_cabg', 'post_pci', 'chf'
  sessions_attended int [default: 0]
  sessions_total int [default: 36]
  completion_status varchar(32)  // 'active', 'completed', 'discontinued'
  notes text
  created_at timestamptz [default: `now()`]
}

Table anticoagulation_clinic_visits {
  id bigserial [pk]
  tenant_id bigint [not null]
  patient_id bigint [not null]
  visit_date date [not null]
  inr_value decimal(4,2)
  warfarin_dose_mg decimal(5,2)
  doac_name varchar(64)
  doac_dose_mg decimal(5,2)
  trend_arrow varchar(8)  // 'up', 'down', 'stable'
  action text
  next_visit_date date
  created_at timestamptz [default: `now()`]
}
```

### API Surface

| Method | Path | RBAC | Idempotency | Notes |
|---|---|---|---|---|
| GET | `/api/cardiology/patients/:id/echo` | Doctor, Nurse | no | Latest echo + history |
| POST | `/api/cardiology/echo` | Sonographer, Doctor | no | Upload new (DICOM) |
| GET | `/api/cardiology/patients/:id/ecg` | Doctor, Nurse | no | ECG list |
| POST | `/api/cardiology/procedures` | Doctor | yes | Schedule cath |
| GET | `/api/cardiology/procedures/:id` | Doctor, Nurse | no | Detail |
| PATCH | `/api/cardiology/procedures/:id` | Doctor | no | Update status |
| POST | `/api/cardiology/cds/chadsvasc` | Doctor, Nurse | no | Calls /api/calculators/cha2ds2-vasc |
| POST | `/api/cardiology/cds/hasbled` | Doctor, Nurse | no | Bleeding risk |
| POST | `/api/cardiology/cds/acsbundle` | Doctor | no | ACS bundle CDS |
| POST | `/api/cardiology/cds/hfgdmt` | Doctor, Nurse | no | HF GDMT tracking |
| GET | `/api/cardiology/cohorts/post-mi` | Doctor, Researcher | no | RLS on tenant |
| GET | `/api/cardiology/anticoag/queue` | Doctor, Nurse | no | Today's INR queue |

### Idempotency

- All POST `/api/cardiology/procedures` use the GATE7 idempotency guard.
- Echo upload: dedup by (patient_id, study_date, study_type, image_hash).

### RBAC (summary)

| Role | Can view | Can edit | Can sign |
|---|---|---|---|
| Cardiologist | All | All | Yes |
| Cardiology Nurse | All | Echo, anticoag, vitals | No |
| Sonographer | Echo | Echo | Own echo only |
| EP Doctor | All | EP procedures only | Yes |
| Researcher | Cohort only | No | No |
| Patient | Own only | No | No |

## Frontend

### Stations / Workspaces

- Existing: `cardiology-station` (general view)
- New sub-tabs (within station):
  - Echo (Layout F — imaging)
  - ECG (Layout D — chart)
  - Procedures (Layout G — forms)
  - Anticoag Clinic (Layout H — queue+detail)
  - HF Dashboard (Layout B — KPIs)
  - CDS panel (right panel in Layout A)

### NAV_ITEMS

- Existing: 48 (Cardiology)
- No new top-level items; sub-tabs within cardiology-station

## Dependencies

- Existing: openai, pg, express
- New: `langfuse` (LLM observability)
- New: `cross-encoder` (re-ranking)

## Env Vars

- `OPENAI_API_KEY` (existing)
- `LANGFUSE_PUBLIC_KEY` (new)
- `LANGFUSE_SECRET_KEY` (new)
- `LANGFUSE_BASE_URL` (new, self-hosted)
- `CARDIOLOGY_CDS_ENABLED=true` (feature flag)

## Observability

- APM spans: `cardiology.cds.run`, `cardiology.echo.upload`, `cardiology.cath.schedule`
- Audit events: procedure orders, sign events, CDS runs
- Metrics: door-to-balloon time, GDMT compliance rate, CDS acceptance rate

---

End of technical architecture.
