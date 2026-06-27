# 09 — تذاكر تنفيذ P0 (Backlog قابل للتنفيذ)

> تحويل فجوات الـBlueprint (00–08) إلى **تذاكر تنفيذ** للأقسام الحرجة P0 + الويزرد الأساسي. كل تذكرة: وصف + معايير قبول (AC) + تبعيات + تقدير + ملاحظات أمان. **توثيق تخطيطي فقط — لا كود/DB في هذا الملف.**

## اتفاقيات التذاكر
- **النوع:** Epic (E) · Story (S) · Task (T) · Spike (SP).
- **التقدير:** نقاط (1/2/3/5/8/13) ≈ تعقيد نسبي.
- **التسميات:** `P0` · `clinical` · `integration` · `db-gate` (يحتاج بوابة DDL) · `security` · `ui-live` (ملف عميل = حيّ فور التحرير) · `server-dormant` (يحتاج PM2 restart).
- **Definition of Done (DoD) عام:** كود + `node --check` + اختبارات (unit+integration) + RLS+tenant_id+audit + i18n (tr) + escapeHTML للإخراج + مراجعة + توثيق + smoke المالك (للـUI). **بوابات الأمان القائمة تبقى سارية** (RLS 150، XSS L1+2، perimeter، RBAC 403).
- **قاعدة حاكمة:** أي تذكرة `db-gate` لا تُنفَّذ DDL إلا ببوابة DB مخصّصة معتمدة؛ المحاسبة تبقى OFF؛ التكاملات الخارجية (NPHIES/ZATCA/PACS/HL7) gated حتى اعتماد المفاتيح.

## ترتيب التنفيذ المقترح (Sprints)
- **S0 (أساس):** E0 الويزرد + E-X1 جدول orders الموحّد + E-X2 ترقية فهارس tenant_id + E-X3 مصفوفة RBAC.
- **S1:** Doctor Station (CPOE/CDS) + Medical Records (HIM coding).
- **S2:** Laboratory (LIS) + Radiology (RIS/PACS).
- **S3:** Pharmacy + Nursing (MAR).
- **S4:** Emergency (ED board) + Inpatient ADT (bed board).
- **S5:** ICU (flowsheets/scores) + تكاملات (FHIR/HL7) + تصلّب.

---
## E-X — تذاكر أساسية عابرة (Foundational)
- **E-X1 / S — جدول الطلبات الموحّد (orders/order_items/order_sets)** `P0 db-gate`
  - AC: جدول `orders(tenant_id, encounter_id, type[lab/rad/med/consult], status, ordered_by)` + `order_items` + `order_sets`؛ RLS+tenant_id؛ يولّد سجلات في الأقسام (lab_orders/rad_orders/prescriptions) حسب النوع؛ audit لكل طلب. تقدير: 8.
- **E-X2 / T — ترقية فهارس tenant_id (الكل)** `P0 db-gate`
  - AC: فهرس `tenant_id` (+مركّبات `(tenant_id,patient_id)`/`(tenant_id,status)`) على كل جدول حسّاس (gated سابقاً 59/147 → الكل)؛ بلا قفل طويل (CONCURRENTLY)؛ validate. تقدير: 3.
- **E-X3 / S — مصفوفة RBAC (دور×صلاحية) + enforcement** `P0 security`
  - AC: جداول `roles`/`permissions`/`role_permissions`؛ `requirePermission(action)` middleware؛ per-user permissions تُحترم فعلياً (تعالج L6 السابقة)؛ شاشة إدارة في Settings. تقدير: 8.
- **E-X4 / SP — طبقة FHIR R4 للتبادل** `integration`
  - AC: spike لتثبيت mapping (Patient/Encounter/Observation/MedicationRequest/DiagnosticReport) عبر transaction Bundle + read-back (نمط HAPI المُثبت). لا PHI حقيقي. تقدير: 5.

---
## E0 — Facility Onboarding Wizard (أساسي، prerequisite) `P0 server-dormant`
> المرجع: 08. يُمكّن تشغيل أي منشأة جديدة + يغذّي `facilityType`/`FACILITY_ALLOWED`.
- **E0-S1 — نموذج البيانات للتهيئة** `db-gate`: `tenants`/`facilities`(+`parent_facility_id`)/`facility_modules`/`integration_settings`. AC: RLS+tenant_id؛ `facility_modules` ديناميكي من DB (يحلّ محل الثابت). تقدير: 5.
- **E0-S2 — endpoint التزويد** `server-dormant security`: `POST /api/admin/facilities/provision` (super-admin only). AC: ينشئ tenant+facility+Admin+seed ضمن transaction واحد؛ 403 لغير super-admin؛ audit `facility_provisioned`؛ لا كلمة مرور افتراضية؛ تكاملات gated. تقدير: 8.
- **E0-S3 — واجهة الويزرد (8 خطوات)** `ui-live`: stepper (نوع→هوية/ترخيص→هيكل→وحدات[toggle+تبعيات]→Admin→تكاملات→هوية بصرية/لغة→تأكيد). AC: بطاقات الأنماط الـ5 تُعبّئ الوحدات؛ تحذير تبعيات (ICU↔Inpatient)؛ ع/EN RTL؛ escapeHTML. تقدير: 8.
- **E0-S4 — seed المرجعيات حسب النمط** `db-gate`: roles/CoA/chargemaster/consent/departments/beds. AC: بيانات وهمية بلا PHI؛ production يتخطّى demo seed (نمط قائم). تقدير: 5.

