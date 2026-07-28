<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# CARD-002 DBML Schema (dbdiagram.io) — 12 tables

## Pattern
All tables: 	enant_id UUID NOT NULL, RLS + FORCE RLS, soft_deleted_at, audit columns.
Reference: SNIPPETS.md#SNIP-02 for full RLS DDL.

## Tables

### 1. cardiac_cath_procedures (master encounter)
- id UUID PK
- tenant_id UUID FK→tenants.id
- patient_id, encounter_id
- procedure_type (PCI|TAVR|MitraClip|Watchman|diagnostic|endomyocardial_biopsy|other)
- indication, urgency (STEMI|urgent|elective|emergent)
- access_route (radial_r|radial_l|femoral_r|femoral_l|brachial)
- sheath_size_fr
- door_time, balloon_time
- d2b_minutes, d2b_compliant (≤90), d2b_exception_reason
- operator_user_id, assistant_user_id, scrub_tech_user_id, circulating_rn_user_id, anesthesiologist_user_id
- status (scheduled|in_progress|completed|cancelled|aborted)
- findings_encrypted bytea (PHI envelope per SNIP-03)
- complications jsonb
- cpt_codes jsonb
- nphies_claim_id
- created_at, updated_at, created_by_user_id, updated_by_user_id, soft_deleted_at
- Indexes: (tenant_id, patient_id), (tenant_id, status, door_time), (tenant_id, operator_user_id, door_time)

### 2. pci_records
- id UUID PK
- tenant_id UUID FK
- procedure_id UUID FK→cardiac_cath_procedures
- lesion_count, lesions jsonb
- syntax_score, syntax_score_band (low|intermediate|high)
- grace_score, timi_score
- pre_timi_flow, post_timi_flow
- residual_stenosis_pct
- devices jsonb
- final_pressure_atm
- dapt_score, bleeding_risk_score
- operator_cosign_user_id, assistant_cosign_user_id
- dapt_2md_cosign jsonb
- Index: (tenant_id, procedure_id)

### 3. stent_registry (SFDA-tracked, lifetime retention)
- id UUID PK
- tenant_id UUID FK
- procedure_id UUID FK
- pci_record_id UUID FK
- patient_id
- udi (SFDA UDI barcode)
- manufacturer, model
- size_diameter_mm, length_mm
- batch_lot, expiration_date
- vessel, segment
- deployment_pressure_atm, post_dilation
- sfda_reported_at, sfda_report_id
- implanted_at
- operator_user_id, assistant_user_id
- soft_deleted_at (lifetime retention)

### 4. structural_heart_mdt
- id UUID PK
- tenant_id UUID FK
- patient_id, referral_id
- mdt_date, indication
- members_present jsonb (≥5 specialists)
- sts_score, frailty_score, euroscore_ii
- recommendation
- recommendation_alternatives jsonb
- patient_consent_summary
- decided_by (all voting members cosign)
- status
- nphies_preauth_id

### 5. tavr_workup
- id UUID PK
- tenant_id UUID FK
- patient_id, mdt_id FK
- ct_annular_area_mm2, ct_annular_perimeter_mm
- valve_calcification_score
- access_route_planned (TF|TA|TC|TLa)
- valve_size_predicted, valve_type_planned
- coronary_height_mm, aortic_root_dims
- frailty_assessment
- dental_clearance, pulm_clearance
- completed_at

### 6. cath_lab_scheduling
- id UUID PK
- tenant_id UUID FK
- facility_id, room_id (CATH-LAB-1..N)
- scheduled_date, slot_start, slot_end
- procedure_type
- operator_user_id
- estimated_duration_min
- equipment_ids jsonb
- status, conflict_check

### 7. contrast_tracking (CIN risk)
- id UUID PK
- tenant_id UUID FK
- patient_id, procedure_id FK
- contrast_agent, contrast_volume_ml
- cumulative_30day_ml
- baseline_egfr, post_egfr_48h
- cin_event, hydration_protocol

### 8. radiation_dose_log (per-staff + per-procedure)
- id UUID PK
- tenant_id UUID FK
- procedure_id FK
- staff_id, role (operator|nurse|tech)
- role_dose_mgy, role_dap_gy_cm2
- lead_apron_used, thyroid_shield_used
- dosimeter_reading_monthly_mgy, cumulative_ytd_mgy

### 9. cath_lab_equipment
- id UUID PK
- tenant_id UUID FK
- facility_id
- equipment_type (fluoroscope|IVUS|OCT|Impella|IABP|rotational_atherectomy|FFR)
- manufacturer, model, serial
- install_date, last_pm_date, next_pm_date
- status (active|service|retired)
- sfda_registration

### 10. cath_lab_red_flags
- id UUID PK
- tenant_id UUID FK
- procedure_id FK
- flag_type (perforation|dissection|no_reflow|thrombosis|air_embolism|tamponade|anaphylaxis)
- detected_at, detected_by (monitor|ai|md)
- response_action, response_time_seconds
- resolved_at, audit_critical

### 11. cath_audit_log (hash-chained, 7+ years)
- id UUID PK
- tenant_id UUID FK
- procedure_id FK
- user_id, action
- input_hash, output_hash (SHA-256)
- prev_hash (hash chain)
- created_at

### 12. cath_consent
- id UUID PK
- tenant_id UUID FK
- patient_id, procedure_id FK
- consent_type (PCI|TAVR|MitraClip|Watchman|PFO|ASD|ablation|biopsy|research|ai_assisted_care)
- consent_text_ar, consent_text_en
- signed_at, signed_by, witness_id
- interpreter_used
- ai_assisted_care_consent bool
- withdrawal_at

## RLS Pattern (apply to all 12)
`sql
ALTER TABLE {t} ENABLE ROW LEVEL SECURITY;
ALTER TABLE {t} FORCE ROW LEVEL SECURITY;
CREATE POLICY {t}_tenant ON {t} USING (tenant_id = current_setting('app.tenant_id')::UUID);
`

---
*Section 04 of CARD-002. SA voice. L1 DRAFT.*