# NamaMedical — Executive One-Pager

## What
A KSA-built, CBAHI-aligned hospital platform with AI co-pilots across 40 clinical and
administrative domains. PDPL-compliant, data-resident in the Kingdom.

## Why it matters
| Pain point | NamaMedical response |
|------------|---------------------|
| Door-to-Balloon > 90 min | AI ECG + one-click Code STEMI cross-team activation |
| Sepsis bundle missed | NEWS2/qSOFA detection + auto-applied 1-hour bundle |
| Medication errors | Allergy + dose + interaction + cumulative-limit blocks |
| Bed turnover | Live ED/ICU board + smart discharge readiness |
| Fragmented integrations | Native NPHIES, Wasfaty, Mawid, Sehhaty, Yaqeen, ZATCA, Shahm |
| Accreditation surveys | CBAHI evidence index + KPI catalog auto-collected |
| Workforce burden | AI co-pilots reduce documentation 30%+ |

## Architecture
- Cloud-native microservices on Kubernetes (Hetzner KSA).
- MSSQL primary OLTP + Qdrant vector DB + Kafka events.
- React 19 web + Qt desktop + React-Native mobile (clinical + patient).
- 99.9% uptime SLO; blue/green deploys; quarterly DR drills.

## AI governance
- Advisory only — clinician retains authority.
- Per-model risk-tier review (SDAIA + WHO + FDA SaMD-aligned).
- Hash-chained audit log; PHI redaction before any LLM call.
- KSA-region inference only.

## Compliance
- KSA PDPL · NCA ECC · CBAHI · MoH eHealth
- ISO 27001/27799 · CAP / ISO 15189 (Lab) · IAEA (Radiation) · SFDA (Drugs/Devices)

## Outcomes (target / based on published CoE benchmarks)
- ↓ 30% Door-to-Balloon time (CoE benchmark)
- ↓ 25% Sepsis mortality (with bundle compliance)
- ↓ 20% Medication error rate
- ↑ 15% Bed turnover
- ↑ NPS (patient experience)
- ↑ Staff satisfaction (fewer late shifts on documentation)

## Roadmap (6 sprints)
| Sprint | Goal |
|--------|------|
| 0 | Platform + CI/CD + monorepo |
| 1 | ED + ICU (highest clinical impact) |
| 2 | Radiology + PACS |
| 3 | Lab + Vector DB + RAG |
| 4 | Cardiology + Ophthalmology + OB-GYN |
| 5 | Quality + Education + HR |
| 6 | Centers of Excellence + Patient Portal |

## What you get on day 1
- Platform deployed in KSA region
- Integration to NPHIES + Wasfaty + ZATCA pre-tested
- Training for clinical + admin staff
- 24/7 support with tier-1 < 5 min pager
- Quarterly clinical AI quality review

## Contact
- Sales: sales@nama.local
- Demos: demos@nama.local
