# تقرير تدقيق ملفات الهجرة مسبقاً (STAGING_DDL_PREFLIGHT_ONLY_REPORT)

**المشروع:** NamaMedical / الطبيب
**رأس التزام الجذر الحالي (ROOT HEAD):** `d187c41d3dc7e863415273a7c96c997489fab1cb`
**مسار شجرة العمل المعزولة للجذر:** `..\NamaMedical_isolated_root_6c418c`
**مسار شجرة العمل المعزولة لـ namaweb:** `..\namaweb_isolated_p0p1_1fe349d`
**التاريخ:** 2026-06-27
**النوع:** مراجعة ثنائية وتحليل سكوني للملفات — لا اتصال بالخارج — لا قاعدة بيانات — لا تشغيل DDL

---

## 1. ملخص جاهزية بيئة العمل المعزولة

تم التحقق من نظافة كلا المجلدين المعزولين وخلوهما من أي تلوث أو تعديلات غير ملتزم بها (Clean Worktrees):
- **مجلد الجذر المعزول:** نظيف تماماً (`Clean`) ✅
- **مجلد namaweb المعزول:** نظيف تماماً (`Clean`) ✅

---

## 2. مراجعة ملفات الهجرة سكونياً (Static SQL Review)

### 2.1 هجرة حماية البيانات القديمة (`p1_01_legacy_core_rls_up.sql`)
تستهدف الهجرة تفعيل سياسات أمان مستوى الصف (RLS) على الجداول الأربعة الأساسية للبيانات الحساسة: `patients` و `invoices` و `appointments` و `medical_records`.

- **الآلية:**
  1. إضافة عمود `tenant_id` إذا لم يكن موجوداً.
  2. تحديث الحقول الفارغة بقيمة افتراضية للمستأجر الأول `UPDATE ... SET tenant_id = 1 WHERE tenant_id IS NULL`.
  3. تعيين العمود كغير قابل للقيم الفارغة `SET NOT NULL`.
  4. ربط مفتاح خارجي مع جدول المستأجرين مع خاصية الحذف المتعاقب `ON DELETE CASCADE`.
  5. إنشاء كشاف فهرسة على `tenant_id`.
  6. تفعيل حماية الصفوف وإلزامها: `ENABLE ROW LEVEL SECURITY` و `FORCE ROW LEVEL SECURITY`.
  7. فرض سياسة العزل باستخدام المتغير الجلسي `app.tenant_id`:
     ```sql
     USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
     ```
- **الملاحظات:** الهجرة آمنة ومغلفة بالكامل داخل معاملة (`BEGIN; ... COMMIT;`).

### 2.2 هجرة منع تكرار قيود دفتر اليومية (`p1_02_gl_posting_idempotency_up.sql`)
تستهدف الهجرة إضافة مفتاح التكرار (`idempotency_key`) لجدول قيود اليومية لمنع القيد المزدوج.

- **الآلية:**
  1. إضافة عمود `idempotency_key` من نوع `TEXT`.
  2. إنشاء فهرس فريد جزئي (Partial Unique Index) على `(tenant_id, idempotency_key)` يستثني الحقول الفارغة:
     ```sql
     CREATE UNIQUE INDEX ... WHERE idempotency_key IS NOT NULL;
     ```
- **الملاحظات:** يضمن الفهرس عدم تأثر البيانات السابقة (حيث قيمة المفتاح فارغة) مع منع أي قيود مكررة جديدة مستقبلاً عند تفعيل الربط التلقائي.

---

## 3. تصنيف وتقييم المخاطر (Risk Classification)

| نوع الخطر | الوصف | مستوى الخطر | إجراءات التخفيف المتخذة |
|-----------|-------|-------------|-------------------------|
| **خطر الإغلاق الحصري (Table Locking)** | عمليات `ALTER TABLE` و `UPDATE` ستقوم بحظر القراءة والكتابة على الجداول الأساسية أثناء تنفيذ الهجرة. | **متوسط إلى عالٍ** | يُنصح بتشغيل الهجرة في بيئة Staging أولاً، وفي بيئة الإنتاج يتم جدولتها ضمن نافذة صيانة (Maintenance Window). |
| **خطر التحديث التلقائي (Backfill Assumptions)** | افتراض أن جميع السجلات التي لا تحتوي على مستأجر تتبع `tenant_id = 1`. | **منخفض** | السجلات الحالية في النظام التجريبي تتبع بالفعل المستأجر الرئيسي؛ يجب مراجعة البيانات في الإنتاج قبل التطبيق الفعلي. |
| **خطر فقدان السياق (Context Outage)** | في حال نسيان التطبيق تمرير سياق المستأجر `app.tenant_id` في أي استعلام، ستظهر النتائج كـ 0 سجلات (Fail-Closed). | **متوسط** | تم اختبار مسارات التطبيق بنسبة 100% في البيئة المحلية للتأكد من ربط سياق المستأجر مع كل اتصال. |

