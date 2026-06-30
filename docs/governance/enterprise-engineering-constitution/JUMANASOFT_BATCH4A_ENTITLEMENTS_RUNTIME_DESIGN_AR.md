# الدفعة 4A — تصميم Entitlements Runtime Resolver (GATE 3)

**التاريخ:** 2026-06-30 · الفرع: `feature/jumanasoft-entitlements-runtime`.
**المبدأ:** resolver نقيّ + DB adapter، آمن عند غياب e25، إنفاذ خلف flags، observe-only في 4A، أقل diff.

## 1) أعلام التحكّم (feature flags)
| العلم | القيم | الافتراضي | الأثر |
|---|---|---|---|
| `ENTITLEMENTS_ENABLED` | `true`/`false` | **`false`** | عند false: الـ resolver خامل تماماً — صفر تغيير سلوك، لا استعلامات إضافية. |
| `ENTITLEMENTS_ENFORCEMENT_MODE` | `observe`/`enforce` | **`observe`** | observe: يحسب ويسجّل فقط، **لا يمنع**. enforce: يمنع **فقط** عند نقاط مصرّح بها صراحةً (لا شيء في 4A). |
| `ENTITLEMENTS_FAIL_MODE` | `allow_existing`/`deny_new` | **`allow_existing`** | عند تعذّر الحساب (غياب e25/خطأ DB): allow_existing = **fail-open** (لا كسر). `deny_new` محجوز لمستقبل مبرّر فقط. |

> في 4A: لا توجد **أي** نقطة enforce فعلية. حتى مع `enforce`، لا مسار إنشاء مربوط — التأثير الفعلي = observe في كل الأحوال لهذه الدفعة.

## 2) الواجهة العامة (resolver نقيّ + adapter)
- `resolveTenantEntitlements(tenantId)` → `{ source, plan_key, entitlements, reason }`
  - يقرأ خطة المستأجر الحالية (من `tenant_plan_assignments` عبر `deriveCurrentPlan`) ثم استحقاقات تلك الخطة.
  - **عند غياب e25 أو لا خطة:** يُرجِع **الاستحقاقات الافتراضية الموثّقة** (`DEFAULT_ENTITLEMENTS`) مع `source='default'` و`reason` واضح — لا استثناء.
- `getTenantPlan(tenantId)` → `{ plan_key, source } | null`.
- `hasFeature(entitlements, featureKey)` → boolean (مفتاح غير معروف → **يرمي/يرفض**، لا pass-through).
- `checkLimit(entitlements, limitKey, currentUsage)` → `{ allowed, limit, usage, unlimited, mode }`
  - `limit === null` → غير محدود → `allowed=true`.
  - يحترم `ENFORCEMENT_MODE`: في observe دائماً `allowed=true` (مع تسجيل التجاوز)، في enforce يطبّق المقارنة.
- `KNOWN_FEATURES` / `KNOWN_LIMITS`: قوائم بيضاء (مفتاح خارجها → رفض صريح).

## 3) الاستحقاقات الافتراضية (عند غياب الخطة/e25)
آمنة وغير مدمّرة (**fail-open** افتراضياً): كل الحدود `null` (غير محدود)، الوحدات = فارغة (لا gating)، `support_level='standard'`, `api_access=false`, `custom_domain=false`. الأساس: **لا نكسر مستأجراً قائماً** لمجرّد أن الكتالوج غير موفّر.

## 4) المفاتيح المعروفة
- `KNOWN_LIMITS = [max_users, max_branches, max_invoices_per_month]`.
- `KNOWN_FEATURES = [api_access, custom_domain]` + وحدات `modules_enabled` (من قائمة وحدات `plans.js` البيضاء).

## 5) Cache (اختياري، قصير المدى)
- cache في الذاكرة لكل `tenantId` بـ TTL قصير (مثل 30s) لتفادي استعلام لكل طلب — **اختياري ومحافظ**: عند `ENTITLEMENTS_ENABLED=false` لا cache ولا استعلام. مفتاح الإبطال: تغيير خطة المستأجر (يمكن مسح الإدخال). في 4A نبقيه بسيطاً (TTL فقط، بلا إبطال معقّد) لأن الاستخدام observe.

## 6) Observability / Audit
- في observe: عند **تجاوز افتراضي** لحدّ، يُسجَّل حدث `ENTITLEMENT_OBSERVE` (tenant/limit/usage/limit) — بلا منع، بلا أسرار.
- عند فشل الحساب: `ENTITLEMENT_RESOLVE_FAIL` + fail-open. لا طباعة قيم env.

## 7) الأمان
- الهوية/السياق من الخادم فقط — **لا اعتماد على client-side**.
- مفاتيح غير معروفة (feature/limit) → **رفض صريح** (لا تجاوز صامت).
- لا bypass لـ RBAC: عرض الاستحقاقات المحسوبة يبقى خلف `requireSuperAdmin` (لا يديرها أدمن المستأجر).
- لا DDL، لا دفع، لا webhook.

## 8) المعمارية (أقل diff)
- **وحدة جديدة `namaweb/entitlements.js`:** ثوابت + دوال نقيّة (`hasFeature`/`checkLimit`/`mergeDefaults`/`pickEnforcement`) + `makeEntitlementsResolver({ pool, logAudit })` (adapter يقرأ e25 بأمان، يعيد الافتراضي عند الغياب) + cache بسيط.
- **ربط observe-only:** endpoint قراءة `GET /api/super-admin/tenants/:id/entitlements` (خلف `requireSuperAdmin`) يعرض الاستحقاقات المحسوبة + badge في تفاصيل المستأجر في الواجهة. **لا ربط بأي نقطة إنشاء.**
- لا تغيير على أي مسار قائم (users/invoices/...). عند `ENTITLEMENTS_ENABLED=false` السلوك مطابق تماماً.
