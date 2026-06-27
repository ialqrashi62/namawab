# KPI Catalog
v1.0 — Owner: Quality + Executive — Refresh quarterly

## Notation
- **Source**: where the metric is computed.
- **Cadence**: hourly / daily / monthly / quarterly.
- **Direction**: ↑ better / ↓ better.

## 1. Patient experience
| KPI | Definition | Source | Cadence | Direction | Target |
|-----|-----------|--------|---------|----------|-------|
| NPS | Net Promoter Score from post-visit survey | survey app | monthly | ↑ | ≥ 60 |
| Complaint rate | Complaints per 1000 visits | patrel_complaints | monthly | ↓ | ≤ 3 |
| Resolution time | Avg days to resolve complaint | patrel_complaints | monthly | ↓ | ≤ 10 |
| Wait time satisfaction | % "satisfied" with ED wait | survey | monthly | ↑ | ≥ 75% |

## 2. Access & throughput
| KPI | Definition | Source | Cadence | Target |
|-----|-----------|--------|---------|-------|
| ED Door-to-Doctor | Median minutes | ed_visits | hourly | ≤ 20 |
| Door-to-Balloon (STEMI) | Median minutes | cardio_cath_cases | per case | ≤ 90 |
| Door-to-Needle (Stroke) | Median minutes | ed_codes + ed_visits | per case | ≤ 30 |
| Sepsis 1-h Bundle compliance | % patients meeting all elements | ed_order_bundles | monthly | ≥ 90% |
| OPD wait time | Median check-in to seen | visits | daily | ≤ 25 |
| Admission-to-bed | Median minutes | ed_visits | daily | ≤ 60 |
| Discharge before 11am | % discharges before 11:00 | visits | daily | ≥ 50% |
| OR utilization | Used hours / scheduled hours | surg_cases | weekly | 75–85% |
| Cath-lab utilization | Used / scheduled | cardio_cath_cases | weekly | 70–85% |

## 3. Clinical quality
| KPI | Definition | Source | Cadence | Target |
|-----|-----------|--------|---------|-------|
| 30-day readmission | All-cause readmits within 30d | visits | monthly | ≤ 10% |
| HAI rate | Healthcare-associated infections per 1000 patient-days | id_outbreaks + visits | monthly | ≤ 1.5 |
| CLABSI | Central line bloodstream infections per 1000 line-days | nursing_obs + cultures | monthly | ≤ 1.0 |
| CAUTI | Catheter-assoc UTI per 1000 catheter-days | nursing_obs + cultures | monthly | ≤ 1.5 |
| VAP | Vent-associated pneumonia per 1000 vent-days | icu_vent + cultures | monthly | ≤ 2.0 |
| Surgical site infection | per 100 procedures | surg_cases + cultures | monthly | ≤ 2.0 |
| Falls with injury | per 1000 patient-days | nursing_risks | monthly | ≤ 0.5 |
| Pressure injury (HAPI) | per 1000 patient-days | nursing_risks | monthly | ≤ 0.5 |
| Medication error rate | per 1000 doses administered | nursing_med_admin | monthly | ≤ 5 |
| Unplanned ICU admit (post-op) | % within 24h | surg_cases | monthly | ≤ 1% |
| Crash-cart / Code Blue events | count + survival rate | ed_codes | monthly | track |

## 4. AI/Co-pilot
| KPI | Definition | Source | Cadence | Target |
|-----|-----------|--------|---------|-------|
| AI uptime | %time available | observability | daily | ≥ 99.9% |
| AI p95 latency | LangGraph end-to-end | observability | hourly | ≤ 5s |
| Confidence ≥ 0.7 share | % of advisory answers | audit | monthly | ≥ 80% |
| Human override rate | % of AI suggestions overridden | audit | monthly | track |
| Subgroup gap | max performance gap | model monitor | monthly | ≤ 5% |
| ECG STEMI sensitivity | KSA cohort rolling | model monitor | monthly | ≥ 90% |
| Hallucination incidents | per month | OVR | monthly | 0 |

## 5. Financial
| KPI | Definition | Source | Cadence | Target |
|-----|-----------|--------|---------|-------|
| ZATCA submission success | % first-pass | zatca worker | daily | ≥ 99% |
| Insurance denial rate | % NPHIES denied | claims | monthly | ≤ 5% |
| Days in A/R | Avg | finance_vouchers | monthly | ≤ 45 |
| Revenue per OPD visit | SAR | finance | monthly | track |
| Cost per discharge | SAR | finance | monthly | track |

## 6. Workforce
| KPI | Definition | Source | Cadence | Target |
|-----|-----------|--------|---------|-------|
| Vacancy rate | open / approved | hr_positions | monthly | ≤ 5% |
| Saudization | % Saudi nationals | hr | monthly | per Nitaqat |
| Training compliance | % up-to-date mandatory modules | hr_training_records | monthly | ≥ 95% |
| Burnout indicator | survey-based | EAP | quarterly | low |
| Retention 12-mo | % staying | hr | quarterly | ≥ 85% |

## 7. Safety & compliance
| KPI | Definition | Source | Cadence | Target |
|-----|-----------|--------|---------|-------|
| OVR reports | per 1000 visits | qa_incidents | monthly | track ↑ (reporting culture) |
| Sentinel events | count | qa_incidents | monthly | 0 |
| CAPA on-time closure | % | qa_capa | monthly | ≥ 80% |
| CBAHI gap rate | open gaps / standards | qa_audits | quarterly | ↓ |
| Privileging expiry rate | % expired | qa_credentialing | weekly | 0% |
| OHS exposures | needlestick + chem + rad | ohs_exposures | monthly | track ↓ |

## 8. Infrastructure / SRE
| KPI | Definition | Source | Cadence | Target |
|-----|-----------|--------|---------|-------|
| Tier-1 uptime | %time | obs | monthly | ≥ 99.9% |
| Sev1 incidents | count | IR system | monthly | ↓ |
| MTTR Sev1 | hours | IR system | per | ≤ 2 |
| Backup success | % daily | DR | daily | 100% |
| DR drill outcome | RTO/RPO actual vs target | drills | quarterly | within target |
| Vulnerabilities open | by severity | scanners | weekly | per SLA |

## 9. Department-level KPIs
- Each dept (G01–G40) has its own subset; defined inside its `groups/{NN}_*.md` §2.0.
- Aggregates from this catalog.

## 10. Dashboards
- Executive (G35): top 25 KPIs.
- CMO: clinical quality + safety bundles.
- CNO: nursing quality + falls/pressure.
- CFO: financial + ZATCA + denials.
- CISO: security + scans + incidents.
- AI Lead: AI quality table.
- Per-dept: relevant slice.
