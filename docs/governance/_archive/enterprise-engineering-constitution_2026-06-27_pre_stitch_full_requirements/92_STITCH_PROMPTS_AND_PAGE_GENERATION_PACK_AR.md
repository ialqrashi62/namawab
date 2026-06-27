# حزمة برومنتات STITCH الرسمية
## Official STITCH Prompt Pack

| الحقل | القيمة |
|---|---|
| رمز الوثيقة | EEC-STITCH-092 |
| المشروع | NamaMedical / الطبيب |
| التصنيف | داخلي / مؤسسي / مرجعي / غير مخصص للنشر العام إلا بموافقة |
| الإصدار | 4.0 |
| الحالة | مضافة إلى الحزمة الشاملة بعد استلام متطلبات المالك التفصيلية |
| المالك | مكتب الهندسة المؤسسية والحوكمة التقنية |
| تاريخ الإصدار | 2026-06-27 |
| اللغة | العربية المؤسسية مع المصطلحات الإنجليزية التقنية عند الحاجة |
| نطاق التطبيق | الدستور، التصميم، STITCH، الأقسام، الشاشات، الأزرار، المتطلبات، الاختبارات، والأدلة |
| ملاحظة اعتماد | هذه وثائق هندسية مرجعية وليست اعتماداً قانونياً أو سريرياً نهائياً دون مراجعة مختصة |

---

## 1. الغرض

توفير برومنتات جاهزة لتصميم كل قسم عبر STITCH مع ضمان عدم اختصار المتطلبات.

## 2. Master STITCH Prompt

```text
Act as a senior healthcare product designer, clinical workflow architect, Saudi healthcare compliance UX lead, and enterprise design system owner.

Design a world-class bilingual Arabic-first medical ERP module for NamaMedical / الطبيب using STITCH.

Module:
[ضع اسم القسم هنا]

Required source:
Use the full Owner Requirements Source and do not omit any subsection related to this module.

Design requirements:
- Arabic RTL first, English-ready.
- Enterprise hospital-grade UI.
- Comparable in depth to global medical systems: unified patient record, workflow continuity, safe orders, audit, RCM where applicable, interoperability-ready.
- Saudi-ready: PDPL privacy, CBAHI clinical safety, NCA security, NPHIES/ZATCA where applicable.
- No PHI, no secrets, no real patient data.
- Include all screens, buttons, states, permissions, validation, audit messages, empty/loading/error/success/locked states.
- Include mobile/tablet/desktop responsive behavior.
- Include component inventory and i18n keys.
- Include acceptance criteria and test cases.
- Every dangerous action must have confirm/reason/audit.
- Every clinical finalization must have role guard and lock/amendment policy.
- Every cross-tenant data path must be blocked by design.

Output:
1. Module overview.
2. User roles.
3. Navigation.
4. Screen list.
5. User flows.
6. Button/action catalog.
7. Data fields.
8. Validation rules.
9. Permission matrix.
10. Audit events.
11. Error states.
12. Empty states.
13. Success states.
14. Clinical safety notes.
15. Saudi compliance notes.
16. Integration notes.
17. Acceptance criteria.
18. Test cases.
19. Handoff checklist.
```

## 3. STITCH Prompt حسب نوع القسم

| نوع القسم | إضافة إلزامية للبرومنت |
| --- | --- |
| العيادات والباطنة | أضف timeline، diagnoses، orders، prescriptions، follow-up، chronic care. |
| الجراحة والعمليات | أضف pre-op, consent, OR schedule, anesthesia, implants, PACU, checklist. |
| النساء والولادة | أضف maternal-fetal safety, high-risk pregnancy, labor, delivery, neonatal linkage. |
| الأطفال | أضف guardians, growth charts, pediatric dosing, vaccination, child safety. |
| المختبر | أضف specimen, barcode, result verification, critical values, QC. |
| الأشعة | أضف modality, RIS/PACS, DICOM, contrast, dose, critical findings. |
| الصيدلية | أضف formulary, CPOE, allergies, interactions, controlled meds, eMAR. |
| الطوارئ | أضف triage, acuity, trauma, stroke/chest pain code, observation. |
| العناية المركزة | أضف ventilator, fluid balance, scores, drips, critical alerts. |
| المالية/التأمين | أضف RCM, claims, denials, NPHIES, ZATCA guard, journal guard. |
| الإدارة والأكاديمية | أضف committees, credentialing, IRB, training, audit, risk. |
| المراكز المتخصصة | أضف multidisciplinary pathway, tumor board/heart team style workflows. |

## 4. قاعدة عدم الاختصار

أي قسم في مصدر المتطلبات يجب أن يملك واحداً من:
- شاشة مستقلة.
- workflow مستقل.
- تبويب داخل شاشة.
- سجل بيانات.
- تقرير.
- زر/إجراء.
- أو قرار OUT_OF_SCOPE موثق ومبرر.

لا يسمح بإسقاط أي بند بصمت.