---
## E1 — Doctor Station: CPOE + CDS `P0 clinical`
> المرجع: 02§4. الأعلى أثراً.
- **E1-S1 — Problem List + Allergies مُرمّزة** `db-gate`: `problems(icd10/snomed)`. AC: إضافة/حلّ مشكلة بترميز؛ allergies مُبرزة برأس المريض؛ audit. تقدير: 5.
- **E1-S2 — شاشة CPOE موحّدة** `ui-live server-dormant`: نموذج طلب (lab/rad/med/consult) + توقيع جماعي + order sets. AC: ينشئ سجلات عبر E-X1؛ كل طلب tenant-scoped+audit؛ ع/EN. تقدير: 13.
- **E1-S3 — محرّك CDS (تفاعل/حساسية/جرعة/تكرار)** `clinical`: AC: عند الطلب يتحقّق ويُظهر تنبيه؛ hard-stop للحرج (422)، تجاوز ناعم بسبب موثّق؛ قواعد قابلة للتهيئة. تقدير: 8.
- **E1-S4 — ملاحظات SOAP + قوالب + flowsheet** `ui-live`: AC: note منظّمة + توقيع؛ flowsheet trending للعلامات/النتائج. تقدير: 8.

---
## E2 — Medical Records / HIM `P0 clinical`
> المرجع: 02§31.
- **E2-S1 — السجل الطولي الموحّد** : AC: عرض كل اللقاءات/النتائج/الصور/الملاحظات لمريض؛ RLS؛ access logged. تقدير: 8.
- **E2-S2 — الترميز (ICD-10/SNOMED/CPT) + deficiency** `db-gate`: AC: ترميز لقاء مكتمل؛ طابور نقص توثيق. تقدير: 5.
- **E2-S3 — ROI + break-glass + retention** `security`: AC: طلب نسخة بموافقة + إصدار موثّق؛ break-glass يُسجّل بإنذار؛ retention policy. تقدير: 5. (amendments قائمة.)

---
## E3 — Laboratory / LIS `P0 clinical integration`
> المرجع: 02§5.
- **E3-S1 — lifecycle العيّنة + باركود** `db-gate`: `lab_samples`(Collected→Received→InProcess→Verified). AC: باركود لكل عيّنة؛ حالات؛ audit. تقدير: 5.
- **E3-S2 — تكامل أجهزة HL7 (inbound)** `integration`: `POST /api/lab/hl7`. AC: ربط النتيجة بالعيّنة؛ LOINC؛ (sandbox أولاً، gated للأجهزة الحقيقية). تقدير: 8.
- **E3-S3 — auto-verification + delta + critical call-back** `clinical`: AC: ضمن النطاق+لا delta → اعتماد تلقائي وإلا hold؛ critical لا يُغلق بلا call-back موثّق. تقدير: 5.
- **E3-S4 — QC (Levey-Jennings) + reagent lots** : AC: إدخال QC + رسم + تنبيه خروج. تقدير: 5.

---
## E4 — Radiology / RIS + PACS `P0 clinical integration`
> المرجع: 02§6.
- **E4-S1 — RIS worklist (حالات)** `db-gate`: AC: Scheduled→Arrived→InProgress→Completed→Reported؛ audit. تقدير: 5.
- **E4-S2 — DICOM MWL + تكامل PACS** `integration`: AC: modality worklist للأجهزة؛ ربط `dicom_studies`؛ عارض صور (الصور عبر `/api/phi-files/:id` المحمي القائم). تقدير: 13.
- **E4-S3 — Structured reporting + critical + prior compare** `clinical`: AC: قوالب (BI-RADS)؛ تنبيه critical؛ مقارنة سابق؛ توقيع/addendum. تقدير: 8.

---
## E5 — Pharmacy `P0 clinical integration`
> المرجع: 02§7.
- **E5-S1 — e-Prescribing + pharmacist verification** : AC: وصفة طبيب→طابور صيدلية؛ تحقّق (تفاعل/حساسية/جرعة/formulary). تقدير: 8.
- **E5-S2 — مخزون دفعات/انتهاء (FEFO) + dispense بالباركود** `db-gate`: `drug_batches`. AC: الصرف يخصم أقرب دفعة انتهاءً؛ تنبيه نواقص/قرب انتهاء. تقدير: 8.
- **E5-S3 — المخدّرات (سجل مزدوج) + Wasfaty/NPHIES** `security integration`: AC: سجل controlled مزدوج؛ تكامل gated. تقدير: 5.

