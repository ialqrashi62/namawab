---
module_id: ER-001
section: 06_compliance
template_ref: TPL:DEPT
generated: 2026-07-23
---

# ER-001 ISO 9001:2015 Controls

## Quality Management System (QMS)

| Clause | Control | ER-001 Implementation |
|--------|---------|------------------------|
| **4** Context of Organization | 4.1 Understanding context | ED market analysis, KSA/UAE/GCC context |
| | 4.2 Needs of customers | Patient + family + referring MD needs |
| | 4.3 Scope | All ED services (triage, treatment, disposition) |
| | 4.4 QMS | Documented processes, evidence-based care |
| **5** Leadership | 5.1 Leadership commitment | CMO commitment to quality |
| | 5.2 Policy | Quality policy, patient-first |
| | 5.3 Roles | Head of ED, charge nurses, MDs, RNs |
| **6** Planning | 6.1 Risks + opportunities | Risk register, mitigation plans |
| | 6.2 Quality objectives | Door-to-balloon <90min, sepsis bundle <1h, etc. |
| | 6.3 Planning of changes | Change management process |
| **7** Support | 7.1 Resources | Staffing matrix, equipment, training budget |
| | 7.2 Competence | BLS, ACLS, PALS, TNCC certifications |
| | 7.3 Awareness | Monthly safety huddles, M&M conferences |
| | 7.4 Communication | Internal (staff meetings), external (NPHIES) |
| | 7.5 Documented info | ED procedures, protocols, order sets |
| **8** Operation | 8.1 Operational planning | Annual plan, monthly review |
| | 8.2 Requirements | Patient needs, regulatory, payer |
| | 8.3 Design + development | New order sets, AI agents |
| | 8.4 Control of externally provided | NPHIES, lab, imaging vendors |
| | 8.5 Production + service provision | Triage, treatment, disposition SOPs |
| | 8.6 Release of products | New drug/formulary release process |
| | 8.7 Control of nonconforming | Incident reporting, CAPA |
| **9** Performance Evaluation | 9.1 Monitoring + measurement | KPI dashboard (real-time) |
| | 9.2 Internal audit | Quarterly ER audit |
| | 9.3 Management review | Monthly review with ED leadership |
| **10** Improvement | 10.1 General | PDCA cycle |
| | 10.2 Nonconformity + corrective action | CAPA workflow |
| | 10.3 Continual improvement | Kaizen events, lean initiatives |

## Key Performance Indicators (ISO 9001)

### Clinical Quality
| KPI | Target | Measurement | Frequency |
|-----|--------|-------------|-----------|
| Door-to-balloon (STEMI) | >85% <90min | Chart review | Monthly |
| Door-to-needle (tPA) | >50% <60min | Chart review | Monthly |
| Sepsis bundle compliance | >80% <1h | Order set audit | Monthly |
| Pain reassessment | >90% within 1h | Chart review | Monthly |
| Medication reconciliation | >95% | Pharmacy audit | Monthly |
| Allergic reaction rate | <0.1% | Incident reports | Monthly |
| Unplanned 72h return | <3% | Data warehouse | Monthly |

### Operational
| KPI | Target | Measurement | Frequency |
|-----|--------|-------------|-----------|
| Door-to-provider | <30min median | Triage system | Daily |
| LOS median | <4h | Encounter system | Daily |
| LWBS rate | <2% | Triage system | Daily |
| Patient satisfaction | >4.0/5.0 | Press Ganey | Monthly |
| Bed turnover | <15min | Housekeeping | Daily |

### Safety
| KPI | Target | Measurement | Frequency |
|-----|--------|-------------|-----------|
| Red flag miss rate | 0 (zero) | Chart review | Monthly |
| Drug safety bypass attempts | 0 (audit each) | Audit log | Weekly |
| Cross-tenant RLS violations | 0 | Security log | Daily |
| Audit chain break | 0 | Hash verification | Daily |
| Code survival (overall) | >25% | Code log | Monthly |
| STEMI mortality | <5% | Outcome registry | Monthly |

### Staff
| KPI | Target | Measurement | Frequency |
|-----|--------|-------------|-----------|
| Staff turnover | <15% annual | HR | Annual |
| Overtime hours | <10% of FTE | HR | Monthly |
| Training completion | 100% required | LMS | Monthly |
| Burnout screening (Maslach) | Annual, action if high | Survey | Annual |

## Customer Satisfaction (Patient + Family)

- Press Ganey survey (post-ED visit, electronic + paper)
- Complaint tracking (categorized, response within 48h)
- Patient advisory council (quarterly, includes ED representatives)
- Social media monitoring (reviews)
- Real-time feedback (ED kiosk, optional)

## Internal Audits (Quarterly)

- Chart audit (random 30 charts per month)
- Triage accuracy (RN vs AI, override rate)
- Medication safety (5-rights, allergy, interaction)
- Code activation appropriateness
- Disposition accuracy (return rate, bounce-back)
- Documentation completeness
- Time targets (door-to-balloon, sepsis bundle, etc.)

## Management Review (Monthly)

- Quality objectives review
- Audit results
- Customer satisfaction
- Nonconformities + CAPA
- Risk register update
- Improvement opportunities
- Resource needs

## CAPA (Corrective + Preventive Action)

```
Incident / Nonconformity
    |
    v
Root Cause Analysis (5 Whys, fishbone)
    |
    v
Corrective Action (immediate fix)
    |
    v
Preventive Action (systemic change)
    |
    v
Implementation + verification
    |
    v
Close + document
```

**ER-specific CAPA examples:**
- Door-to-balloon >90min → review cath lab activation, transport
- Drug allergy incident → review allergy documentation workflow
- LWBS increase → review triage wait times, staffing
- Complaint about communication → staff training, scripts
- Near-miss (red flag miss) → AI tuning, alert thresholds

## Continual Improvement (Kaizen)

- Daily huddles (15 min, all staff)
- Weekly safety review
- Monthly M&M conference
- Quarterly QI project
- Annual strategic planning

---
*Section 06.b of ER-001. Owner: CQO. L4 validated.*
