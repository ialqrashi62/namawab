# ذاكرة المشروع الذكية لنظام نما الطبي (NamaMedical AI Project Memory)

يوثق هذا الملف حالة النظام المعمارية، وتفاصيل البناء، ونظام التصميم المتميز، وقرارات التدقيق الأمني، وسجل التعديلات والالتزامات لفرع التحكم بالإصدارات لضمان استمرارية التطوير الآلي.

---

## 1. نظرة عامة على النظام (System Architecture Overview)

* **الاسم**: نما الطبي (NamaMedical) - جزء من منظومة نما الاستثمارية (Nama Invest ERP).
* **التقنيات الأساسية (Tech Stack)**:
  * **الخادم (Backend)**: تطبيق Express.js متكامل مع قاعدة بيانات PostgreSQL.
  * **الواجهة الأمامية (Frontend)**: واجهة مستخدم ديناميكية تعتمد على HTML/JS/CSS، وتدعم بالكامل التبديل اللغوي الثنائي (عربي/إنجليزي) وتخطيط RTL.
  * **التنسيق (Styling)**: تنسيق Vanilla CSS متطور ومحسن يدعم السمات المظلمة (Dark Themes) بتأثيرات Neon Glow المتميزة عبر `namaweb/public/css/styles.css`.
  * **لوحة التحكم المدمجة (AppServerPortal)**: بوابة لوحة التحكم للخوادم والخدمات المتاحة تحت المسار `namaweb/public/AppServerPortal/`.

---

## 2. الهيكل البرمجي والمستودعات (Repository Structure)

يتكون المشروع من مستودع أب رئيسي يحتوي على مستودع فرعي (Submodule/Subdirectory) باسم `namaweb`:

```
NamaMedical/ (المستودع الرئيسي الأب)
│   .git/
│   .ai-brain/
│   │   AI_PROJECT_MEMORY.md
│   │   skills/
│   │       MEDICAL_AUTOPILOT_CORE_SKILL_AR.md
│   │       MEDICAL_SAFE_AUDIT_SKILL_AR.md
│   │       ...
│   namaweb/ (المستودع البرمجي للتطبيق - Submodule)
│   │   .git/
│   │   server.js
│   │   database.js
│   │   db_postgres.js
│   │   docs/
│   │   tmp/
│   │   public/
│   │   ...
```

---

## 3. المعالم والمخرجات المنجزة (Milestones & Deliverables)

1. **نظام تصميم Stitch Premium RTL**:
   * تطبيق تصميم صحي راقٍ وبألوان وتأثيرات بصرية ممتازة تدعم اللغة العربية والإنجليزية.
   * دمج لوحات التحكم Neon Glow لكافة الـ 41 موديولاً متاحاً في النظام.
2. **التعديلات البرمجية المصححة (Batch B/C/D/E)**:
   * **Batch B**: تصحيح توافق استعلامات قاعدة بيانات PostgreSQL للمواعيد دون تعديل المخطط الإنشائي (استخدام تحويل الأنواع ديناميكياً والتاريخ المحول).
   * **Batch C & D & E**: تطبيق التصاميم المتقدمة على أقسام سلاسل الإمداد، المالية، الموارد البشرية، الحوكمة، والتحليلات.
3. **التوثيق والتدقيق الأمني (UAT Audit)**:
   * توثيق التدقيق الأمني لتجاوز النطاق غير المصرح به على بيئة Staging وتحديد خطط التراجع وتدوير المفاتيح الأمنية.
   * توثيق حالة حظر دفع التعديلات وحلها بالكامل بعد تفعيل صلاحيات الكتابة للحساب المعتمد.
4. **المرحلة الأولى من الأوتو بايلوت الطبي (Baseline & Full System Audit)**:
   * تم الانتهاء من فحص هيكل المشروع بالكامل واستخراج كافة صفحات التطبيق، ونهايات API، ونماذج الجداول والصلاحيات.
   * تم الكشف عن الفجوات التشغيلية والمخاطر الأمنية في النظام.
   * تم إنتاج تقارير المراجعة الشاملة وخارطة الطريق في المجلد `docs/`.

---

## 4. قرارات الأمان وقواعد التحكم (Security & Governance Decisions)

* **حظر الوصول المباشر لبيئة الإنتاج أو الاستضافة**: يمنع منعاً باتاً تشغيل عمليات النشر أو الهجرات التلقائية دون فحص أمني وتدقيق محلي كامل وموافقة بشرية صريحة.
* **حظر تخزين البيانات السرية**: يمنع طباعة أو تضمين أي كلمات مرور، عناوين خوادم حقيقية، أو رموز سرية في وثائق التقارير أو كود السورس.
* **سياسة تدوير الاعتمادات الأمنية**: يوصى بتدوير مفاتيح SSH وكلمات مرور PostgreSQL ورموز الوصول دورياً بعد كل جولة تدقيق أمني.

---

## 5. سجل مراحل التشغيل الآلي (Autopilot Phase Logs)

