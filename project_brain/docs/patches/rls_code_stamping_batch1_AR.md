# Patch Spec — Batch 1: ختم tenant_id/facility_id (دفاع-في-العمق)

> المرحلة: `P1_RLS_CODE_LEVEL_TENANT_STAMPING…` | candidate spec فقط — **لم يُطبَّق على namaweb** (تشعّب main↔master). يُطبَّق بعد قرار دمج المالك + موافقة نشر.
> الأساس: namaweb 039a7d7 (`server.js`). النمط مطابق لـ crossmatch/transfusions القائمة. كله **فوق** DB default (لا يكسره).
> facility_id موجود على: units, donors, insurance_claims, medical_records, medical_certificates. **غير موجود** على transport_requests (tenant_id فقط).

## 0) import (سطر 10)
```diff
- const { pool, initDatabase } = require('./db_postgres');
+ const { pool, initDatabase, getCurrentTenantId } = require('./db_postgres');
```
(db_postgres.js في 039a7d7 يُصدّر getCurrentTenantId ضمن ALS binding — مؤكَّد.)

## 1) logAudit (≈134–142)
```diff
  async function logAudit(userId, userName, action, module, details, ip) {
      try {
+         // RLS defense-in-depth: stamp tenant_id from trusted ALS context (NULL لنظامي بلا سياق)
+         const tid = getCurrentTenantId();
          await pool.query(
-             'INSERT INTO audit_trail (user_id, username, action, module, new_values, ip_address) VALUES ($1,$2,$3,$4,$5,$6)',
-             [userId, userName || '', action || '', module || '', details || '', ip || '']
+             'INSERT INTO audit_trail (user_id, username, action, module, new_values, ip_address, tenant_id) VALUES ($1,$2,$3,$4,$5,$6,$7)',
+             [userId, userName || '', action || '', module || '', details || '', ip || '', tid]
          );
      } catch (e) { console.error('Audit log error:', e.message); }
  }
```

## 2) POST /api/insurance/claims (≈640) — أضف requireTenantScope + ختم
```diff
- app.post('/api/insurance/claims', requireAuth, requireRole('insurance'), async (req, res) => {
+ app.post('/api/insurance/claims', requireAuth, requireRole('insurance'), requireTenantScope, async (req, res) => {
      ...
+     const { tenantId, facilityId } = getRequestTenantContext(req);
-     'INSERT INTO insurance_claims (patient_name, insurance_company, claim_amount) VALUES ($1,$2,$3) RETURNING id'
+     'INSERT INTO insurance_claims (patient_name, insurance_company, claim_amount, tenant_id, facility_id) VALUES ($1,$2,$3,$4,$5) RETURNING id'
      // params: [..., claim_amount, tenantId, facilityId]
```

## 3) POST /api/medical/records (≈668)
```diff
- app.post('/api/medical/records', requireAuth, requireRole('doctor', 'nursing'), async (req, res) => {
+ app.post('/api/medical/records', requireAuth, requireRole('doctor', 'nursing'), requireTenantScope, async (req, res) => {
+     const { tenantId, facilityId } = getRequestTenantContext(req);
-     'INSERT INTO medical_records (patient_id, doctor_id, diagnosis, symptoms, icd10_codes, notes) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id'
+     'INSERT INTO medical_records (patient_id, doctor_id, diagnosis, symptoms, icd10_codes, notes, tenant_id, facility_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id'
      // params: [..., notes, tenantId, facilityId]
```

## 4) POST /api/medical/certificates (≈1817)
```diff
- app.post('/api/medical/certificates', requireAuth, async (req, res) => {
+ app.post('/api/medical/certificates', requireAuth, requireTenantScope, async (req, res) => {
+     const { tenantId, facilityId } = getRequestTenantContext(req);
-     'INSERT INTO medical_certificates (patient_id, patient_name, doctor_id, doctor_name, cert_type, diagnosis, notes, start_date, end_date, days) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id'
+     'INSERT INTO medical_certificates (patient_id, patient_name, doctor_id, doctor_name, cert_type, diagnosis, notes, start_date, end_date, days, tenant_id, facility_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING id'
      // params: [..., days, tenantId, facilityId]
```

## 5) POST /api/blood-bank/units (≈2484)
```diff
- app.post('/api/blood-bank/units', requireAuth, async (req, res) => {
+ app.post('/api/blood-bank/units', requireAuth, requireTenantScope, async (req, res) => {
+     const { tenantId, facilityId } = getRequestTenantContext(req);
-     'INSERT INTO blood_bank_units (bag_number, ..., notes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id'
+     'INSERT INTO blood_bank_units (bag_number, ..., notes, tenant_id, facility_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING id'
      // params: [..., notes, tenantId, facilityId]
```

## 6) POST /api/blood-bank/donors (≈2507) — انتبه: CURRENT_DATE::TEXT حرفي في الوسط
```diff
- app.post('/api/blood-bank/donors', requireAuth, async (req, res) => {
+ app.post('/api/blood-bank/donors', requireAuth, requireTenantScope, async (req, res) => {
+     const { tenantId, facilityId } = getRequestTenantContext(req);
-     'INSERT INTO blood_bank_donors (donor_name, ..., gender, last_donation_date, medical_history, notes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,CURRENT_DATE::TEXT,$9,$10) RETURNING id'
+     'INSERT INTO blood_bank_donors (donor_name, ..., gender, last_donation_date, medical_history, notes, tenant_id, facility_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,CURRENT_DATE::TEXT,$9,$10,$11,$12) RETURNING id'
      // params: [..., notes, tenantId, facilityId]
```

## 7) POST /api/transport/requests (≈4006) — tenant_id فقط (لا facility_id)
```diff
- app.post('/api/transport/requests', requireAuth, async (req, res) => {
+ app.post('/api/transport/requests', requireAuth, requireTenantScope, async (req, res) => {
+     const { tenantId } = getRequestTenantContext(req);
-     'INSERT INTO transport_requests (patient_id,...,special_needs) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *'
+     'INSERT INTO transport_requests (patient_id,...,special_needs, tenant_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *'
      // params: [..., special_needs, tenantId]
```

## قواعد التطبيق
- لا tenant_id/facility_id من req.body (تُؤخذ من getRequestTenantContext فقط).
- requireTenantScope يضمن fail-closed (403 بلا سياق في prod).
- يبقى DB default fallback؛ التمرير الصريح = نفس قيمة السياق (لا تعارض، لا كسر).
- بعد التطبيق: node --check + اختبار ثابت + (عند موافقة نشر) pm2 restart محكوم.

`PATCH_SPEC_BATCH1_READY`
