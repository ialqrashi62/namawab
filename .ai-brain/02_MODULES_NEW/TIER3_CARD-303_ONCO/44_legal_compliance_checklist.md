# CARD-303_ONCO — Legal & Compliance Checklist

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
- [x] Cardio-Onc center designation
- [x] Multidisciplinary team
- [x] Quality indicators
- [x] Outcome tracking
- [x] Patient education

### NPHIES
- [x] Cancer + cardiac bundle
- [x] ICD-10-AM cancer coding
- [x] SBS procedure codes
- [x] Pre-auth for chemo + cardiac monitoring

### ZATCA
- [x] Cardio-Onc pricing
- [x] 15% VAT
- [x] Phase 2 readiness

### SFDA
- [x] Trastuzumab, Pertuzumab approved
- [x] Pembrolizumab, Nivolumab approved
- [x] ADE reporting
- [x] CRS reporting (CAR-T)

### NCCN Collaboration
- [x] Cancer VTE protocol
- [x] Cardioprotection
- [x] Survivorship

### MoH
- [x] Cardio-Onc certification
- [x] Registry submission
- [x] Cancer center collaboration

## International

### ESC 2022 Cardio-Onc
- [x] Risk stratification
- [x] Surveillance protocols
- [x] Cardioprotection

### AHA/ACC 2023
- [x] Joint Cardio-Onc model
- [x] Quality indicators

### IC-OS 2024
- [x] ICI myocarditis criteria
- [x] Treatment protocol

### ASCO 2020
- [x] Cardioprotection

## Safety Rails (AGENTS.md §2.2)

| # | Rail | Status |
|---|---|---|
| 1 | No secrets | ✅ |
| 2 | No PHI in commits | ✅ |
| 3 | No force-push | ✅ |
| 4 | No DELETE without backup | ✅ |
| 5 | Tenant isolation | ✅ |
| 6 | Idempotent money | ✅ |
| 7 | PHI encrypted | ✅ |
| 8 | CSP report-only | ✅ |
| 9 | Money server-side | ✅ |
| 10 | Audit hash-chained | ✅ |
| 11 | Fail-closed on tenant | ✅ |
| 12 | No PHI in logs | ✅ |
| 13 | Golden Access | ✅ |

## Document Retention
- Cancer records: 25 yr (MoH)
- Cardio-Onc: 25 yr
- ICI myocarditis: 25 yr
- VTE: 25 yr
- Audit: 7 yr (CBAHI)

## Consent (Arabic)
```
أوافق على:
1. تخزين بياناتي الطبية
2. مشاركة البيانات مع فريق Cardio-Onc
3. تعديل جرعة العلاج الكيميائي
4. بدء العلاج الوقائي للقلب
5. الإبلاغ لـ CBAHI / MoH / NCCN

التاريخ: __________ التوقيع: __________
```
