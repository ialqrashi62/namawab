# اكتشاف وتوصيات مهارات الوكيل (Agent Skills Discovery & Recommendation)

> التاريخ: 2026-06-20 | المرحلة: Skills Discovery (قبل التدقيق الطبي الموسّع)
> **لم يُثبَّت أي شيء.** هذا تقرير مراجعة وتوصية فقط، ولا يُنفَّذ أي `npx skills add` إلا بموافقة صريحة بعد المراجعة.

---

## 1. حقيقة جوهرية عن المكدّس التقني (تصحيح افتراضات القالب)

القالب يفترض مكدّس Next.js/TypeScript/Prisma. **الواقع المؤكَّد من `namaweb/package.json`**:

| العنصر | الواقع |
| ------ | ------ |
| الإطار | **Express.js** (^4.21) — ليس Next.js |
| اللغة | **JavaScript عادي (Vanilla)** — لا TypeScript (3 ملفات .ts متفرقة فقط) |
| قاعدة البيانات | **node-postgres `pg`** (^8.18) باستعلامات SQL مباشرة — **لا Prisma، لا ORM** |
| الواجهة | SPA بـ Vanilla JS + TailwindCSS |
| الاختبار | لا Jest/Vitest/Playwright — اختبارات Node ثابتة مخصّصة (`cross_tenant_*.js`) |

> **النتيجة**: كل المهارات العامة المتعلقة بـ Next.js/TypeScript/Prisma/Playwright/Vitest/Jest **غير قابلة للتطبيق مباشرة** على هذا المشروع. التوصية بها ستكون مضلِّلة. القيمة الحقيقية في المهارات المحلية الخاصة بالمجال الطبي.

---

## 2. المهارات المحلية الموجودة (مفحوصة)

| المجلد | الحالة |
| ------ | ------ |
| `.ai-brain/skills` | **40+ مهارة موجودة** (autopilot core, RLS, tenant isolation, pharmacy, ICU, surgery, compliance, UTF-8, deploy, hygiene...) + 3 مهارات P0 أُنشئت حديثاً |
| `.agents/skills` | موجود لكنه **فارغ** (0 ملفات) |
| `.github/skills` | **غير موجود** |
| `.claude/skills` | **غير موجود** |

المهارات المحلية الحالية تغطّي معظم احتياجات الأوتوبيلوت الطبي وعزل المستأجرين والنشر والنظافة. لا حاجة لتكرارها.

---

## 3. المهارات العامة المرشّحة (مفحوصة عبر بحث الويب — لم تُثبَّت)

