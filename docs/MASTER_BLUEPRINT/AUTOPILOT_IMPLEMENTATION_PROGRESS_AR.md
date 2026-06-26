# تقرير تقدّم التنفيذ — Master Autopilot (E0 → E9)

> سجلّ حيّ لكل ما بُني/طُوِّر ضمن الأوتوبيلوت متعدّد الوكلاء. يُحدَّث بعد كل إبيك.
> **آخر تحديث:** 2026-06-26 — بعد اكتمال E6 وأثناء بناء E7.

---

## 1) المنهجية (حلقة الأوتوبيلوت الآمنة)

لكل إبيك: **Workflow متعدّد الوكلاء** =
1. **Map** — وكيل استكشاف للقراءة فقط (Explore) يرسم خريطة التكامل (ملفات/أسطر/جداول/مساعدات auth/نمط RLS/اتفاقيات الاختبار).
2. **Build** — وكيل بناء في **git worktree معزول** (`isolation:'worktree'`, `effort:'high'`)، يلتزم على فرع `feat/<epic>`، **لا يدفع/ينشر/يمسّ قاعدة البيانات**.
3. **Review** — مراجعة خصامية (`feature-dev:code-reviewer`) بأقصى صرامة.

ثم: وكيل إصلاح يطبّق ملاحظات المراجعة داخل الـworktree → **تحقّق مستقل** (`node --check` + الاختبارات بـ`NODE_PATH=main namaweb/node_modules`) → `git push origin feat/<epic>` (**فرع فقط — ليس main الحيّ**).

**درس مُثبت:** كل إبيك حتى الآن كشفت المراجعة فيه ثغرة حقيقية واحدة على الأقل → موقف «لا نشر تلقائي» صحيح ومُبرّر.

---

## 2) حالة النشر (حاسمة)

| البند | الحالة |
|---|---|
| الفرع الحيّ على الإنتاج | `main = 171b7c2` (دون أي إبيك) |
| النشر على alfaisal-erp.com | **لا شيء منشور** — تحقّق مباشر: نقاط E5 الجديدة تُرجع 404، `/health`=200 |
| موقع الإبيكات | فروع `origin/feat/*` فقط (دائمة، آمنة) |
| السبب | الوكيل يملك صلاحيات DB لدور التطبيق فقط (لا DDL)؛ مُصنِّف الـharness يمنع استكشاف الاعتمادات/superuser |
| خطوة النشر النهائية | **runbook اسمه DEPLOY_ALL ينفّذه المالك**: تشغيل migrations بترتيب الاعتماديات، ثم أنشر الكود + `pm2 restart` + smoke |

---

## 3) الإبيكات المنجَزة (فروع origin)

