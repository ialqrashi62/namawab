# خطة تخفيف مخاطر تشغيل DDL على Staging (STAGING_DDL_RISK_MITIGATION_PLAN)

**المشروع:** NamaMedical / الطبيب
**الفرع:** `audit/phase-1-critical-remediation`
**رأس التزام الجذر الحالي (ROOT HEAD):** `d187c41d3dc7e863415273a7c96c997489fab1cb`
**التاريخ:** 2026-06-27
**النوع:** خطة تخفيف وإجراءات وقائية محاسبية وأمنية — تحليل سكوني وتصميم فقط — لا تنفيذ DDL — لا اتصال بقاعدة البيانات

---

## 1. مقدمة
بناءً على نتائج تقرير `STAGING_DDL_PREFLIGHT_ONLY_REPORT_AR.md` الذي كشف عن وجود 4 مخاطر مانعة (Blocking Risks) تعيق التشغيل المباشر لملفات الهجرة الخاصة بالـ RLS ومنع التكرار المالي على بيئة Staging، تم إعداد هذه الخطة لتخفيف وتجاوز هذه المخاطر قبل الحصول على موافقة التشغيل الفعلي.

---

## 2. إجراءات تخفيف المخاطر الأربعة

### 2.1 تخفيف خطر الإغلاق الحصري (LOCKING_RISK Mitigation)
عملية `ALTER TABLE ... ADD COLUMN` و `ALTER TABLE ... ALTER COLUMN SET NOT NULL` بالإضافة إلى `UPDATE` على الجداول الأساسية (`patients`, `invoices`, `appointments`, `medical_records`) تتطلب قفلاً حصرياً (`AccessExclusiveLock`) مما يعيق أي عمليات قراءة أو كتابة متزامنة.

*   **الإجراء التخفيفي في Staging:**
    1.  يتم إيقاف خادم التطبيق مؤقتاً أثناء التشغيل لمنع تراكم الطلبات (Connection Queue Timeout).
    2.  تؤخذ لقطة احتياطية كاملة (`Staging DB Snapshot`) قبل تشغيل الهجرة مباشرة لاستعادتها فوراً في حال حدوث فشل أو قفل ميت (Deadlock).
    3.  يتم تشغيل الهجرة في فترة خمول تام للأنشطة الاختبارية.

---

### 2.2 تخفيف خطر التحديث التلقائي للمستأجر (BACKFILL_RISK Mitigation)
افتراض تشغيل `UPDATE ... SET tenant_id = 1 WHERE tenant_id IS NULL` قد يؤدي إلى خلط سجلات المستأجرين في حال كانت قاعدة Staging تحتوي على مستأجرين متعددين.

*   **الإجراء التخفيفي في Staging:**
    1.  قبل تشغيل الهجرة، يتم التحقق سكونياً من توزيع البيانات الحالية عبر الاستعلام التالي (يُنفّذ عند تفعيل بوابة الـ DB):
        ```sql
        SELECT tenant_id, COUNT(*) FROM patients GROUP BY tenant_id;
        ```
    2.  إذا تبين وجود مستأجرين آخرين بقيم غير `1` أو قيم فارغة، يتم تعديل الهجرة لاستخدام جدول رسم خرائط (`mapping rules`) بناءً على المنشأة (`facility_id`) أو الفرع لضمان توزيع السجلات بشكل سليم بدلاً من التحديث الأعمى إلى المستأجر 1.

---

### 2.3 تخفيف خطر رؤية حماية RLS للجلسة (RLS_VISIBILITY_RISK Mitigation)
بعد تفعيل `FORCE ROW LEVEL SECURITY`، أي استعلام يتم تنفيذه دون وضع `app.tenant_id` في الجلسة سيرجع 0 صفوف صامتة مما قد يعطل لوحة التحكم أو يعطي انطباعاً خاطئاً بفقدان البيانات.

*   **الإجراء التخفيفي في Staging:**
    1.  التأكد من أن سياق اتصال التطبيق بقاعدة البيانات يقوم بتهيئة الجلسة بشكل إلزامي.
    2.  مراجعة منطق سياق المستأجر في الملف `server.js` للتأكد من أن جميع الاستعلامات للجداول الأربعة تتم عبر معاملات (Transactions) يُنفّذ في بدايتها:
        ```javascript
        await client.query("SET LOCAL app.tenant_id = $1", [tenantId]);
        ```
    3.  إجراء اختبارات فحص تكامل مغلقة (Integration Test Cases) للتأكد من فحص الهوية والوصول للمستأجر قبل تمرير الاستعلام.

---

### 2.4 تخفيف خطر فرادة قيود دفتر اليومية (GL_UNIQUE_RISK Mitigation)
إضافة فهرس فريد جزئي `uq_fje_tenant_idempotency` على جدول `finance_journal_entries` قد تفشل في حال وجود قيود يومية مكررة تحمل نفس مفتاح التكرار مسبقاً على Staging.

*   **الإجراء التخفيفي في Staging:**
    1.  قبل تشغيل DDL، يتم تشغيل استعلام كشف التكرار التالي:
        ```sql
        SELECT tenant_id, idempotency_key, COUNT(*)
        FROM finance_journal_entries
        WHERE idempotency_key IS NOT NULL
        GROUP BY tenant_id, idempotency_key
        HAVING COUNT(*) > 1;
        ```
    2.  في حال العثور على مكررات مسبقة، يتم تنظيفها أو أرشفة السجلات المكررة يدوياً، أو تحديث مفتاح التكرار الخاص بها ليكون فريداً قبل تطبيق الفهرس لمنع فشل الهجرة.

---

## 3. حقول الإغلاق للخطة

```
FINAL_STATUS: STAGING_DDL_RISK_MITIGATION_PLAN_PREPARED
ROOT_BRANCH: audit/phase-1-critical-remediation
ROOT_HEAD: d187c41d3dc7e863415273a7c96c997489fab1cb
LOCK_MITIGATION_STRATEGY: APP_SHUTDOWN_AND_SNAPSHOT
BACKFILL_MITIGATION_STRATEGY: DATA_PRE_CHECK_AND_MAPPING_RULE
RLS_CONTEXT_VERIFICATION: MANDATORY_SET_LOCAL_IN_TX
GL_DUPLICATE_CHECK_QUERY: DEFINED
DB_TOUCHED: NO
DDL_RUN: NO
MIGRATIONS_RUN: NO
PUSH_RUN: NO
PRODUCTION_TOUCHED: NO
REPORT_FILE: docs/governance/enterprise-engineering-constitution/STAGING_DDL_RISK_MITIGATION_PLAN_AR.md
NEXT_RECOMMENDED_ACTION: OWNER_APPROVAL_TO_COMMIT_ALL_HYGIENE_AND_PREFLIGHT_REPORTS
```
