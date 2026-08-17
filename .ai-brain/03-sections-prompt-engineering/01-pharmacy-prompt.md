# PHARMACY Section — Prompt Engineering

## Section Domain
**Pharmacy** — Hospital pharmacy module covering prescription, dispensing, IV compounding, reconciliation, interactions, controlled substances.
**World-Class Reference**: Epic Willow, Cerner PharmNet, Meditech Pharmacy.

## System Prompt

```
You are a clinical pharmacist expert building the hospital pharmacy module
of NamaMedical Hospital ERP (Saudi Arabia). Domain follows:
- ZATCA Phase 2 compliant drug ordering
- NPHIES pharmacy claims
- CBAHI medication safety
- SFDA Saudi Food & Drug Authority regulations
- PDPL patient privacy for medication data
- HL7 v2 RXA/RXE/RXO messages
- FHIR R4 MedicationRequest, MedicationStatement, MedicationDispense
- C-CDA medication sections

All endpoints return JSON with status/result fields. Validation uses
class ValidationError + ensureStr/Number/Enum/Bool helpers. Pure functions
in module.exports.fucs(). Never call DB. Tables use tenant_id RLS.

Arabic-first labels: Bilingual (ar/en) supported via i18n keys.
Drug names follow SFDA list + RxNorm + SNOMED CT.
Dose units: mg, mcg, g, mL, units, mmol, IU.
```

## Context

```
Hospital context: multi-tenant, multi-facility (16 facility types),
multi-encounter (inpatient/outpatient/ED/OR/ICU/OB).
Patient context: allergies, weight, age, renal function, hepatic function,
pregnancy, lactation, G6PD, pharmacogenomics.
Provider context: role, privilege, formulary, license.
Pharmacy context: inpatient satellite, outpatient retail, IV room, OR
satellite, oncology satellite, controlled substance vault.
```

## Workflow & Orchestration

```
1. Provider orders medication (CPOE)
2. Pharmacy receives order (queue)
3. Pharmacist verifies order (interactions, allergies, dose, route, freq)
4. If IV: IV admixture compounding (sterile technique)
5. Pharmacist dispenses (unit-dose, multi-dose, IV bag, syringe)
6. Nurse administers (5 rights, MAR, scan)
7. Patient receives monitoring
8. Refill / discontinue
```

## LangChain Chaining

```python
# In LLM-augmented features (e.g., dose recommendation):
chain = (PromptTemplate("Given patient {age}, weight {weight}, "
        "creatinine {cr}, drug {drug}, dose {dose}, frequency {freq}, "
        "indication {indication}, suggest optimal regimen")
        | llm | parser)
```

## VectorMine (RAG)

```
Embed: drug monographs, formulary, drug interactions, side effects,
renal dosing tables, pediatric dosing tables.
Vector: PGVector with HNSW index.
Retrieve: top-5 for each query.
Generate: Cite monograph + dosing table.
Citations: 21 CFR 201.56, AHFS, Lexicomp, Micromedex, SFDA list.
```

## API Endpoints (30 total)

### 101 — prescription_order_entry
- rx_order_create
- rx_order_modify
- rx_order_discontinue
- rx_order_renew
- rx_order_verify

### 102 — pharmacy_dispensing
- rx_dispense_unit_dose
- rx_dispense_multi_dose
- rx_dispense_iv_bag
- rx_dispense_syringe
- rx_dispense_topical

### 103 — iv_compounding_sterile
- iv_admixture_prepare
- iv_admixture_verify
- iv_admixture_usp797_check
- iv_chemotherapy_safety
- iv_compound_label

### 104 — medication_reconciliation
- med_rec_intake
- med_rec_inpatient_admission
- med_rec_transfer
- med_rec_discharge
- med_rec_followup

### 105 — drug_interaction_check
- ddi_check
- ddi_dose_adjust
- ddi_allergy_check
- ddi_duplicate_therapy
- ddi_severity_classify

### 106 — controlled_substance_tracking
- cs_dispense_log
- cs_wastage_log
- cs_count_audit
- cs_diversion_detect
- cs_dea_form_222

## Data & Storage

### Tables (6 new)
- pharma_rx_order
- pharma_rx_dispense
- pharma_iv_admixture
- pharma_med_reconciliation
- pharma_ddi_event
- pharma_controlled_substance_log

### Indexes
tenant_id + order_id, tenant_id + dispense_id, etc.

## RAG

### Vector DB
- Embed: drug_monograph, formulary, interaction, allergy
- Retrieval: top-5 for each clinical query
- Generation: drug recommendation with citation

## Frontend / UI-UX

### Pages (Pharmacy Module)
- RxOrderQueue
- DispenseWorkbench
- IVRoomBoard
- MedRecForm
- InteractionCheck
- ControlledSubstanceVault
- PatientMedList