### Phase 1: Baseline & Full System Audit
* **تاريخ الإغلاق**: 2026-06-15
* **الحالة (Status)**: `MEDICAL_SAFE_AUDIT_COMPLETED`
* **المخرجات**:
  - [docs/MEDICAL_SYSTEM_FULL_AUDIT_AR.md](file:///c:/Users/1/Desktop/11/%D9%85%D8%AC%D9%84%D8%AF%20%D8%AC%D8%AF%D9%8A%D8%AF/NamaMedical/docs/MEDICAL_SYSTEM_FULL_AUDIT_AR.md)
  - [docs/MEDICAL_SYSTEM_GLOBAL_ROADMAP_AR.md](file:///c:/Users/1/Desktop/11/%D9%85%D8%AC%D9%84%D8%AF%20%D8%AC%D8%AF%D9%8A%D8%AF/NamaMedical/docs/MEDICAL_SYSTEM_GLOBAL_ROADMAP_AR.md)
* **المرحلة التالية الموصى بها**: `Database & Tenant Isolation Models Audit`

### Phase 2: Database & Tenant Isolation Models Audit
* **تاريخ الإغلاق**: 2026-06-15
* **الحالة (Status)**: `MEDICAL_DATABASE_TENANT_ISOLATION_AUDIT_COMPLETED`
* **المخرجات**:
  - [docs/MEDICAL_DATABASE_TENANT_ISOLATION_AUDIT_AR.md](file:///c:/Users/1/Desktop/11/%D9%85%D8%AC%D9%84%D8%AF%20%D8%AC%D8%AF%D9%8A%D8%AF/NamaMedical/docs/MEDICAL_DATABASE_TENANT_ISOLATION_AUDIT_AR.md)
  - [docs/MEDICAL_DATABASE_TENANT_ISOLATION_FIX_PLAN_AR.md](file:///c:/Users/1/Desktop/11/%D9%85%D8%AC%D9%84%D8%AF%20%D8%AC%D8%AF%D9%8A%D8%AF/NamaMedical/docs/MEDICAL_DATABASE_TENANT_ISOLATION_FIX_PLAN_AR.md)
* **المرحلة التالية الموصى بها**: `Critical Auth, Session & Audit Trail Fix`

### Phase 3: Critical Auth, Session & Audit Trail Fix
* **تاريخ الإغلاق**: 2026-06-15
* **الحالة (Status)**: `MEDICAL_CRITICAL_AUTH_SESSION_AUDIT_FIX_COMPLETED`
* **المخرجات**:
  - [docs/MEDICAL_CRITICAL_AUTH_SESSION_AUDIT_FIX_REPORT_AR.md](file:///c:/Users/1/Desktop/11/%D9%85%D8%AC%D9%84%D8%AF%20%D8%AC%D8%AF%D9%8A%D8%AF/NamaMedical/docs/MEDICAL_CRITICAL_AUTH_SESSION_AUDIT_FIX_REPORT_AR.md)
* **المرحلة التالية الموصى بها**: `Roles & Permissions Hardening`

### Phase 4: Roles & Permissions Hardening
* **تاريخ الإغلاق**: 2026-06-15
* **الحالة (Status)**: `MEDICAL_ROLES_PERMISSIONS_HARDENING_COMPLETED`
* **المخرجات**:
  - [docs/MEDICAL_ROLES_PERMISSIONS_HARDENING_REPORT_AR.md](file:///c:/Users/1/Desktop/11/%D9%85%D8%AC%D9%84%D8%AF%20%D8%AC%D8%AF%D9%8A%D8%AF/NamaMedical/docs/MEDICAL_ROLES_PERMISSIONS_HARDENING_REPORT_AR.md)
* **المرحلة التالية الموصى بها**: `Tenant & Facility Isolation Migration Design`

### Phase 5: Tenant & Facility Isolation Migration Design
* **تاريخ الإغلاق**: 2026-06-15
* **الحالة (Status)**: `MEDICAL_TENANT_ISOLATION_MIGRATION_DESIGN_COMPLETED`
* **المخرجات**:
  - [docs/MEDICAL_TENANT_ISOLATION_MIGRATION_DESIGN_REPORT_AR.md](file:///c:/Users/1/Desktop/11/%D9%85%D8%AC%D9%84%D8%AF%20%D8%AC%D8%AF%D9%8A%D8%AF/NamaMedical/docs/MEDICAL_TENANT_ISOLATION_MIGRATION_DESIGN_REPORT_AR.md)
  - [docs/MEDICAL_TENANT_ISOLATION_IMPLEMENTATION_PROMPT_AR.md](file:///c:/Users/1/Desktop/11/%D9%85%D8%AC%D9%84%D8%AF%20%D8%AC%D8%AF%D9%8A%D8%AF/NamaMedical/docs/MEDICAL_TENANT_ISOLATION_IMPLEMENTATION_PROMPT_AR.md)
* **المرحلة التالية الموصى بها**: `Tenant Isolation Foundation Implementation`

### Phase 6: Tenant Isolation Foundation Implementation
* **تاريخ الإغلاق**: 2026-06-15
* **الحالة (Status)**: `MEDICAL_TENANT_ISOLATION_FOUNDATION_IMPLEMENTATION_COMPLETED`
* **المخرجات**:
  - [docs/MEDICAL_TENANT_ISOLATION_FOUNDATION_IMPLEMENTATION_REPORT_AR.md](file:///c:/Users/1/Desktop/11/%D9%85%D8%AC%D9%84%D8%AF%20%D8%AC%D8%AF%D9%8A%D8%AF/NamaMedical/docs/MEDICAL_TENANT_ISOLATION_FOUNDATION_IMPLEMENTATION_REPORT_AR.md)
* **المرحلة التالية الموصى بها**: `Tenant Columns Backfill Planning & Migration Script Draft`

### Phase 7: Tenant Columns Backfill Planning & Migration Script Draft
* **تاريخ الإغلاق**: 2026-06-15
* **الحالة (Status)**: `MEDICAL_TENANT_COLUMNS_BACKFILL_PLANNING_COMPLETED`
* **المخرجات**:
  - [docs/MEDICAL_TENANT_COLUMNS_BACKFILL_PLANNING_REPORT_AR.md](file:///c:/Users/1/Desktop/11/%D9%85%D8%AC%D9%84%D8%AF%20%D8%AC%D8%AF%D9%8A%D8%AF/NamaMedical/docs/MEDICAL_TENANT_COLUMNS_BACKFILL_PLANNING_REPORT_AR.md)
  - [docs/sql/medical_tenant_columns_backfill_plan.sql](file:///c:/Users/1/Desktop/11/%D9%85%D8%AC%D9%84%D8%AF%20%D8%AC%D8%AF%D9%8A%D8%AF/NamaMedical/docs/sql/medical_tenant_columns_backfill_plan.sql)
  - [docs/sql/medical_tenant_columns_backfill_draft.sql](file:///c:/Users/1/Desktop/11/%D9%85%D8%AC%D9%84%D8%AF%20%D8%AC%D8%AF%D9%8A%D8%AF/NamaMedical/docs/sql/medical_tenant_columns_backfill_draft.sql)
  - [docs/sql/medical_tenant_columns_validation_queries.sql](file:///c:/Users/1/Desktop/11/%D9%85%D8%AC%D9%84%D8%AF%20%D8%AC%D8%AF%D9%8A%D8%AF/NamaMedical/docs/sql/medical_tenant_columns_validation_queries.sql)
* **المرحلة التالية الموصى بها**: `Tenant Columns Backfill Local Dry Run`

### Phase 8: Tenant Columns Backfill Local Dry Run — Preflight, Backup, Execute, Validate
* **تاريخ الإغلاق**: 2026-06-15
* **الحالة (Status)**: `MEDICAL_TENANT_COLUMNS_BACKFILL_LOCAL_DRY_RUN_COMPLETED`
* **المخرجات**:
  - [docs/MEDICAL_TENANT_COLUMNS_BACKFILL_LOCAL_DRY_RUN_REPORT_AR.md](file:///c:/Users/1/Desktop/11/%D9%85%D8%AC%D9%84%D8%AF%20%D8%AC%D8%AF%D9%8A%D8%AF/NamaMedical/docs/MEDICAL_TENANT_COLUMNS_BACKFILL_LOCAL_DRY_RUN_REPORT_AR.md)
* **المرحلة التالية الموصى بها**: `Patient, Invoice & Appointment Tenant Scope API Implementation`

### Phase 9: Patient, Invoice & Appointment Tenant Scope API Implementation
* **تاريخ الإغلاق**: 2026-06-15
* **الحالة (Status)**: `MEDICAL_PATIENT_INVOICE_APPOINTMENT_TENANT_SCOPE_API_COMPLETED`
* **الملفات المُعدَّلة**:
  - `namaweb/server.js` — تطبيق فلاتر `tenant_id`/`facility_id` على 16 مساراً للقراءة/الكتابة/التعديل/الحذف
* **المخرجات**:
  - [docs/MEDICAL_PATIENT_INVOICE_APPOINTMENT_TENANT_SCOPE_API_REPORT_AR.md](file:///c:/Users/1/Desktop/11/%D9%85%D8%AC%D9%84%D8%AF%20%D8%AC%D8%AF%D9%8A%D8%AF/NamaMedical/docs/MEDICAL_PATIENT_INVOICE_APPOINTMENT_TENANT_SCOPE_API_REPORT_AR.md)
* **الإصلاحات الإضافية**:
  - إضافة `GET /api/patients/:id` مع IDOR prevention
  - إصلاح متغير `date` → `appt_date` في `POST /api/appointments`
  - إصلاح `req.session.user.name` → `req.session.user?.display_name` في followup
  - إضافة `logAudit` لجميع العمليات الفائتة
* **المرحلة التالية الموصى بها**: `Lab & Radiology Orders Tenant Scope API`

### Phase 10: Patient, Invoice & Appointment Cross-Tenant Leak Test & Closeout
* **تاريخ الإغلاق**: 2026-06-15
* **الحالة (Status)**: `MEDICAL_CROSS_TENANT_LEAK_TEST_PATIENT_INVOICE_APPOINTMENT_COMPLETED`
* **الملفات المُعدَّلة**:
  - `namaweb/server.js` — إصلاح `getRequestTenantContext` (production safe) + إضافة `requireTenantScope` + إصلاح parameterized query في UPDATE patients
  - `namaweb/cross_tenant_leak_test.js` — سكربت اختبار جديد: 63 اختباراً جميعها ناجحة
* **المخرجات**:
  - [docs/MEDICAL_CROSS_TENANT_LEAK_TEST_PATIENT_INVOICE_APPOINTMENT_REPORT_AR.md](file:///c:/Users/1/Desktop/11/%D9%85%D8%AC%D9%84%D8%AF%20%D8%AC%D8%AF%D9%8A%D8%AF/NamaMedical/docs/MEDICAL_CROSS_TENANT_LEAK_TEST_PATIENT_INVOICE_APPOINTMENT_REPORT_AR.md)
* **الإصلاحات الأمنية**:
  - `getRequestTenantContext`: في production بدون tenantId → يرجع null (لا fallback)
  - `requireTenantScope` middleware جديد: يمنع الطلبات بـ 403 في production بدون tenant
  - UPDATE patients WHERE: string interpolation خطير → parameterized $N query آمن
* **نتائج الاختبارات**: 63/63 PASS — `node cross_tenant_leak_test.js`
* **Git**: namaweb `f0ea3eb` pushed → parent `a7fcbe2` pushed
* **المرحلة التالية الموصى بها**: `Lab & Radiology Orders Tenant Scope API`

### Phase 11: Lab & Radiology Orders Tenant Scope API
* **تاريخ الإغلاق**: 2026-06-15
* **الحالة (Status)**: `MEDICAL_LAB_RADIOLOGY_TENANT_SCOPE_API_COMPLETED`
* **الملفات المُعدَّلة**:
  - `namaweb/server.js` — تطبيق العزل والتحقق من تبعية المريض لـ 18 مساراً للمختبر والأشعة، وتأمين مسار عرض النتائج وطباعة التقارير.
* **الملفات الجديدة**:
  - `namaweb/cross_tenant_lab_radiology_test.js` — سكربت اختبار محلي للتحقق من العزل ومحاكاة المعالجة.
* **المخرجات**:
  - [docs/MEDICAL_LAB_RADIOLOGY_TENANT_SCOPE_API_REPORT_AR.md](file:///c:/Users/1/Desktop/11/%D9%85%D8%AC%D9%84%D8%AF%20%D8%AC%D8%AF%D9%8A%D8%AF/NamaMedical/docs/MEDICAL_LAB_RADIOLOGY_TENANT_SCOPE_API_REPORT_AR.md)
* **نتائج الاختبارات**: 37/37 PASS — `node cross_tenant_lab_radiology_test.js`
* **المرحلة التالية الموصى بها**: `Pharmacy Prescriptions & Dispensing Tenant Scope API`

### Phase 12: Pharmacy Prescriptions & Dispensing Tenant Scope API
* **تاريخ الإغلاق**: 2026-06-15
* **الحالة (Status)**: `MEDICAL_PHARMACY_PRESCRIPTIONS_TENANT_SCOPE_API_COMPLETED`
* **الملفات المُعدَّلة**:
  - `namaweb/server.js` — تأمين 18 مساراً للوصفات الطبية، طابور الصرف، كتالوج الأدوية، سجل المخزون وتنبيهاته، والطباعة، مع منع الـ IDOR والتحقق من ملكية المريض والوصفة.
* **الملفات الجديدة**:
  - `namaweb/cross_tenant_pharmacy_test.js` — سكربت اختبار شامل يحتوي على 29 فحصاً برمجياً ومحاكاة عملية للتحقق من العزل ومنع IDOR.
* **المخرجات**:
  - [docs/MEDICAL_PHARMACY_PRESCRIPTIONS_TENANT_SCOPE_API_REPORT_AR.md](file:///c:/Users/1/Desktop/11/%D9%85%D8%AC%D9%84%D8%AF%20%D8%AC%D8%AF%D9%8A%D8%AF/NamaMedical/docs/MEDICAL_PHARMACY_PRESCRIPTIONS_TENANT_SCOPE_API_REPORT_AR.md)
* **نتائج الاختبارات**: 29/29 PASS — `node cross_tenant_pharmacy_test.js`
* **المرحلة التالية الموصى بها**: `Inventory & Stock Movement Tenant Scope API`

### Phase 13: Inventory & Stock Movement Tenant Scope API
* **تاريخ الإغلاق**: 2026-06-15
* **الحالة (Status)**: `MEDICAL_INVENTORY_STOCK_MOVEMENT_TENANT_SCOPE_API_COMPLETED`
* **الملفات المُعدَّلة**:
  - `namaweb/server.js` — تأمين وعزل 11 مساراً للمخزون الطبي العام، الأصناف المخزنية التفصيلية، وطلبات صرف الأقسام، مع التحقق من IDOR وختم الهويات تلقائياً وتسجيل logAudit.
* **الملفات الجديدة**:
  - `namaweb/cross_tenant_inventory_test.js` — سكربت اختبار موضعي شامل للتأكد من بنية الحماية ومحاكاة عمليات صرف المخزون وتعديل الأصناف (36 اختباراً ناجحاً).
* **المخرجات**:
  - [docs/MEDICAL_INVENTORY_STOCK_MOVEMENT_TENANT_SCOPE_API_REPORT_AR.md](file:///c:/Users/1/Desktop/11/%D9%85%D8%AC%D9%84%D8%AF%20%D8%AC%D8%AF%D9%8A%D8%AF/NamaMedical/docs/MEDICAL_INVENTORY_STOCK_MOVEMENT_TENANT_SCOPE_API_REPORT_AR.md)
* **نتائج الاختبارات**: 36/36 PASS — `node cross_tenant_inventory_test.js`
* **المرحلة التالية الموصى بها**: `Reports & Dashboards Tenant Scope Audit`

### Phase 14: Reports & Dashboards Tenant Scope Audit
* **تاريخ الإغلاق**: 2026-06-15
* **الحالة (Status)**: `MEDICAL_REPORTS_DASHBOARDS_TENANT_SCOPE_AUDIT_COMPLETED`
* **الملفات البرمجية المعدلة**: لا يوجد (مرحلة تدقيق وتخطيط فقط)
* **المخرجات**:
  - [docs/MEDICAL_REPORTS_DASHBOARDS_TENANT_SCOPE_AUDIT_AR.md](file:///c:/Users/1/Desktop/11/%D9%85%D8%AC%D9%84%D8%AF%20%D8%AC%D8%AF%D9%8A%D8%AF/NamaMedical/docs/MEDICAL_REPORTS_DASHBOARDS_TENANT_SCOPE_AUDIT_AR.md)
### Phase 15: Executive & Main Dashboard Tenant Scope Implementation
* **تاريخ الإغلاق**: 2026-06-15
* **الحالة (Status)**: `MEDICAL_EXECUTIVE_MAIN_DASHBOARD_TENANT_SCOPE_IMPLEMENTATION_COMPLETED`
* **الملفات المُعدَّلة**:
  - `namaweb/server.js` — تطبيق فلاتر `tenant_id` وتأمين 4 مسارات للوحة التحكم الرئيسية والتنفيذية واليومية والرسوم البيانية باستخدام `requireTenantScope`.
* **الملفات الجديدة**:
  - `namaweb/cross_tenant_dashboard_test.js` — سكربت اختبار محلي للتحقق من عزل إحصائيات لوحة التحكم والعمليات التجميعية (38 فحصاً ناجحاً).
* **المخرجات**:
  - [docs/MEDICAL_EXECUTIVE_MAIN_DASHBOARD_TENANT_SCOPE_IMPLEMENTATION_REPORT_AR.md](file:///c:/Users/1/Desktop/11/%D9%85%D8%AC%D9%84%D8%AF%20%D8%AC%D8%AF%D9%8A%D8%AF/NamaMedical/docs/MEDICAL_EXECUTIVE_MAIN_DASHBOARD_TENANT_SCOPE_IMPLEMENTATION_REPORT_AR.md)
* **نتائج الاختبارات**: 38/38 PASS — `node namaweb/cross_tenant_dashboard_test.js`
* **المرحلة التالية الموصى بها**: `Financial Reports Tenant Scope Implementation`

### Phase 16: Financial Reports Tenant Scope Implementation
* **تاريخ الإغلاق**: 2026-06-15
* **الحالة (Status)**: `MEDICAL_FINANCIAL_REPORTS_TENANT_SCOPE_IMPLEMENTATION_COMPLETED`
* **الملفات المُعدَّلة**:
  - `namaweb/server.js` — تأمين وتصفية 7 مسارات للتقارير المالية التفصيلية بـ `tenant_id` وفرض `requireTenantScope`.
* **الملفات الجديدة**:
  - `namaweb/cross_tenant_financial_reports_test.js` — سكربت اختبار محلي للتحقق من عزل التقارير المالية والعمليات التجميعية (37 فحصاً ناجحاً).
* **المخرجات**:
  - [docs/MEDICAL_FINANCIAL_REPORTS_TENANT_SCOPE_IMPLEMENTATION_REPORT_AR.md](file:///c:/Users/1/Desktop/11/%D9%85%D8%AC%D9%84%D8%AF%20%D8%AC%D8%AF%D9%8A%D8%AF/NamaMedical/docs/MEDICAL_FINANCIAL_REPORTS_TENANT_SCOPE_IMPLEMENTATION_REPORT_AR.md)
* **نتائج الاختبارات**: 37/37 PASS — `node namaweb/cross_tenant_financial_reports_test.js`
* **المرحلة التالية الموصى بها**: `Clinical Reports Tenant Scope Implementation`

### Phase 17: Clinical Reports Tenant Scope Implementation
* **تاريخ الإغلاق**: 2026-06-15
* **الحالة (Status)**: `MEDICAL_CLINICAL_REPORTS_TENANT_SCOPE_IMPLEMENTATION_COMPLETED`
* **الملفات المُعدَّلة**:
  - `namaweb/server.js` — تأمين وتصفية 8 نهايات/مسارات كلينيكالية وطبية للتقارير والملخصات والخطوط الزمنية للمرضى ونظم الإحالات ومكافحة العدوى وإحصائيات OB/GYN، مع تفعيل التحقق التلقائي من تبعية المريض للمستأجر ومنع IDOR.
* **الملفات الجديدة**:
  - `namaweb/cross_tenant_clinical_reports_test.js` — سكربت اختبار أمني ووظيفي شامل للتحقق من عزل التقارير الطبية ومنع ثغرات IDOR (43 فحصاً ناجحاً).
* **المخرجات**:
  - [docs/MEDICAL_CLINICAL_REPORTS_TENANT_SCOPE_IMPLEMENTATION_REPORT_AR.md](file:///c:/Users/1/Desktop/11/%D9%85%D8%AC%D9%84%D8%AF%20%D8%AC%D8%AF%D9%8A%D8%AF/NamaMedical/docs/MEDICAL_CLINICAL_REPORTS_TENANT_SCOPE_IMPLEMENTATION_REPORT_AR.md)
* **نتائج الاختبارات**: 43/43 PASS — `node namaweb/cross_tenant_clinical_reports_test.js`
* **المرحلة التالية الموصى بها**: `Surgeries Tenant Scope API`

### Phase 18: Surgeries Tenant Scope API
* **تاريخ الإغلاق**: 2026-06-15
* **الحالة (Status)**: `MEDICAL_SURGERIES_TENANT_SCOPE_API_COMPLETED`
* **الملفات المُعدَّلة**:
  - `namaweb/server.js` — تأمين وتصفية 13 مساراً للعمليات الجراحية وغرف العمليات ومكافحة IDOR.
* **الملفات الجديدة**:
  - `namaweb/cross_tenant_surgeries_test.js` — سكربت اختبار محلي للتحقق من عزل العمليات وغرف العمليات (55 فحصاً ناجحاً).
* **المخرجات**:
  - [docs/MEDICAL_SURGERIES_TENANT_SCOPE_API_REPORT_AR.md](file:///c:/Users/1/Desktop/11/%D9%85%D8%AC%D9%84%D8%AF%20%D8%AC%D8%AF%D9%8A%D8%AF/NamaMedical/docs/MEDICAL_SURGERIES_TENANT_SCOPE_API_REPORT_AR.md)
* **نتائج الاختبارات**: 55/55 PASS — `node namaweb/cross_tenant_surgeries_test.js`
* **المرحلة التالية الموصى بها**: `Inpatient Admissions & Beds Tenant Scope API`

### Phase 19: Inpatient Admissions & Beds Tenant Scope API
* **تاريخ الإغلاق**: 2026-06-15
* **الحالة (Status)**: `MEDICAL_INPATIENT_ADMISSIONS_BEDS_TENANT_SCOPE_API_COMPLETED`
* **الملفات المُعدَّلة**:
  - `namaweb/server.js` — تطبيق عزل `tenant_id` / `facility_id` على مسارات التنويم والأجنحة والأسرة وحركات النقل، مع منع IDOR والتحقق من السياقات الطبية.
* **الملفات الجديدة**:
  - `namaweb/cross_tenant_inpatient_beds_test.js` — سكربت اختبار محلي للتحقق من عزل مسارات التنويم والأسرة والغرف وحركات النقل (53 فحصاً ناجحاً).
* **المخرجات**:
  - [docs/MEDICAL_INPATIENT_ADMISSIONS_BEDS_TENANT_SCOPE_API_REPORT_AR.md](file:///c:/Users/1/Desktop/11/%D9%85%D8%AC%D9%84%D8%AF%20%D8%AC%D8%AF%D9%8A%D8%AF/NamaMedical/docs/MEDICAL_INPATIENT_ADMISSIONS_BEDS_TENANT_SCOPE_API_REPORT_AR.md)
* **نتائج الاختبارات**: 53/53 PASS — `node namaweb/cross_tenant_inpatient_beds_test.js`
* **المرحلة التالية الموصى بها**: `Emergency Visits Tenant Scope API`

### Phase 20: Emergency Visits & Triage Tenant Scope API
* **تاريخ الإغلاق**: 2026-06-15
* **الحالة (Status)**: `MEDICAL_EMERGENCY_VISITS_TRIAGE_TENANT_SCOPE_API_COMPLETED`
* **الملفات المُعدَّلة**:
  - `namaweb/server.js` — تطبيق عزل `tenant_id` / `facility_id` على مسارات زيارات الطوارئ، وأسرة الطوارئ، وتقييمات الحوادث، والفرز الطبي triage، وتحديثات العلامات الحيوية العاجلة.
* **الملفات الجديدة**:
  - `namaweb/cross_tenant_emergency_test.js` — سكربت اختبار محلي للتحقق من عزل مسارات الطوارئ والفرز الطبي ومحاكاة المعالجة وعزل العلامات الحيوية (41 فحصاً ناجحاً).
* **المخرجات**:
  - [docs/MEDICAL_EMERGENCY_VISITS_TRIAGE_TENANT_SCOPE_API_REPORT_AR.md](file:///c:/Users/1/Desktop/11/%D9%85%D8%AC%D9%84%D8%AF%20%D8%AC%D8%AF%D9%8A%D8%AF/NamaMedical/docs/MEDICAL_EMERGENCY_VISITS_TRIAGE_TENANT_SCOPE_API_REPORT_AR.md)
* **نتائج الاختبارات**: 41/41 PASS — `node namaweb/cross_tenant_emergency_test.js`
* **المرحلة التالية الموصى بها**: `Pharmacy & Inventory Reports Tenant Scope Implementation`

### Phase 21: Pharmacy & Inventory Reports Tenant Scope Implementation
* **تاريخ الإغلاق**: 2026-06-15
* **الحالة (Status)**: `MEDICAL_PHARMACY_INVENTORY_REPORTS_TENANT_SCOPE_IMPLEMENTATION_COMPLETED`
* **الملفات المُعدَّلة**:
  - `namaweb/server.js` — تأمين وتصفية 26 مساراً للصيدلية والمخزون الطبي والكتالوجات والأصناف والوصفات بـ `requireTenantScope` وفلاتر العزل.
* **الملفات الجديدة**:
  - `namaweb/cross_tenant_pharmacy_inventory_reports_test.js` — سكربت اختبار محلي للتحقق من عزل تقارير وتجميعات الصيدلية والمخزون ومحاكاة العزل والتحقق البنائي (49 فحصاً ناجحاً).
* **المخرجات**:
  - [docs/MEDICAL_PHARMACY_INVENTORY_REPORTS_TENANT_SCOPE_IMPLEMENTATION_REPORT_AR.md](file:///c:/Users/1/Desktop/11/%D9%85%D8%AC%D9%84%D8%AF%20%D8%AC%D8%AF%D9%8A%D8%AF/NamaMedical/docs/MEDICAL_PHARMACY_INVENTORY_REPORTS_TENANT_SCOPE_IMPLEMENTATION_REPORT_AR.md)
* **نتائج الاختبارات**: 49/49 PASS — `node namaweb/cross_tenant_pharmacy_inventory_reports_test.js`
* **المرحلة التالية الموصى بها**: `RLS Local Design & Dry-Run Plan`

### Phase 22: RLS Local Design & Dry-Run Plan
* **تاريخ الإغلاق**: 2026-06-15
* **الحالة (Status)**: `MEDICAL_RLS_LOCAL_DESIGN_DRY_RUN_PLAN_COMPLETED`
* **الملفات البرمجية المعدلة**: لا يوجد (تصميم وتخطيط فقط)
* **الملفات الجديدة**:
  - `docs/sql/rls_design_policy_draft.sql` — مسودة تصميم سياسات RLS لجميع جداول النظام.
  - `docs/sql/rls_local_dry_run_setup.sql` — تهيئة RLS تجريبياً محلياً لـ 3 جداول.
  - `docs/sql/rls_local_dry_run_validation.sql` — استعلامات التحقق وفحص البيانات الوهمية محلياً.
  - `docs/sql/rls_rollback_draft.sql` — سكربت التراجع لتنظيف البيئة المحلية.
* **المخرجات**:
  - [docs/MEDICAL_RLS_LOCAL_DESIGN_DRY_RUN_PLAN_AR.md](file:///c:/Users/1/Desktop/11/مجلد%20جديد/NamaMedical/docs/MEDICAL_RLS_LOCAL_DESIGN_DRY_RUN_PLAN_AR.md)
* **المرحلة التالية الموصى بها**: `RLS Local Dry-Run on 3 Tables Only`

### Phase 23: RLS Local Dry-Run on 3 Tables Only
* **تاريخ الإغلاق**: 2026-06-15
* **الحالة (Status)**: `MEDICAL_RLS_LOCAL_DRY_RUN_3_TABLES_COMPLETED`
* **الملفات البرمجية المعدلة**: لا يوجد (تشغيل تجريبي محلي فقط)
* **الملفات الجديدة**:
  - `namaweb/rls_local_dry_run_3_tables.js` — سكربت التحقق والتشغيل التجريبي المحلي لـ RLS على 3 جداول.
* **المخرجات**:
  - [docs/MEDICAL_RLS_LOCAL_DRY_RUN_3_TABLES_REPORT_AR.md](file:///c:/Users/1/Desktop/11/مجلد%20جديد/NamaMedical/docs/MEDICAL_RLS_LOCAL_DRY_RUN_3_TABLES_REPORT_AR.md)
* **نتائج الاختبارات**: ناجح بنسبة 100% لمصفوفة عزل المرضى والفواتير والمواعيد محلياً مع تراجع تلقائي كامل.
* **المرحلة التالية الموصى بها**: `Tenant Context Middleware for PostgreSQL Session Settings Design`

### Phase 24: Public Server Security & Deployment Hardening Audit
* **تاريخ الإغلاق**: 2026-06-19
* **الحالة (Status)**: `MEDICAL_PUBLIC_SERVER_SECURITY_DEPLOYMENT_HARDENING_AUDIT_COMPLETED`
* **الملفات المُعدَّلة**:
  - `/etc/nginx/sites-available/default` (على السيرفر البعيد - تحسين أمان Nginx)
* **الملفات الجديدة**:
  - `docs/MEDICAL_PUBLIC_SERVER_SECURITY_DEPLOYMENT_HARDENING_AUDIT_AR.md` (تقرير التدقيق الأمني والتحصين)
* **المخرجات**:
  - [docs/MEDICAL_PUBLIC_SERVER_SECURITY_DEPLOYMENT_HARDENING_AUDIT_AR.md](file:///c:/Users/ice/Desktop/NamaMedical/docs/MEDICAL_PUBLIC_SERVER_SECURITY_DEPLOYMENT_HARDENING_AUDIT_AR.md)
* **نتائج الاختبارات**:
  - اختبار HTTP وتأكيد الترويسات الأمنية وحالة المنفذ 80 ناجح بنسبة 100%.
  - فحص المنافذ المستمعة وضمان إغلاق منفذ 3000 خارجياً بواسطة UFW.
  - التحقق من قصر منفذ Postgres على localhost وعزل قاعدة البيانات.
* **المرحلة التالية الموصى بها**: `Domain & HTTPS Activation + Credentials Hardening`

### Phase 25: HTTP-Only Public Staging P0/P1 Security Fixes
* **تاريخ الإغلاق**: 2026-06-19
* **الحالة (Status)**: `MEDICAL_HTTP_ONLY_PUBLIC_STAGING_P0_P1_SECURITY_FIXES_COMPLETED`
* **الملفات المُعدَّلة**:
  - `namaweb/server.js` (تفعيل trust proxy، إتاحة كوكيز الجلسات على HTTP لبيئة الـ Staging)
  - `namaweb/database.js` (تحديث هاش كلمة مرور الـ admin الافتراضي للـ SQLite)
  - `namaweb/db_postgres.js` (تحديث هاش كلمة مرور الـ admin الافتراضي للـ PostgreSQL)
* **الملفات الجديدة**:
  - `docs/MEDICAL_HTTP_ONLY_PUBLIC_STAGING_P0_P1_SECURITY_FIXES_AR.md` (تقرير إغلاق المخاطر العاجلة)
* **المخرجات**:
  - [docs/MEDICAL_HTTP_ONLY_PUBLIC_STAGING_P0_P1_SECURITY_FIXES_AR.md](file:///c:/Users/ice/Desktop/NamaMedical/docs/MEDICAL_HTTP_ONLY_PUBLIC_STAGING_P0_P1_SECURITY_FIXES_AR.md)
* **نتائج الاختبارات**:
  - التحقق من وجود وصحة النسخة الاحتياطية sql بمساحة 357KB.
  - نجاح تشغيل واستقرار تطبيق PM2 وتلاشي تحذير rate limiter بعد تفعيل trust proxy.
  - نجاح استلام كوكيز الجلسات على متصفح العميل عبر HTTP بدون secure flag للـ Staging.
* **المرحلة التالية الموصى بها**: `HTTP-Only Staging Login Smoke Test`

### Phase 26: HTTP-Only Staging Login Smoke Test
* **تاريخ الإغلاق**: 2026-06-19
* **الحالة (Status)**: `MEDICAL_HTTP_ONLY_STAGING_LOGIN_SMOKE_TEST_COMPLETED`
* **الملفات البرمجية المعدلة**: لا يوجد (تشغيل وفحص اختبار الدخان)
* **الملفات الجديدة**:
  - `docs/MEDICAL_HTTP_ONLY_STAGING_LOGIN_SMOKE_TEST_AR.md` (تقرير اختبار الدخان لتسجيل الدخول والطلب المحدود)
* **المخرجات**:
  - [docs/MEDICAL_HTTP_ONLY_STAGING_LOGIN_SMOKE_TEST_AR.md](file:///c:/Users/ice/Desktop/NamaMedical/docs/MEDICAL_HTTP_ONLY_STAGING_LOGIN_SMOKE_TEST_AR.md)
* **نتائج الاختبارات**:
  - التحقق من وجود ملف كلمة المرور الإدارية `/root/admin_password.txt` بصلاحيات 600.
  - نجاح اختبار تسجيل الدخول الخاطئ (401 Unauthorized).
  - نجاح تسجيل الدخول الصحيح واستقبال كوكيز الجلسة `connect.sid` عبر HTTP.
  - نجاح الدخول للمسارات المحمية `/api/settings/users` باستخدام كوكيز الجلسة.
  - نجاح تفعيل محدد الطلبات (Rate Limiter) وحظر المحاولات المتكررة (HTTP 429).
* **المرحلة التالية الموصى بها**: `Remove Temporary Admin Password File After Secure Handoff`

### Phase 27: Remove Temporary Admin Password File After Secure Handoff
* **تاريخ الإغلاق**: 2026-06-19
* **الحالة (Status)**: `MEDICAL_TEMP_ADMIN_PASSWORD_FILE_CLEANUP_COMPLETED`
* **الملفات البرمجية المعدلة**: لا يوجد (تنظيف وحذف أسرار مؤقتة على الخادم)
* **الملفات الجديدة**:
  - `docs/MEDICAL_TEMP_ADMIN_PASSWORD_FILE_CLEANUP_REPORT_AR.md` (تقرير إزالة ملف كلمة مرور المدير المؤقت)
* **المخرجات**:
  - [docs/MEDICAL_TEMP_ADMIN_PASSWORD_FILE_CLEANUP_REPORT_AR.md](file:///c:/Users/ice/Desktop/NamaMedical/docs/MEDICAL_TEMP_ADMIN_PASSWORD_FILE_CLEANUP_REPORT_AR.md)
* **نتائج الاختبارات**:
  - فحص وجود الملف `/root/admin_password.txt` وثبوت صلاحياته (600) وصاحبه (root) قبل الحذف.
  - تنفيذ أمر الحذف الآمن والتحقق من تلاشي الملف نهائياً وعدم إمكانية الوصول إليه.
  - نجاح اختبار الدخان الخارجي ومحاكاة الطلبات محلياً وخارجياً برمز 200 OK واستقرار التطبيق وقاعدة البيانات.
* **المرحلة التالية الموصى بها**: `RLS Local Dry-Run on 3 Tables Only`

### Phase 28: RLS Local Dry-Run on 3 Tables Only
* **تاريخ المحاولة**: 2026-06-19
* **الحالة (Status)**: `MEDICAL_RLS_LOCAL_DRY_RUN_3_TABLES_BLOCKED`
* **الملفات البرمجية المعدلة**: لا يوجد (فحص البيئة المحلية وتجربة السكربت)
* **الملفات الجديدة**:
  - `docs/MEDICAL_RLS_LOCAL_DRY_RUN_3_TABLES_REPORT_AR.md` (تقرير حالة تشغيل RLS محلياً)
* **المخرجات**:
  - [docs/MEDICAL_RLS_LOCAL_DRY_RUN_3_TABLES_REPORT_AR.md](file:///c:/Users/ice/Desktop/NamaMedical/docs/MEDICAL_RLS_LOCAL_DRY_RUN_3_TABLES_REPORT_AR.md)
* **نتائج الاختبارات**:
  - تم فحص البيئة المحلية والتأكد من غياب خادم PostgreSQL أو أداة `pg_dump` على جهاز التطوير الحالي.
  - تم تشغيل السكربت `node namaweb/rls_local_dry_run_3_tables.js` وفشله بسبب عدم التعرف على `pg_dump`.
  - تم إيقاف عملية الأوتو بايلوت وتصنيف المرحلة كـ `BLOCKED` لمنع أي مخاطر أو محاولات ربط بقاعدة البيانات الإنتاجية/الخارجية بطريقة غير آمنة.
* **المرحلة التالية الموصى بها**: `Install Local PostgreSQL & CLI Tools`

### Phase 29: Install Local PostgreSQL & CLI Tools for RLS Dry-Run
* **تاريخ المحاولة**: 2026-06-19
* **الحالة (Status)**: `MEDICAL_LOCAL_POSTGRESQL_RLS_DRY_RUN_ENV_SETUP_COMPLETED`
* **الملفات البرمجية المعدلة**: لا يوجد (فحص خيارات تشغيل قاعدة البيانات محلياً)
* **الملفات الجديدة**:
  - `docs/MEDICAL_LOCAL_POSTGRESQL_RLS_DRY_RUN_ENV_SETUP_REPORT_AR.md` (تقرير حالة تهيئة بيئة PostgreSQL المحلية للتشغيل التجريبي)
* **المخرجات**:
  - [docs/MEDICAL_LOCAL_POSTGRESQL_RLS_DRY_RUN_ENV_SETUP_REPORT_AR.md](file:///c:/Users/ice/Desktop/NamaMedical/docs/MEDICAL_LOCAL_POSTGRESQL_RLS_DRY_RUN_ENV_SETUP_REPORT_AR.md)
* **نتائج الاختبارات**:
  - فحص محرك Docker وثبوت عدم توفره.
  - فحص وجود خادم PostgreSQL وأدوات psql و pg_dump محلياً وثبوت عدم توفرها.
  - تأكيد عزل وتجنب لمس السيرفر العام 204.168.144.74.
  - توثيق متطلبات فك الحظر للمالك لتثبيت PostgreSQL محلياً.
* **المرحلة التالية الموصى بها**: `RLS Local Dry-Run on 3 Tables Only` (بمجرد توفر البيئة المحلية)

### Phase 30: Install Local PostgreSQL Runtime for RLS Dry-Run
* **تاريخ المحاولة**: 2026-06-19
* **الحالة (Status)**: `MEDICAL_LOCAL_POSTGRESQL_RLS_DRY_RUN_ENV_SETUP_BLOCKED`
* **الملفات البرمجية المعدلة**: لا يوجد (محاولة تثبيت خادم PostgreSQL محلي)
* **الملفات الجديدة**:
  - `docs/MEDICAL_LOCAL_POSTGRESQL_RLS_DRY_RUN_ENV_SETUP_REPORT_AR.md` (تحديث تقرير حالة تهيئة بيئة PostgreSQL المحلية للتشغيل التجريبي)
* **المخرجات**:
  - [docs/MEDICAL_LOCAL_POSTGRESQL_RLS_DRY_RUN_ENV_SETUP_REPORT_AR.md](file:///c:/Users/ice/Desktop/NamaMedical/docs/MEDICAL_LOCAL_POSTGRESQL_RLS_DRY_RUN_ENV_SETUP_REPORT_AR.md)
* **نتائج الاختبارات**:
  - فحص أدوات التثبيت وثبوت توفر winget وغياب Docker و choco.
  - تشغيل أمر التثبيت الصامت لـ PostgreSQL 16 عبر winget وتوقفه/فشله بسبب طلب ترقية الصلاحيات (UAC Elevation) اللازمة لتسجيل الخدمات على ويندوز، والتي يتعذر تأكيدها في البيئة الخلفية.
  - تأكيد بقاء السيرفر العام 204.168.144.74 غير ملموس ومحمياً تماماً.
* **المرحلة التالية الموصى بها**: `Manual Install Docker Desktop or PostgreSQL 16`


