# قرار المرحلة التالية بعد تفعيل RLS Runtime (Master Decision)

> الوضع: `MEDICAL_MASTER_AUTOPILOT_AFTER_RLS_RUNTIME_ENFORCEMENT_RESELECT` | التاريخ: 2026-06-21.

```text
SELECTED_NEXT_PHASE: P0_RLS_RESTRICTED_ROLE_AUTHENTICATED_WORKFLOW_UAT (نُفِّذ هذه الجولة)
PRIORITY_LEVEL: P0 (إثبات أن workflows الأساسية تعمل تحت nama_medical_app قبل أي محاسبة/DDL/ميزات)
WHY_SELECTED:
  - RLS صار نافذاً فعلياً (app=nama_medical_app، super=false، bypassrls=false، عزل مُثبَت).
  - أعلى خطر بعد التبديل هو "regression صامت": مسار يفترض رؤية بيانات بلا ضبط app.tenant_id فيعيد 0 (تعطّل وظيفي آمن لكنه كسر للميزة). يجب إثبات أن الأساسيات تعمل.
WHY_NOT_ACCOUNTING_POSTING: ممنوع البدء قبل نجاح UAT؛ flag يبقى OFF.
WHY_NOT_NEW_DDL: لا DDL جديد قبل استقرار workflows تحت الدور.
WHY_NOT_STITCH: BLOCKED_PENDING_MCP_AND_KEY.
WHY_NOT_FEFO_LAB_RAD: P4، أدنى من إثبات استقرار P0 بعد التبديل.
BLOCKERS: لا حواجز على UAT الآمن (read-only + route auth + ROLLBACK writes).
APPROVAL_REQUIRED: لا (UAT آمن، بلا تغيير بيانات/إنتاج).
EXECUTION_SCOPE: route authorization (HTTP 401) + إثبات إنفاذ RLS تحت الدور على بيانات حقيقية (patients/invoices/audit_trail/blood_bank_units) + سلوك كتابة audit_trail (ROLLBACK) + فحص logs + حارس المحاسبة. لا تغيير بيانات، لا restart، لا .env، لا git force.
```

## قاعدة القرار المطبّقة
RLS نافذ ⇒ الأولوية القصوى إثبات الاستقرار الوظيفي تحت الدور المحدود قبل أي عمل جديد. اختير `P0_RLS_RESTRICTED_ROLE_AUTHENTICATED_WORKFLOW_UAT` ونُفِّذ. لم تُفعّل المحاسبة ولا Stitch ولا DDL.

## قيد UAT (شفافية)
لا تتوفّر لي بيانات اعتماد تسجيل دخول للتطبيق (ولن أُخمّنها)، لذا UAT غطّى: (1) **تفويض المسارات** (401 بلا جلسة لكل المسارات المحمية)، و(2) **طبقة إنفاذ RLS تحت دور التطبيق الفعلي** على بيانات إنتاج حقيقية — وهي الآلية التي تعتمدها الجلسات المصادقة (ضبط app.tenant_id ⇒ رؤية مستأجره فقط). آلية الربط ALS تم إثباتها مستقلاً 9/9 سابقاً، وشوهد +1 صف audit_trail (tenant1) من نشاط حقيقي يؤكد عمل logAudit تحت الدور.

`NEXT_PHASE_DECISION_COMPLETE`
