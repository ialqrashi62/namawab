# تقرير الفحص المسبق لجاهزية الإنتاج لمنصة المنشآت (PHASE_FACILITY_PLATFORM_PRODUCTION_READINESS_PREFLIGHT_AR)

* **المشروع:** منصة نما الطبية (NamaMedical ERP)
* **المرحلة:** الفحص المسبق والتحضيري لبيئة الإنتاج (Preflight)
* **المستند:** تقرير الفحص المسبق وجاهزية بوابات الأمان المعتمد
* **الحالة الفنية:** معلق بانتظار استلام إقرار الـ DevOps وإجابات الاستبيان الميداني للإنتاج (`PRODUCTION_READINESS_PREFLIGHT_BLOCKED_OWNER_DEVOPS_ACTION_REQUIRED`) ⚠️

---

## 1. ملخص المراجعة الأمنية والتحقق النهائي (FINAL_STATUS)

* **القرار النهائي المعتمد للمرحلة (FINAL_STATUS):**
  * **`PRODUCTION_READINESS_PREFLIGHT_BLOCKED_OWNER_DEVOPS_ACTION_REQUIRED`**
* **العوائق الحالية المعلقة (BLOCKERS):**
  1. `BLOCKED_PRODUCTION_READONLY_PREFLIGHT_ACCESS_REQUIRED` (الحاجة لتعبئة وإقرار حزمة مطابقة الإنتاج read-only).
  2. `BLOCKED_RESTORABLE_PRODUCTION_BACKUP_REQUIRED` (الحاجة لتوفير إثبات نسخ احتياطي رسمي pg_dump قابل للاستعادة قبل النشر).
  3. `BLOCKED_DB_SERVER_TEST_GAP_DECISION_REQUIRED` (الحاجة لقرار المالك بخصوص فجوة الـ 48 اختباراً متخطياً).

---

## 2. تفاصيل بوابات الفحص والتحضير (Safety Gateways)

* **هل لُمِس الإنتاج في هذه المرحلة؟ (PRODUCTION_TOUCHED):** `NO` ❌ (معزول تماماً ومؤمن).
* **هل تم تنفيذ نشر (Deploy)؟:** `NO` ❌
* **هل نُفّذ DDL؟** `NO` ❌
* **هل نُفّذ migration؟** `NO` ❌
* **حالة الالتزام والفرع (Commit Metadata):**
  * **مستودع الكود الرئيسي (Root Repo):** الفرع `ops/jumanasoft-enterprise-facility-platform-staging-prep` (الالتزام الحالي HEAD)
  * **المستودع الفرعي (Submodule Repo):** الفرع `integration/all-epics` | الالتزام `b44fb1abfdff0a4c6d9cb41d23d97fad06e62f49`

---

## 3. تفصيل متطلبات وعوائق ما قبل النشر (Pre-deployment Requirements)

### أ. متطلبات النسخ الاحتياطي القابل للاستعادة (Restorable Backup Requirement)
* **القاعدة الحاكمة:** يُشترط صراحة تنفيذ الإجراء التالي قبل النشر:
  `RESTORABLE_PG_DUMP_BACKUP_REQUIRED_BEFORE_PRODUCTION_DEPLOY`
* **المطلوب توثيقه من DevOps:**
  * backup taken? (YES/NO)
  * backup type (e.g. pg_dump)
  * timestamp
  * restore verification? (YES/NO)
  * storage location classified (not printed if sensitive)
  * owner/devops attestation

### ب. فجوة الاختبارات لـ DB/Server (Test Gap Decision)
* **المشكلة:** تم تشغيل 101 اختباراً محلياً بنجاح وتخطّي 48 اختباراً تتطلب قاعدة بيانات نشطة.
* **الخيارات المتاحة للمالك لاتخاذ القرار:**
  * **الخيار A:** `OWNER_APPROVES_RUN_DB_SERVER_TEST_SUITE_BEFORE_PRODUCTION: YES`
  * **الخيار B:** `OWNER_ACCEPTS_DB_SERVER_TEST_GAP_RISK_FOR_CONTROLLED_DEPLOY: YES`

### ج. خطة تراجع الطوارئ الكاملة (Comprehensive Rollback Plan)
لا تعتمد خطة التراجع على إسقاط الجداول فقط، بل تلتزم بالإجراءات المعززة التالية:
1. **معايير الإلغاء الفوري (Abort Criteria):** التوقف وإلغاء النشر فوراً في حال حدوث بطء في الاستجابة، أو فشل جزئي في الـ DDL، أو تعذر إقلاع الخادم.
2. **إيقاف الميزات البرمجية (Disable Feature/Navigation):** إمكانية إيقاف عرض المنشآت وحجب محدد المدن الطبية برمجياً من لوحة التحكم في حال حدوث مشكلات بعد النشر مع الحفاظ على بقية ميزات ERP نشطة.
3. **حظر الكتابة للجديد:** وقف كامل لمعاملات الكتابة لقاعدة البيانات للجداول الـ 17 المنشأة حديثاً لحين معالجة الخلل.
4. **حماية بيانات الإنتاج الفعلي:** يمنع تماماً تنفيذ أي أمر `DROP` يستهدف جداول أو بيانات إنتاجية مخزنة مسبقاً إلا بموجب موافقة صريحة مكتوبة من المالك.
5. **فحوصات التراجع السريعة (Rollback Smoke Checks):** فحص صلاحية إقلاع الموقع والوصول لرابط الصحة العام `/api/health` للتأكد من استقرار الخدمة بعد التراجع.

---

## 4. الخطوات التالية المسموحة
* **الخطوة التالية المسموحة (NEXT_ALLOWED_ACTION):** `OWNER_DEVOPS_PROVIDE_PRODUCTION_READONLY_EVIDENCE_BACKUP_AND_TEST_GAP_DECISION` (بانتظار تزويدنا بإجابات استبيان مطابقة الإنتاج read-only وتعبئة خيارات النسخ الاحتياطي وفجوة الاختبارات).
