# CBAHI Evidence Index
v1.0 — Owner: Quality Director — Survey-readiness binder

> Each row maps a CBAHI standard area to NamaMedical features, evidence artifacts,
> and the responsible owner. Auditors should be able to navigate from any standard
> citation to the live data + policy documents.

## How to use during a survey
1. Auditor cites a standard (e.g., `IPSG.2 — Effective Communication`).
2. Navigate to the row below.
3. Show: live screen, evidence file (binder ID), and KPI dashboard.

## Mapping table

### IPSG — International Patient Safety Goals
| Std | Title | NamaMedical Feature | Evidence | Owner |
|-----|------|--------------------|----------|------|
| IPSG.1 | Identify patients correctly | MRN + barcode + 2-identifier check | screenshots; nursing audit | CNO |
| IPSG.2 | Effective communication | SBAR handover (G30); critical-value call-back (G22); timeout (G10) | nursing_handover, lab_critical_calls, surg_consents | CNO + CMO |
| IPSG.3 | High-alert medications | dual-witness sign-off; barcode; high-alert flag | pharm_orders, onc_cycle_orders | Pharmacy Dir |
| IPSG.4 | Safe surgery | preoperative checklist, site marking, time-out, counts | surg_consents, surg_counts | OR Lead |
| IPSG.5 | Reduce HAI | hand hygiene compliance, isolation, antimicrobial stewardship | id_outbreaks, id_abx_orders, IPC dashboards | IPC Lead |
| IPSG.6 | Reduce harm from falls | Morse score + intervention bundle | nursing_risks | CNO |

### ACC — Access, Continuity of Care
| Std | NamaMedical | Evidence |
|-----|------------|----------|
| ACC.1 | Triage CTAS + ED workflow | ed_triage, ed_visits |
| ACC.2 | Admission/transfer/discharge process | visits, social_discharge_plans |
| ACC.3 | Continuity of care | EMR access, handover SBAR, discharge summary |
| ACC.4 | Discharge & follow-up | discharge plans, follow-up appointments |
| ACC.5 | Transport | nama-internal transport module + Shahm integration |

### AOP — Assessment of Patients
| Std | NamaMedical | Evidence |
|-----|------------|----------|
| AOP.1 | Initial assessment within timeframe | nursing_assessments, doctor_notes |
| AOP.2 | Reassessment | nursing_observations stream |
| AOP.3 | Lab + Imaging services | G22 + G21 with TAT KPIs |
| AOP.4 | Care planning | nursing_care_plans (NANDA) |

### COP — Care of Patients
| Std | NamaMedical | Evidence |
|-----|------------|----------|
| COP.1 | Uniform care | care pathways per dept, BPMN files |
| COP.2 | High-risk care (resus, blood, restraint, dialysis) | ed_codes, bb_*, nephro_dialysis_sessions |
| COP.3 | End-of-life care | palliative pathway, advance directives |
| COP.4 | Pain management | pain_pca, intrathecal pumps |
| COP.5 | Food & nutrition | nutr_assessments + diets |

### ASC — Anesthesia & Surgical Care
| Std | NamaMedical | Evidence |
|-----|------------|----------|
| ASC.1 | Pre-anesthesia assessment | anes_pre_op |
| ASC.2 | Intra-op record | anes_intra_op |
| ASC.3 | PACU monitoring | pacu_admissions |
| ASC.4 | Surgical site marking + count | surg_counts + checklist |

### MMU — Medication Management
| Std | NamaMedical | Evidence |
|-----|------------|----------|
| MMU.1 | Selection & procurement | inventory_items + formulary |
| MMU.2 | Storage incl. high-alert | inventory + cold-chain logs |
| MMU.3 | Ordering + transcription | pharm_orders |
| MMU.4 | Preparation & dispensing | pharm_compound_log |
| MMU.5 | Administration (5 rights) | nursing_med_admin |
| MMU.6 | Monitoring effects | adverse drug reactions log |
| MMU.7 | Antimicrobial stewardship | id_abx_orders |

### PFE — Patient & Family Education
| Std | NamaMedical | Evidence |
|-----|------------|----------|
| PFE.1 | Education plan + materials | heduc_sessions; AR/EN leaflets |
| PFE.2 | Comprehension verification | heduc_sessions.comprehension_check |

### QPI — Quality Improvement
| Std | NamaMedical | Evidence |
|-----|------------|----------|
| QPI.1 | KPIs collected | KPI catalog |
| QPI.2 | RCA-2 + FMEA on sentinel/high-risk | qa_sentinel_rca |
| QPI.3 | CAPA | qa_capa |
| QPI.4 | External benchmarking | reports |

### PCI — Prevention & Control of Infections
| Std | NamaMedical | Evidence |
|-----|------------|----------|
| PCI.1 | IPC program + leadership | G08 dashboards |
| PCI.2 | HAI surveillance | KPIs CLABSI/CAUTI/VAP/SSI |
| PCI.3 | Hand hygiene compliance | observation rounds |
| PCI.4 | Isolation precautions | nursing care plan flags |
| PCI.5 | Sterilization (CSSD) | CSSD logs |
| PCI.6 | Outbreak management | id_outbreaks |

### GLD — Governance, Leadership & Direction
| Std | NamaMedical | Evidence |
|-----|------------|----------|
| GLD.1 | Org structure + medical staff bylaws | exec_initiatives + policies |
| GLD.2 | Strategic & operational plans | exec_initiatives (OKRs) |
| GLD.3 | Ethics committee | ethics_cases |
| GLD.4 | Annual quality report | board packs |

### FMS — Facility Management & Safety
| Std | NamaMedical | Evidence |
|-----|------------|----------|
| FMS.1 | Safety + security | sec_incidents, ohs_exposures |
| FMS.2 | Hazardous materials & waste | OHS + IPC logs |
| FMS.3 | Disaster mgmt | disaster_plans + drills |
| FMS.4 | Fire safety | drills + Civil Defense |
| FMS.5 | Medical equipment | biomed_devices, calibrations |
| FMS.6 | Utilities | maintenance system |

### SQE — Staff Qualifications & Education
| Std | NamaMedical | Evidence |
|-----|------------|----------|
| SQE.1 | Credentialing & privileging | qa_credentialing |
| SQE.2 | Orientation | hr_training_records |
| SQE.3 | Continuing education (CME) | edu_cme |
| SQE.4 | Performance evaluation | hr_performance_reviews |

### MOI — Management of Information
| Std | NamaMedical | Evidence |
|-----|------------|----------|
| MOI.1 | Information security | security_baseline + pen-test reports |
| MOI.2 | Records management | data_retention_policy |
| MOI.3 | EMR & decision support | the entire platform |
| MOI.4 | Audit trail | it_audit_logs (hash-chained) |

### LAB / RAD / DIA chapters — see G22 / G21 / G23 mapping in their respective docs.

## Refresh
- Reviewed monthly by Quality Director.
- Annual mock-survey with external consultant.
