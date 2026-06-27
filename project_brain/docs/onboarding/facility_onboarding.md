# Facility Onboarding Playbook
v1.0 — Owner: Customer Success — Target go-live: 12 weeks

## Phase 0 — Discovery (Week 0)
- [ ] Sign MSA + DPA
- [ ] Stakeholders mapped: CMO, CIO, CNO, CFO, IT lead, Clinical leads
- [ ] Scope locked: which departments + integrations
- [ ] Compliance checklist: PDPL DPIA, CBAHI alignment, MoH license
- [ ] Network/firewall requirements shared

## Phase 1 — Infrastructure (Weeks 1-2)
- [ ] Hetzner KSA region cluster provisioned (Terraform)
- [ ] Vault + KMS configured; root keys ceremony
- [ ] Backups + DR site up
- [ ] DNS + TLS issued
- [ ] Monitoring (Prometheus/Grafana/Loki) running
- [ ] CI/CD pipeline reaching staging

## Phase 2 — Integrations (Weeks 2-4)
- [ ] NPHIES sandbox onboarding + cert install
- [ ] Wasfaty test prescriptions exchanged
- [ ] Mawid slots publishing
- [ ] Sehhaty patient data sync test
- [ ] Yaqeen identity verification call test
- [ ] ZATCA Phase 2 CSID onboarded; test invoices cleared
- [ ] Shahm bed-status push live; 937 booking test
- [ ] PACS DICOM pipe working
- [ ] LIS integration (HL7 v2) for results

## Phase 3 — Data migration (Weeks 3-5)
- [ ] Source-system audit (vendor, version, schema)
- [ ] Mapping doc per entity (patients, visits, results, meds)
- [ ] De-identification of test data
- [ ] Migration scripts dry-run on staging
- [ ] Validation: counts + spot-checks + reconciliation report
- [ ] Cutover plan with rollback

## Phase 4 — Configuration (Weeks 4-6)
- [ ] Departments enabled per facility scope
- [ ] Order sets reviewed & approved by clinical leads
- [ ] CDS rules tuned (alert fatigue audit)
- [ ] AI features turned on per risk-tier policy
- [ ] Branding (logo, colors, footer)
- [ ] AR/EN content reviewed

## Phase 5 — Identity & access (Weeks 5-7)
- [ ] IdP integration (Azure AD / Keycloak / SCIM from HR)
- [ ] Roles + privileges configured per dept
- [ ] SCFHS license verification turned on
- [ ] Break-glass procedure documented
- [ ] Audit access reviewed by InfoSec

## Phase 6 — Training (Weeks 6-9)
- [ ] Train-the-trainer sessions (per dept)
- [ ] Clinician onboarding (≤ 5 video modules + sandbox practice)
- [ ] Admin training
- [ ] Super-user identification + escalation path
- [ ] Patient-facing portal walk-through video

## Phase 7 — Validation (Weeks 8-10)
- [ ] UAT with real workflows in sandbox
- [ ] Load test against production-equivalent capacity
- [ ] Pen-test (limited scope)
- [ ] CBAHI gap re-scan
- [ ] Clinical safety committee sign-off

## Phase 8 — Pilot go-live (Weeks 10-11)
- [ ] Pilot ward(s) live with on-site support
- [ ] Daily standup with clinical + tech
- [ ] Issue triage + same-day fixes
- [ ] Quick wins documented + shared

## Phase 9 — Full go-live (Week 12)
- [ ] All in-scope departments live
- [ ] On-call coverage confirmed
- [ ] Status page public
- [ ] Communication to patients about new portal
- [ ] Hyper-care for first 30 days

## Phase 10 — Hand-off to BAU (Week 12+)
- [ ] Quarterly business review cadence set
- [ ] CSM relationship transferred
- [ ] Improvement backlog prioritized
- [ ] Next-quarter roadmap agreed

## Risks & dependencies
- Vendor data export (legacy HIS) is the largest risk; engage 90 days early.
- SCFHS license refresh cycles can block clinicians; start credentialing month 1.
- Network firewall changes through facility IT can take 4 weeks; submit week 1.
