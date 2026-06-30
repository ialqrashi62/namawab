---
name: jumanasoft-saas-architecture
description: معمارية جمانة سوفت كـ SaaS متعدّد المستأجرين — الطبقات، المراجع، ومسار البناء (المرحلة 4).
---

# جمانة سوفت — معمارية SaaS

## القرار الاستراتيجي (معتمد 2026-06-30)
- **Jumanasoft Core** = المشروع الحالي (Node/Express monolith + PostgreSQL RLS + Redis)، حيّ على `jumanasoft.com`.
- **`nextjs/saas-starter`** (`.vendor/nextjs-saas-starter`) = مرجع أنماط (auth، Stripe، dashboard).
- **Open SaaS** (`.vendor/open-saas-reference`) = مرجع ثانوي فقط.
- **SEO/GEO Skills** = طبقة نمو ومحتوى. **Vercel Skills** = طبقة جودة/أداء/نشر.
- **Payment Adapter** = Stripe الآن + Moyasar/HyperPay (السعودية) لاحقاً، خلف تجريد واحد.

## الطبقات
1. **Public site** (تسويق + SEO/GEO) → جذب واشتراك.
2. **Auth & Onboarding** → تسجيل مستأجر جديد، إنشاء tenant + facility + Admin.
3. **Tenant App** (النظام الطبي الحالي) → معزول بـ RLS لكل مستأجر.
4. **Super Admin** → إدارة المستأجرين، الخطط، التفعيل/الإيقاف، المراقبة.
5. **Billing** → خطط، اشتراكات، دورة حياة، مزوّد دفع مجرّد.
6. **Platform** → entitlements/feature flags، audit، observability، cost control.

## إعادة الاستخدام (لا نبني من صفر)
الأساس موجود وقوي: عزل RLS (150 سياسة FORCE)، مصفوفة RBAC (`requirePermission`)، `facility_entitlements`/وحدات الميزات، `audit_trail`، idempotency (e23)، ZATCA Phase-2. **طبقة SaaS تُبنى فوق هذه.**

## مسار المرحلة 4 (بالأولوية)
1. Super Admin (إدارة المستأجرين) — جدول `tenants` + لوحة.
2. Tenant onboarding (self-serve: signup → provision tenant).
3. الخطط والأسعار (`plans`, `plan_features`).
4. Billing provider abstraction (واجهة `PaymentProvider`). راجع [[jumanasoft-billing-payments]].
5. Subscription lifecycle (trial/active/past_due/canceled + webhooks).
6. RBAC وصلاحيات. راجع [[jumanasoft-multi-tenant-rbac]].
7. Audit logs (موجود — توسعة العرض).
8. Feature flags / entitlements (لكل خطة/مستأجر).
9. Dashboard احترافي. راجع [[jumanasoft-ui-ux-design-system]].
10. SEO/GEO للموقع العام. راجع [[jumanasoft-seo-geo-growth]].
11. Observability + cost control. راجع [[jumanasoft-observability-deployment]].
12. UAT + deployment gates. راجع [[jumanasoft-global-gates]].

## مبادئ
- كل ميزة جديدة تمرّ ببوابات [[jumanasoft-global-gates]].
- نمط الوحدة النقيّة + اختبار (validation/idempotency/zatca).
- لا كسر للنظام الطبي الحيّ — الطبقة الجديدة additive + مبوّبة بالأعلام حتى الجاهزية.
