-- ============================================================
-- audit_trail_reader_runtime_grant_candidate_up.sql
-- CANDIDATE ONLY — DO NOT EXECUTE ON PRODUCTION WITHOUT EXPLICIT APPROVAL.
-- خيار B: منح عضوية دور القارئ لدور التطبيق ليستطيع SET ROLE داخل مسار super-admin فقط.
-- النطاق: GRANT عضوية فقط. لا SUPERUSER، لا BYPASSRLS، لا تغيير سياسات/صلاحيات أخرى.
-- شرط إلزامي مرافق (كود): SET ROLE nama_audit_reader يُستخدم حصراً خلف requireSuperAdmin
--   وداخل معاملة، ثم RESET ROLE/COMMIT. لا يُقبل tenant_id من body. pagination + filters آمنة.
-- ============================================================
-- ⚠️ INHERIT FALSE إلزامي (PostgreSQL 16+): مع الوراثة الافتراضية، تنطبق سياسة
--   audit_trail_select_superadmin (TO nama_audit_reader) على nama_medical_app **مباشرةً**
--   (لأنه عضو وارث) فتنكسر عزلة audit_trail لكل استعلامات التطبيق العادية! (أثبتته البروفة.)
--   مع INHERIT FALSE: لا وراثة تلقائية؛ تنطبق سياسة القارئ فقط بعد SET ROLE صريح.
BEGIN;
GRANT nama_audit_reader TO nama_medical_app WITH INHERIT FALSE;
COMMIT;
