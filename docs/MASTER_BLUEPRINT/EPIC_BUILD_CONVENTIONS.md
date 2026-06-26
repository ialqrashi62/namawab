# EPIC BUILD CONVENTIONS — قواعد بناء الإبيكات (مرجع موحّد)

> مرجع ثابت لكل وكلاء البناء/المراجعة/الإصلاح. يلخّص الحلقة الآمنة + المتطلّبات الصارمة + الدروس المتكرّرة، حتى لا تُعاد كتابتها في كل prompt.

## الحلقة الآمنة (لكل إبيك)
Map (قراءة فقط، Explore) → Build (worktree معزول، opus، commit-early-and-amend، **لا push/deploy/DB**) → Review (مراجعة خصامية، feature-dev:code-reviewer) → Fix (وكيل sonnet داخل الـworktree) → تحقّق مستقل (node --check + اختبارات) → `git push origin feat/<epic>` (فرع فقط). **لا نشر — live main يبقى `171b7c2` حتى DEPLOY_ALL يُنفّذه المالك.**

## بيئة
- app: `namaweb/` (Node/Express monolith). server.js + public/js/app.js (~11k سطر) + db_postgres.js.
- اختبارات DB-free تحاكي الـpool. شغّلها بـ`NODE_PATH=c:\Users\ice\Desktop\NamaMedical\namaweb\node_modules`.
- محرّكات/وحدات `require`d قائمة لإعادة الاستخدام: `cds.js` (تفاعلات/حساسية/جرعة)، `getPatientActiveMeds(patientId, tenantId)` (مشتقّ من الخادم)، `esi_engine.js`، `nursing_scores.js`، `icu_scoring.js`. **أعِد الاستخدام، لا تُعِد التنفيذ.**
- حُرّاس tenant fail-closed موجودون: `e7RequireTenant`/`e8RequireTenant`/`e9RequireTenant` (يرمي 403 على tenant فارغ). أعِد استخدام النمط؛ أي helper جديد يجب أن يرمي/يُرجع صفراً على tenant فارغ.

## المتطلّبات الصارمة (HARD — غير قابلة للتفاوض)
1. **عزل المستأجر:** كل استعلام يحمل `AND tenant_id=$N` صريحاً **فوق** FORCE RLS. tenant فارغ → fail-closed (403/صفر صفوف). **ممنوع** أي `tenantId ? scoped : unscoped` fallback غير مُنطَّق.
2. **RBAC:** كل مسار `requireAuth + requireRole(<أدوار مناسبة>) + requireTenantScope`. كل إجراء حسّاس يُدقَّق عبر `logAudit`.
3. **زر الواجهة الأساسي يجب أن يستدعي المسار الآمن.** بعد إضافة مسار آمن جديد، **افحص العميل (app.js) عن أي handler قديم يلتفّ على آلة الحالة/التحقّق عبر مسار legacy** وأعِد توجيهه أو صلّبه أو اجعله 409. (هذا النمط تكرّر في E5/E6/E7/E8.)
4. **عند تعريف `window.<name>` عام، ابحث أولاً عن تعريف سابق بنفس الاسم ولا تطمسه** (درس E8: طمس `window.dischargePatient` كسر وحدة أخرى صامتاً).
5. **لا حقول سلطة موثوقة من العميل:** الدرجات/الحالات/الأسعار/الهوية تُحسب/تُتحقَّق server-side. الانتحال ممنوع.
6. **مقارنة المعرّفات كأعداد صحيحة** (درس E6: تجاوز عبر معرّف مبطّن بمسافة `' 5'` → استخدم `parseInt`/`Number.isInteger`).
7. **fail-CLOSED على أخطاء المحرّكات الحرجة** (درس E6: خطأ محرّك الحساسية كان fail-soft → اجعله critical/block).
8. **عمليات الموارد المشتركة (أسرّة/مخزون/دفعات) معامِلاتية وآمنة للتسابق:** `SELECT … FOR UPDATE` داخل transaction قبل أي تغيير حالة؛ اقفل موارد متعدّدة بترتيب id تصاعدي (درس E8: تجمّد AB/BA). الإدخال الناقص → Incomplete لا قيمة مطمئنة كاذبة (درس E6 Braden).
9. **آلة الحالة server-side:** ارفض الانتقالات غير الصالحة (409/422)، لا تكتفِ بإخفائها في الواجهة.
10. **XSS:** كل قيمة من الخادم في innerHTML عبر `escapeHTML`؛ `safeId`/`jsStr` في onclick؛ `rawHtml` للماركب الثابت فقط. **SQLi:** كل الاستعلامات بـ`$N` (لا تضمين نصّي).

## Migrations (candidate فقط — لا تُنفَّذ)
- ثلاثيات `migrations/<key>_NN_<name>_{up,validate,down}.sql`، `BEGIN;…COMMIT;`، idempotent (`IF NOT EXISTS`/`DROP … IF EXISTS`).
- FORCE RLS + السياسة المعيارية: `USING/WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)`.
- `tenant_id INTEGER NOT NULL REFERENCES tenants(id)` + FK للمريض/الكيان الأب (`REFERENCES patients(id)` إلخ).
- `down` يُسقط الجداول **الجديدة** أولاً ثم سياساتها؛ للجداول القائمة سابقاً يعكس الإضافات فقط (**لا يُسقط جداول قائمة**).
- `validate` يفحص كل الثوابت (force_rls=t، FK موجود لكل جدول، NOT NULL).
- **لا تُضِف جداول الإبيك إلى كتلة bootstrap في db_postgres.js** (candidate-only؛ تكسر الإقلاع بـ"relation does not exist").
- تحذير: `UPDATE … SET tenant_id=1 WHERE tenant_id IS NULL` نمط dev — يحتاج مراجعة على بيانات حيّة متعدّدة المستأجرين.

## الاختبارات (3 لكل إبيك على الأقل)
- `<key>_<feature>_test.js` — منطق العمل + آلة الحالة (انتقالات غير صالحة → 409/422).
- `cross_tenant_<key>_test.js` — A لا يقرأ/يكتب بيانات B (tenant فارغ fail-closed؛ معرّف عابر → 0/404).
- `<key>_<engine>_unit_test.js` — إن وُجد محرّك حساب نقي (حدود/bands/incomplete).
- شغّل + انحدار (`e1_rx_cds_gate_test.js` على الأقل + أي اختبار مجاور). الكل 0 فشل.

## Git
- commit على `feat/<epic>`، رسالة تنتهي بـ:
  `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`
- **commit مبكراً ثم amend** (درس E6: وكيل بناء مات في منتصف الاتصال دون commit → ضاع كل شيء). فرع غير ملتزَم = غير قابل للاسترداد.
- لا push/force/deploy/DB. التحقّق المستقل ثم الدفع يتولّاهما المنسّق (لا الـbuild agent).

## الفروع المنجَزة (lineage) — انظر DEPLOY_ALL_RUNBOOK_AR.md
E0/E-X/E1/E2/E3/E4 عن main؛ E5/E6/E7 عن E1؛ E8 عن E7؛ E9 عن E8. الموجة الثانية (E10+) عن main (171b7c2) إلا ما يعتمد على إبيك سابق (مثلاً التأمين يعتمد الفوترة).
