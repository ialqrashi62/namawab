# Next Priority Execution (بعد التصنيف الشامل) — إغلاق

> 2026-06-23 | نُفِّذت الأولويات الثلاث بالترتيب: KEK escrow (أداة مالك جاهزة)، Mirth sandbox candidate، FHIR sandbox code candidate (7/7 dummy). لا تغيير إنتاجي، لا أسرار/مفاتيح مكشوفة.

## ما أُنجز
1. **KEK Escrow** — أُنشئت أداة owner-run آمنة `ops/security/nama_kek_escrow.ps1` (AES-256-CBC+HMAC-SHA256 / PBKDF2-200k؛ تفكّ DPAPI في الذاكرة، تُعيد التغليف تحت passphrase يُقرأ SecureString، تكتب ملف escrow مشفّر). **المفتاح لا يُطبع/يُكتب نصاً/يُلتزَم.** PARSE OK. مخرجات الـescrow مُدرَجة في .gitignore. **لم تُشغَّل** — تشغيلها بالـpassphrase ونقلها offline = إجراء المالك (لا يمكن للوكيل وضع السرّ في خزنة المالك دون كشفه).
2. **Mirth sandbox candidate** — `docs/PHASE_B_D1_MIRTH_SANDBOX/01_...` (طوبولوجيا loopback، Docker مؤقت، persistence، queue/retry/dead-letter، تدقيق، نموذج أسرار بالمرجع، حدود: لا endpoints خارجية/لا PHI/لا شهادات).
3. **FHIR sandbox code candidate** — `docs/PHASE_B_D2_FHIR_SANDBOX/` نموذج تحويل JS مستقل (6 موارد R4) + تحقّق محلي **7/7** ببيانات dummy؛ صورة التقرير مرجع محمي `/api/phi-files/:id` (لا بايتات مضمّنة). غير موصول بالإنتاج، بلا DB/شبكة.

## الحقول
```text
FINAL_STATUS: NEXT_PRIORITY_EXECUTION_COMPLETED_OR_CLASSIFIED
KEK_ESCROW_STATUS: ESCROW_TOOLING_READY_PENDING_OWNER_RUN (safe owner-run method delivered; agent cannot perform offline step without exposing key)
MIRTH_SANDBOX_STATUS: PHASE_B_D1_MIRTH_SANDBOX_DEPLOYMENT_CANDIDATE_READY
FHIR_SANDBOX_STATUS: PHASE_B_D2_FHIR_SANDBOX_CANDIDATE_READY (prototype 7/7 dummy)
PRODUCTION_CHANGES: NONE
DDL_EXECUTED: NO
DATA_CHANGED: NO
CODE_DEPLOYED: NO (prototype/tool not wired to runtime)
EXTERNAL_CALLS: NO
REAL_PHI_USED: NO
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_COUNT: 0
SECRETS_PRINTED: NO
KEYS_COMMITTED: NO
DPAPI_BLOB_COMMITTED: NO
FORCE_PUSH_USED: NO
NEXT_RECOMMENDED_ACTION: OWNER_RUN_KEK_ESCROW (ops/security/nama_kek_escrow.ps1) + APPROVE_PHASE_B_D1_MIRTH_SANDBOX_DEPLOYMENT / APPROVE_PHASE_B_D2_FHIR_LOCAL_SANDBOX_CODE
```

## ملاحظات
- **KEK escrow الفعلي = إجراء مالك**: شغّل الأداة بنفسك (passphrase قوي ≥12)، انقل ملف الـescrow إلى خزنة offline، خزّن الـpassphrase منفصلاً، واستثنِ الـblob من النسخ. الاسترداد على جهاز جديد عبر `-Mode recover`.
- Mirth/FHIR التنفيذ الفعلي (تنصيب) = بوابات لاحقة؛ هذه candidates آمنة (sandbox/dummy).
- المحاسبة OFF، journal 0، R17 سليمة، health 5/5 + domain 200.

تم تنفيذ أو تصنيف أولويات ما بعد التصنيف الشامل مع بقاء المحاسبة مغلقة وعدم كشف أسرار