### Buttons
- Verify Order
- Dispense
- Compound
- Reconcile
- Override Warning
- Cancel Order
- Renew

### Lists
- Pending orders
- Active orders
- Dispense log
- Compound log
- Allergy list

## Digital Assets

- Pill images (use SFDA pill identifier API)
- IV bag images
- Label templates (ZPL/print)
- NDC barcodes (EAN-13, GS1)

## Infrastructure / DevOps

### CI/CD
- GitHub Actions on push
- Run test suite
- Run smoke
- Deploy to Hetzner

### Testing & QA
- Unit: validate inputs
- Integration: order-create to dispense chain
- E2E: provider orders → pharmacist dispenses → nurse administers
- Smoke: 30/30 200 OK

### Business Flows

#### Flow 1 — Inpatient Order
1. Provider opens chart
2. Selects "Order Medication"
3. Searches formulary
4. Enters dose, route, frequency
5. DDI engine runs (interactions, allergies, dose)
6. If alert: override or modify
7. Provider signs order
8. Order flows to pharmacy queue
9. Pharmacist verifies
10. Dispenses unit-dose
11. MAR records administration

#### Flow 2 — IV Compounding
1. Provider orders IV antibiotic
2. Pharmacist reviews
3. IV room technician prepares
4. USP 797 sterile check
5. Label generated (ZPL)
6. Delivered to unit
7. Nurse hangs
8. Compatibility check before Y-site

## Wireframes

See `.ai-brain/05-stitch-wireframes/pharmacy.stitch.html`

## Database ERD

See `.ai-brain/06-erd-database/pharma-erd.md`

## API Specifications

See `.ai-brain/07-openapi-specs/pharma-openapi.yaml`

## Test Cases

See `.ai-brain/08-test-cases/pharma-test-cases.md`

## Security Plan

- All controlled substance logs hash-chained
- Two-pharmacist verification for high-alert meds
- NDC barcode validation
- Tamper-evident labels
- Audit trail for all dispenses (7-year retention)

## i18n

ar (default), en, fr, ur. Keys: `pharma.order.create`, `pharma.dispense.unit`, etc.

## Sample Data

- NDC codes: 00074-4341-04 (vancomycin), 0093-0058-01 (warfarin)
- Saudi formulary: top 500 drugs
- Common interactions: warfarin+aspirin, MAOI+SSRI, etc.

## Migration Scripts

`migrations/e999_pharma_up.sql` + `e1000_pharma_up.sql`...

## User Manual

See `.ai-brain/11-docs/pharma-manual.md`

## Training Videos

- How to verify an order
- How to compound IV
- How to dispense controlled substances

## Legal & Compliance

- KSA: SFDA registration, MoH narcotic rules
- KSA: CBAHI medication safety standards
- KSA: ZATCA drug pricing

## Project Management

Story: PHARM-1 — As a pharmacist, I want to verify orders with auto-DDI
Acceptance: All orders checked against patient allergies + active meds
Story points: 8 per module (6 modules × 8 = 48 points)

## Task Tracking

- PHARM-1: Order entry (8 pts)
- PHARM-2: Dispensing (5 pts)
- PHARM-3: IV room (13 pts)
- PHARM-4: Reconciliation (8 pts)
- PHARM-5: DDI engine (5 pts)
- PHARM-6: Controlled (8 pts)

## Budget & Token Cost

Estimate: ~30K tokens for 6 modules (skills, no abbreviation)

## APM & Logging

- Pharmacist action latency
- Order verification time
- DDI alert override rate
- Controlled substance access audit

## User Analytics

- Orders per provider per day
- Dispense rate per shift
- Override patterns
- IV admixture turnaround

## LLM Observability

- DDI suggestion accuracy
- IV dilution recommendations
- Pediatric dosing accuracy

## Authentication (SSO/JWT)

- Pharmacist badge scan (RFID/NFC)
- Biometric for controlled substances
- Two-factor for remote access

## Authorization & RBAC

| Role | Permission |
|---|---|
| Pharmacy Tech | Dispense non-controlled, compound |
| Pharmacist | Verify, dispense all, sign CS |
| Pharmacy Manager | Manage inventory, audit |
| Provider | Order |
| Nurse | Administer, MAR |

## Penetration Testing

- Drug name spoofing (look-alike sound-alike LASA)
- Dose calculation overflow
- NDC injection
- Controlled substance record tampering

## SEO Optimization

N/A (internal product)

## Helpdesk & Support

- Pharmacy help desk
- 24/7 on-call pharmacist
- Vendor support (drug databases)

## Go-to-Market Strategy

- Phase 1: Existing 16 facilities upgrade
- Phase 2: New facility onboarding
- Phase 3: SaaS multi-tenant
