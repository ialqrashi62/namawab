# PHASE 4 — بوابة دور قارئ التدقيق (مراجعة، بلا GRANT)

> 2026-06-22 | لا GRANT، لا تفعيل. تحقّق حيّ من حالة الدور.

## الحالة الحيّة (postgres قراءة-فقط)
- `nama_audit_reader` موجود: **NOLOGIN، NOSUPER، NOBYPASSRLS** ✅.
- `nama_medical_app` **ليس عضواً** فيه ✅ (لا GRANT للتطبيق).

## التصميم المطلوب قبل التفعيل
```text
SELECT-only على audit_trail
GRANT nama_audit_reader TO nama_medical_app WITH INHERIT FALSE
SET ROLE محكوم خلف requireSuperAdmin فقط؛ RESET في finally
pagination + حد صفوف؛ إخراج بلا تسريب PHI (تقييد أعمدة)
```

## الحالة
```text
AUDIT_READER_STATUS: CANDIDATE_READY_NOT_DEPLOYED
ROLE: exists NOLOGIN/NOSUPER/NOBYPASSRLS   APP_IS_MEMBER: NO   GRANT_EXECUTED: NO
NEXT_REQUIRED_ACTION: APPROVE_AUDIT_READER_GRANT_AND_DEPLOY
```
