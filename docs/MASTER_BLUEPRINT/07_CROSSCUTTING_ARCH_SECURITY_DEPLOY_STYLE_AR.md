# 07 — المعمارية + الأمن + النشر + Design System + i18n + Seeders + Migrations

## 1) Architecture (المعمارية)
**الحالية:** Monolith Node/Express (`server.js`) + SPA عميل (`public/js/app.js` ~11k سطر + `admin.js`) + PostgreSQL 16 (`nama_medical_web`) + Redis (جلسات) + PM2 (`nama-app`) على single-box win32، خلف nginx (دومين عام jumanasoft.com).
```
[Browser SPA] —https—> [nginx] —> [Express (PM2 nama-app)] —RLS—> [PostgreSQL native]
                                          │
                                          ├─> [Redis: sessions]
                                          ├─> [crypto_envelope (DPAPI KEK / Vault مستقبلاً)]
                                          └─> [FHIR/HL7/DICOM/NPHIES/ZATCA — gated integrations]
```
**طبقات منطقية:** Presentation (SPA) · API/Controller (Express routes) · Domain (per-module logic) · Data (pool.query + RLS wrapper + AsyncLocalStorage tenant binding) · Integration (FHIR/HL7/DICOM/NPHIES/ZATCA).
**توصيات تطوّر:**
- فصل العميل (SPA) إلى modular bundles بدل ملف 11k سطر (قابلية صيانة) + إزالة inline handlers تدريجياً (يخدم CSP enforcing).
- طبقة خدمات (service layer) لكل domain + DTO/validation موحّد.
- **multi-facility** (مدينة طبية): `parent_facility_id` + تقارير مجمّعة.
- مستقبلاً: استخراج خدمات ثقيلة (LIS/PACS/الفوترة) عند الحاجة (ليس الآن — monolith كافٍ).

## 2) Security Plan (خطة الأمن) — مبنية على المنشور فعلياً
**قائم ومنشور:** XSS Layer1+2 (ترميز إخراج شامل) · admin endpoint guards (403) · auth hardening (لا كلمات مرور افتراضية، mfaConsume، fail-fast للأسرار) · HTTP perimeter (CORS allowlist، CSRF Origin-check، CSP Report-Only، Permissions-Policy) · RLS (150 FORCE policy، tenant binding) · A3 at-rest (AES-256-GCM + DPAPI KEK) · KEK escrow (DR مُغلق) · PHI download محمي.
**خارطة الطريق:**
- **RBAC matrix** كامل (دور×صلاحية) + per-user permissions enforcement.
- **CSP enforcing** بعد إزالة/تهريب inline handlers (code-readiness قائم: report endpoint + CSP_ENFORCE flag).
- **CSRF tokens** (وضع صارم) فوق Origin-check.
- **PDPL:** تصنيف بيانات + موافقات + حق الوصول/الحذف + سجلّ معالجة + إقامة البيانات (KSA).
- **Vault** لإدارة المفاتيح المركزية (staging مُثبت؛ production محجوب لعدم توفّر مضيف معزول).
- **break-glass** access موثّق + مراجعة دورية للصلاحيات + audit immutable.
- **التكاملات الخارجية gated** (NPHIES/ZATCA/PACS) حتى اعتماد المفاتيح الحقيقية.

## 3) Deployment Plan (خطة النشر)
**نمط قائم:** edit → `node --check` → tests → commit namaweb → push origin HEAD:main (FF) → advance parent gitlink → push origin HEAD:master (FF) → (عند الاعتماد) `pm2 restart nama-app`. **client static = live فور التحرير؛ server.js = خامل حتى restart.**
**بيئات موصاة:** dev (محلي) → **staging (مضيف معزول)** → production. **توصية حرجة (درس مثبت):** عمليات Docker الثقيلة قد ترتدّ Docker Desktop وتُسقط nama-redis + تعيد تشغيل التطبيق على single-box → افصل sandbox/Vault على مضيف منفصل أو نافذة صيانة.
**Auto-recovery قائم:** PM2 logon-resurrect + 5-min health watchdog + Redis unless-stopped.
**خطوات نشر منشأة جديدة:** onboarding wizard (08) → provision tenant → seed مرجعيات → تفعيل وحدات النمط → اختبار smoke → تسليم Admin.
**Rollback:** git checkout للملف السابق + pm2 restart (للخادم)؛ للعميل (static) استبدال ذرّي للملف.

## 4) Style Guide / Design System
- **الهوية:** طبي/نظيف؛ ألوان أساسية (primary أزرق طبي + accent) عبر CSS variables (`--primary`, `--hover`, `--text`...) — قائمة. دعم theme فاتح/داكن.
- **الطباعة:** IBM Plex Sans Arabic (ع) + IBM Plex Sans (EN) — قائم (Google Fonts، مغطّاة في CSP).
- **RTL/LTR:** تبديل حسب `isArabic`؛ `direction:rtl` للعربية.
- **المكوّنات الموحّدة:** `makeTable`/`createTable` (جداول مُهرّبة)، `statusBadge`/`badge`، `showModal`، `showToast`، `escapeHTML`/`rawHtml`/`safeId`/`safeUrl`/`jsStr` (helpers أمان قائمة).
- **الأنماط:** بطاقات/شارات حالة بألوان دلالية (أخضر/أصفر/أحمر)، أزرار (primary/secondary/danger/success)، نماذج (form-input).
- **التوصية:** توثيق catalog مكوّنات (component library) + tokens + إزالة inline styles تدريجياً (يخدم CSP) + إرشادات a11y (تباين/تركيز/ARIA).

