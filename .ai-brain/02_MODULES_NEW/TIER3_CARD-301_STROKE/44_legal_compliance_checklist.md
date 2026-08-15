# CARD-301_STROKE — Legal & Compliance Checklist

## Saudi Compliance (Mandatory)

### PDPL (Personal Data Protection Law)
- [x] Consent obtained before any PHI processing (Article 4)
- [x] Purpose limitation — only stroke care use (Article 5)
- [x] Data minimization — only essential fields (Article 6)
- [x] Accuracy — verified PHI (Article 7)
- [x] Storage limitation — 25 years retention (Article 8)
- [x] Integrity & confidentiality — encrypted at rest (Article 9)
- [x] Accountability — DPO appointed (Article 10)
- [x] Cross-border transfer — limited to MoH-approved systems (Article 23)
- [x] Data subject rights — access, correction, deletion (Article 4)
- [x] Breach notification — within 72 hours (Article 22)

### CBAHI (Hospital Accreditation)
- [x] Stroke Center designated per CBAHI standards
- [x] Multidisciplinary team documented
- [x] SLA tracking (DNT, DTG)
- [x] Quality indicators reported to CBAHI
- [x] Mock stroke drills quarterly
- [x] Patient education materials (Arabic)
- [x] Family education and consent
- [x] Follow-up continuity

### NPHIES (Insurance)
- [x] Stroke diagnosis coded per ICD-10-AM
- [x] Procedure codes per SBS
- [x] Bundle submission for stroke care
- [x] Pre-authorization for thrombectomy
- [x] Letter of medical necessity template

### ZATCA (E-Invoicing)
- [x] Service catalog with prices
- [x] Tax invoices (15% VAT)
- [x] NPHIES-anchored billing
- [x] Phase 2 readiness (UBL 1.1 + XML + QR)

### SFDA (Saudi FDA)
- [x] Tenecteplase registered (since 2024)
- [x] Alteplase registered
- [x] Adverse drug event reporting
- [x] Lot tracking for batch recall

### MoH Stroke Program
- [x] Stroke registry data submission
- [x] GWTG-S data export
- [x] Stroke center certification
- [x] Sehhaty integration (read-only)

## International Benchmarks (Optional)

### AHA/ASA GWTG-S
- [x] All indicators tracked
- [x] Quarterly benchmarking report
- [x] Quality improvement cycle

### WHO (ICD-11)
- [x] Use ICD-11 coding for new cases
- [x] Coding updates per WHO

### HL7 FHIR R4
- [x] Patient resource
- [x] Encounter resource
- [x] Condition resource
- [x] Procedure resource
- [x] Observation resource

## Safety Rails (per AGENTS.md §2.2)

| # | Rail | Status |
|---|---|---|
| 1 | No hardcoded secrets | ✅ |
| 2 | No PHI in commits | ✅ |
| 3 | No force-push | ✅ |
| 4 | No DELETE without backup | ✅ |
| 5 | Tenant isolation on every route | ✅ |
| 6 | Money routes idempotent | N/A (no $) |
| 7 | PHI at rest encrypted | ✅ |
| 8 | CSP report-only by default | ✅ |
| 9 | Money/VAT server-side | N/A |
| 10 | Audit log hash-chained | ✅ |
| 11 | Fail-closed on missing tenant | ✅ |
| 12 | No PHI in logs | ✅ |
| 13 | Golden Access Rule | ✅ |

## Document Retention

| Document | Retention |
|---|---|
| Stroke case records | 25 years (MoH) |
| Imaging | 25 years |
| Consent forms | 25 years |
| Audit logs | 7 years (CBAHI) |
| Tenecteplase batch tracking | 5 years (SFDA) |
| Patient education | 5 years |

## Legal Disclaimers

### Patient Consent (Arabic)
```
أوافق على:
1. تخزين بياناتي الطبية في نظام NamaMedical
2. مشاركة بياناتي مع فريق السكتة الدماغية
3. استخدام Tenecteplase / Alteplase / Thrombectomy
4. الإبلاغ عن حالتي لـ CBAHI / MoH

التاريخ: __________ التوقيع: __________
```

### Patient Consent (English)
```
I consent to:
1. Storage of my medical data in NamaMedical system
2. Sharing my data with the stroke team
3. Use of Tenecteplase / Alteplase / Thrombectomy
4. Reporting my case to CBAHI / MoH

Date: __________ Signature: __________
```

## Incident Notification

| Event | Notify | Within |
|---|---|---|
| Data breach | SDAIA | 72 hours |
| Adverse drug event | SFDA | 24 hours |
| Stroke death | MoH | 24 hours |
| Equipment failure | NHSRC | 24 hours |
| Patient complaint | Hospital admin | 48 hours |
