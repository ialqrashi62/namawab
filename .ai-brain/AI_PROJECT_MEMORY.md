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
* **المرحلة التالية الموصى بها**: `Tenant Columns Backfill Planning` (أو `Patient/Invoice Tenant Scope Implementation` لتوسيع عزل البيانات).

