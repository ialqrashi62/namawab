# PHASE_REMEDIATION_V2 — Baseline Freeze (2026-08-09)

## الهدف
تثبيت نقطة بداية رسمية قبل تنفيذ خطة Remediation v2، مع ربط مباشر بالبوابات G0..G5 ومخرجات قابلة للتدقيق.

## الحالة الحالية المختصرة
- حالة عامة: تنفيذ Wave A بدأ فعليًا على فرع معزول.
- خط امتثال ZATCA/NPHIES/CBAHI: مطبق ومتحقق جزئيًا باختبارات مركزة.
- مسار CI: تمت إضافة بوابة امتثال مخصصة ضمن خطة Wave A.
- قيود بيئية: اختبار route واحد يعتمد `better-sqlite3` وقد يفشل محليًا على Windows + Node 24 بدون Visual C++ Build Tools.

## KPI Baseline (قبل بقية الموجات)
- Compliance tests (quick): PASS
- ZATCA fail-closed guards: PASS
- NPHIES/CBAHI UI guards: PASS
- Integration route full suite: PASS على بيئة namaweb الأساسية، ويتطلب dependency جاهز في كل worktree.

## ربط البوابات (G0..G5)
- G0 (Compliance): تحسن مباشر عبر توحيد validation/redaction/fail-closed.
- G1 (RLS): مستقر حسب الحالة السابقة، دون تعديل كسري في هذه الدفعة.
- G2 (PHI Encryption): لا تغيير في هذه الدفعة.
- G3 (Money Idempotency): بدون تغيير في هذه الدفعة.
- G4 (Tenant Scope): حراسة tenant مفعلة ضمن مسارات الامتثال.
- G5 (Audit Chain): بدون تغيير في هذه الدفعة.

## نطاق Wave A (المثبت)
1. دمج حزمة الامتثال (Task 2) على فرع تنفيذ معزول.
2. تشغيل الاختبارات المركزة وتوثيق القيود البيئية.
3. إضافة بوابة CI امتثال (Task 9 جزئيًا).

## المخاطر المفتوحة الآن
- استمرار اعتماد الاختبار الكامل على `better-sqlite3` في بعض بيئات Windows.
- بقاء Task 1/9 التوثيقي الكامل يحتاج دمج نهائي على الفرع المستهدف بعد اعتماد المالك.

## قرار التنفيذ
- الاستمرار بالمسار Subagent-Driven على دفعات صغيرة قابلة للإغلاق.
- منع أي نشر أو تغييرات Red-lane حتى اعتماد المالك.
