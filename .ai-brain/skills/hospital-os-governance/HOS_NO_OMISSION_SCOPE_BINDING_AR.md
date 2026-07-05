# HOS_NO_OMISSION_SCOPE_BINDING_AR
# ربط العمل بنطاق Hospital OS No-Omission

## القاعدة
أي مرحلة في Hospital OS يجب أن تُقارن مع نطاق عدم الإسقاط.

لا يجوز تجاهل:
- الأقسام.
- الأدوار الطبية.
- الأدوار التمريضية.
- الأدوار الإدارية.
- الصيدلية.
- المختبر.
- الأشعة.
- بنك الدم.
- التنويم.
- الطوارئ.
- العناية المركزة.
- العمليات.
- المالية.
- التأمين.
- السجلات.
- الجودة.
- مكافحة العدوى.
- التعليم.
- الصيانة.
- النقل.
- الخدمة الاجتماعية.
- خدمة الوفيات.
- الأسنان.
- بوابة المرضى.
- الطب عن بعد.

## لكل قسم يجب فحص
1. Screens.
2. Buttons.
3. Tables أو data candidates.
4. APIs.
5. RBAC action-level.
6. Workflow.
7. Integrations.
8. Safety Gates.
9. Audit.
10. Tests.
11. Risks.
12. ai-brain documentation.

## حالات القرار
- NO_OMISSION_PASS
- NO_OMISSION_PARTIAL
- NO_OMISSION_BLOCKED

إذا بقي أي قسم أو دور أو Workflow غير مفحوص، لا تعلن PASS.
