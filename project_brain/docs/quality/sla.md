# Service Level Agreement (SLA)
v1.0 — Owner: COO + CTO — Per Master Service Agreement Annex

## 1. Service tiers
| Tier | Examples | Uptime target | Maintenance window |
|------|----------|---------------|--------------------|
| 1 — Life-critical | ED, ICU, Pharmacy, Lab, Blood Bank, AI ECG, Cath Lab | **99.9%** monthly (≤ 43 min downtime) | Friday 02:00–04:00 KSA, ≤ 1 h |
| 2 — Clinical | OPD, Surgery, Radiology, Nursing, Pharmacy non-stat | 99.5% monthly | Friday 02:00–04:00 KSA, ≤ 2 h |
| 3 — Administrative | HR, Finance, Reports, Settings, Training | 99.0% monthly | Friday 00:00–06:00 KSA |

## 2. Performance SLOs
| Operation | p50 | p95 | p99 |
|-----------|----|----|----|
| Patient search | 60 ms | 200 ms | 500 ms |
| Order create | 100 ms | 400 ms | 800 ms |
| Lab result post | 80 ms | 300 ms | 700 ms |
| AI co-pilot text-only | 1.2 s | 3.5 s | 6 s |
| AI co-pilot with RAG | 1.8 s | 5 s | 8 s |
| ECG AI inference | 2 s | 5 s | 10 s |
| ED board SSE update | 200 ms | 1 s | 2 s |
| Page authenticated load (web) | 600 ms | 1.5 s | 3 s |

## 3. Incident response SLAs
| Severity | Acknowledge | Engage | Public update | Resolution target |
|----------|-------------|--------|---------------|-------------------|
| Sev1 | 5 min | 15 min | 15 min | ≤ 2 h |
| Sev2 | 10 min | 30 min | 30 min | ≤ 4 h |
| Sev3 | 30 min | 2 h | 2 h | ≤ 1 business day |
| Sev4 | next business | — | — | next release |

## 4. Backup & DR
- RPO: ≤ 15 min (tier 1), ≤ 30 min (tier 2), ≤ 4 h (tier 3).
- RTO: ≤ 30 min (tier 1), ≤ 2 h (tier 2), ≤ 24 h (tier 3).
- DR drills quarterly; report shared with hospital leadership.

## 5. Security SLAs
- Critical vuln patch: 7 days
- High vuln patch: 30 days
- Medium vuln patch: 90 days
- PHI breach to SDAIA notification: ≤ 72 h

## 6. Support channels
| Channel | Hours | Use for |
|---------|------|---------|
| In-app help bot | 24/7 | quick how-to |
| Email support@nama.local | 24/7 ack ≤ 1 h business | non-urgent |
| Pager (Sev1) | 24/7 | tier-1 outage |
| Slack #nama-support (institutional) | business hours | clinical queries |

## 7. Service credits (illustrative; per MSA)
| Monthly uptime | Credit |
|----------------|-------|
| < 99.9% (tier 1) | 5% of monthly fee |
| < 99.5% (tier 1) | 10% |
| < 99.0% (tier 1) | 25% |

## 8. Exclusions
- Force majeure (per KSA legal definition).
- Customer-side issues (network, MDM blocking, end-user error).
- Scheduled maintenance announced ≥ 7 d.
- Third-party platform outages (NPHIES, Wasfaty, Mawid, LLM provider) — best-effort with workaround.

## 9. Reporting
- Monthly SLA report shared by 5th of following month.
- Trends + breach analysis + corrective actions.
- Available via Executive dashboard (G35).
