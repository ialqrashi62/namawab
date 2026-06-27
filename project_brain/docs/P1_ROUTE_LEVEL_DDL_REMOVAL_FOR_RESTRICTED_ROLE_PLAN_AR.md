# P1 — خطة إزالة DDL من معالجات المسارات لتعمل تحت الدور المقيَّد (Refactor Plan)

> المرحلة: Gate 4 | التاريخ: 2026-06-21 | تخطيط؛ التطبيق في Gate 6 (code candidate، بلا نشر).

## القاعدة
```
لا DDL داخل request handlers.
أي CREATE/ALTER/INDEX ينتقل إلى migration SQL منفصل (يُنفَّذ خارج runtime بدور superuser بموافقة).
route handler = business logic فقط.
المعالج لا يحاول إنشاء/تعديل الجدول؛ المخطط يُدار خارج-النطاق (migration SQL بدور superuser).
إذا schema ناقص ⇒ المعالج يُرجِع خطأ منظّم (الموجود: try/catch → 500) بدلاً من محاولة DDL.
```

## القرار الهندسي
**إزالة** عبارات `await pool.query(\`CREATE/ALTER ... IF NOT EXISTS ...\`)` من المعالجات. تعريفات الـDDL تُحفَظ في candidate SQL (Gate 5) للتزويد خارج-النطاق.
**🔴 تصحيح حاسم (تحقّق فعلي 2026-06-21)**: 13 من جداول المسارات (كل جداول Batch A) **غير موجودة** في الإنتاج (المسارات لم تُستدعَ قط). لذا الـDDL ليس «زائداً ميتاً» بل **منشئاً فعلياً عند أول استدعاء** — وتحت الدور المقيَّد يفشل. ⇒ نشر إزالة الكود **يجب أن يصاحبه/يسبقه تشغيل `route_level_ddl_cleanup_candidate_up.sql` (superuser)** لإنشاء الجداول، وإلا تفشل المسارات بـ42P01 بدل 42501 (نفس 500). الكود وحده لا يكفي.

## تقسيم الدفعات
```text
Batch A (أعلى استخداماً / 500 مباشر على تدفّق المريض والعيادة والمالية):
  - PUT /api/appointments/:id/checkin (visit_lifecycle) ← مسار أساسي في تدفّق المريض
  - POST/GET /api/visits/lifecycle(/today) (visit_lifecycle)
  - GET /api/obgyn/stats (obgyn_pregnancies, obgyn_deliveries)
  - POST/GET /api/referrals (referrals)
  - POST/GET(/:id) /api/medical-reports (medical_reports)
  - POST /api/cash-drawer/open (cash_drawer)

Batch B (500 مباشر على مسارات ثانوية/تقارير):
  - (pathology) pathology_specimens ؛ (cssd) cssd_batches ؛ (cme) cme_events
  - infection-control (infection_control_reports) ؛ (maintenance) maintenance_orders
  - GET /api/insurance/policies (insurance_policies)
  - GET /api/inventory (inventory CREATE) ؛ GET /api/pharmacy/prescriptions (pharmacy_prescriptions CREATE)

Batch C (DDL مبتلَع بـ.catch — لا 500، لكن «ابتلاع DDL» محظور ⇒ تنظيف لاحق):
  - pharmacy_prescriptions_queue ALTERs (POST /api/prescriptions, PUT /api/pharmacy/queue/:id)
  - inventory ALTERs الثانوية + pharmacy_prescriptions ALTERs المبتلَعة
```

## نطاق هذا المرشّح (Gate 6)
- **يُزال في هذا المرشّح**: **Batch A** فقط (10 تعديلات نظيفة، مطابقة فريدة مُتحقَّقة) = مسارات تدفّق المريض + العيادة/المالية الأساسية: `appointments/:id/checkin` + `visits/lifecycle(/today)` (visit_lifecycle×3)، `obgyn/stats`، `referrals` (POST+GET)، `medical-reports` (POST+GET+:id)، `cash-drawer/open`.
- **مؤجّل (Batch B)**: pathology/cssd/cme/infection_control/maintenance/insurance_policies/inventory(CREATE)/pharmacy_prescriptions(CREATE) — تحتاج قراءة سياق كامل لكل معالج لتعديل نظيف (ALTERs مكرّرة عبر مسارات) ⇒ مرشّح متابعة منفصل لتجنّب مطابقة غير-فريدة محفوفة.
- **مؤجّل (Batch C)**: عبارات DDL المبتلَعة بـ.catch (لا تسبب 500).
- candidate SQL (Gate 5) يغطّي **كل** الجداول (A+B+C) للتزويد خارج-النطاق سلفاً.
- السبب: السلامة والمراجعة — دفعة نظيفة فريدة المطابقة بدل إعادة كتابة ~18 موضعاً بمطابقات غير فريدة في ملف 7000 سطر (candidate غير منشور؛ الأولوية للصحّة).

## مسموح / ممنوع (مُلتزَم)
- مسموح: حذف DDL من المعالجات ؛ commit/push بلا force.
- ممنوع: نشر، restart، تنفيذ DDL، data change، GRANT، توسيع صلاحيات، تغيير ربط app.tenant_id، تغيير .env، تفعيل accounting، ابتلاع أخطاء DDL جديد.

## التحقق (Gate 7)
node --check ؛ لا startup DDL ؛ DDL المسارات (A+B) مُزال ؛ الربط+الغلاف محفوظان ؛ health route سليم ؛ لا .env ؛ لا أسرار ؛ accounting OFF.

`REFACTOR_PLAN_READY — REMOVE ALL DIRECT-500 ROUTE DDL (A+B) THIS CANDIDATE; SWALLOWED (C) DEFERRED; SQL CANDIDATE COVERS ALL`
