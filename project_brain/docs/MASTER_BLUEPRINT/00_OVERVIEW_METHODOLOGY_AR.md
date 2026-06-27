# NamaMedical — Master Blueprint (المخطط الرئيسي الشامل) — 00 نظرة عامة + المنهجية

> 2026-06-23 | حزمة متطلبات/تصميم شاملة مبنية على **الحالة الفعلية للتطبيق** (43 وحدة من `NAV_ITEMS`)، مع مقارنة (gap analysis) مقابل الأنظمة العالمية، ولكل قسم: **برومنت جاهز + سيناريو عمل + فلو بيانات** + الجداول/الأزرار/القوائم المقترحة. تتجاهل هذه الحزمة كل التقييمات/الفحوصات الأمنية السابقة وتبدأ نظرة وظيفية جديدة (product/feature-completeness).

## كيف تُقرأ هذه الحزمة
| الملف | المحتوى |
|---|---|
| `00_OVERVIEW_METHODOLOGY_AR.md` | (هذا) المنهجية + مصادر المقارنة العالمية + سلّم النضج + قالب القسم + فهرس المخرجات |
| `01_MODULE_INVENTORY_MATURITY_AR.md` | جرد الـ43 وحدة: الحالة الفعلية + ملخّص الفجوة + درجة النضج + طبقة الأولوية |
| `02_MODULE_SPECS_CLINICAL_AR.md` | مواصفات الأقسام السريرية/التشخيصية (gap/prompt/scenario/dataflow) |
| `03_MODULE_SPECS_OPERATIONS_ADMIN_AR.md` | بقية الأقسام (تدفّق المريض/التنويم/التشغيل/المالية/الإدارة/التخصصية) |
| `04_CROSSCUTTING_ERD_AR.md` | نموذج البيانات / مخطط العلاقات (ERD) للكيانات الأساسية |
| `05_CROSSCUTTING_API_OPENAPI_AR.md` | منهج API + مواصفات OpenAPI تمثيلية |
| `06_CROSSCUTTING_USERSTORIES_TESTPLAN_AR.md` | قصص المستخدم + معايير القبول + خطة الاختبار |
| `07_CROSSCUTTING_ARCH_SECURITY_DEPLOY_STYLE_AR.md` | المعمارية + الأمن + النشر + design system + i18n + seeders + migrations |

## مصادر المقارنة العالمية (Benchmark)
- **Epic** (Hyperspace/Hyperdrive, MyChart, Beaker LIS, Radiant RIS, Willow Pharmacy, ASAP ED, Stork OB, Cupid Cardiology) — مرجع العمق السريري وworkflows.
- **Oracle Health / Cerner** (Millennium, PowerChart, FirstNet ED, SurgiNet, PharmNet) — مرجع التكامل المؤسسي.
- **MEDITECH Expanse** — مرجع البساطة السريرية + mobile.
- **InterSystems TrakCare** — مرجع unified HIS للأسواق الدولية.
- **openEMR / OpenMRS** — مرجع open-source للحد الأدنى الوظيفي.
- **athenahealth / NextGen** — مرجع ambulatory + RCM (دورة الإيراد).
- **السياق السعودي (إلزامي):** **NPHIES** (تأمين/مطالبات/eligibility)، **CBAHI** (اعتماد الجودة)، **MOH/SCFHS** (التراخيص)، **ZATCA Phase 2** (الفوترة الإلكترونية)، **PDPL** (حماية البيانات)، **SCHS/Wasfaty** (الوصفات).
- **معايير تشغيلية:** HL7 v2 / **FHIR R4** · **DICOM** (PACS) · **LOINC** (المختبر) · **SNOMED-CT** / **ICD-10-AM** (التشخيص) · **RxNorm/SFDA** (الأدوية).

