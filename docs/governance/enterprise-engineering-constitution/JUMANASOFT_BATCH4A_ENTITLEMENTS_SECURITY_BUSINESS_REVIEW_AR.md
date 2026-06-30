# الدفعة 4A — مراجعة أمنية وتجارية (GATE 9)

**التاريخ:** 2026-06-30 · الفرع: `feature/jumanasoft-entitlements-runtime`.
**المُراجَع:** `entitlements.js` (جديد)، `server.js` (+18، endpoint observe خلف علم)، `plans-admin.js` (+28، عرض observe)، `entitlements_test.js` (جديد).

## 1) قائمة التحقق الأمني
| البند | النتيجة | الدليل |
|---|---|---|
| لا enforcement شامل افتراضي | ✅ | `ENTITLEMENTS_ENABLED=false` افتراضاً → الـ resolver لا يُركَّب أصلاً. `ENFORCEMENT_MODE=observe` افتراضاً. **لا نقطة إنشاء مربوطة** في 4A. |
| لا كسر للمستأجرين عند غياب e25 | ✅ | الـ resolver **fail-open**: غياب الجداول/خطأ → `DEFAULT_ENTITLEMENTS` (حدود غير محدودة، لا gating) + `ENTITLEMENT_RESOLVE_FAIL` audit. مُختبَر (لا throw). |
| لا route حساس بلا guard | ✅ | `GET …/tenants/:id/entitlements` خلف `requireAuth` + `requireSuperAdmin`. مُختبَر: أدمن مستأجر 403، مجهول 401. |
| لا client-side-only entitlement | ✅ | الحساب على الخادم بالكامل؛ الواجهة **عرض فقط** (لا قرار صلاحية في المتصفح). |
| لا unknown feature pass-through | ✅ | `hasFeature`/`checkLimit` **يرميان** على مفتاح غير معروف. مُختبَر. |
| لا أسرار | ✅ | فحص نظيف؛ `console.log` يطبع الوضع (observe/enforce) فقط — لا قيم env/أسرار. |
| لا payment/checkout/webhook | ✅ | غير موجودة. |
| لا production config / DDL production | ✅ | لا env، لا نشر، لا DDL، لم يُشغَّل e25. |
| لا hard delete | ✅ | لا حذف بيانات؛ قراءة فقط. |
| لا bypass لـ RBAC | ✅ | لا تغيير على `requireRole`/`requirePermission`/`requireTenantAdmin`؛ endpoint جديد يضيف حارساً ولا يزيله. |

## 2) المراجعة التجارية
- **أعلام آمنة افتراضياً:** `ENABLED=false`, `MODE=observe`, `FAIL_MODE=allow_existing` → لا مفاجآت تشغيلية.
- **observe-only:** يحسب ويعرض ويسجّل التجاوزات (`ENTITLEMENT_OBSERVE`) **دون منع** — يتيح قياس الأثر قبل أي إنفاذ فعلي.
- **سلوك المستأجر بلا خطة موثّق:** `source='no_plan'` + استحقاقات افتراضية (غير محدود) — لا يُحرَم.
- **مفاتيح/حدود من قوائم بيضاء** فقط (تتسق مع كتالوج الدفعة 3).
- **رؤية Super Admin فقط** للاستحقاقات المحسوبة — أدمن المستأجر لا يديرها ولا يراها عبر هذا المسار.

## 3) المخاطر المتبقية (موثّقة، مقبولة)
1. **قيم حقيقية تتطلّب توفير e25** على staging؛ حتى ذلك الـ resolver يُرجِع الافتراضي (observe يُظهر `no_plan/default`). مقصود وآمن.
2. **`enforce` mode موجود لكن بلا نقطة ربط** في 4A — حتى مع تفعيله يبقى الأثر observe. الإنفاذ الفعلي (users أولاً، ثم invoices بحذر) = دفعات تالية.
3. **cache TTL=30s:** تغيير الخطة يظهر خلال ≤30s في observe (مقبول). عند ربط الإنفاذ لاحقاً يُستحسن استدعاء `invalidate(tenantId)` عند التعيين (الدالة متوفّرة).

## 4) الحكم
**لا enforcement شامل، لا كسر، لا ثغرات، fail-open آمن، خلف أعلام.** → `PASS`.
