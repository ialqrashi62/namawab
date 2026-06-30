# الدفعة 3 — قرار DDL (GATE 4)

**التاريخ:** 2026-06-30 · الفرع: `feature/jumanasoft-plans-pricing`.

## القرار: **migration candidate additive — لم يُشغَّل على production**

المخطط الحالي **غير كافٍ** (لا توجد جداول plans/entitlements/assignments — انظر جرد GATE 2)، لذا تتطلّب الدفعة جداول جديدة. أُنشئت كـ **مرشّح additive فقط**:

| الملف | المحتوى |
|---|---|
| `migrations/e25_plans_pricing_candidate_up.sql` | `CREATE TABLE IF NOT EXISTS` لـ `plans` / `plan_entitlements` / `tenant_plan_assignments` + فهرسان + قيود CHECK (سعر ≥ 0، صيغة plan_key، مصدر التعيين). |
| `migrations/e25_plans_pricing_candidate_down.sql` | `DROP TABLE IF EXISTS` (ترتيب عكسي) — لقاعدة اختبار معزولة فقط؛ الجداول جديدة فلا فقدان بيانات قائمة. |
| `migrations/e25_plans_pricing_candidate_validate.sql` | تحقّق قراءة-فقط يُرجع `all_ok` عند اكتمال الجداول/القيود/الفهارس. |

## الامتثال
- **المسموح المُستخدَم:** `CREATE TABLE` additive، `ADD`-style nullable/default آمن، `CREATE INDEX`، قيود `CHECK`/`FOREIGN KEY`.
- **الممنوع — لم يُستخدَم:** لا `DROP` (عدا ملف الـ down المخصّص للاختبار المعزول)، لا `TRUNCATE`، لا `ALTER` هدّام، لا تعديل `tenants`/`plan_type`، لا إعادة كتابة بيانات.
- **لم يُشغَّل أي migration على production** (ولا على أي قاعدة في هذه الدفعة — الاختبارات تستخدم pool وهمياً، لا DB حقيقية).
- `tenants.plan_type` و`tenants.status` **دون مساس** (توافق خلفي مع الدفعة 1 وonboarding).

## خطة التراجع (Rollback)
- لا أثر على production (لم يُشغَّل). على قاعدة اختبار معزولة فقط: `e25_..._down.sql` يُسقِط الجداول الثلاث الجديدة (لا بيانات قائمة تُفقَد).
- على مستوى الكود: حذف الفرع `feature/jumanasoft-plans-pricing` أو `git revert`.

## نطاق التشغيل الصريح
- **لم يُشغَّل محلياً ولا على test ولا على production.** الجداول موجودة كنصّ SQL مرشّح فقط؛ منطق التطبيق مُختبَر بـ pool وهمي (no DB).
- التفعيل الفعلي = توفير الجداول على staging/إنتاج بإذن المالك عبر runbook منفصل (خارج هذه الدفعة).
