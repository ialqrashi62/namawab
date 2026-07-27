/**
 * pcc/ccu/ccu_routes.js
 *
 * 5 Express endpoints for CCU.
 * Same middleware chain as cath_lab.
 * Money routes: POST /admissions (idempotent), POST /admissions/:id/vitals (idempotent).
 */
'use strict';

const { Router } = require('express');
const { withTenant } = require('../db');
const Engine = require('./ccu_engine');
const {
  authenticate,
  requireTenantScope,
  requireRole,
  validateBody,
  idempotencyGuard,
  writeAuditLog,
} = require('../middleware');
const { RS } = require('../schemas');

const router = Router();
const ccuTenantRole = [authenticate, requireTenantScope, requireRole('CCU')];

/* 1. POST /admissions (idempotent) */
router.post('/admissions',
  ...ccuTenantRole,
  validateBody(RS.ccuAdmissionCreate),
  idempotencyGuard,
  async (req, res, next) => {
    try {
      const tenantId = req.session.tenantId;
      const { patientId, encounterId, admissionType, primaryDiagnosis, cptCodes } = req.body;
      const result = await withTenant(tenantId, async (client) => {
        const id = require('crypto').randomUUID();
        await client.query(
          `INSERT INTO ccu_admission
             (id, tenant_id, patient_id, encounter_id, admission_type,
              status, primary_diagnosis, cpt_codes)
           VALUES ($1, $2, $3, $4, $5, 'admitted', $6, $7)`,
          [id, tenantId, patientId, encounterId, admissionType, primaryDiagnosis || null,
           JSON.stringify(cptCodes || [])]
        );
        await writeAuditLog(client, {
          tenantId, procedureId: null, actorId: req.session.userId,
          action: 'CREATE', entityType: 'ccu_admission', entityId: id, payload: req.body,
        });
        return { id, patientId, encounterId, admissionType, status: 'admitted' };
      });
      res.status(201).json(result);
    } catch (err) { next(err); }
  }
);

/* 2. GET /admissions */
router.get('/admissions',
  ...ccuTenantRole,
  async (req, res, next) => {
    try {
      const tenantId = req.session.tenantId;
      const limit = Math.min(parseInt(req.query.limit || '50', 10), 200);
      const result = await withTenant(tenantId, async (client) => {
        return client.query(
          `SELECT id, patient_id, encounter_id, admission_type, status,
                  grace_score, timi_score, scai_stage, primary_diagnosis,
                  admitted_at, discharged_at, created_at
           FROM ccu_admission
           WHERE tenant_id = $1 AND soft_deleted_at IS NULL
           ORDER BY created_at DESC
           LIMIT $2`,
          [tenantId, limit]
        );
      });
      res.json(result.rows);
    } catch (err) { next(err); }
  }
);

/* 3. GET /admissions/:id */
router.get('/admissions/:id',
  ...ccuTenantRole,
  async (req, res, next) => {
    try {
      const tenantId = req.session.tenantId;
      const result = await withTenant(tenantId, async (client) => {
        const adm = await client.query(
          `SELECT * FROM ccu_admission WHERE id = $1 AND tenant_id = $2 AND soft_deleted_at IS NULL`,
          [req.params.id, tenantId]
        );
        if (adm.rowCount === 0) { const e = new Error('Not found'); e.statusCode = 404; throw e; }
        const vitals = await client.query(
          `SELECT * FROM ccu_vital_sign WHERE admission_id = $1 ORDER BY measured_at DESC`,
          [req.params.id]
        );
        const meds = await client.query(
          `SELECT * FROM ccu_medication_admin WHERE admission_id = $1 ORDER BY given_at DESC`,
          [req.params.id]
        );
        return { admission: adm.rows[0], vitals: vitals.rows, medications: meds.rows };
      });
      res.json(result);
    } catch (err) { next(err); }
  }
);

/* 4. POST /admissions/:id/vitals (idempotent) */
router.post('/admissions/:id/vitals',
  ...ccuTenantRole,
  validateBody(RS.ccuVitalCreate),
  idempotencyGuard,
  async (req, res, next) => {
    try {
      const tenantId = req.session.tenantId;
      const v = req.body;
      const result = await withTenant(tenantId, async (client) => {
        const adm = await client.query(
          `SELECT id FROM ccu_admission WHERE id = $1 AND tenant_id = $2 AND soft_deleted_at IS NULL`,
          [req.params.id, tenantId]
        );
        if (adm.rowCount === 0) { const e = new Error('Admission not found'); e.statusCode = 404; throw e; }
        const id = require('crypto').randomUUID();
        await client.query(
          `INSERT INTO ccu_vital_sign
             (id, tenant_id, admission_id, measured_at, heart_rate, sbp_mmhg, dbp_mmhg,
              map_mmhg, spo2_pct, rhythm, lactate_mmol_l, on_vasopressor, arrhythmia_flag)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
          [id, tenantId, req.params.id, v.measuredAt || new Date().toISOString(),
           v.heartRate, v.sbpMmhg, v.dbpMmhg, v.mapMmhg, v.spo2Pct,
           v.rhythm, v.lactateMmolL, v.onVasopressor, v.arrhythmiaFlag]
        );
        await writeAuditLog(client, {
          tenantId, procedureId: null, actorId: req.session.userId,
          action: 'CREATE', entityType: 'ccu_vital_sign', entityId: id, payload: v,
        });
        return { id, admissionId: req.params.id };
      });
      res.status(201).json(result);
    } catch (err) { next(err); }
  }
);

/* 5. GET /decision/grace (pure compute) */
router.get('/decision/grace',
  ...ccuTenantRole,
  async (req, res) => {
    const score = parseInt(req.query.score || '0', 10);
    res.json(Engine.GRACEInHospitalMortality(score));
  }
);

module.exports = router;