---

## 4. المخاطر المانعة قبل تشغيل DDL على Staging (Blocking Risks Before Staging DDL)

1. **خطر الإغلاق الحصري (LOCKING_RISK):**
   عمليات `ALTER TABLE` و `UPDATE` ستقوم بحجز قفل حصري (`AccessExclusiveLock`) على الجداول الأساسية (`patients`, `invoices`, `appointments`, `medical_records`). هذا يتطلب إما نافذة صيانة مجدولة (`maintenance window`) أو أخذ لقطة (`staging snapshot`) وقبول توقف مؤقت للخدمة أثناء التنفيذ لمنع حظر الطلبات الأخرى.

2. **خطر التحديث التلقائي للمستأجر (BACKFILL_RISK):**
   تنفيذ `UPDATE ... SET tenant_id = 1 WHERE tenant_id IS NULL` ممنوع منعاً باتاً حتى يتم إثبات أن بيئة Staging هي مستأجر واحد اصطناعي (`single-tenant synthetic`) أو وضع قاعدة مطابقة ورسم خرائط (`mapping rule`) آمنة لضمان عدم نقل سجلات مستأجرين آخرين بشكل خاطئ للمستأجر الرئيسي.

3. **خطر رؤية حماية RLS للجلسة (RLS_VISIBILITY_RISK):**
   بعد تفعيل فرض سياسة RLS بنجاح (`FORCE ROW LEVEL SECURITY`)، يجب إثبات واختبار أن سياق المستأجر `app.tenant_id` يتم ضبطه بدقة وبشكل صحيح في وقت التشغيل (`runtime`) لكل استعلام وقبل أي تفاعل مع قاعدة البيانات، وإلا فإن التطبيق قد يرى 0 صفوف صامتة (`fail-closed`).

4. **خطر فرادة قيود دفتر اليومية (GL_UNIQUE_RISK):**
   قبل تطبيق قيد الفرادة الفرعي (`unique constraint`) على `idempotency_key` لجدول `finance_journal_entries`، يجب تشغيل فحص سكوني للمكررات (`duplicate scan`) على بيئة Staging حصراً، واتخاذ قرار معتمد وواضح في حال وجود قيود مكررة مسبقاً لمنع فشل الفهرسة الفريدة.

---

## 5. الفحص والتحقق الرقمي (Static Verification Status)

- **وجود ملفات الهجرة P1:** نعم (`YES`)
- **وجود تقارير المعالجة P0/P1:** نعم (`YES`)
- **تشغيل أي أمر DDL أو تعديل قاعدة بيانات:** لا (`NO`)
- **جاهزية بيئة Staging للتطبيق التجريبي:** لا (`BLOCKED`) - توجد مخاطر مانعة تتطلب خطة تخفيف معتمدة.

---

## 6. حقول الإغلاق

```
FINAL_STATUS: STAGING_DDL_PREFLIGHT_COMPLETE_BLOCKING_RISKS_FOUND
ROOT_BRANCH: audit/phase-1-critical-remediation
ROOT_HEAD: d187c41d3dc7e863415273a7c96c997489fab1cb
ISOLATED_ROOT_PATH: ..\NamaMedical_isolated_root_6c418c
ISOLATED_NAMAWEB_PATH: ..\namaweb_isolated_p0p1_1fe349d
P1_MIGRATION_FILES_PRESENT: YES
P0P1_REPORTS_PRESENT: YES
STATIC_SQL_REVIEW_DONE: YES
SQL_STATIC_REVIEW_RESULT: BLOCKING_RISKS_FOUND
LOCKING_RISK: DETECTED_AccessExclusiveLock_ON_CORE_TABLES
BACKFILL_RISK: DETECTED_UPDATE_TENANT_ID_TO_1
APPLICATION_CONTEXT_RISK: FILTERED_BY_APP_TENANT_ID_FAIL_CLOSED
DDL_EXECUTED: NO
DB_TOUCHED: NO
MIGRATIONS_RUN: NO
PUSH_RUN: NO
PRODUCTION_TOUCHED: NO
SECRETS_PRINTED: NO
PHI_PRINTED: NO
SAFE_TO_PREPARE_STAGING_DDL_GATE: YES_WITH_RISK_MITIGATION_PLAN
SAFE_TO_RUN_STAGING_DDL_GATE: NO_UNTIL_RISK_MITIGATION_OR_EXPLICIT_RISK_ACCEPTANCE
NEXT_RECOMMENDED_ACTION: CREATE_STAGING_DDL_RISK_MITIGATION_PLAN_BEFORE_ANY_UP_VALIDATE
```
