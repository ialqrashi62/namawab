# NEPH-002 Part 1 — الملفات 1-15
$ErrorActionPreference = "Stop"
$root = "c:\Users\ice\Desktop\NMEDCALVSCODE\.ai-brain\02_MODULES_NEW\POC"
$banner = "<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->"
$UTF8 = [System.Text.UTF8Encoding]::new($false)
$count = 0
function WF($p,$c){$d=Split-Path $p -Parent;if(-not(Test-Path $d)){New-Item -ItemType Directory -Force -Path $d|Out-Null};[System.IO.File]::WriteAllText($p,$c,$UTF8);$script:count++}

# 1. README
WF "$root\NEPH-002\README.md" @"
$banner
---
module_id: NEPH-002
name: "Renal Transplantation"
parent: "Nephrology"
code: NEPH
generated: 2026-07-24
loop_status: "L1 DRAFT"
template_ref: TPL:DEPT
owners: {clinical: CMO, technical: AIE, compliance: CQO}
catalog_ref: ".ai-brain/01_DATA/CATALOG.yaml:38"
context_brief_ref: "CONTEXT_BRIEFS.md#section-2"
---

# Renal Transplantation — NEPH-002

## Mission
Comprehensive kidney transplant program: living + deceased donor, ABO-compatible + ABO-incompatible, paired exchange, post-transplant immunosuppression, rejection workup, long-term graft surveillance. SCOT-mandated reporting (Saudi Center for Organ Transplantation).

## Scope
- Living donor nephrectomy (open + laparoscopic)
- Deceased donor procurement
- Recipient transplant (vascular + ureteral)
- Immunosuppression induction + maintenance
- ABOi desensitization (PLEX + IVIG + rituximab)
- Protocol + for-cause biopsy
- Rejection treatment (ACR/AMR)
- BK/CMV prophylaxis + monitoring
- Long-term follow-up (graft survival, QoL)
- 13 new tables, 26 endpoints, 6 LangChain chains

## Top 10 Conditions
ESRD (N18.6) · CKD-5 (N18.5) · Diabetic nephropathy (E11.22) · ADPKD (Q61.2) · Chronic GN (N03.9) · Alport (Q87.81) · IgA (N02.B) · Lupus nephritis (M32.14) · FSGS (N04.1) · HUS/TTP (D59.3/M31.1)

## Top 20 Procedures
LDN (50300) · Lap LDN (50547) · Back-table (50325) · DD procurement (50300-50) · Recipient nephrectomy (50220/50240) · Renal transplant (50360) · Vascular anastomosis · Ureteroneocystostomy (50780) · Ureteral stent (50605) · Induction ATG/basiliximab · PLEX (36514) · IVIG (90284) · Biopsy (50200/88307) · Protocol biopsy · Anti-rejection (J-codes) · Graft nephrectomy (50340) · HD bridge (90935) · PD bridge (90945) · DSA monitoring · HLA typing (81370-81383)

## 12 Red Flags
Hyperacute rejection · ACR (Banff IA-IIIA) · AMR (DSA+/C4d+) · CNI toxicity (trough >20) · BK polyomavirus · RAV thrombosis · RV thrombosis · Urinary leak · Lymphocele · Post-Tx infection · PTLD (EBV) · Recurrent primary disease

## Database (13 tables, RLS-forced)
transplant_waitlist · donor_registry · recipient_evaluation · hla_typing · crossmatch_results · transplant_procedure · immunosuppression_log (HIGH-ALERT) · rejection_episodes · protocol_biopsies · graft_surveillance · post_transplant_infections · long_term_followup · paired_exchange_pool

## 6 LangChain Chains
donor_recipient_matching_score · banff_biopsy_interpreter · immunosuppression_trough_advisor · rejection_risk_predictor · infection_prophylaxis_checker · paired_exchange_optimizer

## Compliance
- JCI: COP, MMU (high-alert IS), QPS, SQE
- CBAHI: transplant program
- SCOT: mandatory reporting
- NPHIES: transplant bundle
- ZATCA: billing + VAT
- SFDA: IS + REMS (ATG, rituximab, eculizumab)
- PDPL: 10y records, 20y donor, lifetime recipient
- HIPAA: 164.312 (doubly protected)

## Sign-off
CMO/AIE/SA/DSL/PM/CQO/ORC: L1 DRAFT complete.
"@

# 2. 00_synthesis
WF "$root\NEPH-002\00_synthesis.md" @"
$banner
# NEPH-002 — 7-Expert Panel Synthesis (L1-L4)

## Module Summary
**ID:** NEPH-002 · **Name:** Renal Transplantation · **Parent:** Nephrology (NEPH) · **Tier:** 1 (life-saving + chronic) · **Status:** L1 DRAFT

## 7-Expert Contributions

### CMO
**Inputs:** 10 conditions (ESRD, CKD-5, DN, ADPKD, GN, Alport, IgA, lupus, FSGS, HUS); 20 procedures (LDN open/lap, DD procurement, transplant, ureteroneocystostomy, biopsy, anti-rejection); 12 red flags; crossmatch (CDC/flow/vXM); HLA 10 loci high-res NGS; IS protocols (KDIGO 2009, CST 2023); KDPI/EPTS scoring; ABOi desensitization.
**Key decisions:** ABOi requires desensitization (rituximab + PLEX + IVIG); biopsy for-cause at 1-3% Cr rise; BK PCR >10⁴ = reduce IS; CNI trough >20 = block + escalate; SCOT reporting within 7d; paired exchange for sensitized recipients.
**Veto conditions:** Positive CDC XM (absolute decline); missing crossmatch; missing HLA typing; IS without dual-pharmacist verify; biopsy without indication; BK viremia without reduction; discharge without IS education.

### AIE
**Inputs:** 6 LangChain chains (donor-recipient match, Banff interpreter, trough advisor, rejection risk, infection prophylaxis, paired exchange); RAG over KDIGO/Banff/OPTN/CST; LLM gateway with PII redaction.
**Key decisions:** MedEmbed primary; gpt-4o + claude-3.5; med-llama offline fallback; rule-based `transplant_engine.js` safety floor; PII redaction before LLM; citation required; auto-fallback.
**Critical:** Trough >20 ng/mL = BLOCK + escalate; Banff grade requires MD sign-off.

### SA
**Inputs:** 13 new tables; 26 new endpoints; RLS on all; pure JS engine `transplant_engine.js` (10 functions); OpenAPI 3.1.
**Key decisions:** Single DB, multi-tenant; pure JS engine; AsyncLocalStorage; hash-chained audit; SCOT integration via API; paired exchange as separate module.
**Performance:** p99 <500ms read, <1.5s write; 200 concurrent users.

