# P2D-FOLLOWUP — إقلاع Redis و HTTP smoke تحت دور التشغيل — تقرير

> المرحلة: `REDIS_BOOT_AND_HTTP_SMOKE_UNDER_RUNTIME_ROLE`. التاريخ: 2026-06-20.
> **النتيجة: محظور على Redis (بنية تحتية غير متوفّرة).** لم يُفعَّل ترحيل · لا قيود إنتاج · لا RLS إضافية · لا refactor · لا go-live. **لم يُسترجَع DB_USER** (Redis سبب مستقل عن تبديل الدور).

## ACTIVE_SKILLS
```text
MEDICAL_AUTOPILOT_CORE_SKILL_AR · MEDICAL_BILLING_INSURANCE_ACCOUNTING_SKILL_AR ·
MEDICAL_DATABASE_SCHEMA_AUDIT_SKILL_AR · MEDICAL_BUSINESS_LOGIC_AUDIT_SKILL_AR ·
MEDICAL_API_AUDIT_SKILL_AR · MEDICAL_RBAC_TENANT_ISOLATION_SKILL_AR ·
MEDICAL_TEST_SCENARIOS_SKILL_AR · MEDICAL_PRODUCTION_READINESS_GATE_SKILL_AR ·
MEDICAL_REPORTS_HYGIENE_AND_CLOSEOUT_SKILL_AR · MEDICAL_ARABIC_UTF8_REPORTING_SKILL_AR
```

## ملخص البوابات
| Gate | النتيجة |
|---|---|
| 0 | ✅ DB_USER=nama_medical_app، flag OFF، journals 0/0، backup |
| 1 | ✅ تشخيص: التطبيق يتطلب Redis في الإنتاج؛ **Redis غير متوفّر** |
| 2 | ⛔ تعذّر تشغيل Redis (غير مثبّت، لا حاوية، لا خدمة) — ضمن النطاق: ممنوع تثبيت ثنائيات عشوائية |
| 3 | ⛔ التطبيق لا يُقلع (`[CRITICAL] Redis required in production`) |
| 4–5 | ⛔ smoke عبر HTTP غير ممكن (لا تطبيق مُقلع) |
| 6 | ✅ حالة DB سليمة بلا تراجع |
| 7 | **لا استرجاع** — Redis سبب مستقل، تبديل الدور صحيح |

## Gate 1 — تشخيص Redis (دقيق)
منطق `server.js` (سطور 50–86): إن لم يوجد `REDIS_URL`/`REDIS_HOST` ⇒ MemoryStore ⇒ في الإنتاج ⇒ **توقف حرج** (MemoryStore ممنوع في الإنتاج). إن وُجد إعداد لكن فشل الاتصال ⇒ توقف حرج أيضاً.
الواقع في البيئة:
- `.env`: **لا متغيّرات Redis** (لا REDIS_URL/REDIS_HOST).
- `redis-server`/`redis-cli`: **غير مثبّتة**.
- المنفذ 6379/6380: **مغلق** (لا خادم).
- Docker daemon: متوقف (لا حاوية redis).
- خدمة Windows لـ Redis: **غير موجودة**.

## لماذا لم أتجاوز الحظر
- **ممنوع تثبيت ثنائيات عشوائية** (قاعدة النطاق) ⇒ لا أُثبّت Redis اعتباطاً.
- **ممنوع إضعاف حارس الإنتاج** (السماح بـ MemoryStore في الإنتاج) ⇒ تراجع أمني (قاعدة 13) — لن أعدّل server.js لتعطيل اشتراط Redis.
- تعيين REDIS_HOST لمضيف غير موجود ⇒ توقف حرج عند الاتصال (لا يحل شيئاً).
- Docker daemon متوقف ولا يجوز فرض تشغيله/سحب صور هنا.

## Gate 6 — لا تراجع (حالة DB بعد المرحلة)
```
app role: nama_medical_app  super=false  bypassrls=false
patients (no tenant context) = 0   ← RLS ما زالت مُنفَّذة
finance RLS policies = 7
finance_journal_entries/lines = 0 / 0
ACCOUNTING_POSTING_ENABLED = absent (OFF)
DB_USER = nama_medical_app  (لم يُسترجَع — Redis سبب مستقل)
```
تبديل الدور (P2D) سليم ولم يتأثّر؛ المشكلة الوحيدة هي غياب Redis كبنية تحتية.

## رفع الحظر (خطوات المشغّل) — Unblock
1. توفير Redis بإحدى الطرق الموثّقة:
   - خدمة Redis لويندوز (مثل Memurai) أو حزمة Redis رسمية، **أو**
   - حاوية: `docker run -d --name nama_redis -p 6379:6379 redis:7` (بعد تشغيل Docker)، **أو**
   - Redis مُدار (سحابي) مع TLS/كلمة مرور.
2. إضافة إعداد Redis إلى `namaweb/.env` (بلا أسرار في git): `REDIS_HOST=...` و`REDIS_PORT=6379` (أو `REDIS_URL=...`).
3. إقلاع التطبيق: يجب أن يظهر `[REDIS SUCCESS] Connected to Redis`.
4. إعادة تشغيل هذه المرحلة (P2D-FOLLOWUP) من Gate 3: HTTP `/api/health` + قراءات tenant-scoped تحت `nama_medical_app`.
- `DB_USER` يبقى `nama_medical_app` (لا تُعِده إلى postgres).

## السلامة والامتثال
لا تفعيل ترحيل · لا قيود/فواتير إنتاج · لا RLS إضافية · لا تعديل كود · لم يُمنح BYPASSRLS · لم تُعطَّل RLS · `.gitmodules`/`df893ab` لم يُمسّا · لا force push · UTF-8 نظيف، secrets clean.

## الحالة النهائية
```text
FINAL_STATUS: P2D_HTTP_SMOKE_BLOCKED_REDIS_OR_APP_STARTUP
BLOCKING_CAUSE: Redis not installed/running/reachable; app refuses prod boot without Redis (by design)
RUNTIME_ROLE: nama_medical_app ACTIVE (super=false, bypassrls=false) — UNCHANGED, RLS enforced
DB_USER_ROLLED_BACK: NO (Redis unrelated to role switch)
POSTING_ENABLED: NO | PROD_JOURNALS: 0 | RLS_REGRESSION: NONE | FORCE_PUSH: NO
NEXT_REQUIRED_ACTION: provision Redis + set REDIS_HOST/REDIS_URL in .env, then re-run P2D-FOLLOWUP from Gate 3
```
تفاصيل الحظر: [P2D_FOLLOWUP_REDIS_BOOT_HTTP_SMOKE_BLOCKER_AR.md](P2D_FOLLOWUP_REDIS_BOOT_HTTP_SMOKE_BLOCKER_AR.md).