## سلّم النضج (Maturity)
- **L0 — Placeholder:** شاشة/قائمة موجودة بلا منطق حقيقي.
- **L1 — Basic:** CRUD أساسي + جدول عرض.
- **L2 — Functional:** workflow عملي (حالات/أزرار إجراء/طباعة) لكنه ناقص ميزات عالمية.
- **L3 — Integrated:** مربوط بأقسام أخرى + معايير (FHIR/HL7/DICOM) جزئياً.
- **L4 — World-class:** قرار سريري/أتمتة/تكامل خارجي (NPHIES/ZATCA/PACS) + تدقيق + تقارير متقدمة.

## طبقات الأولوية (Priority Tier)
- **P0 — نواة سريرية حرجة:** Doctor Station, Laboratory, Radiology, Pharmacy, Emergency, Inpatient ADT, ICU, Medical Records, Nursing.
- **P1 — تدفّق وإيراد:** Reception, Appointments, Patient Accounts, Finance, Insurance, ZATCA, OB/GYN, Surgery, Blood Bank.
- **P2 — تشغيل ودعم:** Inventory, Catalog, Dept Requests, CSSD, Dietary, Infection Control, Quality, Maintenance, Transport, Waiting Queue, Consent.
- **P3 — توسعة وتجربة:** Patient Portal, Telemedicine, Pathology, Clinical Pharmacy, Rehabilitation, Social Work, Mortuary, CME, Cosmetic Surgery, Reports, Messaging, Dashboard, HR, Settings.

## قالب كل قسم (Per-Module Template)
لكل وحدة في ملفات 02/03:
1. **الحالة الفعلية + النضج** — ما هو موجود في الكود اليوم (من `app.js`/`server.js`) + درجة L0–L4.
2. **فجوة الأنظمة العالمية (Gap)** — جداول/شاشات/أزرار/قوائم يجب إضافتها، مع المرجع (Epic/Cerner/…) + المعيار (FHIR/DICOM/NPHIES…).
3. **برومنت جاهز (Ready Prompt)** — برومنت بناء قابل للّصق مباشرة (يصف الشاشة/الجداول/الـAPI/القواعد).
4. **سيناريو عمل (Work Scenario)** — تدفّق المستخدم خطوة بخطوة (actor → action → result).
5. **فلو البيانات (Data Flow)** — actor → UI → API endpoint → جداول DB → أحداث/تكاملات → تدقيق.

## مبادئ معمارية حاكمة (تنطبق على كل قسم)
- **متعدّد المستأجرين (multi-tenant):** كل جدول حسّاس يحمل `tenant_id` + RLS (سياسة العزل قائمة فعلياً — 150 FORCE policy).
- **RBAC + per-user permissions:** أدوار + صلاحيات دقيقة لكل إجراء.
- **تدقيق شامل (audit trail):** كل إجراء حسّاس يُسجَّل (من/ماذا/متى/أي مستأجر).
- **معايير التشغيل البيني:** FHIR R4 كطبقة تبادل، HL7 v2 للأنظمة القديمة، DICOM للصور.
- **i18n (ع/EN) + RTL:** كل نص عبر `tr()`؛ لا نص مكتوب مباشرة.
- **ترميز الإخراج (XSS-safe):** كل بيانات API تُهرَّب (`escapeHTML`) — البنية قائمة فعلياً.
- **الفوترة:** ZATCA Phase 2 (ختم رقمي + XML + clearance) للفواتير الضريبية.

## ما لا يمكن للوكيل إنتاجه كاملاً (إفصاح)
- **Training Videos:** يُنتَج **سكربت/storyboard** نصّي فقط (لا فيديو فعلي).
- **Legal & Compliance Docs:** يُنتَج **هيكل + بنود مرجعية** (NPHIES/CBAHI/PDPL/ZATCA) — يحتاج مراجعة قانونية بشرية قبل الاعتماد.
- **Wireframes:** تُقدَّم كـ **ASCII/وصف تخطيطي** + مواصفات مكوّنات (لا صور).

> الخطوة التالية بعد اعتماد هذا الـBlueprint: تحويل كل قسم P0 إلى تذاكر تنفيذ (مع الحفاظ على بوابات الأمان/الـRLS القائمة)، أو إطلاق Workflow متعدّد الوكلاء لتوليد بقية المخرجات بالتوازي.
