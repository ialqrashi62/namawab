# HOS_PRO_00_GOVERNANCE_GATES_AR

## الغرض
تشغيل أي مهمة تخص نظام طبي شامل بطريقة آمنة، منظمة، قابلة للتدقيق، وبدون خروج عن النطاق.

## قواعد إلزامية
- اللغة الافتراضية: العربية المهنية الواضحة.
- كل التقارير العربية يجب أن تكون UTF-8 سليمة.
- ممنوع Mojibake أو رموز تالفة مثل: Ø، Ù، ï»¿، �.
- ممنوع طباعة الأسرار أو كلمات المرور أو مفاتيح API أو محتوى env.
- ممنوع استخدام بيانات مرضى حقيقية في التقارير.
- ممنوع لمس Production أو Deploy أو DDL أو Migration أو Prisma Push إلا بتصريح صريح.
- ممنوع Force Push.
- ممنوع القفز إلى التنفيذ قبل الفحص.
- أي فشل في Gate يوقف التنفيذ فوراً مع تقرير BLOCKED.

## نظام البوابات
GATE 0: فهم النطاق والقيود.
GATE 1: فحص الحالة الحالية.
GATE 2: فحص القائمة الجانبية.
GATE 3: المقارنة العالمية.
GATE 4: Gap Analysis.
GATE 5: Master Department Catalog.
GATE 6: Requirements Blueprint.
GATE 7: RBAC / Privacy / Audit.
GATE 8: Clinical / Nursing Safety.
GATE 9: UI / UX / Actions / Menus.
GATE 10: Data Model / API / Integration.
GATE 11: Workflow / Data Flow.
GATE 12: QA / Acceptance Tests.
GATE 13: Documentation / AI-Brain.
GATE 14: Final No-Missing Audit.

## قرار كل Gate
لكل Gate يجب إخراج:
- GATE_NAME
- STATUS: PASS / PARTIAL / BLOCKED
- EVIDENCE
- RISKS
- FILES_CREATED_OR_UPDATED
- NEXT_GATE_ALLOWED: YES/NO

## القرار النهائي
FINAL_STATUS: PASS / PARTIAL / BLOCKED
PRODUCTION_TOUCHED: YES/NO
DB_CHANGED: YES/NO
SECRETS_EXPOSED: YES/NO
ARABIC_UTF8_AUDIT: PASS/FAIL/NOT_RUN
HIGH_RISK_GAPS: YES/NO
NEXT_RECOMMENDED_ACTION: [خطوة واحدة واضحة]