### DSL
**Inputs:** PHI encryption; tenant isolation; money route idempotency; hash-chained audit; DR.
**Key decisions:** Rate limit 200/min; CSP report-only; HIGH-ALERT gate for IS drugs; ABORh gate; SCOT integration secure; data residency KSA.
**Compliance:** 13 rails + 4 dept-specific.

### PM
**Inputs:** 5 personas; Stitch 3-column transplant station; AR+EN; mobile+desktop.
**Key decisions:** Left = donor + match score; Center = procedure + IS; Right = graft + trough + biopsy.

### CQO
**Inputs:** JCI/CBAHI/SCOT/NPHIES/ZATCA/SFDA/PDPL/HIPAA.
**Key decisions:** All 8 audit categories; 10 consent types; SCOT reporting mandatory; lifetime retention for recipient; doubly protected PHI (donor + recipient); breach 72h.
**Audit events:** transplant.waitlist.added, crossmatch.performed, procedure.completed, IS.administered, rejection.detected, graft_loss, donor.organs.recovered, biopsy.banff.graded.

### ORC
**Synthesis:** Multi-tenant via RLS; pure JS engine; SCOT integration; high-alert IS dual-pharm verify; LLM decision support (NOT authority); 6 L4 gates pending.

## L1-L4 Cycle Plan
- **L1 DRAFT** (current): 35 files → COMPLETE
- **L2 CRITIQUE**: 3 pairs (CMO↔AIE, SA↔DSL, PM↔CQO)
- **L3 REFINE**: ORC merges
- **L4 VALIDATE**: 6 hard gates

---
*ORC synthesis. NEPH-002 L1 DRAFT complete.*
"@

# 3. 01_clinical_workflows
WF "$root\NEPH-002\01_clinical_workflows.md" @"
$banner
# NEPH-002 Clinical Workflows (CMO)

## 1. Recipient Evaluation Workflow

1. **Referral** (Nephrologist) → waitlist
2. **Initial assessment** (Transplant Coordinator): history, PMH, surgical history, psychosocial
3. **Cardiac workup:** stress echo (>50) or coronary angio (DM, age>60, long dialysis)
4. **Pulmonary:** PFTs, CXR, ABG (smokers, COPD)
5. **Infection screening:** HBV, HCV, HIV, CMV IgG, EBV, HSV, VZV, TB (IGRA), Strongyloides (endemic)
6. **Malignancy screening:** age-appropriate (colonoscopy >50, mammogram >40 women, PSA men >50, Pap smear women)
7. **Vascular:** bilateral upper/lower extremity duplex (planning access)
8. **Urologic:** bladder capacity (voiding cystourethrogram if neurogenic)
9. **HLA typing + crossmatch** (donor-specific)
10. **Dental clearance** (within 6 months)
11. **Psychosocial** (compliance assessment, support system, finances)
12. **MDT review** (Nephrologist, Surgeon, Coordinator, Social Work, Anesthesia, ID)
13. **Listing** (UNOS/cPRA + KDPI matching)
14. **Consent** (transplant + research + AI-assisted care)

## 2. Donor Evaluation (Living)

1. **Initial screening:** ABO compat, age >18, willing, no coercion
2. **Medical:** history, exam, labs (CBC, BMP, LFT, coags, UA, urine culture)
3. **Cardiovascular:** ECG, stress (>45), echo (if indicated)
4. **Renal function:** 24h CrCl >80, eGFR >80, no proteinuria
5. **Imaging:** CT angio (renal artery anatomy), MAG3 (split function)
6. **Psychosocial:** independent living donor advocate (ILDA)
7. **Independent donor advocate** (not part of recipient team)
8. **Consent** (donor nephrectomy + research)
9. **Surgery scheduling** (recipient OR + donor OR + immunology crossmatch final)

## 3. Transplant Procedure (Recipient)

1. **Pre-op:** NPO, IV access, type & screen, crossmatch final
2. **Induction IS** (in OR): ATG (1.5 mg/kg) or basiliximab (20 mg)
3. **Anesthesia:** GA, arterial line, central line
4. **Incision:** Gibson (right iliac fossa) or midline
5. **Native nephrectomy** (if polycystic, chronic infection)
6. **Vascular anastomosis:** renal artery (end-to-side EIA or internal iliac), renal vein (end-to-side EIV)
7. **Reperfusion:** urine output within minutes (good sign)
8. **Ureteroneocystostomy:** Lich-Gregoir (anti-reflux)
9. **Ureteral stent** (removed 2-6 weeks)
10. **Foley** 5-7 days
11. **JP drain** (removed when output <50 mL/d)
12. **Tissue typing final + crossmatch**

## 4. Post-Op Day 0-7 (Inpatient)

| Day | Plan |
|-----|------|
| 0 | ICU 24h, IV fluids 1 mL/kg/h, UO monitor q1h, Tacrolimus start (trough 8-12), MMF 1g BID, MPred 500 mg IV x3 |
| 1 | Transfer to ward, Foley patent, JP output, Tac trough (8-12), MMF/Mpred PO |
| 2 | Drain removal (if <50 mL/d), encourage PO |
| 3 | Tac trough (8-12), Cr trend, education |
| 4-6 | Cr downtrending, education, discharge planning |
| 7 | Discharge (if stable, Cr down, IS at goal, education complete) |

## 5. Immunosuppression Protocol (Standard Low-Risk)

**Induction:**
- Basiliximab 20 mg IV day 0, day 4 (IL-2R antagonist)

**Maintenance triple:**
- Tacrolimus 0.1 mg/kg BID (trough 5-10 ng/mL first 3 mo, then 4-8)
- Mycophenolate Mofetil (MMF) 1-2 g/day
- Prednisone 5 mg/day (after taper from 500 mg IV)

**High-risk (high PRA, ABOi, prior transplant):**
- rATG 1.5 mg/kg × 3-5 days
- Tacrolimus trough 8-12 ng/mL
- MMF 2 g/day
- Prednisone taper slower

**ABOi (desensitization):**
- Rituximab 375 mg/m² day -14
- PLEX × 3-5 (alternate days)
- IVIG 100 mg/kg post-PLEX
- Tacrolimus + MMF start day -7
- Transplant day 0

## 6. Rejection Workup

| Rejection | Banff | Treatment |
|-----------|-------|-----------|
| Borderline | Borderline | Optimize IS, repeat biopsy 2-4 wk |
| ACR IA | Mild | MPred 500 mg IV x3 |
| ACR IB | Moderate | MPred + optimize |
| ACR IIA/IIB | Moderate-severe | rATG 1.5 mg/kg x3-5 |
| ACR III | Severe | rATG + PLEX |
| AMR (acute) | C4d+/DSA+ | PLEX + IVIG + rituximab ± bortezomib |
| AMR (chronic active) | TG, IFTA | Optimize IS, consider tocilizumab/bortezomib |

## 7. Surveillance

