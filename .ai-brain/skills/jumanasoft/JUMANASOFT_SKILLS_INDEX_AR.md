---
name: jumanasoft-skills-index
description: فهرس مهارات جمانة سوفت الداخلية + ربطها بالمهارات الخارجية والمراجع والقرار الاستراتيجي.
---

# جمانة سوفت — فهرس المهارات (Skills Index)

مهارات **داخلية** خاصة بالمشروع (لا تعتمد على الخارجية فقط). كل عمل يمرّ ببوابات [[jumanasoft-global-gates]].

## المهارات الداخلية (`.ai-brain/skills/jumanasoft/`)
| المهارة | الغرض |
|---|---|
| [[jumanasoft-global-gates]] | البوابات الإلزامية G0–G10 (سلامة/عزل/مال/تكرار/تحقّق/تدقيق/أمان/اختبار/نشر/ديمومة) |
| [[jumanasoft-saas-architecture]] | معمارية SaaS + الطبقات + مسار المرحلة 4 |
| [[jumanasoft-multi-tenant-rbac]] | عزل RLS + RBAC + التفعيلات + وصفة مورد معزول |
| [[jumanasoft-billing-payments]] | تجريد الدفع (Stripe+Moyasar/HyperPay) + الاشتراكات + ZATCA + idempotency |
| [[jumanasoft-seo-geo-growth]] | طبقة النمو SEO/GEO للموقع العام |
| [[jumanasoft-ui-ux-design-system]] | نظام التصميم RTL + اللوحة + أمان الواجهة |
| [[jumanasoft-observability-deployment]] | المراقبة + التكلفة + نمط النشر الآمن + بوابات النشر |
| [[jumanasoft-security-audit]] | قائمة التدقيق الأمني (GATE 0–18) |

## الخريطة الاستراتيجية (معتمدة 2026-06-30)
| الطبقة | المصدر |
|---|---|
| **Jumanasoft Core** | المشروع الحالي (Node/Express + PG RLS، حيّ على jumanasoft.com) |
| مرجع أنماط SaaS | `.vendor/nextjs-saas-starter` (nextjs/saas-starter) |
| مرجع ثانوي | `.vendor/open-saas-reference` (wasp-lang/open-saas) |
| نمو ومحتوى | seo-geo skills (`.ai-brain/external-skills/seo-geo-claude-skills` + المثبّتة) |
| جودة/أداء/نشر | Vercel skills (`vercel-labs/agent-skills`) |
| الدفع | Stripe الآن + Moyasar/HyperPay لاحقاً (خلف محوّل واحد) |

## المهارات الخارجية المثبّتة (`.agents/skills/`)
- **SEO/GEO**: alert-manager, backlink-analyzer, performance-reporter, rank-tracker, content-quality-auditor, domain-authority-auditor, entity-optimizer, memory-management.
- **Vercel**: deploy-to-vercel, vercel-react-best-practices, vercel-react-native-skills, vercel-react-view-transitions, vercel-cli-with-tokens, web-design-guidelines, writing-guidelines, vercel-optimize.
- **Commerce**: ucp (مصنّف Med Risk — راجِع قبل الاستخدام).
> تحذير: المهارات الخارجية تعمل بكامل الصلاحيات — راجِعها قبل التفعيل. الأولوية للمهارات الداخلية أعلاه.

## اصطلاح التفعيل (Progressive Disclosure — لكل المهارات)
كل مهارة ملف مختصر يُحمَّل عند الحاجة. النمط الموحّد:
- **متى تُفعّل:** عندما تطابق مهمّتك وصف المهارة (`description` في الترويسة) — حمّلها أولاً قبل التنفيذ.
- **المدخلات:** سياق المهمّة (الملفات/المسارات/الجداول المعنيّة) + القواعد الحاكمة.
- **المخرجات:** قرار/خطة/كود يلتزم ببوابات [[jumanasoft-global-gates]] + قائمة تحقّق مكتملة.
- **Gates:** كل مهارة تشير إلى البوابات ذات الصلة (G0–G10). لا تجاوز لبوابة فاشلة.
- **متى تتوقّف:** عند فشل أي بوابة، أو الحاجة لإذن إنتاج/اعتماد خارجي، أو غموض قرار يخصّ المالك → **توقّف بتقرير واضح** (BLOCKED) ولا تلتفّ.
- **الأولوية:** المهارات الداخلية (هذه) قبل الخارجية؛ راجِع أي سكربت خارجي قبل تشغيله.

## المرحلة 4 (بناء SaaS — بالأولوية)
Super Admin → tenant onboarding → الخطط/الأسعار → تجريد الدفع → دورة الاشتراك → RBAC → audit → feature flags/entitlements → dashboard → SEO/GEO → observability/cost → UAT/deploy gates.
كلها تُبنى فوق الأساس الموجود (RLS/RBAC/entitlements/audit/idempotency/ZATCA) عبر [[jumanasoft-saas-architecture]].
