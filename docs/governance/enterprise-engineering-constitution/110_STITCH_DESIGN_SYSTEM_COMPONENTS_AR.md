# نظام التصميم والمكونات عبر STITCH
## STITCH Design System and Component Library

| الحقل | القيمة |
|---|---|
| رمز الوثيقة | EEC-STITCH-110 |
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

## 1. المكونات الإلزامية

| المكون | الاستخدام | الحالة المطلوبة |
| --- | --- | --- |
| AppShell | إطار التطبيق والتنقل | RTL + responsive |
| DepartmentDashboard | لوحة القسم | KPIs + queues + alerts |
| PatientBanner | هوية المريض والسياق السريري | PHI-minimized + role controlled |
| EncounterTimeline | خط زمني للزيارات | tenant-safe |
| OrderPanel | طلبات المختبر/الأشعة/الأدوية | clinical guard |
| ResultViewer | عرض النتائج | critical alerts |
| AuditDrawer | سجل التدقيق | read-only + authorized |
| ApprovalModal | اعتماد وتوقيع | reason + confirmation |
| AmendmentForm | تعديل ملحق | original preserved |
| PermissionDeniedState | منع الوصول | no data leakage |
| EmptyState | حالة فارغة | action-aware |
| ErrorState | فشل آمن | no stack trace |
| I18nText | ترجمة | Arabic-first |
| DataTable | جداول | filter + sort + export guard |
| Wizard | رحلات متعددة الخطوات | autosave + validation |

## 2. Design Tokens

- spacing scale.
- typography scale.
- Arabic-friendly line height.
- semantic colors without hardcoding clinical risk solely by color.
- icon policy.
- focus states.
- density modes.
- print layout.
- accessibility states.

## 3. STITCH Handoff

كل مكون يجب أن يملك:
- وصف.
- props.
- states.
- permissions.
- audit event.
- i18n keys.
- responsive behavior.
- test case.
