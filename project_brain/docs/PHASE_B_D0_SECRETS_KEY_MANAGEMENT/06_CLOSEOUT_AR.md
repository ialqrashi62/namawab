# D0 — Secrets / Key Management Model — إغلاق المرشّح

> 2026-06-22 | جُهِّز نموذج إدارة الأسرار/المفاتيح كمرشّح ورقي. **لم يُنشأ أي مفتاح، لم تُطبع أي قيمة، لا تغيير إنتاجي.** القرار النهائي للمالك.

## ما أُنجز
6 تقارير تحت `docs/PHASE_B_D0_SECRETS_KEY_MANAGEMENT/`:
01 سطح الأسرار الحالي · 02 خيارات A–E (مصفوفة كاملة) · 03 النموذج الموصى · 04 دليل التشغيل · 05 مصفوفة فكّ الحجب · 06 الإغلاق.

## الخلاصة
- **التوصية**: Option E (هجين) — envelope (AES-256-GCM، متاح عبر `crypto` المدمج بلا تبعية) خلف مزوّد KEK مجرّد؛ المرحلة 1 = **B (DPAPI)** أو **A (ملف مقيّد مستثنى من النسخ)**؛ المرحلة 2 = **D (Vault/HSM)** أو **C (KMS)** للمفاتيح التنظيمية، عبر re-wrap بلا إعادة تشفير.
- يفكّ **A3 (mfa_secret + ملفات PHI)** و**تشفير النسخ** فوراً عند الاختيار؛ **ZATCA Ph2/NPHIES** على مسار Vault/HSM لاحقاً.
- مبادئ ثابتة: لا مفاتيح في Git/.env، escrow آمن للـKEK، استثناء المفاتيح من النسخ، تدوير + تدقيق، فصل sandbox/production.

## الحقول
```text
FINAL_STATUS: PHASE_B_D0_SECRETS_KEY_MANAGEMENT_CANDIDATE_READY
SECRETS_VALUES_PRINTED: NO
KEYS_CREATED: NO
KEYS_COMMITTED: NO
PRODUCTION_CHANGES: NONE
DDL_EXECUTED: NO
DATA_CHANGED: NO
CODE_DEPLOYED: NO
EXTERNAL_CALLS: NO
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_COUNT: 0
FORCE_RLS_COUNT: 150
HEALTH_STATUS: local 200, domain 200
R17_STATUS: UNTOUCHED
REPORTS_CREATED: 6
RECOMMENDED_MODEL: Option E (hybrid envelope, KEK provider = DPAPI/file now -> Vault/KMS later)
NEXT_RECOMMENDED_ACTION: OWNER_SELECT_KEY_MODEL
```

## القرار المطلوب من المالك
1. الموافقة على **E (هجين)** كإطار.
2. اختيار مزوّد KEK للمرحلة 1: **B (DPAPI)** أم **A (ملف مفتاح)**.
3. (اختياري) تأكيد مسار **Vault/KMS** للمرحلة 2 للمفاتيح التنظيمية.

ثم: `APPROVE_PHASE_A3_FULL_ENCRYPTION_AT_REST` (يصبح غير محجوب) لتنفيذ تشفير at-rest عبر بوابة محكومة.

تم تجهيز نموذج إدارة الأسرار والمفاتيح كمرشح Phase B D0 دون إنشاء مفاتيح أو كشف أسرار
