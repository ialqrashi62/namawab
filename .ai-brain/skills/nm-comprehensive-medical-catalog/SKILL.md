---
name: nm-comprehensive-medical-catalog
description: Use when auditing completeness of NamaMedical against world-class EMR/HIS systems (Epic, Cerner/Oracle Health, MEDITECH, athena, InterSystems TrakCare, Allscripts/Veradigm, Philips, GE Healthcare, Siemens Healthineers). Generates per-system feature parity matrix and a gap-fix plan. Token-saver: replaces 500-line manual scan with a 50-line DSL.
version: 1.0.0
---

# nm-comprehensive-medical-catalog

## Purpose

Audit NamaMedical feature coverage against **18 world-class medical systems** to identify gaps and prioritize improvements.

## The 18 systems (in scope)

| # | System | Type | Specialty coverage |
|---|---|---|---|
| 1 | Epic | EMR/HIS | All (gold standard) |
| 2 | Cerner / Oracle Health | EMR/HIS | All |
| 3 | MEDITECH | EMR/HIS | All (community hospitals) |
| 4 | athenahealth | EHR | Ambulatory |
| 5 | InterSystems TrakCare | HIS | Global |
| 6 | Allscripts / Veradigm | EHR | Ambulatory |
| 7 | Philips (IntelliSpace, Tasy) | HIS | Imaging + enterprise |
| 8 | Siemens Healthineers | Imaging | Radiology, cardiology |
| 9 | GE Healthcare (Centricity) | EMR/HIS | Enterprise |
| 10 | Nuance / DAX Copilot | AI scribe | Documentation |
| 11 | Picis | OR/ICU | Perioperative |
| 12 | Vocera / Stryker | Communication | Clinical comms |
| 13 | IBM Watson Health | AI | Decision support |
| 14 | Sectra | Imaging | Pathology, radiology |
| 15 | Hyland (Acuo, OnBase) | ECM | Document mgmt |
| 16 | 3M / Solventum | Coding | CDI, coding |
| 17 | Change Healthcare | Revenue | RCM |
| 18 | Waystar | Revenue | RCM |
| 19 | R1 RCM | Revenue | RCM |
| 20 | Epic / Cerner / Allscripts / athena (sweep) | Total addressable |

## 44-department audit (NamaMedical scope)