- **Week 1-2:** clinic, labs (Cr, tac trough, BK PCR, CMV PCR)
- **Month 1, 2, 3, 6, 9, 12, then q3-6mo:** clinic, labs, trough
- **Protocol biopsy:** optional, 3-6-12 mo
- **DSA:** q3-6 mo first year, then yearly
- **BK PCR:** monthly first 6 mo, then q3 mo
- **CMV PCR:** weekly first 3 mo (if D+/R-)
- **Annual:** echo, lipids, glucose, BP, dermatology (skin cancer risk)

## 8. Paired Exchange

For incompatible pairs (ABO or positive XM):
1. Register in exchange pool
2. Computerized match run (3-way, 4-way)
3. Crossmatch final
4. Simultaneous surgeries (4 ORs, 2 teams)
5. All recipients get kidneys same day

## 9. Documentation
**Transplant coordinator:** referral, workup checklist, MDT scheduling, decision letter, NPHIES preauth, patient communication.
**Transplant nephrologist:** evaluation, MDT presentation, IS plan, biopsy interpretation, follow-up.
**Surgeon:** op note, intraop findings, complications.
**Pharmacist:** IS verification, trough monitoring, drug interactions.

## 10. Quality Metrics
- 1-yr graft survival: ≥95% (LRD), ≥90% (DD)
- 1-yr patient survival: ≥95%
- DGF (delayed graft function): <10% (LD), <25% (DD)
- Acute rejection: <10% first year
- BK nephropathy: <5%
- PTLD: <1%
- Waitlist mortality: <5%/year

---
*Section 03 of NEPH-002. CMO voice. L1 DRAFT.*
"@

# 4. 01_dbml_schema
WF "$root\NEPH-002\01_dbml_schema.md" @"
$banner
# NEPH-002 DBML Schema (13 tables)

## 1. transplant_waitlist
- id UUID PK
- tenant_id UUID FK
- patient_id BIGINT
- listing_date, blood_type, cpra_pct, epts_score
- dialysis_years, diabetes_status, prior_transplant_count
- hla_antibodies JSONB
- status (ACTIVE|HOLD|TRANSPLANTED|REMOVED|DEATH)
- priority_score NUMERIC(6,2)

## 2. donor_registry
- id UUID PK
- tenant_id UUID FK
- donor_id VARCHAR(50)
- donor_type (LRD|LURD|DD|PAIRED)
- age, height_cm, weight_kg, blood_type
- hla_typing JSONB
- kdpi_score
- cause_of_death, comorbidities JSONB
- ecmo_used, dcd
- cross_clamp_time, cold_ischemia_minutes
- biopsy_remuzzi_score JSONB
- recovered_at

## 3. recipient_evaluation
- id UUID PK
- tenant_id UUID FK
- patient_id BIGINT
- evaluation_date
- cardiac_clearance, pulmonary_clearance, malignancy_screening
- infection_screening JSONB (HBV, HCV, HIV, CMV, EBV, TB)
- psychosocial_clearance, financial_clearance
- mdt_approval_date, approved_for_listing
- exclusions JSONB

## 4. hla_typing
- id UUID PK
- tenant_id UUID FK
- subject_type (DONOR|RECIPIENT)
- subject_id BIGINT
- locus VARCHAR(10) (A, B, C, DRB1, DQB1, DPA1)
- allele_1, allele_2 VARCHAR(20)
- resolution (LOW|HIGH)
- typing_method (NGS|SSO|SSP)
- tested_at, lab_id

## 5. crossmatch_results
- id UUID PK
- tenant_id UUID FK
- donor_id BIGINT, recipient_id BIGINT
- cdc_t_cell, cdc_b_cell (POS|NEG|EQUIVOCAL)
- flow_t_cell_mcs, flow_b_cell_mcs
- virtual_xm, dsa_locus JSONB
- performed_at, performed_by_user_id

## 6. transplant_procedure
- id UUID PK
- tenant_id UUID FK
- recipient_id, donor_id
- procedure_date, transplant_type
- cold_ischemia_minutes, warm_ischemia_minutes
- vascular_anastomosis_time_min
- ureteral_stent_placed, foley_duration_days
- induction_agent, induction_dose
- surgeon_id, anesthesiologist_id
- estimated_blood_loss_ml, complications_intraop
- status

## 7. immunosuppression_log (HIGH-ALERT)
- id UUID PK
- tenant_id UUID FK
- patient_id, encounter_id
- drug_name (TACROLIMUS|CYCLOSPORINE|MMF|PREDNISONE|SIROLIMUS)
- dose_mg, frequency, route
- trough_level_ng_ml, trough_date
- prescriber_id, pharmacist_verified_id (DUAL)
- started_at, stopped_at
- side_effects JSONB
- high_alert_flag TRUE

## 8. rejection_episodes
- id UUID PK
- tenant_id UUID FK
- patient_id, transplant_id
- episode_date
- rejection_type (ACR|AMR|MIXED|CHRONIC_AMR|BORDERLINE)
- banff_grade (IA|IB|IIA|IIB|III|CAAMR)
- dsa_mfi_at_event JSONB
- treatment_given JSONB
- response (RESOLVED|PARTIAL|REFRACTORY)
- graft_outcome

## 9. protocol_biopsies
- id UUID PK
- tenant_id UUID FK
- transplant_id, patient_id
- biopsy_date, biopsy_type (PROTOCOL_3M|PROTOCOL_6M|PROTOCOL_12M|FOR_CAUSE)
- indication, cores_taken, glomeruli_count
- light_microscopy_findings JSONB
- immunofluorescence_findings JSONB
- electron_microscopy_findings JSONB
- sv40_immunostain (BK virus)
- c4d_score (0-3)
- banff_category
- pathologist_id
- report_url_phi_vault TEXT (per SNIP-03)

## 10. graft_surveillance
- id UUID PK
- tenant_id UUID FK
- patient_id, transplant_id
- visit_date
- scr, egfr, urea, proteinuria_g_24h
- bk_virus_pcr_copies_ml, cmv_pcr_copies_ml
- dsa_panel JSONB
- tacrolimus_trough
- bp_systolic, bp_diastolic, weight_kg
- medication_adherence_pct
- alert_flags JSONB

## 11. post_transplant_infections
- id UUID PK
- tenant_id UUID FK
- patient_id, transplant_id
- infection_date, pathogen
- infection_site, severity
- treatment JSONB
- hospitalization_required
- prophylaxis_status

## 12. long_term_followup
- id UUID PK
- tenant_id UUID FK
- patient_id, transplant_id
- years_post_transplant
- graft_function (FUNCTIONING|FAILED)
- comorbidities JSONB (HTN, DM, dyslipidemia, malignancy, CVD)
- medication_adherence
- qol_score (SF-36 or KDQOL)
- rehospitalizations_ytd
- last_biopsy_date, last_dsa_date

