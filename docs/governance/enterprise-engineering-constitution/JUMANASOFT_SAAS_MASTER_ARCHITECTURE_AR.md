# جمانة سوفت — المعمارية الرئيسية لـ SaaS ERP (PHASE 2)

**التاريخ:** 2026-06-30 · مبنية على **المشروع الحالي** (Express + PostgreSQL RLS)، لا على قالب خارجي.
المبدأ: طبقة SaaS **additive** فوق الأسس الموجودة (RLS/RBAC/entitlements/audit/idempotency/ZATCA).

## 0) نظرة عامة (الطبقات)
```
Public Site (تسويق + SEO/GEO)  ──►  Onboarding/Trial  ──►  Tenant App (ERP الطبي الحالي، معزول RLS)
        │                                  │                         ▲
        ▼                                  ▼                         │
   SEO/GEO layer                    Billing & Subscriptions   ◄── Entitlements/Feature flags
                                           │
                              Super Admin (إدارة المنصّة) + Observability + Audit
```

## 1) نموذج المستأجر (Tenant Model)
- المصدر الموجود: `tenant_id` + RLS FORCE على كل جدول حسّاس + `app.tenant_id` لكل طلب.
- جدول المنصّة `tenants` (يُوسَّع): `id, name, slug, status(active|trial|suspended|canceled), plan_id, created_at, trial_ends_at, owner_user_id`.
- `facilities` تبقى تحت المستأجر (منشأة/فرع). علاقة: tenant 1—N facilities.
- العزل يبقى عبر RLS (الأقوى) — لا فلترة يدوية إلا دفاعاً مزدوجاً.

## 2) الأدوار (Super Admin / Tenant Admin / User RBAC)
- **Super Admin** (منصّة): يدير المستأجرين، الخطط، التفعيل/الإيقاف، يرى مقاييس التشغيل. **خارج** RLS المستأجر (دور/مخطّط منفصل `platform_admins`، لا يصل PHI المستأجرين افتراضياً).
- **Tenant Admin**: يدير مستخدمي مستأجره، الفروع، الاشتراك، الفوترة.
- **User RBAC**: مصفوفة `rbac.js` (fail-closed) + `requireRole`. الصلاحيات الدقيقة من DB.
- حراسة P0 موجودة (مستخدمو النظام + ترقية Admin).

## 3) الخطط والتفعيلات (Plans & Entitlements)
```sql
plans(id, code, name, price_monthly NUMERIC(14,2), price_yearly, currency, trial_days, is_active)
plan_features(plan_id, feature_key, limit_value)      -- e.g. ('clinic','max_users',25)
tenant_entitlements(tenant_id, feature_key, limit_value, source)  -- مشتقّة من الخطة + تجاوزات
```
- يُبنى فوق `facility_entitlements`/وحدات الميزات الحالية.
- فحص: `requireEntitlement('module')` middleware fail-closed (403 + code عند الغياب). راجع skill MULTI_TENANT_RBAC.

## 4) دورة حياة الاشتراك (Subscription Lifecycle)
```sql
subscriptions(id, tenant_id, plan_id, provider, provider_sub_id, status, current_period_end,
              cancel_at_period_end, created_at)
-- status: trialing | active | past_due | canceled | expired
billing_events(id, tenant_id, provider, event_id UNIQUE, type, payload_jsonb, processed_at)
```
- مدفوعة بـ webhooks مُطبَّعة عبر المحوّل. `event_id UNIQUE` = idempotency (نعيد استخدام نمط `idempotency.js`).
- انتقالات: trial→active (دفع)، active→past_due (فشل دفع + مهلة)، →canceled (إلغاء)، →expired.

## 5) تجريد مزوّد الدفع (Payment Provider Abstraction)
- واجهة واحدة `PaymentProvider` (createCustomer/createCheckout/createSubscription/cancel/refund/handleWebhook).
- التنفيذ: `providers/stripe.js` الآن، `providers/moyasar.js`/`hyperpay.js` لاحقاً (السعودية). الاختيار بـ `PAYMENT_PROVIDER`.
- لا تسرّب SDK خارج المحوّل. كل المبالغ `NUMERIC` + parseMoney. راجع skill BILLING_PAYMENTS.

## 6) Trial / Onboarding (Self-serve)
- تدفّق: signup → إنشاء `tenant`(status=trial, trial_ends_at) + facility + Tenant Admin → بذر بيانات أوّلية → توجيه للوحة.
- معاملة ذرّية (BEGIN/COMMIT) + idempotency على إنشاء المستأجر (منع تكرار).

## 7) Usage Metering
```sql
usage_events(id, tenant_id, metric, qty, occurred_at)   -- e.g. ('api_calls',1), ('invoices',1)
usage_rollups(tenant_id, metric, period, total)         -- تجميع دوري لفرض الحدود/الفوترة بالاستهلاك
```
- يُفرض ضدّ `plan_features.limit_value`. تنبيه عند 80%/100%.

## 8) Audit Logs
- موجود: `audit_middleware.js` + `audit_trail` (من/ماذا/متى/IP، مربوط بالمستأجر، بلا PHI). توسعة: عرض/تصفية + أحداث المنصّة (Super Admin).

## 9) Feature Flags
- مستوى المنصّة (تجريبية/تدريجية) + مستوى المستأجر (من الخطة). جدول `feature_flags(key, scope, enabled, rollout)`.

## 10) In-app Alerts + Operations Health
- تنبيهات داخل التطبيق (انتهاء التجربة، فشل دفع، تجاوز حدّ، صيانة).
- صحّة التشغيل: `/api/health` (موجود) + مقاييس (latency/5xx/restarts) + تنبيهات. راجع skill OBSERVABILITY.

## 11) صفحات SEO/GEO العامة
- Home, Pricing, ERP Modules, Industries, About, Contact, Blog. Schema.org + llms.txt + sitemap + robots. `noindex` على /app. راجع skill SEO_GEO_GROWTH.

## 12) مخطّط البيانات الجديد (ملخّص، كله RLS + NUMERIC + audit)
`tenants` (موسّع) · `plans` · `plan_features` · `subscriptions` · `billing_events` · `tenant_entitlements` · `usage_events` · `usage_rollups` · `feature_flags` · `platform_admins`.

## 13) البوابات المعمارية
- كل جدول جديد: RLS + grants + هجرة `eNN_*_{up,down,validate}` + تحقّق معزول (G9).
- كل مسار مال: validateBody + idemGuard + audit + NUMERIC.
- لا لمس production بلا إذن؛ DDL على staging/معزول أولاً. راجع [[jumanasoft-global-gates]].

## 14) قرار البوابة (PHASE 2)
- ✅ **PASS** — المعمارية تستند للأساس الموجود، تغطّي كل العناصر المطلوبة، بلا تبنّي قالب خارجي. ننتقل إلى PHASE 3.
