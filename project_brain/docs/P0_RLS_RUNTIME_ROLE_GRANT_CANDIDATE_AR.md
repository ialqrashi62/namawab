# P0 — مرشّح صلاحيات دور التشغيل (Grant Candidate)

> المرحلة: `P0_RLS_RUNTIME_ROLE_ENFORCEMENT_RESTORE` — البوابة 2 | التاريخ: 2026-06-21.

## الحالة: المرشّح موجود ومُطبَّق — لا حاجة لـ GRANTs جديدة
المرشّح المعتمد: `docs/accounting_candidates/app_runtime_role_candidate.sql` (+ `_validate.sql` + `_rollback_notes.sql`). يُنشئ الدور بأقل صلاحية ويمنح DML + sequences + functions + default privileges. تدقيق Gate 1 أثبت أنه **مُطبَّق فعلاً** (تغطية 149/149 DML). لذا:
- **لا حاجة لكتابة/تنفيذ GRANT candidate جديد.**
- لا GRANTs ناقصة.

## ما لا يفعله المرشّح (مقصود)
لا superuser، لا bypassrls، لا CREATE/ALTER/TRUNCATE، لا ملكية جداول ⇒ FORCE RLS تُطبَّق على الدور.

## ما يبقى خارج المرشّح (سرّ + بيئة)
- **كلمة مرور الدور**: تُضبط بقناة آمنة خارج git (`ALTER ROLE nama_medical_app PASSWORD '<secret>'`). `has_password=true` (مضبوطة)، لكن قيمتها غير معروفة لي ولا يجوز تخمينها.
- **اتصال التطبيق**: تغيير `.env` (DB_USER/DB_PASSWORD) — تغيير بيئة + restart (Gate 6).

```text
GATE2_STATUS: GRANT_CANDIDATE_ALREADY_APPLIED (no new SQL needed)
NEXT: GATE3_APPROVAL_BOUNDARY → GATE4_ROLLBACK_PLAN
```

`RLS_RUNTIME_ROLE_GRANT_CANDIDATE_COMPLETE`
