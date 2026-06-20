# Phase 7 (WS6B) — نشر كود fail-closed مع العلم OFF — تقرير

> التاريخ: 2026-06-20. **نشر code-only مع `ACCOUNTING_POSTING_ENABLED=OFF` — لا تغيير سلوك، لا ترحيل، journals=0.**

## ACTIVE_SKILLS
```text
MEDICAL_AUTOPILOT_CORE_SKILL_AR · MEDICAL_BILLING_INSURANCE_ACCOUNTING_SKILL_AR ·
MEDICAL_DATABASE_SCHEMA_AUDIT_SKILL_AR · MEDICAL_BUSINESS_LOGIC_AUDIT_SKILL_AR ·
MEDICAL_API_AUDIT_SKILL_AR · MEDICAL_RBAC_TENANT_ISOLATION_SKILL_AR ·
MEDICAL_TEST_SCENARIOS_SKILL_AR · MEDICAL_PRODUCTION_READINESS_GATE_SKILL_AR ·
MEDICAL_REPORTS_HYGIENE_AND_CLOSEOUT_SKILL_AR · MEDICAL_ARABIC_UTF8_REPORTING_SKILL_AR
```

## السياق
كان تطبيق PM2 الحيّ يشغّل بالفعل كود فرع الميزة (fail-closed، العلم OFF) من مجلد العمل، بينما مؤشّر gitlink الرسمي في الأب ما زال e6608ba (قبل التوصيل/إعادة الهيكلة). Phase 7 يوفّق المؤشّر الرسمي مع الكود الحيّ المُثبت على staging.

## البوابات
| Gate | النتيجة |
|---|---|
| 1 WS6 staging PASS | ✅ (10/10، تقرير WS6) |
| 2 مراجعة الكود (runEventWithPosting/المسارات/ربط المستأجر/SAVEPOINT/flag OFF) | ✅ مُراجَع، staging-proven |
| 3 build/test | ✅ node --check + اختبارات staging 10/10 + محرك 28/28 |
| 4 نشر code-only، flag OFF | ✅ namaweb feature→master (fast-forward e6608ba..4d2bcaf) + رفع؛ مؤشّر gitlink الأب e6608ba→4d2bcaf |
| 5 HTTP smoke | ✅ health=200، login=200، patients=401 (لا تسريب) |
| 6 journals 0/0 | ✅ |
| 7 posting OFF | ✅ |
| 8 rollback جاهز | ✅ (انظر أدناه) |

## التحقق بعد النشر
- `pm2 restart nama-app` ⇒ إقلاع نظيف، `[REDIS SUCCESS]`، health 200.
- جلسات DB = nama_medical_app (super=false، bypassrls=false).
- العلم `ACCOUNTING_POSTING_ENABLED=OFF` ⇒ المسارات تُنفّذ حدث العمل فقط (لا قيود) — سلوك المستخدم بلا تغيير.
- finance_journal_entries/lines = 0/0.

## الكود المنشور (namaweb master = 4d2bcaf)
- `accounting_posting_service.js`: محرك ترحيل + `runEventWithPosting` (fail-closed atomic) + ربط app.tenant_id + idempotency.
- `server.js`: مسارات issue/pay/cancel fail-closed خلف العلم (OFF).
- `ecosystem.config.js`, اختبارات staging.

## الاسترجاع (فوري، غير هدّام)
- **تعطيل سلوك**: العلم أصلاً OFF؛ لا شيء لتعطيله.
- **استرجاع الكود**: إعادة مؤشّر gitlink الأب إلى e6608ba (commit أب جديد، بلا force) + `git -C namaweb checkout e6608ba` + `pm2 restart nama-app`. backup `backup/before-phase7-deploy`.
- لا حذف بيانات.

## الحالة النهائية
```text
FINAL_STATUS: FAIL_CLOSED_CODE_DEPLOYED_FLAG_OFF_PASS_GO_LIVE_PENDING_APPROVAL
PRODUCTION_TOUCHED: YES (gitlink bump e6608ba->4d2bcaf, code-only)
DATA_CHANGED: NO
DDL_EXECUTED: NO
DEPLOYED: YES (code-only, flag OFF)
POSTING_ENABLED: NO
PROD_JOURNALS_WRITTEN: NO
FORCE_PUSH_USED: NO
NEXT_REQUIRED_ACTION: WS8/Phase 9 controlled accounting go-live = SEPARATE explicit approval (not granted here)
```

## ملاحظة حوكمة
هذا أول تغيير لمؤشّر gitlink الإنتاجي في المشروع (من e6608ba إلى 4d2bcaf). التغيير code-only والعلم OFF ⇒ لا أثر سلوكي على المستخدم؛ والترحيل المحاسبي يبقى معطّلاً حتى موافقة go-live مخصّصة.
