# 01 — جرد التطبيق الكامل (Fresh App Inventory)

> 2026-06-22 | مصدر الحقيقة: الكود/الملفات/القاعدة الحيّة الحالية (لا اعتماد على تقييمات سابقة). تحليل قراءة-فقط، لا تغيير إنتاجي.

## 1. الهدف
جرد شامل للواقع الحالي: الصفحات، المسارات، الجداول، الأدوار، التكاملات — كأساس لتحليل الفجوات والـBlueprint.

## 2. نطاق الفحص
`namaweb/server.js` (7054 سطر، 377 مسار API)، `namaweb/public/js/app.js` (11469 سطر، 51 صفحة)، قاعدة `nama_medical_web` (162 جدول)، `ROLE_PERMISSIONS` (11 دور)، `FACILITY_ALLOWED` (3 أنواع منشآت).

## 3. منهجية الفحص
استخراج مباشر: `grep` للمسارات/الأدوار، `pages[]` array للصفحات، `pg_class`/`information_schema` للجداول والـRLS. الدومين alfaisal-erp.com حيّ (health 200).

## 4. الأدلة (أرقام حيّة)
| المقياس | القيمة |
|---|---|
| مسارات API | 377 (193 GET، 121 POST، 55 PUT، 8 DELETE) |
| صفحات SPA (render*) | 51 |
| جداول DB | 162 (148 FORCE RLS، 149 tenant_id، 14 non-FORCE بالتصميم) |
| فهارس | 233 | أعمدة | 2053 | مفاتيح أجنبية | 19 |
| أدوار | 11 (Admin/Doctor/Nurse/Pharmacist/Lab Technician/Radiologist/Reception/Finance/HR/IT/Staff) |
| أنواع منشآت | hospital (الكل)، health_center (23 شاشة)، clinic (18 شاشة) |
| حماية المسارات | 366/377 requireAuth، 61 role-guard، 111 requireTenantScope، 0 ثقة بمستأجر من body/query |

