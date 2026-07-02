# NM_FHIR_NPHIES_ZATCA — التكاملات والامتثال السعودي

## متى تُستخدم
أي بوابة تمس FHIR، NPHIES، ZATCA، فوترة ضريبية، أو تكاملات خارجية.

## الهدف
ضمان امتثال نظام الطبيب للمعايير السعودية الصحية والمالية مع sandbox آمن لكل التكاملات.

## القواعد الإلزامية
```
SANDBOX_FIRST: YES — كل تكامل يختبر على sandbox أولاً
NO_REAL_NPHIES_CALLS: YES — لا اتصالات NPHIES حقيقية بدون موافقة
NO_REAL_ZATCA_SUBMISSION: YES — لا إرسال فواتير ZATCA بدون موافقة
NO_REAL_CERT: YES — لا شهادات حقيقية في بيئة الاختبار
NO_PHI_IN_INTEGRATION: YES — لا بيانات مرضى حقيقية في sandbox
FHIR_R4_STANDARD: YES — استخدم FHIR R4 المعتمد في السعودية
AUDIT_INTEGRATION: YES — كل اتصال خارجي موثّق في audit log
ZATCA_INVOICE_CHAIN: YES — سلسلة الفواتير ZATCA يجب أن تكون صحيحة
```

## المعايير السعودية المشمولة
```
NPHIES: نظام تبادل المعلومات الصحية الوطني
  - FHIR R4 claims
  - Prior authorization
  - Eligibility verification
  - Remittance advice

ZATCA Phase 2: الفوترة الإلكترونية
  - QR code generation
  - Invoice chaining (hash)
  - CSR generation (sandbox)
  - B2B/B2C invoices

CBAHI: هيئة الاعتماد الصحي السعودية
  - OVR (Ongoing Vigilance Reporting)
  - Quality indicators
  - Patient safety standards

PDPL: نظام حماية البيانات الشخصية السعودي
  - Consent management
  - Data retention
  - Cross-border data restrictions

MHRSD/Nafis: وزارة الموارد البشرية والتنمية الاجتماعية
  - نسب السعودة في الوظائف الصحية
```

## خطوات التنفيذ
1. تحقق من وجود sandbox config منفصل عن production
2. تحقق من أن FHIR payloads تطابق R4 schema
3. اختبر NPHIES eligibility على sandbox
4. اختبر ZATCA invoice generation (UUID, QR, hash)
5. تحقق من سلسلة الفواتير (previousInvoiceHash)

## أدلة النجاح
- FHIR payload يمر validation R4
- ZATCA invoice يحمل QR code صحيح
- Invoice hash chain متسلسلة وصحيحة
- لا اتصالات خارجية بدون موافقة
- sandbox معزول تماماً عن production

## حالات الحظر
- اتصال NPHIES حقيقي بدون موافقة → BLOCKED_REAL_NPHIES_CALL
- ZATCA submission حقيقية بدون موافقة → BLOCKED_REAL_ZATCA_SUBMISSION
- PHI حقيقي في sandbox → BLOCKED_PHI_IN_SANDBOX
- FHIR validation فاشل → BLOCKED_FHIR_INVALID

## صيغة التقرير المختصر
```
INTEGRATION_GATE: PASS/BLOCKED
NPHIES_SANDBOX: TESTED/NOT_TESTED | NPHIES_REAL_CALLS: NO
ZATCA_INVOICE_GEN: PASS/FAIL | ZATCA_REAL_SUBMISSION: NO
FHIR_R4_VALID: YES/NO | PHI_IN_SANDBOX: NO
CBAHI_COMPLIANCE: IN_PROGRESS | PDPL_CONSENT: YES/NO
```
