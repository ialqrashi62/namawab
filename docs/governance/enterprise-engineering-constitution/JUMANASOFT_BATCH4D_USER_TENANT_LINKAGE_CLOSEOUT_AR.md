# الدفعة 4D — تقرير إغلاق سلامة ربط المستخدم بالمستأجر (GATE 10)

**التاريخ:** 2026-06-30 · الفرع: `feature/jumanasoft-user-tenant-linkage-integrity` (من root `b87a73b` / submodule `0747768`).

## 1) ملخّص التنفيذ
إغلاق فجوة عدّ `max_users`: أصبح `POST /api/settings/users` يربط المستخدم الجديد في `user_tenants` بمستأجر الجلسة **ذرّياً** (نفس معاملة إنشاء `system_users`)، فيُحتسَب في `countTenantUsers` ويصبح إنفاذ 4C ذا معنى. لا orphan (فشل الربط ⇒ rollback)، `tenant_id` من الجلسة فقط، **NO-DDL**، بلا تفعيل enforce.

## 2) الملفات (مُنشأة/معدّلة)
**كود (namaweb):**
- `user_provisioning.js` (جديد، **0 تبعيات**) — `createSystemUserWithTenantLink(client, {user, tenantId})`: معاملة BEGIN..COMMIT + ربط `app.tenant_id` (RLS) + `user_tenants ON CONFLICT DO NOTHING` + rollback عند الفشل.
- `server.js` (معدّل) — تحويل معالج `POST /api/settings/users` لاستدعاء الـ helper عبر عميل مخصّص (acquire-in-try + release في finally)؛ + require مبكر.
- `user_tenant_linkage_test.js` (جديد) — **20 اختباراً** (سلوكي + static).
- `settings_user_create_admin_guard_test.js` (معدّل) — تحديث توكيد البنية (الـ INSERT انتقل للـ helper؛ الحارس يسبق نداء الإنشاء).

**توثيق:** INVENTORY · DESIGN · DDL_DECISION · SECURITY_REVIEW · CLOSEOUT (هذا) · تحديث runbook التفعيل 4C.

## 3) أسئلة الامتثال (إجابات صريحة)
| سؤال | الجواب |
|---|---|
| هل تم لمس production؟ | **NO.** |
| هل تم تشغيل DDL/e25؟ | **NO.** |
| هل تم تفعيل enforcement؟ | **NO.** (حارس 4C خلف flags، غير مُفعّل). |
| هل أُغلقت فجوة `user_tenants`؟ | **YES.** الإنشاء يربط ذرّياً؛ مُثبَت أن العدّ ينمو +1. |
| هل أُضيف دفع؟ | **NO.** |
| هل ظهرت أسرار؟ | **NO.** |
| force push / حذف بيانات / boilerplate / كسر دفعات؟ | **NO / NO / NO / NO.** |

## 4) نتائج الاختبارات
- `user_tenant_linkage_test`: **20/20** — إنشاء+ربط ذرّي، ترتيب المعاملة (BEGIN<set_config<INS_USER<INS_LINK<COMMIT)، **العدّ ينمو +1** عبر `countTenantUsers`، بلا tenant لا ربط، فشل الربط ⇒ ROLLBACK ولا COMMIT، ON CONFLICT بلا تكرار، العالمي لا يُحتسب، وفحوص static على server.js.
- regression: super_admin 28 · rbac_guards 23 · plans 47 · entitlements 27 · max_users 16 · المجموعة الآمنة **97/97**.

## 5) بوابات الجودة
- `node --check`: `user_provisioning.js`/`server.js` — **OK**.
- mojibake **0** · iconv UTF-8 **VALID** · `git diff --check` **نظيف** · secret scan **نظيف** · dependency: **لا تبعيات جديدة** (`user_provisioning.js` بلا require).

## 6) المخاطر المتبقية
1. التفعيل الحيّ لـ enforce يبقى مؤجّلاً حتى نجاح 4B على staging (العدّ أصبح موثوقاً ⇒ شرط 4D مُستوفى).
2. مسارات الإنشاء الأخرى (onboarding/bootstrap) تربط أصلاً — لا orphan ضمن النطاق.

## 7) خطة التراجع (Rollback)
- لا أثر على production (لم يُنشر). محلياً: حذف الفرع أو `git revert`. لا DDL. السلوك السابق (إنشاء بلا ربط) قابل للاستعادة بالـ revert، لكن الربط هو الإصلاح المقصود.

## 8) القرار النهائي
**BATCH4D_USER_TENANT_LINKAGE_INTEGRITY_PASS**

## 9) الخطوة التالية المقترحة
- **devops:** تنفيذ 4B على staging (الشرط المتبقّي الوحيد للتفعيل).
- بعد 4B: تفعيل 4C (observe→enforce) على staging عبر runbook التفعيل المُحدَّث (يتضمّن الآن تحقّق نمو العدّ).
