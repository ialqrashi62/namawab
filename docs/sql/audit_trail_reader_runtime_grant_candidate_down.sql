-- ============================================================
-- audit_trail_reader_runtime_grant_candidate_down.sql
-- CANDIDATE ROLLBACK — DO NOT EXECUTE WITHOUT APPROVAL.
-- يسحب عضوية دور القارئ من دور التطبيق. آمن، idempotent، لا يمسّ الدور ولا السياسات.
-- ملاحظة: نفّذه فقط بعد إيقاف نشر أي كود يعتمد على SET ROLE nama_audit_reader.
-- ============================================================
BEGIN;
REVOKE nama_audit_reader FROM nama_medical_app;
COMMIT;
