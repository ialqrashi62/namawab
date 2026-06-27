# Data Retention & Disposal Policy
v1.0 — 2026-05-13 — Owner: DPO + Quality Director

## 1. Scope
All Personal Data, PHI, financial, audit, AI logs, and operational data processed by NamaMedical.

## 2. Retention schedule
| Data category | Retention | Basis | Notes |
|---|---|---|---|
| Adult medical record | 10 years after last contact | MoH-eHealth, CBAHI MOI | full record incl. notes, results |
| Pediatric medical record | until age 21 + 5 years | MoH-eHealth | extra-strict access |
| Maternity / OB record | 25 years from delivery | MoH-eHealth | preserves prenatal Dx |
| Radiation therapy / pathology slides | 30 years | IAEA / CAP | with image archive |
| Blood bank donor & recipient | 30 years | MoH / SFDA | traceability |
| IVF cryopreservation (sperm/oocyte/embryo) | per renewed consent | KSA Islamic ART regs | annual renewal |
| Mental health record | 15 years | MoH | confidentiality enhanced |
| Workplace / OHS exposure | 30 years | KSA labor + OSHA-equiv | for chronic latency |
| Billing / Invoices (ZATCA) | 6 years | ZATCA | tax archive |
| Insurance claims (NPHIES) | 10 years | NHIC / NPHIES |  |
| HR personnel files | duration of employment + 5 years | KSA labor |  |
| HR training / SCFHS license | duration of employment + 5 years | SCFHS |  |
| IRB / Research records | 15 years from study end | ICH-GCP / NCBE |  |
| Audit logs (clinical actions) | 10 years | CBAHI MOI |  |
| Audit logs (security) | 7 years | NCA ECC |  |
| AI prompts/responses (redacted) | 2 years | internal | AI governance |
| Backups (encrypted) | 90 days rolling + 7-year cold | DR | immutable storage |
| CCTV recordings | 90 days | KSA security regs |  |
| Email correspondence | 5 years | ops |  |
| Patient consent records | duration matches related data |  | linked archival |
| Complaints | 7 years from resolution | CBAHI |  |
| Vendor contracts / DPAs | term + 7 years | finance/legal |  |

## 3. Triggers for early deletion
- Subject erasure request, where lawful.
- Data minimization audits.
- End of contract / facility closure.

## 4. Holds
- **Legal hold** suspends deletion (litigation, investigation).
- **IRB hold** suspends deletion for ongoing studies.

## 5. Disposal methods
- Database rows: cryptographic erasure of DEK + soft-delete window 30 days then purge.
- Files / blobs: secure overwrite (DoD 5220.22-M equiv) before deletion.
- Backups: immutability period must lapse first; documented certificate of destruction.
- Paper: cross-cut shredding, certificate retained.
- Hardware: physical destruction (degausser/shredder); SBOM update.

## 6. Roles
- **Data steward** per domain proposes retention adjustments.
- **DPO** approves and audits annually.
- **Quality** integrates with CBAHI evidence.
- **IT** executes deletion routines and provides certificates.

## 7. Records
Each disposal event records: dataset, scope, method, requester, executor, date, hash chain.

## 8. Review
This policy is reviewed annually or upon regulatory change.
