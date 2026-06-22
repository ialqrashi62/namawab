# Phase D UX / Ops / AI — تنفيذ وتصنيف

> docs/مراجعة/runbooks آمنة؛ لا أسرار؛ لا PHI؛ لا AI على بيانات حقيقية بلا سياسة.

| البند | الإجراء | التصنيف | مالك | نشر | PHI | مخاطرة | البوابة |
|---|---|---|---|---|---|---|---|
| design system hardening | مراجعة؛ RTL/ثيمات موجودة | CANDIDATE_READY | نعم | نعم | لا | منخفضة | candidate UX |
| Arabic/English i18n completeness | تحقّق قراءة: 2243 استدعاء `tr()` ثنائي اللغة | COMPLETED_DOCS_ONLY | لا | لا | لا | منخفضة | (مراجعة فجوات candidate) |
| accessibility WCAG review | مراجعة candidate | CANDIDATE_READY | نعم | نعم | لا | منخفضة | candidate UX |
| operator runbooks | يُوثّق (PM2/Redis/Docker/health) | COMPLETED_DOCS_ONLY | لا | لا | لا | منخفضة | — |
| user manuals / training materials | candidate (هيكل + تغطية) | CANDIDATE_READY | نعم | لا | لا | منخفضة | candidate docs |
| observability/alerts | candidate (يبني على health+watchdog) | CANDIDATE_READY | نعم | نعم(لاحقاً) | لا | منخفضة | APPROVE_PHASE_D_OBSERVABILITY_CANDIDATE |
| uptime / backup monitors | candidate (watchdog/backup موجودان) | CANDIDATE_READY | نعم | نعم(لاحقاً) | لا | منخفضة | = observability |
| Redis/PM2 watchdog review | مراجعة قراءة: watchdog+autostart مُسجّلان؛ حادثة Docker عولِجت يدوياً | COMPLETED_DOCS_ONLY | لا | لا | لا | منخفضة | (تحسين: استرداد Docker-daemon التلقائي) |
| HA/DR architecture | يُوثّق (single-box حالياً؛ DR=backup+escrow) | COMPLETED_DOCS_ONLY | لا | لا | لا | متوسطة | candidate HA لاحقاً |
| AI/RAG assistant blueprint | تصميم ورقي بلا PHI | CANDIDATE_READY | نعم | لا | لا(blueprint) | منخفضة | APPROVE_PHASE_D_AI_GOVERNANCE_ONLY |
| privacy-safe AI governance | سياسة candidate (حدود بيانات، موافقة) | CANDIDATE_READY | نعم | لا | لا | منخفضة | = AI governance |
| prompt logging policy | سياسة: لا PHI/أسرار في السجلّات | COMPLETED_DOCS_ONLY | لا | لا | لا | منخفضة | — |
| model data boundary policy | سياسة: لا بيانات مرضى حقيقية للنماذج بلا موافقة | COMPLETED_DOCS_ONLY | لا | لا | لا | منخفضة | — |

## ملاحظة تشغيلية مهمة
حادثة هذه الفترة: **Docker Desktop توقّف ⟶ Redis ⟶ login 500**؛ عولِجت يدوياً. الـwatchdog يعالج Redis-down عندما يكون الـdaemon حياً، لكن **توقّف Docker daemon نفسه** يتجاوز الـwatchdog. تحسين موصى (candidate): مراقبة/استرداد تلقائي لـDocker daemon أو نقل Redis لخدمة Windows native لإزالة تبعية Docker Desktop. (مسجّل في ذاكرة البنية التحتية.)

## الخلاصة
i18n والـwatchdog والسياسات منجزة وثائقياً؛ بقية UX/Ops/AI مرشّحات منخفضة المخاطرة؛ AI محكوم بسياسة خصوصية (لا PHI، لا تسجيل أسرار).
