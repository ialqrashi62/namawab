# Phase 2 — Vault/KMS Readiness & Migration Candidate — إغلاق

> 2026-06-23 | جُهّزت المرحلة 2 كمرشّح جاهزية وهجرة. **لا مفاتيح/شهادات حقيقية، لا private keys، لا اتصال تنظيمي، لا تغيير إنتاجي.** التنفيذ الحقيقي محجوب على توفّر بنية Vault/KMS + موافقة.

## الحقول
```text
FINAL_STATUS: VAULT_KMS_PHASE2_READINESS_AND_MIGRATION_CANDIDATE_READY
VAULT_KMS_PHASE2_STATUS: CANDIDATE_READY (execution BLOCKED_PENDING_KEY_INFRASTRUCTURE)
RECOMMENDED_PROVIDER: HashiCorp Vault (on-prem) للعام at-rest؛ Vault-PKI/HSM للمفاتيح الخاصة التنظيمية (ZATCA/NPHIES). KMS سحابي بديل إن قُبلت السحابة + إقامة البيانات.
KEYS_CREATED: NO
REAL_CERTIFICATES_USED: NO
PRIVATE_KEYS_HANDLED: NO
SECRETS_PRINTED: NO
KEYS_COMMITTED: NO
DPAPI_BLOB_COMMITTED: NO
PRODUCTION_CHANGES: NONE
DDL_EXECUTED: NO
DATA_CHANGED: NO
CODE_DEPLOYED: NO
EXTERNAL_HEALTHCARE_CALLS: NO
ZATCA_CALLS: NO
NPHIES_CALLS: NO
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_COUNT: 0
FORCE_RLS_COUNT: 150
FORCE_PUSH_USED: NO
NEXT_RECOMMENDED_ACTION: OWNER_SELECT_VAULT_KMS_PROVIDER_OR_ZATCA_NPHIES_READINESS
```

## الخلاصة
- **7 وثائق**: سطح المفاتيح الحالي · مقارنة Vault/KMS/HSM (13 معياراً) · البنية الموصى (طبقتان + 3 مزوّدين) · خطة الهجرة (re-wrap بلا إعادة تشفير، dual-read، versioning، rollback، drill، نقاط موافقة) · جاهزية حضانة شهادات ZATCA/NPHIES · قائمة قرار المالك.
- **التوصية**: Hybrid — DPAPI الآن → Vault on-prem (عام) + Vault-PKI/HSM (مفاتيح خاصة تنظيمية)، عبر re-wrap لا يلمس بيانات مشفّرة.
- لا أثر إنتاجي؛ المحاسبة OFF؛ R17 سليمة؛ health 200/200؛ FORCE_RLS 150.

## المتبقّي
- اختيار مزوّد + rehearsal re-wrap (dummy) — بوابات في 06.
- KEK escrow (DR) يبقى إجراء مالك مستقل موصى أولاً.
- التنظيمي (ZATCA Ph2 / NPHIES) محجوب على المزوّد + onboarding + شهادات.

تم تجهيز Vault/KMS Phase 2 كمرشح جاهزية وهجرة دون إنشاء مفاتيح أو استخدام شهادات أو ربط تنظيمي
