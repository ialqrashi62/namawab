# Infectious Diseases — Batch 1 (Synthesis)

> **Owner:** Auto-Phase 3
> **Date:** 2026-07-22

## 1. CMO Input

### Clinical Scope
- **Mission:** ID + infection control + antimicrobial stewardship + travel + vaccination
- **Top 5:** A41.9 (Sepsis), B19.9 (Hepatitis viral), B34.9 (Viral), J18.9 (Pneumonia), A09 (Gastroenteritis)
- **Care bundles:** Sepsis 1h bundle, antimicrobial stewardship, neutropenic fever
- **Red flags:** Septic shock, neutropenic fever, CNS infection, MDR organism

### Sub-units
1. ID consult service
2. Infection control
3. Tropical medicine
4. Antimicrobial stewardship program (ASP)
5. Travel medicine
6. Vaccination center

## 2. AI Engineer

### Engines
- `sepsis_engine.js` (qSOFA — exists, NEWS2, SIRS)
- `abx_stewardship_engine.js` (DDI, renal dose, de-escalation)
- `vaccine_engine.js` (scheduling, contraindications)
- `mdr_engine.js` (colonization, isolation)

## 3. Architect

### API
- POST `/api/id/cds/sepsis_screen`
- POST `/api/id/cds/abx_dose` (renal-adjusted)
- POST `/api/id/cds/vaccine_schedule`
- GET `/api/id/cohorts/mdr`, `/sepsis`, `/vaccination`

## 4. DevOps
- RLS, encrypted culture results
- Audit every abx start/stop

## 5. PM/UX
- Sub-tabs: Consult, IC, ASP, Travel, Vacc
- Layout E (timeline) for infection progression

## 6. Compliance
- CBAHI, IDSA, Saudi MoH communicable disease

## KPIs
1. Sepsis bundle 1h ≥75%
2. Abx de-escalation ≤72h ≥80%
3. C. diff ≤5/10K pt-days
4. MRSA bacteremia <1/10K pt-days
5. HCW flu vacc ≥90%

## New files (this batch)
- Synthesis
