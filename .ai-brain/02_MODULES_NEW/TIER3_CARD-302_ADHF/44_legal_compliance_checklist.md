# CARD-302_ADHF — Legal & Compliance Checklist

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
- [x] Advanced HF center designation
- [x] Multidisciplinary team
- [x] Quality indicators
- [x] Outcome tracking (1-year survival)
- [x] Patient education

### NPHIES
- [x] HF bundle coding
- [x] ICD-10-AM diagnosis
- [x] SBS procedure codes
- [x] Pre-auth for LVAD/transplant

### ZATCA
- [x] HF service pricing
- [x] 15% VAT
- [x] Phase 2 readiness

### SCOT (Saudi Center for Organ Transplantation)
- [x] Heart transplant listing
- [x] Donor matching
- [x] Organ allocation
- [x] Outcome reporting

### SFDA
- [x] ARNI (Sacubitril/Valsartan) registered
- [x] SGLT2i registered
- [x] MRA registered
- [x] LVAD device registered
- [x] ADE reporting

### MoH
- [x] Cardiac center designation Level 1-3
- [x] Registry data submission
- [x] Outcome reporting

## International

### AHA/ACC/HFSA 2022
- [x] GDMT 4-Pillar
- [x] LVAD indications
- [x] Transplant indications

### ISHLT 2023
- [x] Listing status
- [x] Biopsy schedule
- [x] Rejection grading

### INTERMACS 2023
- [x] Profile classification
- [x] Outcomes reporting

### SCAI 2022
- [x] Shock staging
- [x] DRIPS protocol

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
- HF records: 25 yr (MoH)
- LVAD: 25 yr
- Transplant: Lifetime
- Audit: 7 yr (CBAHI)

## Consent (Arabic)
```
أوافق على:
1. تخزين بياناتي الطبية
2. مشاركة البيانات مع فريق HF
3. العلاج بـ ARNI/BB/MRA/SGLT2i
4. LVAD إذا لزم الأمر
5. إدراج في قائمة SCOT (للزرع)
6. الإبلاغ لـ CBAHI / MoH

التاريخ: __________ التوقيع: __________
```
