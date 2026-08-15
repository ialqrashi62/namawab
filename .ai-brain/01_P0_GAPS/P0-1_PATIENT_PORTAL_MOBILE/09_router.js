'use strict';
/**
 * Patient Portal Mobile — Express Router
 * Mount: /api/pp
 * Authentication: Patient JWT (separate from staff session)
 */
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./p0_1_patient_portal_engine');

router.get('/health', (req, res) => res.json({ ok: true, module: 'patient-portal', version: '1.0.0', timestamp: new Date().toISOString() }));

// ===== Identity & Auth =====
router.post('/auth/verify-identity', async (req, res) => {
  try {
    const result = engine.identityVerification(req.body);
    res.json({ ok: true, result });
  } catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

// ===== Appointments =====
router.post('/appointments', requireAuth, requireTenantScope, requireRole('patient'), async (req, res) => {
  try {
    const r = engine.appointmentBooking(req.body);
    await db.query(`INSERT INTO pp_appointments (tenant_id, patient_id, facility_id, specialty, appointment_date, appointment_time, status, appointment_id, insurance_approved, cost, created_by)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [req.tenantId, req.body.patient_id, req.body.facility_id, req.body.specialty,
       req.body.appointment_date, req.body.appointment_time, r.status, r.appointment_id,
       r.insurance_approved, r.cost, req.user?.id || null]);
    res.status(201).json({ ok: true, ...r });
  } catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.get('/appointments/:patient_id', requireAuth, requireTenantScope, requireRole('patient'), async (req, res) => {
  try {
    const r = await db.query(`SELECT * FROM pp_appointments WHERE tenant_id = $1 AND patient_id = $2 ORDER BY appointment_date DESC LIMIT 50`,
      [req.tenantId, parseInt(req.params.patient_id)]);
    res.json({ ok: true, count: r.rows.length, rows: r.rows });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== Telehealth =====
router.post('/telehealth/eligibility', requireAuth, requireTenantScope, requireRole('patient'), (req, res) => {
  try { res.json({ ok: true, result: engine.telehealthEligibility(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

// ===== Lab Results =====
router.post('/lab-results/disclose', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.labResultsDisclosure(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

// ===== Refills =====
router.post('/refills/request', requireAuth, requireTenantScope, requireRole('patient'), (req, res) => {
  try {
    const r = engine.refillRequestValidation(req.body);
    if (r.eligible) {
      db.query(`INSERT INTO pp_refill_requests (tenant_id, patient_id, prescription_id, status, created_by) VALUES ($1, $2, $3, 'pending', $4)`,
        [req.tenantId, req.body.patient_id, req.body.prescription_id, req.user?.id || null]);
    }
    res.json({ ok: true, ...r });
  } catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

// ===== Caregiver Proxy =====
router.post('/caregiver/grant', requireAuth, requireTenantScope, requireRole('patient'), (req, res) => {
  try {
    const r = engine.caregiverProxyAccess(req.body);
    if (r.active) {
      db.query(`INSERT INTO pp_caregivers (tenant_id, patient_id, caregiver_national_id, relationship, consent_doc_id, expires_at, created_by)
                VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [req.tenantId, req.body.patient_id, req.body.caregiver_national_id, req.body.relationship,
         req.body.consent_doc_id, req.body.expires_at || null, req.user?.id || null]);
    }
    res.json({ ok: true, ...r });
  } catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

// ===== Self-Reported Vitals =====
router.post('/vitals/record', requireAuth, requireTenantScope, requireRole('patient'), (req, res) => {
  try {
    const r = engine.selfReportedVitals(req.body);
    db.query(`INSERT INTO pp_vitals (tenant_id, patient_id, type, value, unit, abnormal, measured_at, created_by)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [req.tenantId, req.body.patient_id, r.type, r.value, r.unit, r.abnormal, r.measured_at || new Date().toISOString(), req.user?.id || null]);
    res.status(201).json({ ok: true, ...r });
  } catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

// ===== FHIR Export =====
router.get('/export/fhir/:patient_id', requireAuth, requireTenantScope, requireRole('patient'), (req, res) => {
  try {
    const sections = req.query.sections ? req.query.sections.split(',') : undefined;
    const r = engine.fhirExport({ patient_id: parseInt(req.params.patient_id), sections });
    res.json({ ok: true, ...r });
  } catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

// ===== Insurance =====
router.post('/insurance/verify', requireAuth, requireTenantScope, requireRole('patient'), (req, res) => {
  try { res.json({ ok: true, result: engine.insuranceVerification(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

// ===== Push Notifications =====
router.post('/notifications/push', requireAuth, requireTenantScope, requireRole('patient'), (req, res) => {
  try { res.json({ ok: true, result: engine.pushNotificationPriority(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

// ===== Consent Withdrawal =====
router.post('/consent/withdraw', requireAuth, requireTenantScope, requireRole('patient'), (req, res) => {
  try {
    const r = engine.consentWithdrawal(req.body);
    if (r.withdrawn) {
      db.query(`INSERT INTO pp_consent_log (tenant_id, patient_id, withdrawal_type, effective_at, created_by)
                VALUES ($1, $2, $3, $4, $5)`,
        [req.tenantId, req.body.patient_id, req.body.withdrawal_type, r.effective_at, req.user?.id || null]);
    }
    res.json({ ok: true, ...r });
  } catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

// ===== Health Risk Score =====
router.post('/risk/score', requireAuth, requireTenantScope, requireRole('patient'), (req, res) => {
  try { res.json({ ok: true, result: engine.healthRiskScore(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

// ===== Stats =====
router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
  try {
    const appts = await db.query(`SELECT COUNT(*) AS count FROM pp_appointments WHERE tenant_id = $1`, [req.tenantId]);
    const vitals = await db.query(`SELECT COUNT(*) AS count FROM pp_vitals WHERE tenant_id = $1`, [req.tenantId]);
    res.json({ ok: true, appointments: appts.rows[0].count, vitals: vitals.rows[0].count });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
