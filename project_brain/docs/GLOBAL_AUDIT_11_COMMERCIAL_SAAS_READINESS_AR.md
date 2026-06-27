# التدقيق العالمي 11 — جاهزية SaaS التجاري (Commercial SaaS Readiness)

> التاريخ: 2026-06-20 | المرجع: أنماط SaaS B2B عالمية (Salesforce Health Cloud, NetSuite, Athenahealth).

---

## جدول الجاهزية التجارية

| القدرة | الموجود | الناقص | الحالة |
| ------ | ------- | ------ | ----- |
| **عزل المستأجرين (Data isolation)** | بنية tenant/facility/branch + RLS + requireTenantScope (للموديولات الأساسية) | تغطية كاملة لكل الموديولات (فجوة Gate 5) | PARTIAL |
| **Tenant Provisioning** | جدول `tenants` + seed مستأجر افتراضي | لا API/UI لإنشاء مستأجر؛ إعداد يدوي | NOT_READY |
| **Onboarding ذاتي** | — | لا تسجيل/تفعيل ذاتي | NOT_PRESENT |
| **الخطط/Plans** | حقل `plan_type` فقط | لا تعريف خطط/ميزات | NOT_PRESENT |
| **Entitlements / Feature gating** | — | `plan_type` غير مفروض في أي مكان | NOT_PRESENT |
| **الاشتراكات (Subscriptions)** | — | لا جداول/منطق اشتراك | NOT_PRESENT |
| **Usage metering** | — | لا قياس استخدام | NOT_PRESENT |
| **الفوترة (Billing) للمستأجرين** | — | لا فوترة SaaS (الفواتير للمرضى فقط) | NOT_PRESENT |
| **Dunning (تحصيل متعثر)** | — | — | NOT_PRESENT |
| **Tenant self-service** | — | لا بوابة إدارة ذاتية للمستأجر | NOT_PRESENT |
| **Admin Control Center (super-admin)** | لوحة admin لمستشفى واحد | لا مركز تحكّم SaaS عبر المستأجرين؛ الـ Admin عام لا super-admin | NOT_PRESENT |
| **Analytics عبر المستأجرين** | لوحات لكل مستأجر | لا تحليلات SaaS مجمّعة | NOT_PRESENT |
| **Audit/Security logs (SaaS)** | audit_trail لكل مستأجر | لا سجل SaaS مركزي | PARTIAL |
| **Support tools (impersonation/tickets)** | — | — | NOT_PRESENT |
| **White-label / Branding لكل مستأجر** | `company_settings` عام + `tenant_settings` (غير مستخدم للبراند) | لا براند/ثيم لكل مستأجر | NOT_PRESENT |
| **Custom domains / Subdomain routing** | حقل `subdomain` موجود | لا توجيه فعلي حسب subdomain | NOT_PRESENT |
| **Localization** | عربي/إنجليزي كامل + RTL | — | IMPLEMENTED ✅ |
| **SLA** | runbooks تشغيلية | لا SLA/مراقبة/تنبيه آلي (Gate 7) | NOT_READY |

---

## التحليل

النظام يملك **الأساس التقني لعزل المستأجرين** (الجزء الأصعب)، لكنه يفتقر **لطبقة الأعمال التجارية لـ SaaS بالكامل**:
- لا نموذج إيراد (خطط/اشتراكات/فوترة/usage).
- لا دورة حياة مستأجر (provisioning/onboarding/self-service).
- لا مركز تحكّم لمالك المنصة (super-admin).
- لا عزل تجاري (entitlements/feature gating).
- لا براند/نطاق لكل مستأجر.

عملياً النظام اليوم هو **منتج single-tenant ناضج منشور لعميل واحد**، مع **بنية تحتية multi-tenant جاهزة للتفعيل** — وليس منتج SaaS تجاري تشغيلي.

---

## خارطة نضج SaaS المقترحة

**المرحلة 1 (تمكين multi-tenant فعلي)**:
1. إكمال عزل كل الموديولات (Gate 5 P0).
2. API/UI لإنشاء وإدارة المستأجرين (provisioning).
3. توجيه subdomain → مستأجر.

**المرحلة 2 (نموذج الإيراد)**:
4. تعريف خطط + entitlements + feature gating حسب `plan_type`.
5. اشتراكات + فوترة SaaS + usage metering.

**المرحلة 3 (تشغيل المنصة)**:
6. super-admin control center + analytics عبر المستأجرين.
7. self-service + support tools (impersonation/tickets).
8. white-label/براند لكل مستأجر + SLA + مراقبة آلية.

---

## القرار

`SAAS_READINESS: LOW` — البنية التحتية للعزل موجودة (نقطة قوة)، لكن **كل طبقة الأعمال التجارية لـ SaaS مفقودة**. النظام جاهز كـ **منتج مُثبّت لعميل واحد**، ويحتاج عملاً كبيراً ليصبح **منصة SaaS تجارية متعددة العملاء**.

`COMMERCIAL_SAAS_READINESS_COMPLETE`
