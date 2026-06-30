# الدفعة 4C — تقرير إغلاق مرشّح إنفاذ max_users (GATE 10)

**التاريخ:** 2026-06-30 · الفرع: `feature/jumanasoft-max-users-enforcement-candidate` (من root `ce326a9` / submodule `be4dd86`).

## 1) ملخّص التنفيذ
مرشّح إنفاذ واحد ومنخفض المخاطر لاستحقاق **`max_users`** عند `POST /api/settings/users`، **خلف feature flags، fail-open، بلا DDL، بلا staging، بلا تفعيل حيّ**. يعيد استخدام `entitlements.js` (الدفعة 4A) بالكامل — لا تكرار منطق.

## 2) الملفات (مُنشأة/معدّلة)
**كود (namaweb):**
- `entitlements.js` (معدّل، +56) — `countTenantUsers(pool, tenantId)` (active members) + `makeUserLimitGuard(deps)` (middleware: disabled=no-op / observe=تسجيل / enforce=منع؛ fail-open).
- `server.js` (معدّل، +8) — init `userLimitGuard` مرة واحدة (يقرأ env) + إدراجه في سلسلة `POST /api/settings/users` بعد `requireTenantAdmin`.
- `max_users_enforcement_test.js` (جديد) — **16 اختباراً** (مصفوفة الأعلام + fail-open + RBAC).

**توثيق:** INVENTORY · DESIGN · DDL_DECISION · SECURITY_BUSINESS_REVIEW · STAGING_ACTIVATION_RUNBOOK · CLOSEOUT (هذا).

## 3) أسئلة الامتثال (إجابات صريحة)
| سؤال | الجواب |
|---|---|
| هل تم لمس production؟ | **NO.** |
| هل تم تشغيل DDL/e25؟ | **NO.** |
| هل تم تفعيل enforcement فعلياً؟ | **NO.** كود مرشّح خلف flags؛ `ENTITLEMENTS_ENABLED=false` افتراضاً. |
| هل الكود خلف flags؟ | **YES.** disabled=no-op، observe=لا منع، enforce=منع. |
| observe/enforce runtime على بيئة حقيقية؟ | **NO.** لا staging؛ اختبارات بـ pool وهمي فقط. |
| هل أُضيف دفع؟ | **NO.** |
| هل ظهرت أسرار؟ | **NO.** |
| force push / حذف بيانات / boilerplate؟ | **NO / NO / NO.** |
| كسر Batch 1/2/3/4A/4B docs؟ | **NO.** كلها سليمة. |

## 4) نتائج الاختبارات
- `max_users_enforcement_test`: **16/16** — disabled=no-op (بلا audit)، observe فوق الحدّ لا يمنع + `OBSERVED`، enforce تحت الحدّ يسمح، enforce عند/فوق الحدّ يمنع 409 + `BLOCKED` + رسالة ثنائية + لا تسريب داخلي، unlimited يسمح، e25 غائب fail-open يسمح، خطأ العدّ fail-open + `FAILOPEN`، لا سياق مستأجر يسمح، RBAC: غير الأدمن 403 قبل الحارس.
- regression: super_admin 28 · rbac_guards 23 · plans 47 · entitlements 27 · المجموعة الآمنة **97/97**.

## 5) بوابات الجودة
- `node --check`: `entitlements.js`/`server.js` — **OK**.
- mojibake **0** · iconv UTF-8 **VALID** · `git diff --check` **نظيف** · secret scan **نظيف** · dependency: **لا تبعيات جديدة** (`entitlements.js` يستورد `./plans` فقط).

## 6) المخاطر المتبقية
1. **فجوة العدّ:** مسار الإنشاء لا يربط `user_tenants` → العدّ قد لا ينمو عبره؛ **يجب تأكيد/إصلاح الربط قبل enforce الحيّ** (مدرَج في runbook التفعيل 4C).
2. مسار onboarding (إنشاء ثانٍ) غير مربوط — مقصود (نقطة واحدة).
3. التفعيل الحيّ مؤجّل حتى نجاح 4B على staging.

## 7) خطة التراجع (Rollback)
- لا أثر على production (لم يُنشر). فوري عند التفعيل لاحقاً: `MODE=observe` (يوقف المنع) أو `ENTITLEMENTS_ENABLED=false` (no-op تام). لا DDL/كتابة من الحارس. محلياً: حذف الفرع أو `git revert`.

## 8) القرار النهائي
**BATCH4C_MAX_USERS_ENFORCEMENT_CANDIDATE_PASS**

## 9) الخطوة التالية المقترحة
- **devops:** تنفيذ 4B على staging (شرط أساسي).
- بعد 4B: تفعيل 4C على staging (observe ثم enforce) عبر `JUMANASOFT_BATCH4C_STAGING_ACTIVATION_RUNBOOK_AR.md` — مع تأكيد ربط `user_tenants` أولاً.
- لاحقاً (دفعات تالية): مرشّحات إنفاذ إضافية بحذر (modules ثم — بأعلى حذر — invoices).