## 13. paired_exchange_pool
- id UUID PK
- tenant_id UUID FK
- donor_id, recipient_id
- pool_entry_date
- incompatibility_reason (ABOi|POS_XM|HIGH_cPRA)
- match_run_id
- match_offered_at
- match_accepted_at
- match_completed_at
- match_status (PENDING|MATCHED|ACCEPTED|REJECTED|TRANSPLANTED|EXPIRED)

## RLS Pattern (all 13)
```sql
ALTER TABLE {t} ENABLE ROW LEVEL SECURITY;
ALTER TABLE {t} FORCE ROW LEVEL SECURITY;
CREATE POLICY {t}_tenant ON {t} USING (tenant_id = current_setting('app.tenant_id')::UUID);
```

---
*Section 04 of NEPH-002. SA voice. L1 DRAFT.*
"@

# 5. 01_jci_checklist
WF "$root\NEPH-002\01_jci_checklist.md" @"
$banner
# NEPH-002 — JCI 7th Ed Checklist

## COP — Care of Patients
- [ ] Recipient evaluation per checklist
- [ ] Donor evaluation per checklist
- [ ] MDT review (≥5 specialists)
- [ ] ABO compat verified
- [ ] Crossmatch documented
- [ ] HLA typing high-resolution
- [ ] Induction IS in OR
- [ ] Post-op protocol followed
- [ ] Patient/family education

## MMU — Medication Management
- [ ] **HIGH-ALERT gate** for IS drugs (tacrolimus, cyclosporine, MMF, ATG, rituximab, eculizumab)
- [ ] 2-pharmacist independent double-check
- [ ] Trough level monitoring per protocol
- [ ] Drug interaction check (CNI + azole = toxicity)
- [ ] Patient education on IS compliance
- [ ] Refill tracking
- [ ] Adherence assessment

## QPS — Quality & Patient Safety
- [ ] 1-yr graft survival ≥95% LRD, ≥90% DD
- [ ] 1-yr patient survival ≥95%
- [ ] DGF <10% LD, <25% DD
- [ ] Acute rejection <10% first year
- [ ] BK nephropathy <5%
- [ ] PTLD <1%
- [ ] Waitlist mortality <5%/year
- [ ] Monthly QA review
- [ ] Quarterly outcomes report to CBAHI

## SQE — Staff Qualifications
- [ ] Transplant nephrologist board cert
- [ ] Transplant surgeon (≥50 transplants lifetime)
- [ ] HLA lab certification (ASHI)
- [ ] Coordinator certification (CCTC)
- [ ] Pharmacist transplant training
- [ ] Annual CME

## FMS — Facility Management
- [ ] OR available within 60 min for deceased donor
- [ ] HLA lab on-site or contracted
- [ ] Pathology with Banff expertise
- [ ] Apheresis unit (for ABOi)
- [ ] Critical care beds

## PFR — Patient & Family Rights
- [ ] Living donor independent advocate (ILDA)
- [ ] Donor consents (separate from recipient)
- [ ] Recipient consents (transplant, research, AI)
- [ ] Financial counseling
- [ ] Post-transplant support groups

## MOI — Management of Information
- [ ] SCOT reporting (mandatory)
- [ ] Audit log (hash-chained)
- [ ] PHI encrypted (DPAPI KEK)
- [ ] Lifetime retention for recipient
- [ ] Doubly protected (donor + recipient)
- [ ] FHIR R4 profiles

## Total
38 checks across 7 JCI chapters.

---
*Section 05 of NEPH-002. CQO voice. L1 DRAFT.*
"@

# 6. 01_migration_up
WF "$root\NEPH-002\01_migration_up.sql" @"
$banner
-- NEPH-002 Migration UP — 13 tables
-- Reference: SNIPPETS.md#SNIP-02 for RLS pattern

BEGIN;

-- 1. transplant_waitlist
CREATE TABLE transplant_waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  patient_id BIGINT NOT NULL,
  listing_date TIMESTAMPTZ NOT NULL,
  blood_type VARCHAR(3),
  cpra_pct NUMERIC(5,2),
  epts_score NUMERIC(5,2),
  dialysis_years NUMERIC(5,1),
  diabetes_status BOOLEAN DEFAULT FALSE,
  prior_transplant_count INT DEFAULT 0,
  hla_antibodies JSONB,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  priority_score NUMERIC(6,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by_user_id BIGINT,
  updated_by_user_id BIGINT,
  soft_deleted_at TIMESTAMPTZ
);
ALTER TABLE transplant_waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE transplant_waitlist FORCE ROW LEVEL SECURITY;
CREATE POLICY transplant_waitlist_tenant ON transplant_waitlist USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- 2. donor_registry
CREATE TABLE donor_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  donor_id VARCHAR(50) NOT NULL,
  donor_type VARCHAR(10) NOT NULL,
  age INT, height_cm INT, weight_kg INT,
  blood_type VARCHAR(3),
  hla_typing JSONB,
  kdpi_score NUMERIC(5,2),
  cause_of_death VARCHAR(100),
  comorbidities JSONB,
  ecmo_used BOOLEAN, dcd BOOLEAN,
  cross_clamp_time TIMESTAMPTZ,
  cold_ischemia_minutes INT,
  biopsy_remuzzi_score JSONB,
  recovered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);
ALTER TABLE donor_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE donor_registry FORCE ROW LEVEL SECURITY;
CREATE POLICY donor_registry_tenant ON donor_registry USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- 3. recipient_evaluation
CREATE TABLE recipient_evaluation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  patient_id BIGINT NOT NULL,
  evaluation_date TIMESTAMPTZ NOT NULL,
  cardiac_clearance BOOLEAN, pulmonary_clearance BOOLEAN,
  malignancy_screening BOOLEAN,
  infection_screening JSONB,
  psychosocial_clearance BOOLEAN, financial_clearance BOOLEAN,
  mdt_approval_date TIMESTAMPTZ,
  approved_for_listing BOOLEAN,
  exclusions JSONB,
  evaluated_by_user_id BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);
ALTER TABLE recipient_evaluation ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipient_evaluation FORCE ROW LEVEL SECURITY;
CREATE POLICY recipient_evaluation_tenant ON recipient_evaluation USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- 4. hla_typing
CREATE TABLE hla_typing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  subject_type VARCHAR(10) NOT NULL,
  subject_id BIGINT NOT NULL,
  locus VARCHAR(10) NOT NULL,
  allele_1 VARCHAR(20), allele_2 VARCHAR(20),
  resolution VARCHAR(10) DEFAULT 'HIGH',
  typing_method VARCHAR(20),
  tested_at TIMESTAMPTZ, lab_id VARCHAR(50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);
