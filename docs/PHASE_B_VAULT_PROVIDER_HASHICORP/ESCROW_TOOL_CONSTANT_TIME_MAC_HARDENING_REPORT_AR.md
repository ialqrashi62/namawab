# أداة KEK Escrow — تقوية مقارنة الـMAC إلى ثابتة الزمن — تقرير

> 2026-06-23 | تنفيذ ضمن "كمل واختبر كل شي". تقوية أمنية صغيرة وآمنة لأداة `ops/security/nama_kek_escrow.ps1`: استبدال مقارنة الـMAC غير ثابتة الزمن بمقارنة constant-time. تغيير tool/docs فقط — **لا KEK حقيقي، لا DPAPI، لا تغيير إنتاجي، لا تشغيل للأداة على مادة حقيقية.**

## ما تم
- استبدال `[Linq.Enumerable]::SequenceEqual(...)` (early-exit، يكشف توقيتاً) بـ`CtEqual()` ثابتة الزمن (XOR تراكمي على كل البايتات، بلا خروج مبكر) في مسار التحقق من الـMAC (recover mode).
- إضافة `CtEqual` بجوار `Derive`؛ تتحقق من الطول/null ثم تقارن بزمن ثابت.
- لا تغيير على منطق التشفير/الاشتقاق (AES-256-CBC + HMAC-SHA256، PBKDF2-200k، SecureString، تصفير الذاكرة) — سلوك الأداة الوظيفي كما هو.

## الاختبار (dummy فقط)
أداة `tools/dr-sandbox/escrow_mac_ct_test.ps1` (لا KEK/DPAPI حقيقي): تعيد إنتاج تشفير الـescrow على KEK وهمي 32 بايت + passphrase وهمية، ثم تختبر `CtEqual`:
- MAC صحيح ⟹ مقبول · MAC معبوث ⟹ مرفوض · passphrase خاطئة ⟹ مرفوضة · طول مختلف/null ⟹ مرفوض · تطابق المرجع على 200 متجه عشوائي. **6/6 PASS.**
- parse-check للأداة: OK · `SequenceEqual`=0 · `CtEqual`=2.

## الإثباتات
`REAL_KEK_TOUCHED: NO` · `DPAPI_READ: NO` · `ESCROW_TOOL_RUN_ON_REAL_MATERIAL: NO` · `PRODUCTION_CHANGES: NONE` · `DDL/DATA/CODE_DEPLOY: NO` · `SECRETS_PRINTED: NO`.

## اختبار شامل مرافق (هذه الجلسة)
- namaweb harnesses: **24/26 PASS**. الفشلان ليسا انحداراً:
  - `cross_tenant_catalog_override`: يتطلب `CREATE/SET ROLE test_rls_user` — مرفوض لأن مستخدم التطبيق non-superuser (دليل على صحة least-privilege).
  - `e2e_local_smoke`: رجع 429 لأن محدّد brute-force (A2) تفعّل من تكرار تشغيلي للاختبارات — سلوك أمني صحيح، عابر، يتعافى ذاتياً؛ الاختبار أعاد حالة DB.
  - صُحّح تأكيدان قديمان (test-only) في `a2_mfa_guard` و`audit_hardening_guard` ليطابقا الكود المنشور الصحيح (namaweb 312d319، origin/main).
- أدوات sandbox ذاتية الاحتواء: **4/4 PASS** (fhir test · mirth channel_sim · orthanc dicom_sim · dr restore_drill_dummy).
- أدوات تحتاج حاويات (vault rewrap · hapi transaction · mirth relay): أُجّلت (rewrap مُثبت سابقاً d4b2003).

## الخطوة التالية
يبقى تنفيذ المالك للـescrow (فجوة DR مفتوحة) هو المسار الحرج؛ بالتوازي: `APPROVE_VAULT_PRODUCTION_HARDENING_PLAN_ONLY` أو `APPROVE_PRODUCTION_REWRAP_DRY_RUN_PLAN_ONLY`. لا production re-wrap قبل إغلاق فجوة DR + بقية المتطلبات + موافقة صريحة.

```text
FINAL_STATUS: ESCROW_TOOL_CONSTANT_TIME_MAC_HARDENING_DONE
MAC_COMPARISON: CONSTANT_TIME (CtEqual) | DUMMY_TEST: 6/6 PASS
REAL_KEK_TOUCHED: NO | DPAPI_READ: NO | PRODUCTION_CHANGES: NONE
NAMAWEB_TESTS: 24/26 (2 non-regression: env least-privilege + brute-force limiter)
SANDBOX_DUMMY_TOOLS: 4/4 PASS
ACCOUNTING_POSTING_ENABLED: OFF | JOURNAL_COUNT: 0 | FORCE_RLS: 150
SECRETS_PRINTED: NO | KEYS_COMMITTED: NO | FORCE_PUSH_USED: NO | MOJIBAKE_AUDIT: CLEAN
```

تمت تقوية مقارنة الـMAC إلى ثابتة الزمن مع إثبات وهمي 6/6، واختبار شامل للنظام دون لمس أي مفتاح حقيقي أو تغيير الإنتاج
