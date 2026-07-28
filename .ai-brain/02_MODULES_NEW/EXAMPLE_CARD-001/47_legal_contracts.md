# 47 — Legal & Contracts (CARD-001)

> Owner: CQO · Tier 3

## Cardiology-specific contracts

| ID | Type | Parties | Renewal | Storage |
|----|------|---------|---------|---------|
| LC-CARD-001 | Provider employment (cardiologist) | Hospital + Cardiologist | per HR cycle | HR system |
| LC-CARD-002 | Provider employment (EP, interventional) | Hospital + Provider | per HR cycle | HR system |
| LC-CARD-003 | Locum tenens | Hospital + Locum | per engagement | HR + Legal |
| LC-CARD-004 | Service contract (cath lab) | Hospital + Cath lab vendor (Philips/GE/Siemens) | annual | Legal |
| LC-CARD-005 | Device supply (PM/ICD/CRT) | Hospital + Manufacturer (Medtronic/Abbott/Boston Sci/Biotronik) | annual | Procurement + Legal |
| LC-CARD-006 | Device consignment | Hospital + Manufacturer | annual | Procurement + Legal |
| LC-CARD-007 | Imaging equipment lease | Hospital + Vendor | per lease | Finance + Legal |
| LC-CARD-008 | Telemetry / monitoring | Hospital + Vendor | per contract | Procurement + Legal |
| LC-CARD-009 | Stress test equipment | Hospital + Vendor | per contract | Procurement + Legal |
| LC-CARD-010 | NPHIES integration | Hospital + NPHIES (NHIC) | MOH mandate | Legal + IT |
| LC-CARD-011 | SFDA drug + device reporting | Hospital + SFDA | mandatory | Legal + Quality |
| LC-CARD-012 | Cloud hosting (Hetzner) | Hospital + Hetzner | per contract | IT + Legal |
| LC-CARD-013 | LLM API (OpenAI / Anthropic) | Hospital + Vendor | per contract | IT + Legal |
| LC-CARD-014 | Langfuse (self-host) | Hospital (self) | — | IT |
| LC-CARD-015 | Translation services (medical) | Hospital + Vendor | per contract | Admin + Legal |
| LC-CARD-016 | Pneumatic tube / logistics | Hospital + Vendor | per contract | Admin |
| LC-CARD-017 | Research collaboration | Hospital + University / Sponsor | per study | Research + Legal |
| LC-CARD-018 | Clinical trial | Hospital + Sponsor | per trial | Research + Legal + IRB |
| LC-CARD-019 | Registry participation | Hospital + Society (ACC/ESC) | per registry | Cardiology + Legal |
| LC-CARD-020 | Data sharing (research, de-identified) | Hospital + Research Partner | per project | Legal + DPO |
| LC-CARD-021 | Insurance (professional liability) | Hospital + Insurer | annual | Finance + Legal |
| LC-CARD-022 | Insurance (cyber) | Hospital + Insurer | annual | Finance + Legal |
| LC-CARD-023 | Insurance (general liability) | Hospital + Insurer | annual | Finance + Legal |

## Key clauses

### Data Protection (all vendor contracts)

- DPA (Data Processing Agreement) per PDPL
- Sub-processor list disclosed
- Cross-border transfer restriction (KSA by default)
- Breach notification within 24h
- Right to audit
- Data return + deletion on termination
- Encryption in transit + at rest

### LLM-specific (LC-CARD-013)

- Tenant-controlled opt-in
- PHI-redacted only (no raw PHI)
- Trace + observability (Langfuse)
- Cost guard per tenant
- No model training on tenant data
- Audit log
- Right to terminate

### Device consignment (LC-CARD-006)

- Hospital bears storage risk
- Manufacturer recalls: 24h notification
- Expiry tracking
- Sterility maintenance
- Return + replace
- Audit + reconciliation

### Clinical trial (LC-CARD-018)

- IRB approval
- Informed consent (CF-CARD-014)
- Adverse event reporting
- Data ownership
- Publication rights
- Indemnification
- Insurance

## Compliance

- All contracts reviewed by Legal before signing
- All contracts stored in DOC-LEGAL (encrypted, RLS by department)
- Renewal reminders 90 days before expiry
- Annual contract review
- Legal audit annually

## Insurance

- Professional liability: covers cardiologist, EP, interventional
- Cyber: covers data breach
- General: covers facility
- Per-incident limit + aggregate

## Indemnification

- Hospital indemnifies: clinical acts within scope
- Vendor indemnifies: product defect, IP infringement
- Cross-indemnification: data protection

## Termination

- 30-90 days notice (per contract)
- Data return + deletion
- Transition assistance
- Audit of returned data
- Certificate of deletion
