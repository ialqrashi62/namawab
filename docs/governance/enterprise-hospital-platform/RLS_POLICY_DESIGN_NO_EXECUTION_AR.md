# تقرير تصميم سياسات أمان Row-Level Security (RLS)

يوضح هذا المستند سياسات أمان مستوى السطر (RLS) المقترحة لتأمين وعزل البيانات السريرية والمالية على مستوى المنشآت والمستأجرين.

## السياسات المقترحة (RLS Policies)
1. **عزل المستأجرين (Tenant Isolation)**:
   ```sql
   CREATE POLICY tenant_isolation_policy ON encounters
   USING (tenant_id = current_setting('app.current_tenant_id'));
   ```
2. **عزل المنشآت والأقسام (Facility & Department Scope)**:
   ```sql
   CREATE POLICY facility_scope_policy ON clinical_orders
   USING (facility_id = current_setting('app.current_facility_id')
      AND department_id = ANY(current_setting('app.current_user_departments')::int[]));
   ```
3. **حظر تداول البيانات لغير المصرح لهم**: فرض قيود تمنع استعلام المحاسبين عن النتائج التشخيصية للمرضى، ومنع الصيادلة من تداول مطالبات التأمين.