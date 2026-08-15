# CARD-304_ROBOTIC — Legal & Compliance Checklist

## Saudi Compliance (Mandatory)

### PDPL
- [x] Consent before PHI processing
- [x] Purpose limitation
- [x] Data minimization
- [x] Storage 25 yr
- [x] Encryption at rest
- [x] DPO appointed
- [x] Breach notification 72h

### CBAHI
- [x] Cardiac surgery center designation
- [x] Multidisciplinary team
- [x] Quality indicators (mortality, stroke, conversion)
- [x] Outcome tracking
- [x] Patient education

### NPHIES
- [x] Cardiac surgery coding
- [x] ICD-10-AM diagnosis
- [x] SBS procedure codes
- [x] Pre-auth for cardiac surgery

### ZATCA
- [x] Cardiac surgery pricing
- [x] 15% VAT
- [x] Phase 2 readiness

### SFDA
- [x] DaVinci surgical system approved
- [x] Sapien 3, Evolut approved
- [x] MitraClip approved
- [x] WATCHMAN approved
- [x] ADE reporting

### SCFHS
- [x] Cardiac surgeon credentials
- [x] Anesthesia credentials
- [x] Perfusionist certification
- [x] Robotic surgery training

### MoH
- [x] Cardiac surgery center designation
- [x] Registry data submission
- [x] Outcome reporting

## International

### STS 2024
- [x] Risk score
- [x] Quality indicators

### ESC 2023
- [x] Valve disease guidelines

### ACC/AHA 2024
- [x] Valve management
- [x] TAVI eligibility

## Safety Rails (AGENTS.md §2.2)

| # | Rail | Status |
|---|---|---|
| 1 | No secrets | ✅ |
| 2 | No PHI in commits | ✅ |
| 5 | Tenant isolation | ✅ |
| 7 | PHI encrypted | ✅ |
| 8 | CSP report-only | ✅ |
| 10 | Audit hash-chained | ✅ |
| 11 | Fail-closed on tenant | ✅ |
| 12 | No PHI in logs | ✅ |
| 13 | Golden Access | ✅ |

## Document Retention
- Surgical records: 25 yr (MoH)
- Device records: 25 yr
- Audit: 7 yr (CBAHI)

## Consent (Arabic)
```
أوافق على:
1. تخزين بياناتي الطبية
2. مشاركة البيانات مع Heart Team
3. إجراء DaVinci / TAVI / MitraClip / WATCHMAN
4. الموافقة على التصوير أثناء الجراحة
5. الإبلاغ لـ CBAHI / SFDA / NPHIES

التاريخ: __________ التوقيع: __________
```
