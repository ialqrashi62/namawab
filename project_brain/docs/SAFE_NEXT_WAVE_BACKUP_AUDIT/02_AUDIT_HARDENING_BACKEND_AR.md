# Wave 2 — تقوية التدقيق (Backend)

> 2026-06-22 | backend فقط، بلا DDL/GRANT. منشور ومُتحقَّق.

## الحقول
```text
AUDIT_SURFACE_REVIEWED: login/logout/failed-auth + 82 حدث logAudit قائم (CREATE/UPDATE/DELETE عبر معظم الموديولات + BLOCKED_* + SIGN_LOCK_RECORD/AMEND_RECORD/REFUND...)
EVENTS_COVERED (مضاف هذه الموجة): FAILED_LOGIN (مسارَي 401: مستخدم مجهول/غير نشط + كلمة مرور خاطئة) + LOGOUT
CODE_CHANGED: namaweb server.js (login/logout handlers) — 8023aeb→a0b2d1c
DDL_REQUIRED: NO (audit_trail قائم، السياسة تسمح tenant_id NULL لأحداث النظام)
GRANT_REQUIRED: NO
TESTS_RUN: node --check OK؛ static guard 5/5؛ live smoke (bad login → 401 + FAILED_LOGIN row مُسجَّل)
RBAC_STATUS: PASS (لا تغيير على الصلاحيات)
RLS_STATUS: PASS (FORCE_RLS=149؛ audit_trail append-only)
TENANT_ISOLATION_STATUS: PASS (لا تغيير؛ أحداث login بلا سياق مستأجر = tenant_id NULL مسموح)
SECRETS_PRINTED: NO (لا كلمة مرور في سجل التدقيق — username فقط، مقصوص 64 حرف)
RISK: منخفض (إضافة تسجيل فقط على مسارات auth؛ لا تغيير منطق الدخول)
```

## الفجوات المتبقية (لاحقاً، عند فكّ حواجزها)
- PHI_FILE_DOWNLOAD: ضمن حارس ملفات A3A (مؤجّل E2E).
- forged-tenant attempt: محجوب على مستوى DB (RLS 42501)؛ تسجيل تطبيقي اختياري لاحقاً.
- audit-reader (قراءة super-admin عبر المستأجرين): بوابة GRANT منفصلة.

## الإثبات الحيّ
bad login → 401 + صف FAILED_LOGIN في audit_trail (آخر 5 دقائق = 1). health 5/5، domain 200.
