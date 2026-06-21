-- ============================================================
-- audit_trail_rls_policy_candidate_up.sql
-- CANDIDATE ONLY — DO NOT EXECUTE ON PRODUCTION WITHOUT EXPLICIT DDL APPROVAL.
-- الهدف: جعل audit_trail متوافقاً مع تبديل الدور إلى nama_medical_app (FORCE RLS مُنفَّذ).
--
-- المشكلة: السياسة الحالية rls_audit_trail_tenant_isolation هي FOR ALL بـ
--   WITH CHECK (tenant_id = current_setting('app.tenant_id')). لكن helper التدقيق logAudit
--   يُدرج بدون tenant_id (=> NULL)، فيُرفَض أي إدراج تدقيق بعد التبديل (NULL لا يساوي tid،
--   وحتى للأحداث النظامية بلا سياق NULL=NULL ينتج NULL وليس TRUE) — والخطأ يُبتلع في catch
--   => فقدان تدقيق صامت (تراجع أمني).
--
-- الحل (تصميم سياسة): فصل السياسات بحيث:
--   * INSERT لا يُحجب أبداً (التدقيق يجب ألا يُفقد): يسمح بالأحداث النظامية (tenant_id IS NULL)
--     وبالأحداث المختومة بالمستأجر؛ ويمنع تزوير مستأجر آخر عند وجود سياق.
--   * SELECT يبقى معزولاً بالمستأجر (صفوف NULL/النظام وصفوف المستأجرين الآخرين غير مرئية).
--   * لا UPDATE/DELETE policy => مرفوضة تحت FORCE RLS => سجل تدقيق غير قابل للتعديل (append-only).
--   * لا BYPASSRLS، ولا جعل audit_trail مقروءاً لكل مستأجر، ولا فتح قراءة عابرة بلا حوكمة.
--
-- قراءة super-admin العابرة للمستأجر = آلية محكومة منفصلة (دور قراءة مخصص أو VIEW مُدار) — خارج
--   هذا الملف عمداً (لا تُفتح هنا بلا حوكمة).
--
-- مكمّل (code-only، منفصل): تعديل logAudit ليختم tenant_id من السياق الموثوق getCurrentTenantId()
--   (المتاح عبر AsyncLocalStorage) يمنح إسناداً لكل مستأجر؛ غير لازم للتوافق (هذه السياسة تكفي
--   لمنع فقدان التدقيق)، لكنه يحسّن إمكانية القراءة لكل مستأجر.
-- ============================================================
BEGIN;

-- إسقاط السياسة الصارمة الموحّدة
DROP POLICY IF EXISTS rls_audit_trail_tenant_isolation ON audit_trail;

-- INSERT: لا يُحجب التدقيق أبداً — يسمح بالنظامي (NULL) والمختوم بالمستأجر، ويمنع تزوير مستأجر آخر
CREATE POLICY audit_trail_insert_writealways ON audit_trail
  FOR INSERT
  WITH CHECK (
    tenant_id IS NULL
    OR tenant_id = (NULLIF(current_setting('app.tenant_id', true), ''))::integer
  );

-- SELECT: عزل قراءة بالمستأجر (صفوف النظام/المستأجرين الآخرين غير مرئية للمستأجر)
CREATE POLICY audit_trail_select_tenant ON audit_trail
  FOR SELECT
  USING (
    tenant_id = (NULLIF(current_setting('app.tenant_id', true), ''))::integer
  );

-- لا سياسة UPDATE/DELETE => مرفوضة تحت FORCE RLS => append-only/immutable.

COMMIT;
