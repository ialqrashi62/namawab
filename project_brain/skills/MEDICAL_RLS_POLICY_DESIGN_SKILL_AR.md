# MEDICAL_RLS_POLICY_DESIGN_SKILL_AR

## الهدف

تصميم سياسات RLS آمنة لجداول النظام الطبي، مع الالتزام بعدم كسر التدفقات الحالية.

## القواعد

* استخدم current_setting('app.tenant_id', true) أو set_config عبر transaction context.
* لا تعتمد على SET دائم على pooled connections.
* استخدم SET LOCAL داخل transaction.
* tenant_id إلزامي للسياسات.
* facility_id و branch_id اختياريان حسب الجدول.
* لا تستخدم سياسات واسعة مثل USING (true).
* لا تستخدم bypass إلا لحسابات service موثقة.
* لا تخلط between tenants.

## نمط السياسة المفضل

* SELECT:
  tenant_id = current_setting('app.tenant_id', true)::int
* INSERT:
  WITH CHECK tenant_id = current_setting('app.tenant_id', true)::int
* UPDATE:
  USING tenant_id = current_setting('app.tenant_id', true)::int
  WITH CHECK tenant_id = current_setting('app.tenant_id', true)::int
* DELETE:
  ممنوع افتراضياً أو restricted جداً.

## الاختبارات المطلوبة

* tenant 1 لا يرى tenant 2.
* tenant 2 لا يرى tenant 1.
* INSERT mismatch fails.
* UPDATE cross tenant fails/no rows.
* aggregate SUM/COUNT scoped.
* missing tenant context fails safe.
* rollback removes policies.
