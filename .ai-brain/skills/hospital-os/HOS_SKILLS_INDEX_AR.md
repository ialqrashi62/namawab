# HOS_SKILLS_INDEX_AR
# فهرس مهارات نظام المستشفى الشامل

استخدم هذه المهارات لتقليل التوكنز عند طلب تصميم أو مراجعة أو تطوير أي جزء من نظام طبي شامل.

## التفعيل المختصر
عند أي مهمة تخص النظام الطبي، فعّل المهارات التالية حسب الحاجة:

- HOS_GLOBAL_GATES_AR
- HOS_DEPARTMENT_CATALOG_AR
- HOS_ROLE_MATRIX_AR
- HOS_NURSING_COVERAGE_AR
- HOS_RBAC_AUDIT_AR
- HOS_WORKFLOWS_INTEGRATIONS_AR
- HOS_TESTING_REPORTS_AR
- HOS_AI_BRAIN_PERSISTENCE_AR
- HOS_CHANGE_CLEANUP_REGISTER_AR
- HOS_NO_OMISSION_SCOPE_BINDING_AR
- HOS_PROJECT_MEMORY_UPDATE_AR
- HOS_AI_BRAIN_CLOSEOUT_GATE_AR

## قاعدة عامة
أي قسم طبي أو إداري يجب أن يُحلَّل عبر:
1. الطبيب/الأخصائي أو الفني المسؤول.
2. التمريض المناسب للقسم.
3. مسؤول القسم أو مالك العملية.
4. الصلاحيات RBAC.
5. سير العمل Workflow.
6. التكاملات.
7. المخاطر والضوابط.
8. الاختبارات.
9. التقارير والتدقيق.
10. حالة نهائية PASS / PARTIAL / BLOCKED.

## مبدأ عدم الإسقاط
لا يجوز حذف أي قسم أو دور أو صلاحية أو تدفق عمل أو بوابة أمان بدون ذكر السبب صراحة.

## مهارات ai-brain الإلزامية

فعّل هذه المهارات في كل مرحلة:

- HOS_AI_BRAIN_PERSISTENCE_AR
- HOS_CHANGE_CLEANUP_REGISTER_AR
- HOS_NO_OMISSION_SCOPE_BINDING_AR
- HOS_PROJECT_MEMORY_UPDATE_AR
- HOS_AI_BRAIN_CLOSEOUT_GATE_AR

## قاعدة إلزامية
أي تغيير أو تنظيف أو إصلاح أو مراجعة يجب أن يُوثّق داخل `.ai-brain`.

لا يتم إغلاق أي مرحلة حتى يتم إنشاء أو تحديث:
- task.md
- walkthrough.md
- change-register.md
- cleanup-register.md
- test-results.md
- risk-register.md
- final-report-ar.md
- memory-update.md

لا تحفظ أسراراً أو PHI داخل `.ai-brain`.
