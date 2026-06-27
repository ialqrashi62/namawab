-- ============================================================
-- audit_trail_rls_policy_candidate_down.sql
-- CANDIDATE ROLLBACK — DO NOT EXECUTE WITHOUT APPROVAL.
-- يتراجع عن audit_trail_rls_policy_candidate_up.sql: يُسقط السياستين الجديدتين
-- ويعيد السياسة الصارمة الموحّدة الأصلية (FOR ALL). آمن، idempotent.
-- ============================================================
BEGIN;

DROP POLICY IF EXISTS audit_trail_insert_writealways ON audit_trail;
DROP POLICY IF EXISTS audit_trail_select_tenant ON audit_trail;

-- استعادة السياسة الأصلية كما كانت بعد PHI Class A DDL
CREATE POLICY rls_audit_trail_tenant_isolation ON audit_trail
  FOR ALL
  USING (tenant_id = (NULLIF(current_setting('app.tenant_id', true), ''))::integer)
  WITH CHECK (tenant_id = (NULLIF(current_setting('app.tenant_id', true), ''))::integer);

COMMIT;