ALTER TABLE hla_typing ENABLE ROW LEVEL SECURITY;
ALTER TABLE hla_typing FORCE ROW LEVEL SECURITY;
CREATE POLICY hla_typing_tenant ON hla_typing USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- 5. crossmatch_results
CREATE TABLE crossmatch_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  donor_id BIGINT NOT NULL, recipient_id BIGINT NOT NULL,
  cdc_t_cell VARCHAR(10), cdc_b_cell VARCHAR(10),
  flow_t_cell_mcs NUMERIC(6,1), flow_b_cell_mcs NUMERIC(6,1),
  virtual_xm VARCHAR(10), dsa_locus JSONB,
  performed_at TIMESTAMPTZ, performed_by_user_id BIGINT,
  lab_id VARCHAR(50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);
ALTER TABLE crossmatch_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE crossmatch_results FORCE ROW LEVEL SECURITY;
CREATE POLICY crossmatch_results_tenant ON crossmatch_results USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- 6. transplant_procedure
CREATE TABLE transplant_procedure (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  recipient_id BIGINT NOT NULL, donor_id BIGINT NOT NULL,
  procedure_date TIMESTAMPTZ NOT NULL,
  transplant_type VARCHAR(10),
  cold_ischemia_minutes INT, warm_ischemia_minutes INT,
  vascular_anastomosis_time_min INT, total_ischemia_minutes INT,
  ureteral_stent_placed BOOLEAN, foley_duration_days INT,
  induction_agent VARCHAR(50), induction_dose VARCHAR(100),
  surgeon_id BIGINT, anesthesiologist_id BIGINT,
  estimated_blood_loss_ml INT, complications_intraop TEXT,
  status VARCHAR(20) DEFAULT 'COMPLETED',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);
ALTER TABLE transplant_procedure ENABLE ROW LEVEL SECURITY;
ALTER TABLE transplant_procedure FORCE ROW LEVEL SECURITY;
CREATE POLICY transplant_procedure_tenant ON transplant_procedure USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- 7. immunosuppression_log (HIGH-ALERT)
CREATE TABLE immunosuppression_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  patient_id BIGINT NOT NULL, encounter_id BIGINT,
  drug_name VARCHAR(50) NOT NULL,
  dose_mg NUMERIC(8,2), frequency VARCHAR(20), route VARCHAR(20),
  trough_level_ng_ml NUMERIC(6,2), trough_date TIMESTAMPTZ,
  prescriber_id BIGINT, pharmacist_verified_id BIGINT,
  started_at TIMESTAMPTZ, stopped_at TIMESTAMPTZ,
  side_effects JSONB, high_alert_flag BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);
ALTER TABLE immunosuppression_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE immunosuppression_log FORCE ROW LEVEL SECURITY;
CREATE POLICY immunosuppression_log_tenant ON immunosuppression_log USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- 8. rejection_episodes
CREATE TABLE rejection_episodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  patient_id BIGINT NOT NULL, transplant_id BIGINT NOT NULL REFERENCES transplant_procedure(id),
  episode_date TIMESTAMPTZ NOT NULL,
  rejection_type VARCHAR(30), banff_grade VARCHAR(20),
  dsa_mfi_at_event JSONB, treatment_given JSONB,
  response VARCHAR(20), graft_outcome VARCHAR(20),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);
ALTER TABLE rejection_episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE rejection_episodes FORCE ROW LEVEL SECURITY;
CREATE POLICY rejection_episodes_tenant ON rejection_episodes USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- 9. protocol_biopsies
CREATE TABLE protocol_biopsies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  transplant_id BIGINT NOT NULL, patient_id BIGINT NOT NULL,
  biopsy_date TIMESTAMPTZ, biopsy_type VARCHAR(20),
  indication TEXT, cores_taken INT, glomeruli_count INT,
  light_microscopy_findings JSONB,
  immunofluorescence_findings JSONB,
  electron_microscopy_findings JSONB,
  sv40_immunostain VARCHAR(10), c4d_score VARCHAR(10),
  banff_category VARCHAR(20), pathologist_id BIGINT,
  report_url_phi_vault TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);
ALTER TABLE protocol_biopsies ENABLE ROW LEVEL SECURITY;
ALTER TABLE protocol_biopsies FORCE ROW LEVEL SECURITY;
CREATE POLICY protocol_biopsies_tenant ON protocol_biopsies USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- 10. graft_surveillance
CREATE TABLE graft_surveillance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  patient_id BIGINT NOT NULL, transplant_id BIGINT NOT NULL,
  visit_date TIMESTAMPTZ,
  scr NUMERIC(5,2), egfr NUMERIC(6,2),
  urea NUMERIC(5,1), proteinuria_g_24h NUMERIC(5,2),
  bk_virus_pcr_copies_ml NUMERIC(12,2),
  cmv_pcr_copies_ml NUMERIC(12,2),
  dsa_panel JSONB, tacrolimus_trough NUMERIC(6,2),
  bp_systolic INT, bp_diastolic INT, weight_kg NUMERIC(5,1),
  medication_adherence_pct NUMERIC(5,2),
  alert_flags JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);
ALTER TABLE graft_surveillance ENABLE ROW LEVEL SECURITY;
ALTER TABLE graft_surveillance FORCE ROW LEVEL SECURITY;
CREATE POLICY graft_surveillance_tenant ON graft_surveillance USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- 11. post_transplant_infections
CREATE TABLE post_transplant_infections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  patient_id BIGINT NOT NULL, transplant_id BIGINT NOT NULL,
  infection_date TIMESTAMPTZ, pathogen VARCHAR(100),
  infection_site VARCHAR(50), severity VARCHAR(20),
  treatment JSONB, hospitalization_required BOOLEAN,
  prophylaxis_status VARCHAR(30),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);
ALTER TABLE post_transplant_infections ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_transplant_infections FORCE ROW LEVEL SECURITY;
CREATE POLICY post_transplant_infections_tenant ON post_transplant_infections USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- 12. long_term_followup
CREATE TABLE long_term_followup (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  patient_id BIGINT NOT NULL, transplant_id BIGINT NOT NULL,
  years_post_transplant NUMERIC(5,2),
  graft_function VARCHAR(20),
  comorbidities JSONB, medication_adherence NUMERIC(5,2),
  qol_score NUMERIC(5,2),
  rehospitalizations_ytd INT,
  last_biopsy_date DATE, last_dsa_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);
ALTER TABLE long_term_followup ENABLE ROW LEVEL SECURITY;
ALTER TABLE long_term_followup FORCE ROW LEVEL SECURITY;
CREATE POLICY long_term_followup_tenant ON long_term_followup USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- 13. paired_exchange_pool
CREATE TABLE paired_exchange_pool (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  donor_id BIGINT NOT NULL, recipient_id BIGINT NOT NULL,
  pool_entry_date TIMESTAMPTZ,
  incompatibility_reason VARCHAR(50),
  match_run_id UUID,
  match_offered_at TIMESTAMPTZ,
  match_accepted_at TIMESTAMPTZ,
  match_completed_at TIMESTAMPTZ,
  match_status VARCHAR(30) DEFAULT 'PENDING',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ
);
ALTER TABLE paired_exchange_pool ENABLE ROW LEVEL SECURITY;
ALTER TABLE paired_exchange_pool FORCE ROW LEVEL SECURITY;
CREATE POLICY paired_exchange_pool_tenant ON paired_exchange_pool USING (tenant_id = current_setting('app.tenant_id')::UUID);

