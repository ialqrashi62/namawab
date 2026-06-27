-- ============================================================
-- rls_group_B_candidate_up.sql
-- CANDIDATE ONLY — DO NOT EXECUTE IN PRODUCTION WITHOUT APPROVAL + STAGING PASS.
-- Group B: جداول تشغيلية ذات tenant_id مباشر (مخزون/صيدلية مشتريات/صيانة/عدوى/جودة/نقل).
-- نمط مُثبت: tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer ، fail-closed، ENABLE+FORCE.
-- ============================================================
BEGIN;
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'doctor_inventory_requests','doctor_inventory_request_items','hand_hygiene_audits','infection_outbreaks','infection_surveillance',
    'inventory_items','inventory_purchases','inventory_purchase_items','inventory_issue_to_dept','inventory_issue_items',
    'inventory_dept_requests','inventory_dept_request_items','inventory_stock_count','inventory_opening_balances','maintenance_equipment',
    'maintenance_pm_schedules','maintenance_work_orders','pharmacy_purchase_orders','pharmacy_purchase_items','pharmacy_opening_balances',
    'pharmacy_suppliers','quality_kpis','transport_requests'
  ] LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY', t);
    EXECUTE format('DROP POLICY IF EXISTS rls_%s_tenant_isolation ON %I', t, t);
    EXECUTE format(
      'CREATE POLICY rls_%s_tenant_isolation ON %I FOR ALL '
      || 'USING (tenant_id = (NULLIF(current_setting(''app.tenant_id'', true), ''''))::integer) '
      || 'WITH CHECK (tenant_id = (NULLIF(current_setting(''app.tenant_id'', true), ''''))::integer)',
      t, t);
  END LOOP;
END $$;
COMMIT;
