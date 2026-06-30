# جمانة سوفت — تقييم المهارات والقوالب (PHASE 1)

**التاريخ:** 2026-06-30 · قراءة/تحليل فقط — **لا دمج كود تلقائي**. القوالب مراجع في `.vendor/` فقط (القاعدة 6/7).

## 1) القوالب المستنسخة (مرجعية)
### `.vendor/nextjs-saas-starter` (nextjs/saas-starter)
- **التقنية:** Next.js + TypeScript + Drizzle ORM + PostgreSQL + Stripe + zod + Tailwind + radix-ui + jose (JWT).
- **أنماط مفيدة:**
  - `app/api/stripe/{checkout,webhook}/route.ts` → تدفّق Stripe (checkout + webhook).
  - `lib/payments/actions.ts` → فصل منطق الدفع.
  - `lib/auth/{session,middleware}.ts` → جلسة + حارس.
  - `lib/db/schema.ts` (Drizzle) → نمذجة users/teams/activity/subscriptions.
  - `app/(dashboard)/{pricing,dashboard}` → بنية صفحات الأسعار واللوحة.
  - `app/api/team/route.ts` → نموذج «Team» (يقابل مفهوم المستأجر/المنشأة عندنا).
- **ملاحظة توافق:** التقنية **مختلفة** عن جمانة سوفت (Express/pg خام/Vanilla JS). نأخذ **الأنماط لا الكود**.

### `.vendor/open-saas-reference` (wasp-lang/open-saas)
- **التقنية:** Wasp + React + Prisma + Stripe/Lemon Squeezy. (`schema.prisma`، `main.wasp.ts`).
- **أنماط مفيدة (مرجع ثانوي فقط):** admin dashboard، blog/SEO، analytics، payments أكثر من مزوّد، AGENTS.md/CLAUDE.md.
- **ملاحظة:** Wasp إطار شامل بعيد عن معماريّتنا — مرجع مفاهيمي فقط.

## 2) المهارات الخارجية المثبّتة (`.agents/skills/`, 58)
- **SEO/GEO** (`aaron-he-zhu/seo-geo-claude-skills`): entity-optimizer، content-quality-auditor، rank-tracker، backlink-analyzer، domain-authority-auditor، performance-reporter، alert-manager، memory-management → طبقة النمو.
- **Vercel** (`vercel-labs/agent-skills`): web-design-guidelines، vercel-react-best-practices، vercel-optimize، deploy-to-vercel، vercel-cli-with-tokens، writing-guidelines → طبقة جودة/أداء/نشر.
- **Commerce:** `ucp` — مصنّف **Med Risk** (Snyk). **يُراجَع قبل أي تشغيل** (القاعدة 10). لم يُشغَّل أي سكربت خارجي.

## 3) الأنماط المختارة لجمانة سوفت (استخلاص)
| النمط | المصدر | كيف نطبّقه (على معماريّتنا) |
|---|---|---|
| Payment provider abstraction | saas-starter (stripe routes) | واجهة `PaymentProvider` في Express (Stripe ثم Moyasar/HyperPay) |
| Subscription schema | saas-starter `schema.ts` | جداول `plans/subscriptions` SQL خام + RLS |
| Webhook idempotency | saas-starter webhook | نعيد استخدام `idempotency.js` + جدول event_id |
| Team = Tenant | saas-starter team route | نستخدم نموذج `tenants` + RLS الموجود (أقوى) |
| Pricing/Dashboard layout | saas-starter `(dashboard)` | تصميم RTL خاص بنا — راجع UI/UX skill |
| Admin + SEO + Blog | open-saas | Super Admin + الموقع العام (SEO/GEO skill) |

## 4) ما لا نأخذه
- لا نتبنّى Next.js/Wasp/Drizzle/Prisma (إعادة كتابة كاملة = مخاطرة عالية على نظام حيّ). نبقى على Express/pg ونبني الطبقة الجديدة بنفس النمط (وحدة نقيّة + اختبار + RLS + بوابات).
- لا نسخ boilerplate فوق المشروع (القاعدة 6).

## 5) قرار البوابة (PHASE 1)
- ✅ **PASS** — القوالب مُحلَّلة، الأنماط مُستخلصة، لا دمج كود، لا تشغيل سكربتات خارجية. ننتقل إلى PHASE 2.