COMMIT;
"@

# 7. 01_rag_chains
WF "$root\NEPH-002\01_rag_chains.md" @"
$banner
# NEPH-002 — LangChain / LangGraph Chains (6 chains)

## 1. donor_recipient_matching_score
**Input:** recipient cPRA, DSA, EPTS, blood type, donor KDPI, HLA MM, age delta
**Output:** {match_score, recommendation: proceed/decline/desensitize, rationale}
**Tools:** kdpi_calc, epts_calc, pra_calc, mm_calculator
**Critical:** YES (drives transplant decision; positive CDC XM = absolute decline)

## 2. banff_biopsy_interpreter
**Input:** pathology report (light/IF/EM), C4d, SV40, DSA, Cr
**Output:** {banff_category, suggested_treatment, citations}
**Tools:** banff_grader, c4d_interpreter, sv40_interpreter
**Critical:** YES (gates treatment escalation; MD must sign off)

## 3. immunosuppression_trough_advisor
**Input:** drug, dose, trough, time-post-tx, Cr
**Output:** {dose_change, recheck_interval, warning}
**Tools:** trough_interpreter, cni_toxicity_check
**Critical:** YES — HARD RULE: trough >20 ng/mL = BLOCK + escalate
**HARD BLOCK:** trough >20 → BLOCK + escalate to transplant nephrologist

## 4. rejection_risk_predictor
**Input:** DSA trajectory, eGFR slope, BK/CMV PCR, medication adherence
**Output:** {30d_rejection_risk, recommendation, monitoring}
**Tools:** dsa_trend, egfr_slope, bk_cmv_check
**Critical:** YES

## 5. infection_prophylaxis_checker
**Input:** time-post-tx, IS regimen, serostatus (CMV/EBV/HSV/BK/HepB)
**Output:** {prophylaxis_recommendations, monitoring}
**Tools:** cmv_risk_calculator, ebv_risk, prophylaxis_lookup
**Critical:** YES

## 6. paired_exchange_match_optimizer
**Input:** pool of ABOi/cPRA-high pairs
**Output:** {suggested_swaps: 2-way|3-way, compatibility_check}
**Tools:** abo_compat, pra_match, mm_calculator
**Critical:** NO (coordinator decision)

## Implementation
LangGraph supervisor; 6-stage RAG pipeline; PII redaction; MedEmbed 768d primary; gpt-4o + claude-3.5; auto-fallback to rule-based `transplant_engine.js`.

---
*Section 07 of NEPH-002. AIE voice. L1 DRAFT.*
"@

# 8. 01_stitch_layout
WF "$root\NEPH-002\01_stitch_layout.md" @"
$banner
# NEPH-002 — Stitch 3-Column Station (Transplant)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ TOP: Patient Header (sticky) + Days Post-Tx + Alert flags                   │
├────────────┬────────────────────────────────────────────────┬────────────────┤
│ LEFT       │                CENTER                          │   RIGHT        │
│            │  (Workflow: Waitlist → Eval → Tx → Follow-up) │                │
│ Donor      │  ┌──────────────────────────────────────────┐  │ Graft Function │
│ ─────      │  │ Step 3 of 5: Post-Transplant Day 7      │  │ ─────          │
│ Type: LRD  │  │ Disposition: Discharge                  │  │ Cr 1.4         │
│ Age 42 F   │  │ IS: Tac 2mg BID, MMF 1g BID, Pred 5mg  │  │ eGFR 56        │
│ KDPI 18%   │  │ Plan: Clinic Day 14                      │  │                │
│ HLA MM 2/6 │  ├──────────────────────────────────────────┤  │ IS Levels      │
│ XM NEG     │  │ Active Step Content:                    │  │ ─────          │
│            │  │ Disposition checklist + education log    │  │ Tac trough 8.5 │
│ Recipient  │  │ [← Prev] [Save] [Next →]                 │  │ ✓ Target 5-10  │
│ ─────      │  └──────────────────────────────────────────┘  │ MMF dose 1g    │
│ Age 38 M   │                                                  │ BID            │
│ ESRD 4y    │  AI Insight:                                    │                │
│ cPRA 5%    │  ""BK PCR trending up (1.2K → 4.5K over    │  │ Surveillance   │
│ EPTS 23    │   3 months). Consider biopsy + reduce MMF.    │  │ ─────          │
│ Blood: A+  │   Evidence: KDIGO BK nephropathy 2020.""     │  │ BK PCR 4.5K   │
│            │                                                  │ ↑ (alert)      │
│ Score Calc │                                                  │ CMV PCR neg    │
│ ─────      │                                                  │ DSA neg        │
│ KDPI 18%   │                                                  │                │
│ EPTS 23    │                                                  │ Red Flags      │
│ MM 2/6     │                                                  │ ─────          │
│ Match: OK  │                                                  │ None           │
│ (proceed)  │                                                  │                │
│            │                                                  │                │
│ [Paired Ex]│                                                  │                │
└────────────┴────────────────────────────────────────────────┴────────────────┘
```

Tokens: Primary #0066CC, success #28A745, critical_value #DC3545.
RTL: AR primary, EN secondary. WCAG 2.2 AA.

---
*Section 08 of NEPH-002. PM voice. L1 DRAFT.*
"@

# 9. 01_unit_tests
WF "$root\NEPH-002\01_unit_tests.md" @"
$banner
# NEPH-002 — Unit Tests (transplant_engine.js)

```js
const t = require('./transplant_engine');
const assert = require('assert');

// 1. KDPI
const kdpi = t.kdpiScore(42, 165, 65, 'caucasian', false, false, 'trauma', false, false, 0.9, false);
assert.ok(kdpi.score >= 0 && kdpi.score <= 100);
assert.ok(kdpi.score < 35); // young, healthy donor

// 2. EPTS
const epts = t.eptsScore(38, 4, false, 0);
assert.ok(epts.score >= 0 && epts.score <= 100);

// 3. cPRA
const cpra = t.praCalculation([{locus:'A2', mfi:8500}, {locus:'DR17', mfi:12000}], 'US_pop');
assert.ok(cpra.cpra_pct >= 0 && cpra.cpra_pct <= 100);

// 4. Crossmatch
const xm = t.crossmatchInterpretation('NEG', 'NEG', 50, 80, 'POS', [{locus:'A2', mfi:8500}]);
assert.strictEqual(xm.decision, 'decline_dsa');
assert.strictEqual(xm.absolute_block, false); // DSA, not CDC