| ID | Dept | Epic | Cerner | MEDITECH | athena | TrakCare | Allscripts | Philips | Siemens | GE |
|---|---|---|---|---|---|---|---|---|---|---|
| DEP-001 | Cardiology | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ | ✅ | ⚠️ |
| DEP-002 | Endocrinology | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ⚠️ | ⚠️ |
| DEP-003 | Gastroenterology | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ | ✅ | ⚠️ |
| DEP-004 | HemOnc | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ | ✅ | ⚠️ |
| DEP-005 | Nephrology | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ | ✅ | ⚠️ |
| DEP-006 | Pulmonology | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ | ✅ | ⚠️ |
| DEP-007 | Rheumatology | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ⚠️ | ⚠️ |
| DEP-008 | Infectious disease | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ⚠️ | ⚠️ | ⚠️ |
| DEP-009 | Dermatology | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ⚠️ | ⚠️ |
| DEP-010 | Allergy | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ⚠️ | ⚠️ |
| DEP-011 | General surgery | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ | ✅ | ⚠️ |
| DEP-012 | Ortho | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ | ✅ | ⚠️ |
| DEP-013 | NeuroSurg | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ | ✅ | ⚠️ |
| DEP-014 | CardioTh | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ | ✅ | ⚠️ |
| DEP-015 | ENT | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ | ✅ | ⚠️ |
| DEP-016 | Ophth | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ⚠️ | ⚠️ |
| DEP-017 | Uro | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ | ✅ | ⚠️ |
| DEP-018 | Plastic | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ | ✅ | ⚠️ |
| DEP-019 | Vascular | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ | ✅ | ⚠️ |
| DEP-020 | Transplant | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ | ✅ | ⚠️ |
| DEP-021 | Emergency | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ | ✅ | ⚠️ |
| DEP-022 | ICU | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ | ✅ | ⚠️ |
| DEP-023 | NICU | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ | ✅ | ⚠️ |
| DEP-024 | PICU | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ | ✅ | ⚠️ |
| DEP-025 | PACU | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ | ✅ | ⚠️ |
| DEP-026 | Peds | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ⚠️ | ⚠️ |
| DEP-027 | Neonate | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ | ✅ | ⚠️ |
| DEP-028 | PedsCard | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ | ✅ | ⚠️ |
| DEP-029 | PedsNeuro | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ | ✅ | ⚠️ |
| DEP-030 | PedsNeph | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ | ✅ | ⚠️ |
| DEP-031 | PedsHemOnc | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ | ✅ | ⚠️ |
| DEP-032 | PedsSurg | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ | ✅ | ⚠️ |
| DEP-033 | PedsDev | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ⚠️ | ⚠️ | ⚠️ |
| DEP-034 | OBS | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ⚠️ | ⚠️ |
| DEP-035 | Gyn | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ⚠️ | ⚠️ |
| DEP-036 | Fertility | ✅ | ✅ | ⚠️ | ✅ | ✅ | ⚠️ | ⚠️ | ⚠️ | ⚠️ |
| DEP-037 | MFM | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ⚠️ | ⚠️ | ⚠️ |
| DEP-038 | UroGyn | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ⚠️ | ⚠️ | ⚠️ |
| DEP-039 | Lab | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ | ✅ | ⚠️ |
| DEP-040 | Radiology | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ | ✅ | ⚠️ |
| DEP-041 | IR | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ | ✅ | ⚠️ |
| DEP-042 | NucMed | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ | ✅ | ⚠️ |
| DEP-043 | Pathology | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ | ✅ | ⚠️ |
| DEP-044 | Psych | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ⚠️ | ⚠️ | ⚠️ |
| DEP-045 | Psychol | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ⚠️ | ⚠️ |
| DEP-046 | PT | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ⚠️ | ⚠️ |
| DEP-047 | OT | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ⚠️ | ⚠️ |
| DEP-048 | MedOnc | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ | ✅ | ⚠️ |
| DEP-049 | RadOnc | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ | ✅ | ⚠️ |
| DEP-050 | Palliative | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ⚠️ | ⚠️ | ⚠️ |
| DEP-051 | Anesth | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ | ✅ | ⚠️ |
| DEP-052 | Pain | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ | ✅ | ⚠️ |
| DEP-053 | Pharmacy | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ | ✅ | ⚠️ |
| DEP-054 | Inventory | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ |
| DEP-055 | Finance | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ |
| DEP-056 | HR | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ |
| DEP-057 | Billing | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ |
| DEP-058 | Insurance | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ |
| DEP-059 | Quality | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ⚠️ | ⚠️ | ⚠️ |
| DEP-060 | Facility | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

## Where NamaMedical leads

- AI orchestrators per dept (21 active)
- Vector DB / RAG / LangChain
- Stitch design system (110 pages)
- Arabic-first + RTL
- PDPL + ZATCA + NPHIES + CBAHI + SFDA

## Where NamaMedical lags

| Gap | Source system | Priority |
|---|---|---|
| LLM scribe (Nuance DAX) | Nuance | P2 |
| RCM automation (Waystar/R1) | Waystar, R1 | P1 |
| Coding assistance (3M CDI) | 3M / Solventum | P2 |
| Document mgmt (Hyland) | Hyland | P2 |
| Bedside communication (Vocera) | Vocera | P3 |
| Population health (Epic) | Epic | P2 |
| Genomics (Epic) | Epic | P3 |

## Output

Generates:
- `.ai-brain/00_SYSTEM/GLOBAL_MEDICAL_SYSTEMS_BENCHMARK_AR.md` (already created)
- `.ai-brain/00_SYSTEM/COMPETITIVE_PARITY_MATRIX.md`
- `.ai-brain/00_SYSTEM/GAP_FIX_ROADMAP.md`

## Pair with

- `nm-gap-analysis` (Epic/Cerner/athena gap)
- `nm-global-hospital-benchmark`
- `nm-quality-gates`
