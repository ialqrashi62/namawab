# الدفعة 3 — جرد الخطط/الأسعار الحالي (GATE 2)

**التاريخ:** 2026-06-30 · الفرع: `feature/jumanasoft-plans-pricing` (متفرّع من root `17dd621` / submodule `0751e79`).
**النطاق:** قراءة فقط — لا تعديل كود في هذه البوابة.

## 1) جداول/أعمدة plans/pricing/subscriptions الحالية
| العنصر | الحالة |
|---|---|
| جدول `plans` (كتالوج) | **غير موجود.** |
| جدول `subscriptions` | **غير موجود.** |
| جدول `plan_entitlements` / حدود الميزات | **غير موجود.** |
| جدول `tenant_plan_assignments` | **غير موجود.** |
| `tenants.plan_type` | **موجود** — `VARCHAR(50) DEFAULT 'standard'` ([db_postgres.js:1687](../../../namaweb/db_postgres.js#L1687))، نصّ حر بلا كتالوج/تحقّق. |
| `tenants.status` | **موجود** — `VARCHAR(50) DEFAULT 'active'` (تستخدمه الدفعة 1). |

> ملاحظة: `tenants` في الإنتاج أغنى من DDL الإقلاع (يضيف onboarding أعمدة `archetype/moh_license/cr_no/vat_no` عبر مسار E0). لن نلمس `tenants` في هذه الدفعة.

## 2) entitlements / feature flags
- **لا يوجد** نظام استحقاقات أو حدود ميزات مرتبط بالخطة.
- التحكم بالوصول حالياً عبر الأدوار فقط (`ROLE_PERMISSIONS` + `requirePermission` + مصفوفة `role_permissions`) — **ليس** مرتبطاً بخطة المستأجر.
- بدائل القياس المتاحة للحدود: `facilities` (مرتبطة بالمستأجر) ≈ الفروع، `user_tenants` ≈ المستخدمون، `audit_trail` ≈ النشاط.

## 3) APIs للخطط
- **لا APIs لإدارة الخطط.** Super Admin (الدفعة 1) يعرض `plan_type` كنصّ عرض فقط ضمن قائمة/تفاصيل المستأجر ويفلتر به ([super_admin.js:105](../../../namaweb/super_admin.js#L105)).

## 4) صفحات pricing عامة
- **لا توجد** صفحة أسعار عامة (`public/**/*pric*` = 0). الموقع العام لا يعرض خططاً.

## 5) منطق فوترة سابق (يجب عدم كسره)
- **لا منطق فوترة SaaS سابق.** فوترة الفواتير (e22 REAL→NUMERIC، idempotency على 4 مسارات مال) هي **على مستوى فاتورة المريض**، لا على مستوى اشتراك المستأجر — منفصلة تماماً ولا تتأثر.
- `onboarding.js` يكتب `plan_type` كنصّ حر عند إنشاء مستأجر ([onboarding.js:236](../../../namaweb/onboarding.js#L236)) — يبقى دون مساس؛ كتالوج الدفعة 3 يصبح مصدر الحقيقة مستقبلاً دون كسر الكتابة القديمة.

## 6) اختبارات billing/SaaS حالية
- **لا اختبارات فوترة/خطط SaaS.** مطابقات "plan" كلها سريرية/staging (nursing care plan، remediation plan) — لا علاقة لها بالاشتراكات.

## 7) الخلاصة وأثرها على التصميم
أرض خضراء بالكامل: **لا كتالوج، لا أسعار، لا استحقاقات، لا APIs، لا صفحة عامة، لا منطق سابق، لا اختبارات.** القرار:
- **جداول جديدة additive** (`plans`, `plan_entitlements`, `tenant_plan_assignments`) كـ **migration candidate غير مُشغَّل** — لا لمس لـ `tenants`/`plan_type` (توافق خلفي).
- **وحدة جديدة `plans.js`** (نواة نقيّة + راوتر) خلف `requireSuperAdmin` (جاهز من الدفعة 2) + قراءة عامة للخطط النشطة فقط.
- لا دفع/checkout/webhook (خارج النطاق صراحةً).
