# NamaMedical — Compliance Map (KSA-First, Multi-Standard)

> Per-control mapping across KSA-PDPL, KSA-NCA-ECC, CBAHI, JCI, CAP, ISO 27001/15189/27799,
> HIPAA equivalents, IAEA, SFDA, MoH eHealth.

## 1) Summary table — applicable standards by domain

| Domain | KSA Mandatory | International | Per dept references |
|--------|---------------|---------------|---------------------|
| Patient safety & care | CBAHI, MoH | JCI, IPSG | All clinical groups |
| Information security | NCA ECC, PDPL | ISO 27001/27799, HIPAA-equiv | G33, G34 |
| Lab quality | MoH-CLA | CAP, ISO 15189 | G22 |
| Radiation safety | KSA NRC | IAEA BSS | G21, G28 |
| Pharma/devices | SFDA | ICH-GCP, ISO 13485 | G28, G33, G37 |
| Privacy of personal data | PDPL | GDPR-aligned | All |
| Health workforce | SCFHS | WHO codes | G36 (credentialing), G38 |

## 2) PDPL — KSA Personal Data Protection Law
- Lawful basis: consent / contract / vital interest / legal obligation / legitimate interest.
- Data minimization; purpose limitation; storage limitation.
- Subject rights: access, correction, deletion (limited for clinical), restriction, portability.
- Cross-border transfers: KSA data residency strongly preferred; explicit safeguards required.
- Breach notification: 72 h to SDAIA + affected subjects.
- DPO mandatory for processors with sensitive data > threshold.
- **Where it appears in app**: every screen showing PHI; consent registry; export gates;
  AI prompt redaction; audit trail.

## 3) NCA ECC — Essential Cybersecurity Controls
Five domains × 100+ controls. NamaMedical applies Level 2 baseline.
- Cybersecurity governance, risk mgmt, asset mgmt.
- Identity & access (MFA mandatory for privileged).
- Cryptography (KSA-approved algorithms; key mgmt via HSM).
- Network security; secure configuration; vulnerability mgmt.
- Logging, monitoring, incident response.
- Third-party risk; cloud computing CCC.
- Industrial Control / IoT (biomed devices treated as IoT).

## 4) CBAHI — Saudi Hospital Accreditation
Mandatory for licensed hospitals in KSA. Chapters relevant to features:
- IPSG (International Patient Safety Goals) — affects all clinical UI.
- ACC (Access, Continuity of Care) — Reception, Referrals, Discharge.
- AOP (Assessment of Patients) — Triage, Nursing, Doctor Station.
- COP (Care of Patients) — ICU, Surgery, OB, Emergency.
- ASC (Anesthesia & Surgical Care) — G10, G11, G26.
- MMU (Medication Management & Use) — Pharmacy, Stewardship.
- PFE (Patient & Family Education) — Health Education.
- QPI (Quality & Performance Improvement) — G36.
- PCI (Prevention & Control of Infections) — G08.
- GLD (Governance, Leadership & Direction) — G35.
- FMS (Facility Management & Safety) — G34.
- SQE (Staff Qualifications & Education) — G36 credentialing, G37, G38.
- MOI (Management of Information) — G33.
- LAB / RAD / DIA chapters — G21, G22.

## 5) JCI — Joint Commission International (optional but common)
- Aligns closely with CBAHI; we maintain dual mapping for evidence.
- IPSG identical numbering.

## 6) CAP / ISO 15189 — Laboratory
- Pre-analytical, analytical, post-analytical phases.
- Internal QC + external proficiency testing.
- Document control on SOPs; training records per analyte.
- Reference range validation per population.

## 7) ISO 27001 + 27799
- ISMS scope: NamaMedical platform & operations.
- Annex A controls mapped.
- 27799 (health-specific) extends with PHI-handling.

## 8) HIPAA-equivalent (for non-KSA tenants if applicable)
- Privacy rule + Security rule + Breach notification.
- Mapped fields ensure portability.

## 9) IAEA BSS + KSA NRC
- For G21 (imaging) + G28 (radiation oncology) + G40 (nuclear therapy).
- Justification + optimization (ALARA) + dose limits.
- Personnel dosimetry; QA programs.

## 10) SFDA
- Medical devices: classification, post-market surveillance, adverse-event reporting.
- Drugs: formulary management, recalls, controlled substances.
- Cell & gene therapies: special advanced-therapies framework.

## 11) MoH eHealth
- Standards alignment: HL7 FHIR R5, DICOM, IHE profiles.
- National platforms integration: NPHIES, Wasfaty, Mawid, Sehhaty, Yaqeen, Seha, ANAT.
- Cancer registry, NICVD vaccine registry, NCD registry submissions.

## 12) SCFHS — Saudi Commission for Health Specialties
- License verification before practice.
- Continuing Medical Education (CME) credits tracking.
- Specialty curricula recognized.

## 13) Per-department compliance index (quick lookup)
- G01–G05, G18, G19: CBAHI clinical chapters + IPSG + MoH disease registries
- G08: + IHR-2005 + KSA-MoH HAI surveillance
- G14, G15, G16: CBAHI + SFDA implants + relevant disease registries
- G17: CBAHI burn + MoH burn registry
- G20: pediatric extra-strict PDPL
- G21: + IAEA + KSA NRC + DICOM/HL7
- G22: + CAP + ISO 15189
- G24, G25: CBAHI critical bundles + MoH 937/Shahm integration
- G26: + opioid stewardship (SFDA)
- G28: + IAEA + KSA NRC + ASHP/ISMP + USP <797>/<800>
- G29: + WHO-TM + advertising rules
- G30: + ANA standards + SCFHS scope
- G31: + halal/HACCP + SFDA dietary supplements
- G32: + KSA child/elder protection laws
- G33: + NCA ECC + ISO 27001 + IHE/FHIR/DICOM
- G34: + KSA Civil Defense + JCI EOC
- G35–G38: GLD, SQE, QPI, governance frameworks
- G39: composite of contained groups
- G40: + advanced therapies licensing + Orphanet/NORD registries

## 14) Audit evidence binder (structure)
```
evidence/
├── policies/
├── trainings/
├── scans/
├── pentests/
├── audits/
├── capa/
├── consents-templates/
├── consents-records/   (encrypted, access-controlled)
├── irb-approvals/
└── attestations/
```

## 15) Review cadence
- Quarterly: control effectiveness review + KPI snapshot.
- Annual: full mapping refresh; standards update tracking.
- Ad hoc: on regulation change (publish change-impact note within 14 d).