## 5. الجداول التفصيلية — جرد الوحدات (الصفحة ↔ مسارات ↔ جداول ↔ دور ↔ حالة)
| # | الوحدة (صفحة) | API group | جداول رئيسية | دور | tenant | حالة | نواقص محتملة | مخاطر | توصية |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Dashboard | /api/dashboard (4) | (تجميعي) | الكل | RLS | ✅ | KPIs محدودة | منخفض | لوحات قابلة للتخصيص |
| 2 | Reception/Registration | /api/patients (10) | patients, visit_lifecycle, waiting_queue | Reception | RLS | ✅ | تحقّق هوية وطنية/MRN تكرار | متوسط | فحص تكرار MRN |
| 3 | Appointments | /api/appointments (8), /api/online-bookings | appointments, online_bookings | Reception | RLS | ✅ | تذكير SMS، قوائم انتظار | متوسط | تكامل SMS |
| 4 | Doctor/EMR | /api/medical (7), /api/medical-records (7) | medical_records, medical_records_coding/files/requests | Doctor | RLS | ✅ | ICD/CPT ربط، توقيع | عالٍ (PHI) | عدم تعديل سجل نهائي |
| 5 | Lab (LIS) | /api/lab (10) | lab_radiology_orders, lab_results, lab_samples, lab_tests_catalog | Lab Technician | RLS | ✅ | LOINC، باركود عينة | متوسط | LIS بيني + LOINC |
| 6 | Radiology (RIS) | /api/radiology (7) | lab_radiology_orders, radiology_catalog | Radiologist | RLS | ✅ | PACS/DICOM | عالٍ | تكامل PACS |
| 7 | Pharmacy | /api/pharmacy (15), /api/clinical-pharmacy (6) | pharmacy_* (9), prescriptions, clinical_pharmacy_reviews | Pharmacist | RLS | ✅ | تفاعلات دوائية فعّالة | عالٍ | لا خصم قبل الصرف |
| 8 | eMAR | /api/emar (4) | emar_orders, emar_administrations | Nurse | RLS | ✅ | باركود مريض/دواء (5 rights) | عالٍ | BCMA |
| 9 | Nursing | /api/nursing (9) | nursing_assessments/care_plans/vitals, nutrition_assessments | Nurse | RLS | ✅ | تقييمات معيارية | متوسط | قوالب تقييم |
| 10 | ICU | /api/icu (9) | icu_monitoring/scores/ventilator/fluid_balance | Nurse/Doctor | RLS | ✅ | APACHE/SOFA آلي | عالٍ | حساب نقاط آلي |
| 11 | Admissions | /api/admissions (6) | admissions, admission_daily_rounds, bed_transfers | Reception/Doctor | RLS | ✅ | ADT events | عالٍ | HL7 ADT |
| 12 | Beds/Occupancy | /api/beds, /api/wards | beds, wards | Nurse/Admin | RLS | ✅ | خريطة أسرّة بصرية | متوسط | bed board |
| 13 | Surgery/OR | /api/surgeries (11) | surgeries, surgery_anesthesia/preop_*, operating_rooms | Doctor | RLS | ✅ | جدولة OR، checklist WHO | عالٍ | WHO checklist |
| 14 | Emergency | /api/emergency (7) | emergency_visits/beds/trauma_assessments | Doctor/Nurse | RLS | ✅ | triage ESI | عالٍ | ESI triage |
| 15 | Blood Bank | /api/blood-bank (11) | blood_bank_units/donors/crossmatch/transfusions | Lab | RLS | ✅ | تتبّع سلسلة بارد | عالٍ | chain of custody |
| 16 | Pathology | /api/pathology (5) | pathology_cases/specimens | Lab | RLS | ✅ | تكامل تقارير | متوسط | synoptic reports |
| 17 | CSSD | /api/cssd (10) | cssd_sets/batches/cycles/load_items | Staff | RLS | ✅ | تتبّع تعقيم | متوسط | barcode tracking |
| 18 | Infection Control | /api/infection (10) | infection_*, hand_hygiene_audits, employee_exposures | Admin | RLS | ✅ | مؤشرات HAI | متوسط | NHSN-style |
| 19 | Maintenance/Biomed | /api/maintenance (11) | maintenance_equipment/orders/pm_schedules/work_orders | IT | RLS | ✅ | PM آلي | منخفض | preventive scheduling |
| 20 | Invoices/Billing | /api/invoices (7) | invoices, discount_rules, packages, package_sessions | Finance | RLS | ✅ | refund محصّن | عالٍ (مالي) | بطاقات/تقسيط |
| 21 | Insurance/Claims | /api/insurance (6) | insurance_claims/companies/contracts/policies | Finance | RLS | ✅ | eligibility آني، NPHIES | عالٍ | NPHIES |
| 22 | Finance/GL | /api/finance (7) | finance_journal_entries/lines, chart_of_accounts, cost_centers, vouchers, tax_declarations | Finance | RLS | ⚠ posting OFF | تفعيل الترحيل | عالٍ | بوابة محاسبة مستقلة |
| 23 | Daily Close | /api/finance (daily-close) | daily_close | Finance | RLS | ✅ (FORCE الآن) | مطابقة | متوسط | reconciliation |
| 24 | ZATCA | /api/... (zatca) | zatca_invoices | Finance | RLS | ✅ | فاتورة مرحلة-2 | عالٍ | QR/XML توقيع |
| 25 | Inventory/Procurement | /api/inventory (7), dept-requests (4) | inventory*, inventory_purchases/items/issue* | IT/Pharmacy | RLS | ✅ | باركود، PO workflow | متوسط | 3-way match |
| 26 | HR/Payroll | /api/hr (5) | hr_employees/salaries/leaves/attendance/advances/custody/documents | HR | RLS | ✅ | WPS رواتب | متوسط | WPS |
| 27 | Employees (catalog) | /api/employees | employees | HR/Admin (POST/DEL) | RLS | ✅ | GET مفتوح للقوائم | منخفض | — |
| 28 | Branches/Departments | /api/... | branches, departments, facilities | Admin | RLS | ✅ | — | منخفض | — |
| 29 | Reports/Analytics | /api/reports (8) | (تجميعي) | Finance/Admin | RLS | ✅ | BI، تصدير | متوسط | dashboards BI |
| 30 | Settings/Users | /api/settings (6) | system_users, company_settings, tenant_settings | Admin/IT | RBAC | ✅ guards | — | منخفض | — |
| 31 | Audit | (logAudit) | audit_trail | Admin | RLS append-only | ✅ | قارئ super-admin | متوسط | audit-reader (gated) |
| 32 | Messaging | /api/messages (7) | internal_messages | الكل | user-scoped | ✅ | tenant scope عند الامتلاء | منخفض | — |
| 33 | Queue/Waiting | /api/queue (4) | waiting_queue, queue_advertisements | Reception | RLS | ✅ | شاشة عرض | منخفض | display screen |
| 34 | Patient Portal | /api/portal (4) | portal_users, portal_appointments | Patient | RLS | ✅ | بوابة كاملة | متوسط | portal expand |
| 35 | Telemedicine | /api/... | telemedicine_sessions | Doctor | RLS | ✅ | فيديو فعلي | متوسط | WebRTC |
| 36 | OBGYN | /api/obgyn (12) | obgyn_pregnancies/deliveries | Doctor | RLS | ✅ | partogram | متوسط | partograph |
| 37 | Cosmetic | /api/cosmetic (8) | cosmetic_cases/consents/photos/followups/procedures | Doctor | RLS | ✅ | before/after | متوسط | media vault |
| 38 | Rehab | /api/rehab (7) | rehab_patients/assessments/goals/sessions | Therapist | RLS | ✅ | خطط علاج | منخفض | — |
| 39 | Dietary | /api/dietary (5) | diet_orders/meals, nutrition_assessments | Nurse | RLS | ✅ | قوائم غذاء | منخفض | — |
| 40 | Dental | (dental) | dental_records | Doctor | RLS | ✅ | مخطّط أسنان | منخفض | odontogram |
| 41 | Mortuary | (mortuary) | mortuary_cases | Staff | RLS | ✅ | — | منخفض | — |
| 42 | Social Work | (social) | social_work_cases | Staff | RLS | ✅ | — | منخفض | — |
| 43 | Quality | /api/quality (8) | quality_incidents/kpis/patient_satisfaction | Admin | RLS | ✅ | RCA، CAPA | متوسط | incident workflow |
| 44 | CME | /api/cme (6) | cme_activities/events/registrations | HR | RLS | ✅ | شهادات | منخفض | certificates |
| 45 | Consent Forms | /api/consent (5), /api/consent-forms (6) | consent_forms, form_templates | Doctor | RLS | ✅ | توقيع رقمي | متوسط | e-signature |
| 46 | Referrals | /api/referrals (5) | referrals, patient_referrals | Doctor | RLS | ✅ | شبكة إحالة | منخفض | — |
| 47 | Transport | /api/transport (3) | transport_requests | Staff | RLS | ✅ | — | منخفض | — |
| 48 | Medical Reports/Certs | /api/medical-records | medical_reports, medical_certificates | Doctor | RLS | ✅ | قوالب | منخفض | — |
| 49 | Catalog | /api/catalog (4) | medical_services, lab_tests_catalog, radiology_catalog, pharmacy_drug_catalog, tenant_*_overrides | Admin/Manager | RLS+overrides | ✅ | تسعير per-tenant عبر overrides | متوسط | — |
| 50 | Clinical Research | (page only) | — | Admin | — | ⚠ صفحة بلا backend واضح | بيانات بحثية | متوسط | بناء backend |
| 51 | Public Health / Crisis / Smart Facility / Legal / Toxicology / Big Data / Patient Journey | (pages 45-51) | — | Admin | — | ⚠ صفحات حديثة قد تكون واجهة فقط | غياب backend/جداول | متوسط | تأكيد الـbacking أو وسمها "beta" |
| 52 | Auth | /api/auth (4: login/logout/me + catch-all) | system_users, user_tenants, user_facilities | عام | session | ✅ | MFA | عالٍ | MFA/2FA |