| Skill | Source | URL/Repo | Purpose | لماذا مفيد للمشروع | قيمة توفير التوكنز | الخطر | scripts? | يعدّل ملفات? | يحتاج شبكة? | التوصية |
| ----- | ------ | -------- | ------- | ------------------ | ------------------ | ----- | -------- | ------------ | ---------- | ------- |
| `skill-creator` | Anthropic | github.com/anthropics/skills | توليد/هيكلة مهارات جديدة | يسرّع إنشاء المهارات المحلية بصيغة موحّدة | متوسطة | منخفض | نعم | نعم (ملفات skill) | لا | **مراجعة يدوية ثم تثبيت اختياري** |
| `webapp-testing` | Anthropic | github.com/anthropics/skills | اختبار تطبيقات الويب (Playwright) | قد يساعد E2E مستقبلاً، لكن المشروع لا يستخدم Playwright حالياً | منخفضة الآن | متوسط (يشغّل متصفح/سكربتات) | نعم | نعم | نعم | **مراجعة لاحقاً** (عند تبنّي E2E) |
| `pdf` / `docx` / `xlsx` | Anthropic | github.com/anthropics/skills | توليد مستندات/تقارير | تصدير تقارير طبية/فواتير لاحقاً | منخفضة الآن | منخفض | نعم | نعم | لا | **رفض الآن** (التقارير Markdown كافية) |
| `frontend-design` | Anthropic | github.com/anthropics/skills | إرشاد تصميم الواجهة | قد يفيد تحسينات UX | منخفضة | منخفض | لا | لا | لا | **مراجعة لاحقاً** |
| `find-skills` / `ags` | skills.sh / agentskill-sh | github.com/agentskill-sh/ags | اكتشاف وتثبيت مهارات | أداة اكتشاف عامة | منخفضة | **متوسط-عالٍ** (تثبيت من مصادر مجتمعية غير موثّقة) | نعم | نعم | نعم | **رفض/حذر** — لا تثبيت تلقائي من سوق مفتوح في نظام طبي إنتاجي |
| `Anthropic-Cybersecurity-Skills` | مجتمعي | github.com/mukul975/... | مهارات أمن سيبراني | مرجع لتدقيق الأمن | منخفضة | متوسط (مصدر طرف ثالث) | غالباً | لا | لا | **مراجعة يدوية فقط كمرجع** |
| `awesome-agent-skills` | مجتمعي | github.com/VoltAgent/... | فهرس 1000+ مهارة | استكشاف | منخفضة | متغيّر | متغيّر | متغيّر | نعم | **مرجع استكشاف فقط** |
| مهارات Next.js/TS/Prisma/Vitest/Jest | متعددة | متعددة | خاصة بمكدّس آخر | **غير مطابقة لمكدّس المشروع** | لا قيمة | — | — | — | — | **رفض** (المكدّس Express + pg) |

---

## 4. لماذا نفضّل المهارات المحلية المخصّصة

- المجال **طبي/HIS/SaaS متعدد المستأجرين** بخصوصية سعودية (ZATCA/NPHIES/CBAHI) — لا توجد مهارة عامة موثوقة تغطّيه.
- النظام إنتاجي حسّاس (بيانات مرضى) — تثبيت مهارات من أسواق مفتوحة يحمل مخاطر أمنية (سكربتات، تعديل ملفات، شبكة).
- المهارات المحلية تُخزَّن في Git وتخضع لمراجعتنا وتدقيق UTF-8 والنظافة.

---

## 5. التوصية النهائية

| القرار | العناصر |
| ------ | ------- |
| **تثبيت بعد موافقة** | `skill-creator` (اختياري — لتسريع تأليف المهارات) |
| **مراجعة يدوية لاحقاً** | `webapp-testing` (عند تبنّي Playwright)، `frontend-design` |
| **رفض الآن** | مهارات Next.js/TS/Prisma/Vitest/Jest (مكدّس غير مطابق)، `pdf/docx/xlsx`، التثبيت التلقائي من `ags`/أسواق مفتوحة |
| **إنشاء محلي (مُنفَّذ)** | 20 مهارة طبية محلية تحت `.ai-brain/skills/` (انظر `MEDICAL_LOCAL_SKILLS_CREATION_REPORT_AR.md`) |

**لم يُنفَّذ أي تثبيت.** أوامر الاكتشاف فقط (`npx skills search/list`) مسموحة مستقبلاً؛ `npx skills add` يحتاج موافقة صريحة بعد مراجعة `SKILL.md` والسكربتات.

---

## المصادر
- [github.com/anthropics/skills](https://github.com/anthropics/skills)
- [github.com/anthropics/skills/tree/main/skills](https://github.com/anthropics/skills/tree/main/skills)
- [github.com/agentskill-sh/ags](https://github.com/agentskill-sh/ags)
- [github.com/VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills)
- [github.com/mukul975/Anthropic-Cybersecurity-Skills](https://github.com/mukul975/Anthropic-Cybersecurity-Skills)
- [kdnuggets.com — Top 5 Agent Skill Marketplaces](https://www.kdnuggets.com/top-5-agent-skill-marketplaces-for-building-powerful-ai-agents)

`SKILLS_DISCOVERY_REPORT_COMPLETE`
