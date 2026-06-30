# الدفعة 4A — تقرير إغلاق Entitlements Runtime Resolver (GATE 11)

**التاريخ:** 2026-06-30 · الفرع: `feature/jumanasoft-entitlements-runtime` (من root `6927d89` / submodule `de3b762`).

## 1) ملخّص التنفيذ
طبقة **Entitlements Runtime Resolver** قابلة للتفعيل تدريجياً: تحلّ استحقاقات المستأجر وقت التشغيل وتوفّر فحوص ميزة/حدّ، **بلا DDL، بلا إنفاذ فعلي، بلا كسر السلوك الحالي**. الربط الوحيد = نقطة قراءة **observe-only** في Super Admin (عرض الاستحقاقات المحسوبة). آمن تماماً عند غياب جداول e25 (fail-open موثّق) وخامل تماماً عند `ENTITLEMENTS_ENABLED=false`.

## 2) الملفات (مُنشأة/معدّلة)
**كود (namaweb):**
- `entitlements.js` (جديد) — نواة نقيّة (`mergeDefaults`/`hasFeature`/`checkLimit`/`pickEnforcement` + قوائم بيضاء للميزات/الحدود) + `makeEntitlementsResolver` (adapter fail-open + cache TTL + observe).
- `entitlements_test.js` (جديد) — **27 اختباراً** (نقيّ + resolver fail-open/no-plan/plan/cache/observe + HTTP صلاحيات).
- `server.js` (معدّل، +18) — endpoint `GET /api/super-admin/tenants/:id/entitlements` خلف `requireAuth`+`requireSuperAdmin`، **خلف علم `ENTITLEMENTS_ENABLED`** (خامل افتراضاً).
- `public/super-admin/plans-admin.js` (معدّل، +28) — عرض «الاستحقاقات المحسوبة» observe في تفاصيل المستأجر (يُتجاهَل بصمت عند التعطيل).

**توثيق:** INVENTORY · DESIGN · DDL_DECISION · SECURITY_BUSINESS_REVIEW · STAGING_E25_RUNBOOK (4B) · CLOSEOUT (هذا).

## 3) أسئلة الامتثال (إجابات صريحة)
| سؤال | الجواب |
|---|---|
| هل تم لمس production؟ | **NO.** |
| هل تم تشغيل DDL/migration؟ | **NO.** لم يُشغَّل e25 على أي قاعدة (production/staging/local). الاختبارات بـ pool وهمي. |
| هل تم تفعيل enforcement؟ | **observe فقط + خلف feature flag.** `ENTITLEMENTS_ENABLED=false` افتراضاً؛ `MODE=observe`؛ **لا نقطة إنشاء مربوطة**. |
| هل أُضيف دفع فعلي؟ | **NO.** |
| هل ظهرت أسرار؟ | **NO.** |
| force push / حذف بيانات / boilerplate؟ | **NO / NO / NO.** |
| كسر Batch 1/2/3؟ | **NO.** super_admin 28/28 · rbac_guards 23/23 · plans 47/47 سليمة. |

## 4) نتائج الاختبارات
- `entitlements_test`: **27/27** — يشمل: defaults آمنة، تطبيع الصفوف، `hasFeature`/`checkLimit` يرفضان المجهول، observe لا يمنع، enforce يمنع عند/فوق الحدّ، `pickEnforcement` يردّ القيم غير الصالحة، fail-open عند غياب الجداول (لا throw)، no_plan، plan present، cache (إصابة/انتهاء)، observeLimit يسجّل ولا يمنع، HTTP: Super Admin 200 / أدمن مستأجر 403 / مجهول 401.
- regression: super_admin 28/28 · rbac_guards 23/23 · plans 47/47 · المجموعة الآمنة **97/97**.

## 5) بوابات الجودة
- `node --check`: `entitlements.js`/`server.js`/`plans-admin.js` — **OK**.
- mojibake: **0** (U+FFFD + BOM = 0؛ iconv UTF-8 = VALID). `git diff --check`: **نظيف**. secret scan: **نظيف**. dependency: **لا تبعيات جديدة** (`entitlements.js` يستورد `./plans` فقط).

## 6) المخاطر المتبقية
1. القيم الحقيقية تتطلّب توفير e25 على staging (Runbook 4B جاهز، غير مُنفَّذ) — حتى ذلك: observe يُظهر `no_plan/default` (fail-open).
2. `enforce` mode موجود بلا نقطة ربط في 4A — الإنفاذ الفعلي (users ثم invoices بحذر) دفعات تالية.
3. cache TTL=30s؛ عند ربط الإنفاذ لاحقاً يُستحسن `invalidate(tenantId)` عند تعيين الخطة (الدالة متوفّرة).

## 7) خطة التراجع (Rollback)
- لا أثر على production (لم يُنشر). محلياً: حذف الفرع أو `git revert`. لا rollback DB (no-DDL). تعطيل فوري عبر `ENTITLEMENTS_ENABLED=false` (يُزيل المسار كلياً).

## 8) القرار النهائي
**BATCH4A_ENTITLEMENTS_RUNTIME_FOUNDATION_PASS**

## 9) الخطوة التالية المقترحة
- (عند الرغبة) تنفيذ Runbook 4B على staging (توفير e25 + بذور + تفعيل observe) لقياس الأثر.
- الدفعة 4C: **ربط إنفاذ نقطة واحدة منخفضة المخاطر** (`max_users` على `POST /api/settings/users`) خلف `ENFORCEMENT_MODE=enforce`، بعد فترة مراقبة observe على staging.
