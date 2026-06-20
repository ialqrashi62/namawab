# تقرير إنشاء المهارات المحلية (Local Skills Creation Report)

> التاريخ: 2026-06-20 | المرحلة: Skills Discovery & Local Skills Creation

## 1. الملخص

أُنشئت **19 مهارة محلية جديدة** تحت `.ai-brain/skills/`، واحتُفظ بمهارة قائمة (`MEDICAL_AUTOPILOT_CORE_SKILL_AR` — موجودة وتعمل) دون استبدال (التزام قاعدة منع التكرار). الإجمالي المطلوب 20 مهارة → مكتمل (19 جديدة + 1 قائمة).

## 2. المهارات المُنشأة

| # | الاسم | الغرض | كيف تقلّل التوكنز | متى تُستخدم |
| - | ----- | ----- | ----------------- | ----------- |
| 1 | MEDICAL_AUTOPILOT_CORE_SKILL_AR | **قائمة مسبقاً** — تحكّم gate-by-gate | تعليمات تحكّم موحّدة | بداية كل مرحلة |
| 2 | MEDICAL_GLOBAL_DISCOVERY_SKILL_AR | اكتشاف النظام الكامل | إجراء اكتشاف موحّد بلا إعادة شرح | بداية أي تدقيق |
| 3 | MEDICAL_GLOBAL_BENCHMARK_SKILL_AR | المقارنة العالمية (27 بُعداً) | أبعاد ومراجع جاهزة | بعد الاكتشاف |
| 4 | MEDICAL_FACILITY_TYPE_ENTITLEMENTS_SKILL_AR | استحقاقات أنواع المنشآت | قواعد إنفاذ موحّدة | onboarding/الخطط |
| 5 | MEDICAL_PATIENT_FLOW_AUDIT_SKILL_AR | تدفّق المريض/الاستقبال | خطوات تدقيق جاهزة | تدقيق المرضى |
| 6 | MEDICAL_EMR_WORKFLOW_AUDIT_SKILL_AR | سير EMR السريري | قواعد سريرية جاهزة | تدقيق سريري |
| 7 | MEDICAL_PHARMACY_INVENTORY_SKILL_AR | سلامة الصيدلية/المخزون | القاعدة الحرجة (لا خصم قبل الصرف) | تدقيق الصيدلية |
| 8 | MEDICAL_LAB_RADIOLOGY_AUDIT_SKILL_AR | المختبر/الأشعة | قواعد الاعتماد جاهزة | تدقيق المختبر/الأشعة |
| 9 | MEDICAL_BILLING_INSURANCE_ACCOUNTING_SKILL_AR | الفوترة/التأمين/المحاسبة | قواعد الترحيل جاهزة | تدقيق مالي |
| 10 | MEDICAL_RBAC_TENANT_ISOLATION_SKILL_AR | الصلاحيات/العزل | مصفوفات ومعايير إنفاذ | عزل/صلاحيات |
| 11 | MEDICAL_SECURITY_PRIVACY_AUDIT_SKILL_AR | الأمن/الخصوصية | بنود أمن + redaction | تدقيق أمني |
| 12 | MEDICAL_TEST_SCENARIOS_SKILL_AR | استراتيجية الاختبار | نمط اختبار جاهز | تدقيق الجودة |
| 13 | MEDICAL_PERFORMANCE_AUDIT_SKILL_AR | الأداء | بنود أداء جاهزة | تدقيق الأداء |
| 14 | MEDICAL_ARABIC_UTF8_REPORTING_SKILL_AR | UTF-8 العربي | أمر تدقيق mojibake | قبل أي إغلاق |
| 15 | MEDICAL_GLOBAL_ROADMAP_SKILL_AR | خارطة الطريق | مراحل جاهزة | بعد التدقيق |
| 16 | MEDICAL_API_AUDIT_SKILL_AR | تدقيق الـ API | جدول تصنيف جاهز | تدقيق API |
| 17 | MEDICAL_DATABASE_SCHEMA_AUDIT_SKILL_AR | تدقيق المخطط | فحوص tenant_id/RLS جاهزة | تدقيق DB |
| 18 | MEDICAL_UX_UI_AUDIT_SKILL_AR | تدقيق UX/UI | بنود تجربة جاهزة | تدقيق الواجهة |
| 19 | MEDICAL_RISK_REGISTER_SKILL_AR | سجل المخاطر | أعمدة سجل جاهزة | تجميع المخاطر |
| 20 | MEDICAL_BUSINESS_LOGIC_AUDIT_SKILL_AR | منطق العمل | القواعد الحرجة جاهزة | الحكم على النضج |

## 3. بنية كل مهارة
كل مهارة تتضمّن: الاسم، Purpose، When to Use، Inputs Needed، Procedure، Safety Rules، Output Format، Done Criteria — بالعربية UTF-8.

## 4. لماذا محلية وليست عامة
المجال طبي/SaaS سعودي خاص؛ لا مهارة عامة موثوقة تغطّيه؛ والنظام إنتاجي حسّاس (تجنّب مخاطر الأسواق المفتوحة). التفاصيل في `MEDICAL_AGENT_SKILLS_DISCOVERY_AND_RECOMMENDATION_AR.md`.

## 5. ملاحظات سلامة
- لم يُستبدل أي محتوى قائم (احتُفظ بـ AUTOPILOT_CORE).
- لا أسرار، لا مسارات محلية، UTF-8 نظيف.
- المهارات إرشادية (read-only audit) ولا تنفّذ تعديلات إنتاجية بنفسها.

`LOCAL_SKILLS_CREATION_REPORT_COMPLETE`