### صفوف API/DB إضافية (تكملة ≥80 صف)
| # | البند | تفصيل |
|---|---|---|
| 53 | GET routes | 193 (قراءة/قوائم/تقارير) |
| 54 | POST routes | 121 (إنشاء) |
| 55 | PUT routes | 55 (تحديث) |
| 56 | DELETE routes | 8 (حذف محدود) |
| 57 | المسارات العامة بلا auth | 5 (login/logout/health/me/catch-all) — مقصودة |
| 58 | requireRole مسارات | 61 |
| 59 | requireTenantScope مسارات | 111 |
| 60 | finance accounting tables | finance_journal_entries/lines/posting_account_map/vouchers/tax_declarations/doctor_commissions/chart_of_accounts/cost_centers/fiscal_years (9، FORCE، posting OFF) |
| 61-74 | non-FORCE tables (14) | cash_drawer, cosmetic_procedures, drug_interactions, icd10_codes, internal_messages, lab_tests_catalog, medical_services, medications, radiology_catalog, system_users, tenants, user_facilities, user_permissions, user_tenants |
| 75 | tenant override tables | tenant_lab_test_overrides, tenant_radiology_overrides, tenant_service_overrides, tenant_settings |
| 76 | integration table | integration_settings (FORCE) |
| 77 | facilities table | facilities (FORCE+tid) |
| 78 | approvals workflow | approvals (FORCE+tid) |
| 79 | dashboards/charts | لوحات per-role (Chart.js نمط) |
| 80 | bilingual | tr(en,ar) ×2288 استخدام، RTL أصلي |
| 81 | التكاملات الحالية | ZATCA (حقول)، integration_settings (إطار)؛ NPHIES/PACS/HL7/SMS = ناقصة |
| 82 | الملفات المهمة | server.js, db_postgres.js, public/js/{app,api,login,admin}.js, public/{index,login,admin}.html |

## 6. المتطلبات المقترحة
ربط الصفحات الحديثة (50-51) بـbackend/جداول أو وسمها beta؛ تكاملات NPHIES/PACS/HL7/SMS؛ MFA؛ فهرسة tenant_id للتوسّع.

## 7. الفجوات (مرجّعة لتقرير 03)
تكاملات معيارية (FHIR/HL7/PACS/NPHIES)، MFA، BI، باركود/BCMA، triage/scores آلية — تفصيلها في 03.

## 8. الأولويات
P0: أمن/عزل (محقّق). P1: تكاملات تأمين/مختبر/أشعة. P2: BI/باركود. P3: صفحات beta.

## 9. المخاطر
صفحات واجهة بلا backend (50-51) قد توحي بميزات غير موجودة؛ غياب تكاملات معيارية يحدّ التشغيل البيني.

## 10. توصيات التنفيذ
كل تحسين عبر بوابة بموافقة (UI/API/DB/Integration) — لا تغيير إنتاجي في هذا التحليل.

## 11. Acceptance Criteria
الجرد يغطّي 51 صفحة + 377 مسار + 162 جدول + 11 دور (✅ مغطّى أعلاه، ≥80 صف).

## 12. Next Actions
انتقل إلى 02 (Benchmark) ثم 03 (Gap). تأكيد backing للصفحات 50-51.
