# تقرير مراجعة الملفات غير المتتبعة في الجذر (Root Untracked Files Review)

* **المشروع:** منصة نما الطبية (NamaMedical ERP)
* **المرحلة:** نظافة المستودع الأب وإغلاق حجب بيئة الاختبار (PHASE_ROOT_REPOSITORY_HYGIENE_AND_STAGING_BLOCKER_CLOSEOUT)
* **الحالة:** تم فحص كافة الملفات وتأكيد خلوها من الأسرار والـ PHI (Approved - Clear of Secrets)

---

## 1. تصنيف وتقييم الملفات غير المتتبعة

تم فحص محتوى كل ملف غير متتبع في جذر المشروع لتحديد طبيعته ومدى احتوائه على معلومات حساسة:

| اسم الملف | نوع الملف وتصنيفه | يحتوي على أسرار/PHI؟ | القرار البرمجي |
| :--- | :--- | :---: | :--- |
| `out.txt` | ملف نصي مؤقت (Temporary Artifact) | لا 🟢 | حذف (Should Delete) |
| `script.py` | سكربت تجريبي (Generated Scratch) | لا 🟢 | حذف (Should Delete) |
| `test.py` | سكربت تجريبي (Generated Scratch) | لا 🟢 | حذف (Should Delete) |
| `test.txt` | ملف نصي فارغ (Temporary Artifact) | لا 🟢 | حذف (Should Delete) |
| `write_report.py` | سكربت تجريبي (Generated Scratch) | لا 🟢 | حذف (Should Delete) |

---

## 2. مراجعة وتصنيف ملفات مجلد الحوكمة في الجذر

يحتوي المجلد `docs/governance/enterprise-hospital-platform/` في جذر المشروع على وثائق الحوكمة الخاصة بالمراحل السابقة للأقسام الطبية، وتم تصنيفها كالتالي:

* **وثائق فريدة للمراحل السابقة (يجب الالتزام بها في الجذر لحفظ التاريخ):**
  * `DEPARTMENT_WORKSPACE_TEST_REPORT_AR.md` (تقرير اختبارات أقسام العيادات) -> **التزام (Should Commit)**.
  * `DEPARTMENT_WORKSPACE_UI_REPORT_AR.md` (تقرير واجهة أقسام العيادات) -> **التزام (Should Commit)**.
  * `FACILITY_CATALOG_REFACTOR_REPORT_AR.md` (تقرير إعادة هيكلة دليل المرافق) -> **التزام (Should Commit)**.
  * `FACILITY_SWITCHER_HARDENING_REVIEW_AR.md` (تقرير تحصين منتقي المرافق) -> **التزام (Should Commit)**.
  * `PHASE_DEPARTMENT_WORKSPACE_CORE_PREFLIGHT_AR.md` (التحقق المسبق للأقسام) -> **التزام (Should Commit)**.
  * `PHASE_DEPARTMENT_WORKSPACE_CORE_IMPLEMENTATION_AR.md` (تنفيذ أقسام العيادات) -> **التزام (Should Commit)**.
  * `PHASE_DEPARTMENT_WORKSPACE_CORE_CLOSEOUT_AR.md` (إغلاق مرحلة الأقسام) -> **التزام (Should Commit)**.
  * `SECRET_REDACTION_TEST_REVIEW_AR.md` (مراجعة اختبار حجب الأسرار) -> **التزام (Should Commit)**.

* **وثائق مكررة أو مسودات قصيرة (موجودة بنسخ كاملة داخل namaweb):**
  * `EXISTING_CLINICAL_ORDERS_CAPABILITY_REVIEW_AR.md` (نسخة مسودة 21 بايت) -> **حذف (Should Delete)** لتجنب التكرار والتعارض مع النسخة الكاملة (1.2 كيلوبايت) داخل `namaweb`.
  * `PHASE_CLINICAL_ORDERS_PREFLIGHT_AR.md` (نسخة مسودة 123 بايت) -> **حذف (Should Delete)** لتجنب التكرار والتعارض مع النسخة الكاملة (836 بايت) داخل `namaweb`.

---
**الخلاصة:** جميع الملفات خالية تماماً من أي كلمات مرور أو معلومات اتصال حية أو بيانات مرضى حقيقية (PHI)، وهي جاهزة للتنظيف الآمن.