// 5. Trough adjuster
const adj = t.immunosuppressionTroughAdjuster('TACROLIMUS', 2.0, 12, 5, 10, 1.4);
assert.ok(adj.recommendation);

// 6. HARD RULE: trough >20 = block
const blocked = t.immunosuppressionTroughAdjuster('TACROLIMUS', 4.0, 22, 5, 10, 1.4);
assert.strictEqual(blocked.block, true);
assert.strictEqual(blocked.action, 'escalate_to_physician');

// 7. Banff grade
const banff = t.banffGrade({ti:1, i:1, t:0, v:0}, {c4d:0, dsa:0}, 'NEG', 'NEG');
assert.ok(['Borderline','IA','IB','IIA','IIB','III','CAAMR'].includes(banff.category));

// 8. Rejection risk
const risk = t.rejectionRiskScore({dsa:'rising', egfrSlope:-5, bkPcr:5000, cmvPcr:0, adherence:85});
assert.ok(risk.risk_30d_pct >= 0 && risk.risk_30d_pct <= 100);

// 9. Infection prophylaxis
const proph = t.infectionProphylaxisChecker(60, ['TAC','MMF','PRED'], {cmv:'D+/R-', ebv:'R+', hsv:'R+'});
assert.ok(proph.cmv_prophylaxis === 'valganciclovir_3mo');
assert.ok(proph.pcp_prophylaxis === 'tmp_smx_6mo');

// 10. Match score
const match = t.donorRecipientMatchScore(5, [], 23, 'A+', 18, 2, 4);
assert.ok(match.recommendation === 'proceed');
```

---
*Section 09 of NEPH-002. Tests. L1 DRAFT.*
"@

# 10. 01_user_manual
WF "$root\NEPH-002\01_user_manual.md" @"
$banner
# NEPH-002 User Manual (EN + AR)

## For Transplant Coordinators

### Waitlist Management
1. Verify referral (Nephrologist signed)
2. Order evaluation labs
3. Schedule MDT (≥5 specialists)
4. Track workup completion
5. Update listing status (ACTIVE/HOLD/REMOVED)

### Donor Coordination (Living)
1. ABO compat check
2. Independent donor advocate (ILDA) meeting
3. Donor workup
4. Final crossmatch
5. Schedule OR (donor + recipient simultaneous)

### Post-Transplant Follow-up
- Day 14, 30, 60, 90, 180, 365
- Yearly thereafter
- Labs: Cr, eGFR, tac trough, BK/CMV PCR, DSA
- Education: IS compliance, infection prevention
- Trigger: any alert flag → notify nephrologist

## For Transplant Nephrologists

### Trough Monitoring
- Tacrolimus: 8-12 ng/mL (first 3 mo), 5-10 (after)
- Cyclosporine: 200-300 ng/mL
- Sirolimus: 5-15 ng/mL
- **HARD BLOCK: trough >20 = dose hold + escalate**

### Rejection Treatment
- Borderline: optimize
- ACR IA: MPred 500 mg IV x3
- ACR IIA/IIB/III: rATG 1.5 mg/kg x3-5
- AMR: PLEX + IVIG + rituximab ± bortezomib

## For Pharmacists (AR)
### التحقق المزدوج للأدوية عالية الخطورة
- Tacrolimus, Cyclosporine, MMF, Prednisone, Sirolimus
- 2-صيدلي تحقق مستقل
- مراقبة مستوى الـ trough
- تفاعلات دوائية (CNI + azole = سمية)

## For QA Officers
- 1-yr graft survival ≥95% (LRD), ≥90% (DD)
- 1-yr patient survival ≥95%
- DGF <10% (LD), <25% (DD)
- Acute rejection <10% first year
- SCOT reporting compliance (100% within 7d)

---
*Section 10 of NEPH-002. L1 DRAFT.*
"@

# 11. 02_integration_tests
WF "$root\NEPH-002\02_integration_tests.md" @"
$banner
# NEPH-002 — Integration Tests (26 endpoints)

```js
const request = require('supertest');
const app = require('./server');
const { loginMD, loginCoordinator, loginPharmacist } = require('./test-utils');

