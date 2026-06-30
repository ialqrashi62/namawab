# جمانة سوفت — تقرير الـ Preflight والجرد (PHASE 0)

**التاريخ:** 2026-06-30 · **المشروع:** جمانة سوفت — Jumanasoft · **الدومين:** jumanasoft.com
**الوضع:** قراءة فقط — لم يُعدَّل أي شيء في هذه المرحلة.

## 1) Git
- الفرع الحالي: `audit/phase-1a-critical-remediation`
- ملفات غير مثبّتة: 3 (ملفات حوكمة/مهارات أُنشئت هذه الجلسة).
- الفرع الرئيسي: `master`. الريموتات خاصة (root `origin` خاص؛ namaweb `private-origin`). المستودع العام `namawab` = push معطّل.
- **الإنتاج الحيّ** يشغّل فرعاً مختلفاً (`integration/all-epics` على خادم Hetzner) — ليس هذا الفرع.

## 2) إطار العمل وحزمة الأدوات
- **لا يوجد root package.json**؛ التطبيق في `namaweb/` (الاسم `nama-medical-web`، `main: server.js`).
- **Backend:** Node.js + Express (monolith، `server.js` ≈ **13,961 سطراً**، ~538 مساراً).
- **Package manager:** npm. سكربتات: `start, dev, test, test:safe, setup, build:css, postinstall`.
- **DB:** PostgreSQL عبر `pg` الخام — **لا ORM** (Prisma/Sequelize/TypeORM غير مستخدمة). + `better-sqlite3` (إرث/أدوات). جلسات Redis (`connect-redis`).
- **Frontend:** SPA بـ Vanilla JS — `public/js/app.js` ≈ **14,527 سطراً** + 3 صفحات HTML (login/index + قوالب). لا إطار SPA (لا React/Vue).
- **Deploy:** PM2 (`nama-medical-erp`) + 6 سكربتات في `ops/`.

## 3) الأسس الموجودة (قابلة لإعادة الاستخدام في SaaS)
| القدرة | الحالة في الكود |
|---|---|
| **Tenant isolation** | `tenant_id` + RLS FORCE (150 سياسة)، `tenant_context_pg_session.js` (AsyncLocalStorage)، دور `nama_medical_app` غير ممتاز |
| **RBAC** | `rbac.js` (مصفوفة fail-closed) + `requireRole` إرث |
| **Entitlements/Modules** | `facility_entitlements`/وحدات الميزات (أساس feature flags) |
| **Billing/Money** | `billing_integrity.js` (parseMoney/caps)، `finance_engine.js` (GL/VAT/ZATCA)، e22 (NUMERIC)، `idempotency.js` (e23) |
| **E-Invoice** | `zatca_phase2.js` (Phase-2 crypto، مبوّب) |
| **Insurance/Claims** | `e11_insurance_engine.js` (أساس NPHIES) |
| **Auth** | bcrypt + lockout + MFA TOTP + `password_policy.js` |
| **Audit** | `audit_middleware.js` + `audit_trail` |
| **Security at-rest** | `crypto_envelope.js` (DPAPI envelope) |
| **Migrations** | 152 ملف SQL (نمط `eNN_*_{up,down,validate}`) |
| **Tests** | **121 ملف اختبار** (cross_tenant_* مكثّفة) |

## 4) فجوات طبقة SaaS (غير موجودة بعد)
- لا **Super Admin** لإدارة المستأجرين (signup/provision/suspend).
- لا **Plans/Pricing** ولا **Subscription lifecycle** ولا **Payment provider abstraction** (Stripe/Moyasar).
- لا **self-serve onboarding/trial** ولا **usage metering**.
- الموقع العام تسويقي بدائي؛ لا **SEO/GEO** منظّم.
- لا تجميع سجلّات/تنبيهات تشغيل مركزية.

## 5) قرار البوابة (Gate G0/PHASE 0)
- ✅ **PASS** — الجرد مكتمل، لم يُلمَس الإنتاج، لم يُعدَّل كود. الأساس قويّ ويصلح للبناء فوقه.
- المتابعة إلى PHASE 1 (تقييم المهارات/القوالب).

> القواعد الحاكمة سارية: لا لمس production بلا إذن لاحق، لا DDL على production، لا أسرار، لا force push، لا حذف بيانات، القوالب مرجع في `.vendor/` فقط.