---
## E6 — Nursing / MAR `P0 clinical`
> المرجع: 02§12.
- **E6-S1 — MAR بالباركود (5 rights)** `ui-live db-gate`: AC: مسح سوار+دواء يتحقّق (مريض/دواء/جرعة/طريق/وقت)؛ عدم تطابق يمنع+يسجّل؛ رفض/تأخير موثّق؛ ربط الصيدلية. تقدير: 8.
- **E6-S2 — Care plans + assessments + scales (Braden/Morse/MEWS)** : AC: حساب الموازين + تنبيه عتبة. تقدير: 5.
- **E6-S3 — I/O + handover (ISBAR)** : AC: ميزان سوائل + handover منظّم نهاية الوردية. تقدير: 3.

---
## E7 — Emergency / ED `P0 clinical`
> المرجع: 02§22.
- **E7-S1 — Triage ESI/CTAS** `db-gate`: AC: تصنيف 1-5 + علامات/شكوى؛ أولوية. تقدير: 5.
- **E7-S2 — ED Tracking Board حيّ** `ui-live`: AC: سرير/حالة/طبيب/مؤقّت time-to-provider + LOS + LWBS؛ تحديث حيّ. تقدير: 8.
- **E7-S3 — بروتوكولات سريعة + disposition** `clinical`: AC: sepsis/stroke/chest-pain order sets؛ disposition (admit→E8 / discharge / transfer). تقدير: 5.

---
## E8 — Inpatient ADT `P0 clinical`
> المرجع: 02§23.
- **E8-S1 — Bed board حيّ + occupancy/LOS** `ui-live db-gate`: `beds`(Vacant/Occupied/Cleaning/Reserved). AC: حالة حيّة + إشغال%. تقدير: 8.
- **E8-S2 — Admit→Transfer→Discharge workflow** : AC: قبول (من ER/OPD) + نقل + خروج؛ ربط حالة السرير. تقدير: 8.
- **E8-S3 — Discharge planning + summary + med reconciliation** `clinical`: AC: خطة خروج + ملخّص + تسوية دوائية. تقدير: 5.

---
## E9 — ICU `P0 clinical`
> المرجع: 02§24.
- **E9-S1 — Flowsheets عالية التردد + I/O** `db-gate`: AC: إدخال زمني (علامات/ventilator/infusions/I-O). تقدير: 8.
- **E9-S2 — Severity scoring (APACHE-II/SOFA/GCS)** `clinical`: AC: حساب تلقائي + trending + تنبيه تدهور. تقدير: 5.
- **E9-S3 — Drips/infusions + بروتوكولات** : AC: إدارة مضخّات + sedation/glucose protocols. تقدير: 5.

---
## ملخّص التقدير والتبعيات
| Epic | نقاط تقريبية | يعتمد على |
|---|---|---|
| E-X (أساس) | 24 | — |
| E0 Onboarding | 26 | E-X1/E-X3 |
| E1 Doctor Station | 34 | E-X1, E-X3 |
| E2 HIM | 18 | E1 |
| E3 Laboratory | 23 | E-X1, E1(CPOE) |
| E4 Radiology | 26 | E-X1, E1, PHI-files(قائم) |
| E5 Pharmacy | 21 | E-X1, E1, Inventory |
| E6 Nursing | 16 | E5(الصيدلية), E8 |
| E7 Emergency | 18 | E-X1, E8(beds) |
| E8 Inpatient ADT | 21 | E7, E6 |
| E9 ICU | 18 | E8, E6 |
| **الإجمالي P0** | **≈245 نقطة** | — |

## مخاطر/ملاحظات حاكمة
- **db-gate:** كل DDL خلف بوابة DB معتمدة (لا في التطوير العادي)؛ migrations مُرقّمة (07§7) + RLS+tenant_id+audit إلزامي.
- **integration gated:** HL7/DICOM/NPHIES/ZATCA/Wasfaty تُبنى مقابل sandbox أولاً؛ لا مفاتيح/شهادات/اتصال حقيقي قبل بوابة مخصّصة.
- **ui-live:** ملفات العميل (app.js/admin.js/login*) حيّة فور التحرير → استخدم worktree معزول + تطبيق ذرّي + smoke (النمط المُتبع).
- **server-dormant:** تغييرات server.js خاملة حتى PM2 restart معتمد.
- **الأمان القائم يبقى:** RLS 150، XSS L1+2، perimeter (CORS/CSRF/CSP-RO)، RBAC 403، at-rest A3 — لا تُكسَر.

> جاهز للتحويل إلى نظام تتبّع (Jira/GitHub Issues). كل تذكرة لها AC قابل للاختبار (يطابق 06). ابدأ بـ**S0** ثم **S1**. عند الرغبة بالتنفيذ الفعلي لأي Epic: بوابة تطوير مخصّصة لكل قسم مع الحفاظ على بوابات الأمان.