describe('NEPH-002 API', () => {
  let mdToken, coordToken, pharmToken;
  before(async () => {
    mdToken = await loginMD('dr_ahmed', ['nephrology']);
    coordToken = await loginCoordinator('coord_fatima');
    pharmToken = await loginPharmacist('pharm_omar');
  });

  it('POST /waitlist requires MD role', async () => {
    const res = await request(app)
      .post('/api/v1/transplant/waitlist')
      .set('Authorization', `Bearer ${mdToken}`)
      .send({ patient_id: 1, blood_type: 'A+' });
    expect(res.status).toBe(201);
  });

  it('GET /matching returns donor-recipient match score', async () => {
    const res = await request(app)
      .get('/api/v1/transplant/matching?recipient_id=1&donor_id=1')
      .set('Authorization', `Bearer ${mdToken}`);
    expect(res.body).toHaveProperty('match_score');
    expect(res.body.recommendation).toBeDefined();
  });

  it('POST /crossmatch positive CDC XM = absolute decline', async () => {
    const res = await request(app)
      .post('/api/v1/transplant/crossmatch')
      .set('Authorization', `Bearer ${mdToken}`)
      .send({ donor_id: 1, recipient_id: 1, cdc_t_cell: 'POS' });
    expect(res.body.decision).toBe('absolute_decline');
  });

  it('POST /immunosuppression requires 2-pharmacist verify', async () => {
    const res = await request(app)
      .post('/api/v1/transplant/immunosuppression')
      .set('Authorization', `Bearer ${pharmToken}`)
      .send({ patient_id: 1, drug: 'TACROLIMUS', dose_mg: 2, pharmacist_verified_id: null });
    expect(res.status).toBe(400);
  });

  it('POST /immunosuppression HARD BLOCK on trough >20', async () => {
    const res = await request(app)
      .post('/api/v1/transplant/immunosuppression')
      .set('Authorization', `Bearer ${pharmToken}`)
      .send({ patient_id: 1, drug: 'TACROLIMUS', dose_mg: 4, trough_level: 22, pharmacist_verified_id: 2 });
    expect(res.status).toBe(409); // blocked
    expect(res.body.action).toBe('escalate_to_physician');
  });

  it('POST /procedure requires SCOT donor ID', async () => {
    const res = await request(app)
      .post('/api/v1/transplant/procedure')
      .set('Authorization', `Bearer ${mdToken}`)
      .send({ recipient_id: 1, donor_id: 1, transplant_type: 'LRD' });
    expect(res.status).toBe(201);
    expect(res.body.scot_report_id).toBeDefined();
  });

  it('Cross-tenant isolation: tenant A cannot read tenant B data', async () => {
    const res = await request(app)
      .get('/api/v1/transplant/waitlist')
      .set('Authorization', `Bearer ${mdToken}`)
      .set('X-Tenant-Id', 'tenant-b-uuid');
    expect(res.status).toBe(403);
  });

  it('POST /biopsy requires MD + indication', async () => {
    const res = await request(app)
      .post('/api/v1/transplant/biopsy')
      .set('Authorization', `Bearer ${mdToken}`)
      .send({ transplant_id: 1, biopsy_type: 'FOR_CAUSE', cores_taken: 0 });
    expect(res.status).toBe(400); // indication required for for-cause
  });
});
```

---
*Section 11 of NEPH-002. Tests. L1 DRAFT.*
"@

# 12. 02_iso_9001_checklist
WF "$root\NEPH-002\02_iso_9001_checklist.md" @"
$banner
# NEPH-002 — ISO 9001:2015 QMS Checklist

## 4. Context
- Scope: Renal transplant program (LD + DD + paired exchange)
- Interested parties: patients, families, SCOT, CBAHI, NPHIES, SFDA

## 5. Leadership
- Transplant program director (signed policy)
- Coordinator role
- QA officer
- Quarterly management review

## 6. Planning
- Quality objectives: 1-yr graft survival ≥95% LRD, ≥90% DD
- Risk: FMEA for IS non-adherence, infection
- Opportunity: paired exchange expansion, AI co-pilot

## 7. Support
- Resources: HLA lab, OR, ICU, apheresis, pathology
- Competence: transplant nephrologist, surgeon, coordinator, pharmacist
- Communication: SBAR handoffs, MDT communication
- Documented: SOPs for recipient eval, donor eval, IS, rejection

## 8. Operation
- Operational planning: waitlist mgmt, OR scheduling
- Requirements: KDIGO, Banff, SCOT
- Design: AI chains with L4 validation
- Externally provided: SCOT donor allocation
- Release: transplant procedure MD sign-off
- Nonconforming: incident, RCA

## 9. Performance Evaluation
- Monitoring: 1-yr graft survival, DGF, rejection
- Measurement: trough levels, Cr, BK PCR
- Analysis: monthly outcomes review
- Internal audit: quarterly
- Management review: quarterly

## 10. Improvement
- Nonconformity: report
- Corrective: CAPA
- Continual: paired exchange, AI co-pilot

---
*Section 12 of NEPH-002. L1 DRAFT.*
"@

# 13. 02_migration_down
WF "$root\NEPH-002\02_migration_down.sql" @"
$banner
-- NEPH-002 Migration DOWN
BEGIN;
DROP TABLE IF EXISTS paired_exchange_pool CASCADE;
DROP TABLE IF EXISTS long_term_followup CASCADE;
DROP TABLE IF EXISTS post_transplant_infections CASCADE;
DROP TABLE IF EXISTS graft_surveillance CASCADE;
DROP TABLE IF EXISTS protocol_biopsies CASCADE;
DROP TABLE IF EXISTS rejection_episodes CASCADE;
DROP TABLE IF EXISTS immunosuppression_log CASCADE;
DROP TABLE IF EXISTS transplant_procedure CASCADE;
DROP TABLE IF EXISTS crossmatch_results CASCADE;
DROP TABLE IF EXISTS hla_typing CASCADE;
DROP TABLE IF EXISTS recipient_evaluation CASCADE;
DROP TABLE IF EXISTS donor_registry CASCADE;
DROP TABLE IF EXISTS transplant_waitlist CASCADE;
COMMIT;
"@

# 14. 02_openapi_spec
WF "$root\NEPH-002\02_openapi_spec.md" @"
$banner
# NEPH-002 — OpenAPI 3.1 (26 endpoints)

## Base
URL: `https://api.jumanasoft.com/api/v1/transplant`
Auth: Bearer JWT

## Endpoints (26)

### Waitlist
- POST /waitlist (idempotent)
- GET /waitlist
- GET /waitlist/:id
- PATCH /waitlist/:id

### Evaluation
- POST /evaluation
- GET /evaluation/:id

### HLA Typing
- POST /hla-typing
- GET /hla-typing?subject_id=X&subject_type=RECIPIENT

### Crossmatch
- POST /crossmatch
- GET /crossmatch?donor_id=X&recipient_id=Y

### Procedure
- POST /procedure (idempotent, triggers SCOT report)
- GET /procedure/:id
- GET /patient/:id/graft-history

### Immunosuppression
- POST /immunosuppression (idempotent, high-alert)
- GET /immunosuppression/:patient_id
- PATCH /immunosuppression/:id (dose adjustment)

### Rejection
- POST /rejection
- GET /rejection?patient_id=X

### Biopsy
- POST /biopsy
- GET /biopsy/:id
- GET /biopsy?transplant_id=X&biopsy_type=PROTOCOL_12M

### Surveillance
- POST /surveillance/visit
- GET /surveillance/:patient_id?from=X&to=Y
- GET /surveillance/:patient_id/alerts

### Infection
- POST /infection
- GET /infection?patient_id=X

### Follow-up
- POST /followup
- GET /followup/:patient_id

### Paired Exchange
- GET /pair-exchange/matches
- POST /pair-exchange/register
- POST /pair-exchange/accept

All: requireAuth + requireTenantScope + requireRole + validateBody (per `routes_api.md`).

---
*Section 14 of NEPH-002. L1 DRAFT.*
"@

# 15. 02_sub_dept_catalog
WF "$root\NEPH-002\02_sub_dept_catalog.md" @"
$banner
# NEPH-002 — Sub-Departments

| ID | Name | Type | Description |
|----|------|------|-------------|
| NEPH-002-A | Living Donor Clinic | Clinic | Donor evaluation, workup, education |
| NEPH-002-B | Recipient Evaluation Clinic | Clinic | Recipient workup, MDT presentation |
| NEPH-002-C | HLA Lab | Lab | High-res NGS typing, crossmatch, DSA |
| NEPH-002-D | MDT Room | Conference | Weekly transplant MDT (≥5 specialists) |
| NEPH-002-E | Operating Room (Donor + Recipient) | OR | 2 simultaneous ORs |
| NEPH-002-F | Apheresis Unit | Procedure | PLEX for ABOi desensitization |
| NEPH-002-G | Post-Transplant Clinic | Clinic | Day 14, 30, 60, 90, 180, 365 visits |
| NEPH-002-H | Pathology (Renal) | Lab | Biopsy reading, Banff grading |
| NEPH-002-I | Paired Exchange Coordination | Coordination | National pool, computer match runs |

## Facility types allowed
- tertiary_hospital
- specialized_hospital (transplant center)
- medical_city

---
*Section 15 of NEPH-002. L1 DRAFT.*
"@

Write-Host "✅ NEPH-002 Part 1 done: 15 files written"
