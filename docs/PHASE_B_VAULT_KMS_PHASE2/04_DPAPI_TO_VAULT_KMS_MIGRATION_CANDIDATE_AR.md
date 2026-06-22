# Phase 2 — خطة هجرة DPAPI → Vault/KMS (candidate، بلا تنفيذ)

> خطة فقط. لا re-wrap حقيقي إلا عند توفّر Vault/KMS + موافقة صريحة.

## المبدأ
الهجرة = **إعادة تغليف الـKEK (re-wrap)**، **لا** إعادة تشفير بيانات. الـDEKs تبقى كما هي؛ يتغيّر فقط من يحمي/يغلّف الـKEK.

## الخطوات (عند توفّر Vault/KMS + موافقة)
1. **تحضير المزوّد B**: تهيئة Vault/KMS (transit/PKI) + سياسة وصول مقيّدة + تدقيق.
2. **استيراد KEK الحالي**: فكّ DPAPI (في الذاكرة) ⟹ تغليفه بمفتاح Vault/KMS (KEK جديد بنسخة v2) — عبر إجراء owner محكوم (لا طباعة مفتاح).
3. **dual-read period**: التطبيق يقرأ نسخة الـKEK من الـheader؛ يدعم v1 (DPAPI) و v2 (Vault) معاً مؤقتاً ⟹ لا انقطاع.
4. **re-wrap الـDEKs**: تغليف كل DEK بـKEK v2؛ تحديث header النسخة. (لا إعادة تشفير محتوى.)
5. **التحقّق**: قراءة/فكّ عيّنة عبر v2؛ مطابقة sha256 الأصلية.
6. **إبطال v1**: بعد التأكّد، إيقاف DPAPI v1 (مع الاحتفاظ بـescrow حتى نافذة أمان).

## key version metadata
كل قيمة مشفّرة تحمل `ENCv<major>` + معرّف نسخة KEK ⟹ يعرف التطبيق أي مزوّد/نسخة يفكّ بها.

## خطة rollback
- أثناء dual-read: العودة لقراءة v1 (DPAPI) فوراً (لا يزال صالحاً).
- إن فشل re-wrap لعنصر: يبقى مغلّفاً بـv1 (لا فقدان).
- escrow الـKEK (المرحلة 1) يبقى كشبكة أمان حتى اكتمال الهجرة + drill.

## استراتيجية الاختبار + restore drill
- rehearsal على بيانات dummy/throwaway DB أولاً (مثل drills السابقة).
- restore drill: استعادة نسخة DB + توفير KEK من Vault/escrow ⟹ فكّ عيّنة بنجاح.
- لا تنفيذ على الإنتاج قبل rehearsal PASS + موافقة.

## نقاط موافقة المالك
1. اختيار المزوّد (Vault/Azure/AWS/GCP/HSM).
2. الموافقة على rehearsal re-wrap (dummy).
3. الموافقة على re-wrap الإنتاج + نافذة الصيانة.
4. الموافقة على إبطال v1 بعد drill.

## الحالة
```text
VAULT_KMS_EXECUTION_STATUS: BLOCKED_PENDING_KEY_INFRASTRUCTURE (لا Vault/KMS متوفر الآن)
RE_WRAP_EXECUTED: NO | DATA_RE_ENCRYPTED: NO | KEYS_CREATED: NO
NEXT: APPROVE_VAULT_KMS_PROVIDER_* ثم APPROVE_DPAPI_TO_VAULT_REWRAP_REHEARSAL_ONLY
```