| # | الإبيك | الفرع / الـcommit | النطاق | اختبارات | ملاحظات المراجعة (أُصلحت) |
|---|--------|-------------------|--------|----------|----------------------------|
| E0 | تسجيل المنشآت (Onboarding Wizard) | `feat/e0-onboarding-wizard` `2b14cb9` | 4 migrations (tenants/facilities/facility_modules/integration_settings)، provision معاملة واحدة super-admin، ويزرد 5 أنماط | 80 | C1 cross-tenant integration_settings، I2 archetype→facility_type، I3 reg IDs، I4 subdomain regex |
| E-X | الأساسيات | `feat/ex-foundational` `1e6dfbf` | orders/order_items/order_sets + permissions/role_permissions (RBAC) + 92 فهرس tenant_id | 103 | C1 order_set_id FK يلتفّ على RLS، I1 RBAC seed set_config، I2 status CHECK، I3 ADMIN_ROLES |
| E1 | محطة الطبيب (CPOE/CDS) | `feat/e1-doctor-station` `b18694d` | محرّك CDS fail-safe (cds.js)، CPOE، problems/clinical_notes | 198 | CRIT-1 تفاعل دواء-دواء مفقود server-side، CRIT-2 active_meds موثوق من العميل، +4 IMP (fail-closed) |
| E2 | إدارة المعلومات الصحية (HIM) | `feat/e2-him` `93ee1ba` | coding/roi_requests/record_access_log، 9 نقاط /api/him/* | 142 | CRIT-1..4 predicate tenant_id صريح، IMP audit fail-closed، ROI self-approve 403 |
| E3 | المختبر (LIS) | `feat/e3-laboratory` `df9f4b3` | autoVerify fail-safe، lab_samples/results/critical_callbacks/qc، HL7 gated | 160 | Issue-1 delta baseline من verified فقط، Issue-2 re-report 409، Issue-3 حالة ميتة |
| E4 | الأشعة (RIS/PACS) | `feat/e4-radiology` `b61d1fd` | rad_exams/dicom_studies/rad_reports، MWL gated، صور عبر /api/phi-files المحمي | 149 | Issue-1 RBAC على sign/notify/addendum، Issue-2 تحقّق notified_doctor عبر user_tenants |
| **E5** | **الصيدلية (Pharmacy)** | `feat/e5-pharmacy` `25b06c9` | FEFO صرف ذرّي، تحقّق صيدلي (إعادة تشغيل cds.js على أدوية مشتقّة من الخادم)، أدوية مراقَبة بقيد مزدوج + شاهد، Wasfaty gated | 44+74 | **C1 زر الصرف الأساسي في الواجهة كان يلتفّ على كامل منظومة أمان E5 عبر مسار PUT قديم** → أُعيد توجيهه لـ`POST /api/pharmacy/dispense`؛ **C2** صلاحية مفقودة على `/expiring`؛ **I1** مسارات مكرّرة (legacy تظلّل E5)؛ **I2** رصيد سجل المراقَبة من عدّاد catalog قديم → `SUM(drug_batches.qty_on_hand)` |
| **E6** | **التمريض/MAR (Nursing/MAR)** | `feat/e6-nursing-mar` `2b0fe25` | MAR بـ«5 حقوق» بالباركود (مريض/دواء/جرعة/طريق/وقت) مفروضة server-side fail-closed، شاهد للأدوية عالية الخطورة، CDS عند الإعطاء، درجات (Morse/Braden/NEWS2) محسوبة بالخادم، تقييمات، سجلّ I/O | 25+34+49 | **جولتان مراجعة.** الجولة-1 BLOCK: البناء مات في منتصف الاتصال (DDL+المحرّك فقط، لا مسارات/توصيل) → أُكمل (8 بنود: مسار `/api/mar/administer` آمن، `/api/nursing/scores` يحسب بالخادم، RBAC+tenant على التقييم، FKs، audit، اختبارات). الجولة-2 APPROVE_WITH_FIXES: **C1 تجاوز الشاهد-الذاتي عبر معرّف مبطّن بمسافة** → مقارنة `parseInt`؛ I3 خطأ محرّك الحساسية fail-soft → fail-closed؛ I2 fallback غير مُنطَّق في getPatientActiveMeds → throw؛ I1 route='Oral' مفروض → null عند عدم المعرفة؛ L1/L3 اختبارات+RBAC |

---

## 4) قيد التنفيذ

- **E7 — الطوارئ/ED** 🔄 (بناء): فرز ESI، tracking board، مؤقّت time-to-provider.

## 5) في الطابور

- **E8** التنويم/ADT (admit/transfer/discharge، أسرّة/أجنحة، census).
- **E9** العناية المركّزة/ICU (flowsheets، ventilator، scores).

## 6) قواعد البناء الثابتة (كل الإبيكات)

- migrations = ثلاثيات candidate (up/validate/down)، idempotent (`IF NOT EXISTS`/`DROP ... IF EXISTS`)، `FORCE ROW LEVEL SECURITY` + السياسة المعيارية `tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer` + `tenant_id INTEGER NOT NULL REFERENCES tenants(id)`؛ الـdown يُسقط فهارسه.
- كل استعلام يحمل predicate صريح `AND tenant_id=$N` فوق FORCE RLS؛ tenant فارغ → fail-closed (صفر صفوف)، لا fallback غير مُنطَّق.
- كل إجراء حسّاس → `audit_log`؛ كل مسار → `requireAuth + requireRole + requireTenantScope`.
- زر الواجهة الأساسي يجب أن يستدعي المسار الآمن (درس E5) — لا توصيل بمسار قديم غير محروس.
- إعادة استخدام `cds.js` و`getPatientActiveMeds` (مشتقّ من الخادم، مضادّ للانتحال) بدل إعادة التنفيذ.

## 7) DEPLOY_ALL (للمالك — لاحقاً)

عند الاعتماد: (1) تشغيل migrations لكل إبيك بترتيب الاعتماديات على دور DB مخوّل، كلٌّ متبوع بـ`_validate.sql`؛ (2) دمج الفروع إلى main بترتيب اللينياج (E1 قبل E5/E6)؛ (3) نشر الكود + `pm2 restart nama-app`؛ (4) smoke: `/health`=200، `FORCE_RLS≥150`. التراجع: `_down.sql` بالعكس + `git checkout` + restart.
