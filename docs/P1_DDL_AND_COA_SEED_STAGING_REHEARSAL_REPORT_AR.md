# P1_DDL_AND_COA_SEED — تقرير بروفة Staging

> المرحلة: `DDL_AND_COA_SEED_APPROVAL`. التاريخ: 2026-06-20.
> **النتيجة: لم تُنفَّذ البروفة الحية — موقوفة بـ BLOCKER في Gate 1 (لا قاعدة staging آمنة).**
> لم يُنفَّذ أي DDL/Seed، لا تغيير بيانات، لا اتصال بإنتاج، لا نشر، لا توصيل محرك.

## ACTIVE_SKILLS
```text
MEDICAL_AUTOPILOT_CORE_SKILL_AR · MEDICAL_BILLING_INSURANCE_ACCOUNTING_SKILL_AR ·
MEDICAL_DATABASE_SCHEMA_AUDIT_SKILL_AR · MEDICAL_BUSINESS_LOGIC_AUDIT_SKILL_AR ·
MEDICAL_API_AUDIT_SKILL_AR · MEDICAL_RBAC_TENANT_ISOLATION_SKILL_AR ·
MEDICAL_TEST_SCENARIOS_SKILL_AR · MEDICAL_PRODUCTION_READINESS_GATE_SKILL_AR ·
MEDICAL_REPORTS_HYGIENE_AND_CLOSEOUT_SKILL_AR · MEDICAL_ARABIC_UTF8_REPORTING_SKILL_AR
```

---

## Gate 0 — التحقق من المستودع والملفات المرشّحة: **PASS**
| فحص | نتيجة |
|---|---|
| HEAD | `d56a566` (= المطلوب بالضبط) |
| تزامن origin/master | 0 / 0 |
| HEAD سليل آمن لـ d56a566 | YES |
| الملفات المرشّحة موجودة | 5/5 (up 94، down 52، validate 64، coa 71، mapping 53 سطراً) |
| الملفات لم تتغيّر منذ d56a566 | `CANDIDATES_UNCHANGED_SINCE_d56a566` |
| backup قبل العمل | branch `backup/before-ddl-coa-staging-rehearsal` + tag مطابق عند d56a566 |

### مراجعة SQL ثابتة (static review — بلا قاعدة)
- **idempotency**: `IF NOT EXISTS` ×24 في up؛ `ON CONFLICT` ×7 في coa و×1 في mapping ⇒ إعادة التشغيل آمنة.
- **محاذاة down/up**: 26 سطر DROP في down يقابل ما يُنشئه up (فهارس/قيود/أعمدة/trigger/function).
- **اتساق رموز المحرك**: الرموز العشرة (1000/1010/1100/1110/1200/2100/2300/4000/4090/5000) **كلها موجودة** في `medical_coa_seed_candidate.sql` كحسابات قابلة للترحيل، وكلها مُغطّاة في `account_mapping_seed_candidate.sql`.
- **عمليات حاجزة/خطرة (متوقّعة وموثّقة)**:
  - `ALTER COLUMN debit/credit TYPE NUMERIC(18,2)` ⇒ إعادة كتابة جدول + قفل `ACCESS EXCLUSIVE` (نافذة صيانة).
  - `ADD CONSTRAINT` (CHECK/FK) ⇒ يتحقق من البيانات القائمة (يتطلب `validate.sql` نظيفاً أولاً).
  - `CREATE UNIQUE INDEX` (`uq_coa_tenant_code`, `uq_journal_idempotency` جزئي).
- **تبعية إصدار**: قسم trigger الاختياري يستخدم `EXECUTE FUNCTION` (يتطلب PostgreSQL ≥ 11) — معطّل افتراضياً، لا أثر ما لم يُفعَّل.
- **ملاحظة طفيفة**: فحوص `pg_constraint.conname` في DO blocks عامة (غير مقيّدة بالجدول)؛ الأسماء مميّزة هنا فلا تعارض.
- **الحُكم الثابت**: التصميم سليم بنيوياً وقابل للتطبيق وآمن للإعادة، **بشرط** preflight نظيف على هدف حقيقي.

---

## Gate 1 — جاهزية قاعدة Staging: **BLOCKED**
| فحص | نتيجة | الأثر |
|---|---|---|
| `psql` متاح | ❌ NO_PSQL | لا أداة تطبيق SQL سطرية |
| `pg_dump` متاح | ❌ NO_PG_DUMP | لا أداة backup |
| متغيّرات بيئة DB/Staging | ❌ لا شيء (لا DATABASE_URL/STAGING) | لا اتصال staging مُعرَّف |
| `pg` node driver | ✅ موجود | يمكن نظرياً التشغيل عبر node |
| هوية الهدف الوحيد المتاح (`namaweb/.env`) | ⚠️ `DB_HOST=localhost` + **`NODE_ENV=production`** | الهدف الوحيد موسوم **إنتاج** |
| قاعدة staging مؤكَّد أنها ليست إنتاجاً | ❌ غير موجودة | **لا يمكن تأكيد هدف غير إنتاجي معزول** |

**السبب الحاسم:** لا توجد قاعدة staging مُجهَّزة ومؤكَّدة العزل عن الإنتاج. الإعداد الوحيد المتاح يشير إلى `NODE_ENV=production`. تطبيق DDL عليه ينتهك القواعد 2 و8 و9. لذلك — وفق القاعدة 10 — **تتوقف البروفة الحية** ويُنشأ تقرير BLOCKER.

### نتيجة Gates 2–5
- Gate 2 (تطبيق DDL على staging): **لم يُنفَّذ** — لا staging.
- Gate 3 (CoA/mapping seed على staging): **لم يُنفَّذ**.
- Gate 4 (بروفة rollback): **لم يُنفَّذ**.
- Gate 5 (توافق التطبيق مع المخطط المُطبَّق): **لم يُنفَّذ** (يعتمد على staging مُطبَّق).
  - ملاحظة: اختبارات المحرك النقية (`accounting_posting_test.js`) لا تحتاج قاعدة وقد مرّت سابقاً 28/28؛ لكنها لا تُغني عن بروفة المخطط.

---

## الخلاصة
- Gate 0: PASS · Gate 1: BLOCKED · Gates 2–5: لم تُنفَّذ.
- المطلوب لرفع الحظر: **قاعدة PostgreSQL staging مُجهَّزة ومؤكَّد أنها ليست الإنتاج** + أدوات `psql/pg_dump` (أو سكربت node معتمد) + نسخة schema-only من الإنتاج لإعادة الإنتاج بدقة.
- الـ runbook للإنتاج جاهز (تخطيط فقط) في [P1_DDL_AND_COA_SEED_PRODUCTION_RUNBOOK_AR.md](P1_DDL_AND_COA_SEED_PRODUCTION_RUNBOOK_AR.md).
- تفاصيل الحظر: [P1_DDL_AND_COA_SEED_BLOCKER_AR.md](P1_DDL_AND_COA_SEED_BLOCKER_AR.md).

```text
GATE0: PASS
GATE1: BLOCKED (no safe staging DB; only target is NODE_ENV=production)
GATES_2_5: NOT_RUN
DDL_EXECUTED: NO
DATA_CHANGED: NO
PRODUCTION_DEPLOYED: NO
ENGINE_WIRED_TO_INVOICES: NO
FINAL_STATUS: DDL_AND_COA_SEED_BLOCKED
```
