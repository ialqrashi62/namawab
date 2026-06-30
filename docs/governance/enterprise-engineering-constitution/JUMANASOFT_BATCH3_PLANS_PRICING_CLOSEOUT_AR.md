# الدفعة 3 — تقرير إغلاق الخطط والأسعار (GATE 10)

**التاريخ:** 2026-06-30 · الفرع: `feature/jumanasoft-plans-pricing` (متفرّع من root `17dd621` / submodule `0751e79`).

## 1) ملخّص التنفيذ
أساس **الخطط والأسعار والاستحقاقات** لجمانة سوفت SaaS: كتالوج خطط (هوية + تسعير + استحقاقات) يديره Super Admin، وربط مستأجر بخطة، وقراءة عامة للخطط النشطة — **بلا دفع فعلي، بلا checkout/webhook، بلا DDL على production، بلا كسر الدفعتين 1/2**.

## 2) الملفات (مُنشأة/معدّلة)
**كود (namaweb):**
- `plans.js` (جديد) — نواة نقيّة (`validatePlanInput`/`validateEntitlements`/`canAssignPlan`/`deriveCurrentPlan`/`publicPlanView`/`planAdminView`) + `makePlansRouter` (إدارة) + `makePublicPlansRouter` (قراءة عامة fail-safe).
- `plans_test.js` (جديد) — **47 اختباراً** (نقيّ + HTTP صلاحيات/تحقّق/تعطيل-ناعم/تعيين/audit/عام).
- `server.js` (معدّل، +11) — تركيب راوتر الإدارة خلف `requireSuperAdmin` (داخل علم `SUPER_ADMIN_ENABLED`) + راوتر عام `/api/public/plans`.
- UI: `public/super-admin/index.html` (تبويبات)، `plans-admin.js` (جديد)، تعديل `super-admin.js` (تبويب + نقطة ربط خطة المستأجر)، `super-admin.css` (أنماط).
- `migrations/e25_plans_pricing_candidate_{up,down,validate}.sql` (جديد) — **candidate، لم يُشغَّل**.

**توثيق:** INVENTORY · DESIGN · DDL_DECISION · SECURITY_BUSINESS_REVIEW · CLOSEOUT (هذا).

## 3) أسئلة الامتثال (إجابات صريحة)
| سؤال | الجواب |
|---|---|
| هل تم لمس production؟ | **NO.** لا SSH، لا نشر؛ كل العمل على الفرع المحلي. |
| هل تم تشغيل DDL/migration؟ | **NO.** `e25` candidate لم يُشغَّل على أي قاعدة (لا production، ولا محلياً، ولا test — الاختبارات بـ pool وهمي). |
| هل ظهرت أسرار؟ | **NO.** فحص نظيف؛ لا مفاتيح دفع. |
| هل أُضيف دفع فعلي؟ | **NO.** لا Stripe/Moyasar/HyperPay، لا checkout/webhook/capture/فواتير/dunning/cron. |
| force push / حذف بيانات / دمج boilerplate؟ | **NO / NO / NO.** |
| كسر الدفعة 1 أو 2؟ | **NO.** super_admin 28/28 · rbac_guards 23/23 سليمة. |

## 4) نتائج الاختبارات
- `plans_test`: **47/47** — يشمل: مجهول 401 / أدمن مستأجر 403 / Super Admin 200؛ رفض سعر سالب + عملة غير صالحة + وحدة مجهولة (400)؛ مفتاح مكرّر 409؛ **تعطيل ناعم لا يحذف**؛ تعيين (مستأجر/خطة غير موجودة 404، خطة معطّلة 409، نجاح + audit، إغلاق التعيين السابق)؛ العام يعرض النشطة فقط بلا حقول إدارية؛ **fail-safe [] عند غياب الجداول**؛ راوتر غير مُركَّب → 404.
- regression: super_admin 28/28 · rbac_guards 23/23 · المجموعة الآمنة **97/97**.

## 5) بوابات الجودة
- `node --check`: `plans.js`/`server.js`/`plans-admin.js`/`super-admin.js` — **OK**.
- mojibake: **0** على كل ملفات الدفعة (U+FFFD + BOM = 0؛ iconv UTF-8 = VALID).
- `git diff --check`: **نظيف** (root + submodule). secret scan: **نظيف**. dependency: **لا تبعيات جديدة** (`plans.js` يستخدم `express` فقط).
- typecheck/lint/build: غير منطبق (JS صرف، لا إعداد lint؛ الواجهة CSS عادي).

## 6) المخاطر المتبقية
1. **الاستحقاقات وصفية بعد** (catalog) — الإنفاذ وقت التشغيل (gating حسب الخطة) دفعة لاحقة.
2. `tenant_plan_assignments` بلا RLS — مقبول (جدول منصّي عبر `requireSuperAdmin` فقط)؛ أي endpoint مستأجر مستقبلي يتطلّب RLS/scoping.
3. الجداول غير موفّرة حتى يشغّل المالك `e25` candidate على staging/إنتاج (runbook منفصل) — حتى ذلك: إدارة الخطط 500، العامة fail-safe `[]`.

## 7) خطة التراجع (Rollback)
- لا أثر على production (لم يُنشر). محلياً: حذف الفرع أو `git revert`. لا rollback DB (لم يُشغَّل `e25`؛ وإن شُغِّل على test معزول، يوجد `e25_..._down.sql`).

## 8) القرار النهائي
**BATCH3_PLANS_PRICING_PASS**

## 9) الخطوة التالية المقترحة
- (عند الرغبة) توفير `e25` على staging بإذن المالك + تفعيل Super Admin (`SUPER_ADMIN_ENABLED`/`SUPER_ADMIN_USERS`) لتجربة الكتالوج حيّاً.
- الدفعة 4: **إنفاذ الاستحقاقات وقت التشغيل** (ربط الحدود/الوحدات بنقاط الإنشاء والوصول) — تبني على هذا الأساس.
