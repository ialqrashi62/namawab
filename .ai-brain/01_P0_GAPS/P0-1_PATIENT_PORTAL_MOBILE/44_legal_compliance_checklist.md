# P0-1 Patient Portal — Legal & Compliance Checklist

## Saudi Compliance (Mandatory)

### PDPL 2024 (Personal Data Protection Law)
- [x] Consent before PHI processing
- [x] Right to access
- [x] Right to correction
- [x] Right to erasure
- [x] Right to data portability (FHIR R4 export)
- [x] Right to restrict processing
- [x] Right to withdraw consent
- [x] Consent log (audit-grade)
- [x] DPO appointed
- [x] Breach notification within 72h
- [x] Encryption at rest
- [x] Encryption in transit (TLS 1.3)

### CBAHI (Patient Portal Standards)
- [x] Identity verification (Nafath/Absher)
- [x] Audit log 7+ years
- [x] PHI encrypted at rest
- [x] No PHI in logs
- [x] Multi-factor authentication for sensitive operations
- [x] Patient consent for data sharing
- [x] Critical lab requires clinician verification
- [x] Controlled substance block
- [x] Caregiver access with PDPL consent

### NHIA Sehhaty Integration
- [x] National unified health record
- [x] FHIR R4 standard
- [x] Data sharing per CBAHI standards
- [x] Cross-facility records

### MoH Mawid Integration
- [x] Appointment booking
- [x] Pre-auth via Wateen
- [x] Mawid appointment ID
- [x] Patient notification

### Wateen Insurance
- [x] Real-time insurance verification
- [x] Copay calculation
- [x] Deductible tracking
- [x] Payer directory integration

### SFDA (Pharmacy)
- [x] Medication dispensing
- [x] Controlled substance blocker
- [x] Refill tracking
- [x] ADE reporting

### NUPCO (Procurement)
- [x] Drug catalog sync
- [x] Price transparency

### NAFATH/ABSHER
- [x] SSO authentication
- [x] L2 OTP verification
- [x] L3 biometric verification
- [x] Session management

## International

### WCAG 2.1 AA
- [x] Screen reader support
- [x] High contrast
- [x] Font scaling
- [x] Keyboard navigation
- [x] Color-blind safe palette

### FHIR R4 (HL7)
- [x] Standard data exchange
- [x] Patient export
- [x] Cross-system integration

### HIPAA (informational)
- [x] Privacy Rule
- [x] Security Rule
- [x] Breach notification

## Safety Rails (AGENTS.md §2.2)

| # | Rail | Status |
|---|---|---|
| 1 | No secrets in tracked files | ✅ |
| 2 | No PHI in commits | ✅ |
| 3 | No force-push | ✅ |
| 4 | No DELETE without backup | ✅ |
| 5 | Tenant isolation | ✅ |
| 6 | Idempotency for money | ✅ |
| 7 | PHI encrypted | ✅ |
| 8 | CSP report-only | ✅ |
| 9 | Money server-side | ✅ |
| 10 | Audit hash-chained 7+ yr | ✅ |
| 11 | Fail-closed on tenant | ✅ |
| 12 | No PHI in logs | ✅ |
| 13 | Golden Access Rule | ✅ |

## Document Retention
- Patient records: 25 years (MoH)
- Audit logs: 7 years (CBAHI)
- Consent records: 7 years post-withdrawal
- Financial transactions: 10 years (ZATCA)

## PDPL Consent (Arabic)
```
أوافق على:
1. معالجة بياناتي الصحية لتوفير الرعاية
2. مشاركة البيانات مع مقدمي الرعاية المرخصين
3. تكامل مع Sehhaty / Mawid / Wateen
4. استلام الإشعارات عبر التطبيق
5. (اختياري) استخدام البيانات للبحث العلمي
6. (اختياري) استلام عروض تسويقية

يمكنني سحب هذه الموافقة في أي وقت من الإعدادات.

التاريخ: __________ التوقيع: __________
```

## Patient Rights Notification (Bilingual)
- AR: "حقوقك في PDPL: الوصول، التصحيح، المحو، النقل، سحب الموافقة"
- EN: "Your PDPL Rights: Access, Correction, Erasure, Portability, Withdraw Consent"
