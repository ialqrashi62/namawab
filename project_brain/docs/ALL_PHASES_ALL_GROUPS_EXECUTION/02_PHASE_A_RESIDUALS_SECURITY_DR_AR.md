# Phase A Residuals / Security / DR — تنفيذ وتصنيف

> أعمدة: الحالة · الإجراء · التصنيف · مالك؟ · مفتاح؟ · خارجي؟ · DDL؟ · نشر؟ · PHI؟ · مخاطرة · البوابة.

| البند | الإجراء المُتخذ | التصنيف | مالك | مفتاح | خارجي | DDL | نشر | PHI | مخاطرة | البوابة التالية |
|---|---|---|---|---|---|---|---|---|---|---|
| A3 DPAPI KEK escrow (فعلي) | وُثّقت الجاهزية والخيارات (تقرير SAFE_WAVE/01) | BLOCKED_PENDING_OWNER_APPROVAL | نعم | يلمس المفتاح | لا | لا | لا | لا | متوسطة(DR) | APPROVE_A3_KEK_ESCROW_ACTUAL_OWNER_CONTROLLED |
| A3 restore readiness | drill معزول نجح (167 جدول، KEK ليس بالـdump) | COMPLETED | لا | لا | لا | لا | لا | لا | منخفضة | (دوري) |
| Vault/KMS phase 2 | تصميم ضمن D0/key model | CANDIDATE_READY | نعم | نعم | نعم(Vault/KMS) | لا | نعم(لاحقاً) | لا | متوسطة | APPROVE_VAULT_KMS_PHASE2 |
| نسخ مشفّرة offsite | تصميم؛ يعتمد المفتاح+وجهة | BLOCKED_PENDING_KEY_OR_CERTIFICATE | نعم | نعم | نعم(وجهة) | لا | لا | لا | متوسطة | APPROVE_OFFSITE_ENCRYPTED_BACKUP |
| full restore drill schedule | drill منفّذ؛ الجدولة الدورية تُوثّق بالـrunbook | COMPLETED_DOCS_ONLY | لا | لا | لا | لا | لا | لا | منخفضة | ضمن ops runbook |
| incident response runbook | يُوثّق (مبني على حادثة Docker/Redis المعالَجة) | COMPLETED_DOCS_ONLY | لا | لا | لا | لا | لا | لا | منخفضة | — |
| security operations runbook | يُوثّق | COMPLETED_DOCS_ONLY | لا | لا | لا | لا | لا | لا | منخفضة | — |
| audit-reader optional grant | candidate موجود؛ يحتاج GRANT+endpoint | BLOCKED_PENDING_OWNER_APPROVAL | نعم | لا | لا | GRANT | نعم | لا | منخفضة | APPROVE_AUDIT_READER_GRANT_AND_DEPLOY |
| tenant_id indexes | candidate موجود (CREATE INDEX CONCURRENTLY، آمن) | CANDIDATE_READY | نعم | لا | لا | INDEX | لا | لا | منخفضة | APPROVE_TENANT_ID_INDEX_CANDIDATE |
| RLS drift monitor | تحقّق قراءة: FORCE_RLS=150 ثابت | COMPLETED_DOCS_ONLY | لا | لا | لا | لا | لا | لا | منخفضة | (سكربت مراقبة candidate) |
| secret/key rotation runbook | يُوثّق (KEK re-wrap + DEK re-encrypt) | COMPLETED_DOCS_ONLY | لا | لا | لا | لا | لا | لا | منخفضة | — |

## أدلّة
- restore drill: نجح هذه الدورة (DB throwaway، 167 جدول، 150 FORCE_RLS، حُذفت). FORCE_RLS=150 ثابت = لا انحراف RLS. KEK blob = ice:F فقط، خارج repo.
- KEK escrow هو الفجوة الوحيدة منخفضة-الجهد الحرجة (DR) — يتطلّب لمس المفتاح ⟶ بوابة مالك.

## الخلاصة
الأمان الجوهري مكتمل ومنشور. المتبقّي = escrow الـKEK (بوابة مالك)، الترقية للمرحلة 2 (مفتاح)، offsite مشفّر (مفتاح+وجهة)، وبوابات اختيارية (audit-reader/index). الـrunbooks منجزة وثائقياً.
