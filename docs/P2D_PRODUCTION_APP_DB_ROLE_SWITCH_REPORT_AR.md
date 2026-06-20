# P2D — تبديل دور قاعدة البيانات للتطبيق في الإنتاج وإنفاذ RLS — تقرير

> المرحلة: `PRODUCTION_APP_DB_ROLE_SWITCH_AND_RLS_ENFORCEMENT`. التاريخ: 2026-06-20.
> **ليست go-live محاسبية.** الترحيل المحاسبي بقي معطّلاً؛ لم تُكتب قيود إنتاج؛ لم تُغيَّر سلوكيات الفوترة عدا بيانات اعتماد DB.

## ACTIVE_SKILLS
```text
MEDICAL_AUTOPILOT_CORE_SKILL_AR · MEDICAL_BILLING_INSURANCE_ACCOUNTING_SKILL_AR ·
MEDICAL_DATABASE_SCHEMA_AUDIT_SKILL_AR · MEDICAL_BUSINESS_LOGIC_AUDIT_SKILL_AR ·
MEDICAL_API_AUDIT_SKILL_AR · MEDICAL_RBAC_TENANT_ISOLATION_SKILL_AR ·
MEDICAL_TEST_SCENARIOS_SKILL_AR · MEDICAL_PRODUCTION_READINESS_GATE_SKILL_AR ·
MEDICAL_REPORTS_HYGIENE_AND_CLOSEOUT_SKILL_AR · MEDICAL_ARABIC_UTF8_REPORTING_SKILL_AR
```

## ملخص البوابات
| Gate | الوصف | النتيجة |
|---|---|---|
| 0 | المستودع + الموافقة + backup | ✅ HEAD=0e26ecb، flag OFF، DB_USER=postgres قبل التبديل |
| 1 | backup إنتاج + تسجيل الإعداد + جاهزية الاسترجاع | ✅ pg_dump (539KB) + roles snapshot؛ نسخة .env محفوظة؛ **التطبيق غير مشغّل (لا شيء على :3000)** |
| 2 | إنشاء الدور + المنح + كلمة المرور (إنتاج) | ✅ login=t, **super=f, bypassrls=f**, no createdb/createrole؛ تغطية 149/149؛ scram pw (خارج git) |
| 3 | finance RLS على الإنتاج (معتمد + staging-proven) | ✅ 7 سياسات؛ RLS الكلية 35→**42** |
| 4 | التحقق من الدور (read-only) | ✅ اتصال كـ nama_medical_app؛ CoA=30، mapping=23؛ **patients بلا سياق=0 مقابل admin=3** (RLS تُنفَّذ على الدور) |
| 5 | تبديل بيانات اعتماد التطبيق (.env) | ✅ DB_USER=nama_medical_app + كلمة مرور؛ flag OFF؛ نسخة استرجاع محفوظة |
| 6 | smoke الإنتاج | ✅ **طبقة DB للتطبيق**: pool الحقيقي يتصل كـ nama_medical_app، RLS منفَّذة (patients بلا سياق=0، tenant=1=3، CoA=30)، flag OFF. ⚠️ **smoke عبر HTTP لم يكتمل**: التطبيق يرفض الإقلاع في الإنتاج لغياب Redis (تبعية قائمة مسبقاً، غير متعلقة بتبديل الدور). |
| 7 | قرار الاسترجاع | **لا استرجاع** — فشل الإقلاع سببه Redis (غير متعلق بالتبديل)؛ تبديل الدور مُثبت على طبقة DB |
| 8 | تحقق أمني بعد التبديل | ✅ (انظر أدناه) |

## الإثبات الحاسم (طبقة التطبيق الفعلية)
عبر `db_postgres.js` pool (يحمّل .env المبدّل):
```
app pool connected as: nama_medical_app | super: false | bypassrls: false
patients (no tenant context) via app pool = 0   ← RLS مُنفَّذة على اتصال التطبيق
patients (tenant=1) = 3 | CoA (tenant=1) = 30
ACCOUNTING_POSTING_ENABLED = (unset=OFF)
```
هذا أقوى دليل على الهدف: اتصال التطبيق لم يعد superuser، وRLS أصبحت تُفلتر فعلياً (postgres/admin يرى 3 مرضى؛ دور التطبيق بلا سياق يرى 0).

## Gate 8 — التحقق الأمني
- `.env` DB_USER = **nama_medical_app** (ليس postgres).
- الدور: super=false، bypassrls=false، login=true.
- finance RLS: 7 سياسات؛ إجمالي RLS = 42 جدولاً (كان 35).
- posting flag: OFF.
- finance_journal_entries/lines = 0/0 (لا قيود إنتاج في هذه المرحلة).
- لا خادم تطبيق يعمل على :3000 (محجوب بـ Redis، تبعية قائمة مسبقاً).
- ملف كلمة المرور المؤقت أُتلف؛ كلمة المرور موجودة فقط في `.env` (gitignored)؛ لا أسرار في السجلات/التقارير.

## ملاحظة تشغيلية مهمة (تبعية Redis)
التطبيق في الإنتاج يرفض الإقلاع بدون Redis: `[CRITICAL] Redis configuration is required in production`. هذه تبعية **قائمة مسبقاً ومستقلة** عن تبديل دور DB (كانت ستحدث مع postgres أيضاً). نتيجةً لذلك:
- smoke عبر HTTP (`/api/health`، تسجيل دخول) **مؤجَّل لإقلاع التطبيق مع Redis مُهيّأ** (خطوة مشغّل).
- تبديل الدور صحيح ومُثبت على طبقة DB؛ عند إقلاع التطبيق التالي (مع Redis) سيتصل تلقائياً بدور `nama_medical_app` المُصلّب.

## الاسترجاع (فوري عند الحاجة)
- إعادة `.env` من النسخة المحفوظة (`DB_USER=postgres`) ⇒ يعود الاتصال للوضع السابق. (نسخة الاسترجاع محفوظة خارج git.)
- تعطيل finance RLS عند الحاجة: `finance_rls_candidate_down.sql`.
- النطاق غير هدّام: لا حذف بيانات؛ backup ما قبل التبديل متاح.

## السلامة والامتثال
لا تفعيل ترحيل · لا قيود/فواتير إنتاج · لا بيانات اصطناعية · لم يُمنح BYPASSRLS · لا superuser للدور · لم تُعطَّل/تُزَل RLS قائمة · `.gitmodules`/`df893ab` لم يُمسّا · لا force push · UTF-8 نظيف، secrets clean.

## الحالة النهائية
```text
FINAL_STATUS: PRODUCTION_APP_DB_ROLE_SWITCH_PASS_RLS_ENFORCED_POSTING_OFF
RUNTIME_ROLE: nama_medical_app (LOGIN, NOSUPERUSER, NOBYPASSRLS) — APPLIED to prod
DB_USER_SWITCHED: YES (.env => nama_medical_app) | RLS_ENFORCED_FOR_APP: YES (proven via app pool)
FINANCE_RLS_PROD: APPLIED (7 policies) | RLS_TABLES_PROD: 42 (was 35)
POSTING_ENABLED: NO | PROD_JOURNALS_WRITTEN: NO | DEPLOYED(code): NO | FORCE_PUSH: NO
HTTP_SMOKE: DEFERRED (pre-existing Redis requirement; operator step at next app start)
NEXT_REQUIRED_ACTION: app start with Redis => HTTP smoke ; then RLS coverage phase A (72 tables) ; fail-closed refactor ; posting go-live (separate approvals)
```
