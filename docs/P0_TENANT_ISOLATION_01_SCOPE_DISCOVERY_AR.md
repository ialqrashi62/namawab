# P0 عزل المستأجرين — 01 اكتشاف النطاق (Scope Discovery)

> المرحلة: `P0_TENANT_ISOLATION_GAP_REMEDIATION_AUTOPILOT` | التاريخ: 2026-06-20
> الفحص: قراءة فقط لـ `server.js` (371 مساراً) و`db_postgres.js` (148 جدولاً).

---

## 1. منهجية الاكتشاف

تم تصنيف كل مسار `requireAuth`-only وكل جدول حساس عبر تقاطع معطيين:
- **هل يحمل الجدول `tenant_id`؟** (من قائمة الـ 92 `ALTER TABLE ... ADD COLUMN tenant_id` في `db_postgres.js`).
- **هل يصفّي/يختم الـ handler بـ `tenant_id`؟** (فحص نص الاستعلام).

ينتج عن ذلك صنفان من الفجوات:

| الصنف | التعريف | خطر النشر | الإصلاح |
| ----- | ------- | --------- | ------- |
| **Class A** (فجوة مخطط + استعلام) | الجدول **بلا** `tenant_id` + الاستعلام لا يصفّي | يحتاج DDL (`ADD COLUMN`) قبل تفعيل الفلتر؛ نشر الكود وحده يكسر الإنتاج | كود + DDL متزامنان (نشر مُعتمَد) |
| **Class B** (فجوة استعلام فقط) | الجدول **يحمل** `tenant_id` (من الترحيل المجمّع) + لكن الاستعلام لا يصفّي/يختم | **آمن للنشر** (العمود موجود) | كود فقط |

> **اكتشاف جوهري**: الفجوة أوسع من الموديولات الخمسة المذكورة. عدة موديولات حديثة (telemedicine, pathology, social_work, mortuary, zatca...) **تحمل عمود `tenant_id`** لكن handlers لم تُحدَّث لتصفية/ختم المستأجر — فجوة Class B حيّة.

---

## 2. جدول النطاق

| الموديول | route/API | الجدول | الحالة الحالية | خطر التسريب | الأولوية | القرار |
| -------- | --------- | ------ | -------------- | ----------- | -------- | ------ |
| **السجلات الطبية** | `/api/medical-records/files\|requests\|coding` (4442-4480) | medical_records_files/requests/coding | requireAuth، لا tenant_id، لا فلتر | عالٍ (PII) | P0 | FIX_NOW (Class A) |
| **الصيدلية السريرية** | `/api/clinical-pharmacy/reviews\|education` (4483-4518) | clinical_pharmacy_reviews, patient_drug_education | requireAuth، لا tenant_id، لا فلتر | عالٍ (PII) | P0 | FIX_NOW (Class A) |
| **إعادة التأهيل** | `/api/rehab/patients\|sessions\|goals` (4521-4568) | rehab_patients/sessions/goals/assessments | requireAuth، لا tenant_id، لا فلتر | عالٍ (PII) | P0 | FIX_NOW (Class A) |
| **بوابة المرضى** | `/api/portal/users\|appointments` (4106-4129) | portal_users (Class A), portal_appointments (Class B) | requireAuth، portal_users بلا tenant_id | عالٍ (مصادقة+PII) | P0 | FIX_NOW |
| **التغذية** | `/api/dietary/*`, `/api/nutrition/*` (3762-3815) | diet_orders, diet_meals, nutrition_assessments | requireAuth، لا tenant_id، لا فلتر | متوسط-عالٍ (سريري) | P0 | FIX_NOW (Class A) |
| **بنك الدم** | `/api/blood-bank/*` (2488-2580) | blood_bank_units/donors/crossmatch/transfusions | requireAuth، لا tenant_id، لا فلتر | عالٍ (سريري، مرتبط بالمريض) | P0 | FIX_NEXT (Class A — الموجة 2) |
| **الموافقات/الباقات** | مسارات الموافقات | approvals, package_sessions | لا tenant_id | متوسط (مرتبط بالمريض) | P1 | FIX_NEXT (Class A — SQL مُعد) |
| **الطب عن بعد** | `/api/telemedicine/sessions` (4155-4173) | telemedicine_sessions (**به tenant_id**) | requireAuth، لا فلتر/ختم | عالٍ (PII) | P0 | FIX_NEXT (Class B — آمن للنشر) |
| **علم الأمراض** | `/api/pathology/cases` (4177-4195) | pathology_cases (**به tenant_id**) | requireAuth، لا فلتر/ختم | عالٍ (PII) | P0 | FIX_NEXT (Class B) |
| **الخدمة الاجتماعية** | `/api/social-work/cases` (4199-4217) | social_work_cases (**به tenant_id**) | requireAuth، لا فلتر/ختم | متوسط-عالٍ | P1 | FIX_NEXT (Class B) |
| **خدمة الوفيات** | `/api/mortuary/cases` (4221-4240) | mortuary_cases (**به tenant_id**) | requireAuth، لا فلتر/ختم | متوسط | P1 | FIX_NEXT (Class B) |
| **ZATCA** | `/api/zatca/*` (4133-4151) | zatca_invoices (**به tenant_id**) | requireAuth، لا فلتر/ختم | متوسط (مالي) | P1 | FIX_NEXT (Class B) |
| **الرسائل الداخلية** | `/api/messages` (4572-4604) | internal_messages | لا tenant_id؛ عزل بنموذج sender/receiver | متوسط (خصوصية) | P1 | NEEDS_RESEARCH (نموذج عزل مختلف) |
| مكافحة العدوى/الجودة/الصيانة/النقل/CME/CSSD/الكتالوجات | متعددة | بعضها به tenant_id (Class B)، CSSD/CME بلا | requireAuth، تصفية متفاوتة | منخفض-متوسط (PII أقل) | P2 | IMPROVE_LATER (الموجة 3) |

---

## 3. نطاق الإصلاح في هذه المرحلة

- **الموجة 1 (كود + SQL في هذه المرحلة)**: الموديولات الخمسة المسمّاة صراحةً — السجلات الطبية، الصيدلية السريرية، إعادة التأهيل، بوابة المرضى، التغذية (Class A، ~28 مساراً، 12 جدولاً).
- **الموجة 2 (SQL مُعد + موثّق للنشر القادم)**: بنك الدم، الموافقات، + Class B (telemedicine/pathology/social_work/mortuary/zatca).
- **الموجة 3 (متابعة لاحقة)**: الرسائل الداخلية (نموذج مختلف)، CSSD/CME/الجودة/الصيانة/النقل/مكافحة العدوى.

> القرار يلتزم بالـ Hard Stop: **لا DDL على الإنتاج** في هذه المرحلة. الكود + SQL يُجهّزان ويُختبران محلياً؛ النشر يحتاج موافقة منفصلة (Gate 9/10).

`P0_SCOPE_DISCOVERY_COMPLETE`
