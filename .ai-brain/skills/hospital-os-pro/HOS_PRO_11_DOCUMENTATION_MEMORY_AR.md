# HOS_PRO_11_DOCUMENTATION_MEMORY_AR

## الغرض
ضمان أن كل تحليل أو تعديل أو تنظيف أو تقرير يتم حفظه في AI-Brain وملفات الذاكرة بدون أسرار.

## الملفات المطلوبة
عند تنفيذ الفحص الكامل، أنشئ أو حدّث:

- .ai-brain/hospital-sidebar-inventory-ar.md
- .ai-brain/hospital-global-gap-analysis-ar.md
- .ai-brain/hospital-master-department-catalog-ar.md
- .ai-brain/hospital-requirements-blueprint-ar.md
- .ai-brain/hospital-rbac-privacy-audit-ar.md
- .ai-brain/hospital-clinical-nursing-safety-ar.md
- .ai-brain/hospital-ui-ux-actions-menus-ar.md
- .ai-brain/hospital-data-api-integration-ar.md
- .ai-brain/hospital-workflows-dataflow-ar.md
- .ai-brain/hospital-qa-testing-acceptance-ar.md
- .ai-brain/hospital-final-audit-report-ar.md

وإذا كانت موجودة:
- AI_PROJECT_MEMORY.md
- task.md
- walkthrough.md

## قواعد التوثيق
- لا تحفظ أسرار.
- لا تحفظ بيانات مرضى حقيقية.
- لا تحفظ env values.
- لا تحفظ كلمات مرور.
- اذكر الأدلة لا التخمين.
- اذكر ما تم وما لم يتم.
- اذكر PASS/PARTIAL/BLOCKED.
- اذكر المخاطر المتبقية.
- اذكر الخطوة التالية.

## تقرير الإغلاق النهائي
يجب أن يحتوي:
- Executive Result.
- Sidebar Count.
- Master Catalog Count.
- Missing Departments Count.
- Duplicate Count.
- High Risk Gaps.
- Files Created/Updated.
- Tests Run.
- Risks Remaining.
- Final Decision.

## صيغة القرار النهائي
FINAL_STATUS: PASS / PARTIAL / BLOCKED
SIDEBAR_SECTIONS_COUNT: [number]
MASTER_CATALOG_COUNT: [number]
MISSING_DEPARTMENTS_COUNT: [number]
DUPLICATE_OR_MERGE_COUNT: [number]
HIGH_RISK_GAPS: YES/NO
PRODUCTION_TOUCHED: NO
DB_CHANGED: NO
SECRETS_EXPOSED: NO
ARABIC_UTF8_AUDIT: PASS/FAIL/NOT_RUN
NEXT_RECOMMENDED_ACTION: [خطوة واحدة واضحة]
