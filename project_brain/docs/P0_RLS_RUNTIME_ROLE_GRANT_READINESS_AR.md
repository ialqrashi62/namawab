# P0 — تدقيق جاهزية صلاحيات دور التشغيل (Grant Readiness)

> المرحلة: `P0_RLS_RUNTIME_ROLE_ENFORCEMENT_RESTORE` — البوابة 1 | التاريخ: 2026-06-21 | **read-only** (كـ postgres؛ بلا تخمين أسرار).

## نتيجة التدقيق: الصلاحيات **مكتملة** (الدور جاهز للتشغيل)
| Object | Required Privilege | Has Privilege | Risk | Required GRANT |
| ------ | ------------------ | :-----------: | ---- | -------------- |
| كل جداول `public` (149) | SELECT | **149/149** | لا | — |
| كل جداول `public` | INSERT | **149/149** | لا | — |
| كل جداول `public` | UPDATE | **149/149** | لا | — |
| كل جداول `public` | DELETE | **149/149** | لا | — |
| السلاسل (sequences) | USAGE/SELECT/UPDATE | **147 ممنوحة USAGE** | لا | — |
| المخطط `public` | USAGE | **نعم** (`has_schema_privilege=true`) | لا | — |
| الدوال (functions) | EXECUTE | ممنوحة عبر المرشّح (GRANT EXECUTE ON ALL FUNCTIONS) | لا | — |
| DDL/TRUNCATE/ملكية | (يجب ألا تُمنح) | غير ممنوحة | — | لا تُمنح |
| **DDL وقت الإقلاع** | غير مطلوب | — | لا | `initDatabase()` **يتخطّى** التهيئة في الإنتاج (`NODE_ENV=production` → return) ⇒ لا CREATE/ALTER على الإقلاع |

## خصائص الدور
`login=t, super=f, bypassrls=f, createdb=f, createrole=f` — أقل صلاحية صحيحة؛ FORCE RLS ستنطبق عليه (لا يملك أي جدول).

## التبعيات التشغيلية
- **Redis**: OPEN على :6379 (لا علاقة بدور DB، لكنه شرط إقلاع prod mode) ✅.
- **مسارات بلا سياق مستأجر**: الجداول العامة (system_users/tenants/user_tenants/الكتالوجات) **ليست** FORCE-RLS ⇒ تسجيل الدخول وحلّ المستأجر والكتالوجات تعمل تحت `nama_medical_app` دون سياق. الجداول المملوكة للمستأجر FORCE-RLS ⇒ تتطلّب ضبط `app.tenant_id` (يضبطه wrapper التطبيق per-query) — يُتحقَّق فعلياً في Gate 7 بعد التحويل.

## الخلاصة
**لا GRANTs ناقصة.** الدور مكتمل الصلاحيات وجاهز. لا حاجة لإنشاء GRANT candidate جديد (المرشّح `app_runtime_role_candidate.sql` مُطبَّق فعلاً).

```text
GATE1_STATUS: GRANT_READINESS_COMPLETE (no missing grants)
NO_STARTUP_DDL_IN_PROD: YES (initDatabase returns early)
NEXT: GATE2_GRANT_CANDIDATE (already applied) → GATE3_APPROVAL_BOUNDARY
```

`RLS_RUNTIME_ROLE_GRANT_READINESS_COMPLETE`
