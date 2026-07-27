/**
 * pcc/routes/cath_lab.js
 *
 * 5 Express endpoints for cath lab operations.
 *
 * All endpoints share this middleware chain:
 *   authenticate → requireTenantScope → requireRole('CARD')
 *     → validateBody(RS.<schema>) → idempotencyGuard (money routes only)
 *     → async handler
 *
 * Money routes (idempotency required):
 *   - POST /api/v1/cath-lab/procedures      (records procedure + CPT)
 *   - POST /api/v1/cath-lab/procedures/:id/vessels  (records vessel + supplies)
 *
 * Read routes (no idempotency):
 *   - GET  /api/v1/cath-lab/procedures
 *   - GET  /api/v1/cath-lab/procedures/:id
 *   - GET  /api/v1/cath-lab/decision/jcto
 */
'use strict';

const { Router } = require('express');
const { withTenant } = require('../db');
const Engine = require('../engines/cath_lab_specialized_engine');
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

const cathTenantRole = [authenticate, requireTenantScope, requireRole('CARD')];

/* ============================================================
 * 1. POST /api/v1/cath-lab/procedures
 *    Money route — idempotency required.
 * ============================================================ */
router.post('/procedures',
  ...cathTenantRole,
  validateBody(RS.cathLabProcedureCreate),
  idempotencyGuard,
  async (req, res, next) => {
    try {
      const tenantId = req.session.tenantId;
      const {
        patientId, encounterId, procedureType, scheduledAt,
        primaryOperatorId, cptCodes,
      } = req.body;
      const result = await withTenant(tenantId, async (client) => {
        const ins = await client.query(
          `INSERT INTO cath_lab_procedure
             (tenant_id, patient_id, encounter_id, procedure_type,
              status, scheduled_at, primary_operator_id, cpt_codes)
           VALUES ($1, $2, $3, $4, 'scheduled', $5, $6, $7)
           RETURNING *`,
          [tenantId, patientId, encounterId, procedureType,
           scheduledAt, primaryOperatorId, JSON.stringify(cptCodes || [])]
        );
        await writeAuditLog(client, {
          tenantId, procedureId: ins.rows[0].id, actorId: req.session.userId,
          action: 'CREATE', entityType: 'cath_lab_procedure',
          entityId: ins.rows[0].id, payload: req.body,
        });
        return ins.rows[0];
      });
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }
);

/* ============================================================
 * 2. POST /api/v1/cath-lab/procedures/:id/vessels
 *    Money route — supplies + stents.
 * ============================================================ */
router.post('/procedures/:id/vessels',
  ...cathTenantRole,
  validateBody(RS.cathLabVesselCreate),
  idempotencyGuard,
  async (req, res, next) => {
    try {
      const tenantId = req.session.tenantId;
      const procedureId = req.params.id;
      const v = req.body;
      const result = await withTenant(tenantId, async (client) => {
        // Verify procedure belongs to tenant
        const proc = await client.query(
          `SELECT id FROM cath_lab_procedure
           WHERE id = $1 AND tenant_id = $2 AND soft_deleted_at IS NULL`,
          [procedureId, tenantId]
        );
        if (proc.rowCount === 0) {
          const e = new Error('Procedure not found in this tenant');
          e.statusCode = 404;
          throw e;
        }
        const ins = await client.query(
          `INSERT INTO cath_lab_vessel_intervention
             (tenant_id, procedure_id, vessel_name, segment,
              intervention_type, stent_size_mm, stent_length_mm,
              pre_stenosis_pct, post_stenosis_pct)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           RETURNING *`,
          [tenantId, procedureId, v.vesselName, v.segment || null,
           v.interventionType, v.stentSizeMm || null, v.stentLengthMm || null,
           v.preStenosisPct, v.postStenosisPct]
        );
        await writeAuditLog(client, {
          tenantId, procedureId, actorId: req.session.userId,
          action: 'CREATE', entityType: 'cath_lab_vessel_intervention',
          entityId: ins.rows[0].id, payload: v,
        });
        return ins.rows[0];
      });
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }
);

/* ============================================================
 * 3. GET /api/v1/cath-lab/procedures
 * ============================================================ */
router.get('/procedures',
  ...cathTenantRole,
  async (req, res, next) => {
    try {
      const tenantId = req.session.tenantId;
      const limit = Math.min(parseInt(req.query.limit || '50', 10), 200);
      const result = await withTenant(tenantId, async (client) => {
        return client.query(
          `SELECT id, patient_id, encounter_id, procedure_type, status,
                  scheduled_at, started_at, ended_at, j_cto_score, syntax_score,
                  created_at
           FROM cath_lab_procedure
           WHERE soft_deleted_at IS NULL
           ORDER BY created_at DESC
           LIMIT $1`,
          [limit]
        );
      });
      res.json(result.rows);
    } catch (err) { next(err); }
  }
);

/* ============================================================
 * 4. GET /api/v1/cath-lab/procedures/:id
 * ============================================================ */
router.get('/procedures/:id',
  ...cathTenantRole,
  async (req, res, next) => {
    try {
      const tenantId = req.session.tenantId;
      const result = await withTenant(tenantId, async (client) => {
        const proc = await client.query(
          `SELECT * FROM cath_lab_procedure
           WHERE id = $1 AND soft_deleted_at IS NULL`,
          [req.params.id]
        );
        if (proc.rowCount === 0) {
          const e = new Error('Not found'); e.statusCode = 404; throw e;
        }
        const vessels = await client.query(
          `SELECT * FROM cath_lab_vessel_intervention WHERE procedure_id = $1`,
          [req.params.id]
        );
        const flags = await client.query(
          `SELECT * FROM cath_lab_red_flag WHERE procedure_id = $1
           ORDER BY created_at DESC`,
          [req.params.id]
        );
        return {
          procedure: proc.rows[0],
          vessels: vessels.rows,
          redFlags: flags.rows,
        };
      });
      res.json(result);
    } catch (err) { next(err); }
  }
);

/* ============================================================
 * 5. GET /api/v1/cath-lab/decision/jcto
 *    Pure computation endpoint, no DB.
 * ============================================================ */
router.get('/decision/jcto',
  ...cathTenantRole,
  async (req, res) => {
    const params = {
      bluntProximalCap: req.query.bluntProximalCap === 'true',
      severeCalcification: req.query.severeCalcification === 'true',
      severeBend: req.query.severeBend === 'true',
      lengthGt20: req.query.lengthGt20 === 'true',
      priorFailedAttempt: req.query.priorFailedAttempt === 'true',
    };
    res.json(Engine.CTOScoreJCTO(params));
  }
);

module.exports = router;