## 5) i18n (التدويل)
- **الآلية القائمة:** `tr(en, ar)` لكل نص؛ `isArabic` من localStorage. **القاعدة:** لا نص مكتوب مباشرة — كله عبر `tr()`.
- **التوصية:** استخراج المفاتيح إلى ملفات موارد `i18n/ar.json` + `i18n/en.json` (key→string) بدل تضمين الزوج في كل استدعاء (قابلية ترجمة + إضافة لغات).
```json
// i18n/ar.json (نموذج)
{ "nav.dashboard": "لوحة التحكم", "nav.patients": "المرضى", "btn.save": "حفظ",
  "lab.critical": "قيمة حرجة", "consent.title": "إقرار موافقة", "common.loading": "جارٍ التحميل" }
// i18n/en.json
{ "nav.dashboard": "Dashboard", "nav.patients": "Patients", "btn.save": "Save",
  "lab.critical": "Critical Value", "consent.title": "Consent Form", "common.loading": "Loading" }
```
- دعم تنسيق التواريخ/الأرقام/العملة (ar-SA) + RTL كامل + الهجري/الميلادي.

## 6) Sample Data / Seeders (بيانات أولية)
> تُولَّد ضمن onboarding حسب النمط، **بلا PHI حقيقي** (بيانات وهمية). أمثلة:
- **roles/permissions:** Admin/Doctor/Nurse/LabTech/Pharmacist/Reception/Finance/Insurance + مصفوفة صلاحيات.
- **chart_of_accounts:** CoA معياري (أصول/خصوم/إيراد/مصروف) — مُرشَّح سابقاً (63/63).
- **chargemaster:** خدمات/فحوص شائعة + LOINC/CPT + سعر مبدئي.
- **drug_master:** قائمة أدوية SFDA مختصرة + formulary.
- **consent_templates:** قوالب موافقة (عملية/تخدير/نقل دم) ع/EN.
- **departments/wards/beds:** هيكل افتراضي حسب النمط (مستشفى: أجنحة+أسرّة؛ مستوصف: عيادات).
- **lab_tests/rad_exams catalog:** الفحوص الشائعة + نطاقات طبيعية.
- **demo patients (وهميون):** للـdev/staging فقط — **لا تُحمَّل في production** (نمط قائم: production يتخطّى seed).

## 7) Migration Scripts (سكربتات الترحيل)
> منهج: migrations مُرقّمة، كل واحدة up/validate/down، تعمل ضمن transaction، **idempotent**، tenant-aware. **DDL يُنفَّذ ببوابة DB مخصّصة فقط** (لا في هذه الحزمة).
```
migrations/
  0001_core_tenants_facilities.sql        (tenants, facilities, facility_modules, system_users, roles, permissions)
  0002_patients_visits_encounters.sql     (+ RLS + tenant_id + indexes)
  0003_orders_cpoe.sql                    (orders, order_items, order_sets, clinical_notes, problems)
  0004_lab_lis.sql                        (lab_orders/samples/results + loinc_map + qc)
  0005_rad_ris_pacs.sql                   (rad_orders/exams/reports + dicom_studies)
  0006_pharmacy.sql                       (prescriptions, dispense, drug_master, drug_batches[FEFO])
  0007_nursing_mar.sql                    (assessments, mar, care_plans, vitals, scores)
  0008_er_adt_icu.sql                     (er_visits/triage, admissions/beds/transfers, icu_flowsheets/scores)
  0009_surgery_blood_consent.sql          (or_schedule/surgeries/checklist, blood_units/crossmatch, consent)
  0010_finance_insurance_zatca.sql        (invoices, chargemaster/price_versions, claims[NPHIES], zatca_invoices, GL)
  0011_ops_quality_hr.sql                 (inventory/po/grn, cssd, dietary, infection, incidents/capa, assets/wo, employees/licenses)
  0012_indexes_rls_audit.sql              (tenant_id indexes الكل, FORCE RLS policies, audit_log)
```
- كل migration: `BEGIN; <DDL>; <RLS>; <indexes>; COMMIT;` + ملف `_validate.sql` (تحقّق) + `_down.sql` (تراجع).
- التطبيق على القائم: الجداول الموجودة (patients/visits/lab/rad/...) تُحاذى تدريجياً (ALTER آمنة) بدل إعادة الإنشاء.
- **الترقية ذات الأولوية:** فهرسة `tenant_id` على كل الجداول (gated سابقاً 59/147 → الكل) + `facility_modules` من DB بدل ثابت `FACILITY_ALLOWED`.

## 8) المخرجات المتبقّية (إفصاح)
- **User Manual:** يُولَّد per-role (دليل استخدام مصوّر بالخطوات) — هيكل جاهز per-module من سيناريوهات 02/03.
- **Training Videos:** **سكربت/storyboard** نصّي per-module (لا فيديو فعلي ينتجه الوكيل).
- **Legal & Compliance:** هيكل + بنود مرجعية (PDPL/NPHIES/CBAHI/ZATCA/MOH) — **يحتاج مراجعة قانونية بشرية**.

> هذه الحزمة (00–08) = Master Blueprint كامل: منهجية + جرد 43 وحدة + ويزرد التهيئة + مواصفات كل قسم (gap/prompt/scenario/dataflow) + ERD + OpenAPI + قصص/اختبار + معمارية/أمن/نشر/design/i18n/seeders/migrations. الخطوة التالية: تحويل P0 إلى تذاكر تنفيذ، أو إطلاق Workflow متعدّد الوكلاء لتوسيع كل مخرج (ERD→DDL، OpenAPI→كل المسارات، user manual per-role) بالتوازي.
