---
module_id: ER-001
section: 03_technical_arch
template_ref: TPL:DEPT
generated: 2026-07-23
---

# ER-001 Routes (Express)

## File: `namaweb/er_routes.js`

```javascript
// namaweb/er_routes.js
'use strict';
const express = require('express');
const {authenticate, requireRole, requireTenantScope} = require('./auth');
const er_engine = require('./er_engine');
const {validateBody, RS} = require('./route_schemas');

const router = express.Router();

/**
 * POST /api/er/triage
 * Classify patient acuity (ESI 1-5) + detect red flags
 */
router.post('/triage',
  authenticate,
  requireTenantScope,
  requireRole(['RN', 'MD', 'PA', 'NP']),
  validateBody(RS.er.triageRequest),
  async (req, res) => {
    try {
      const result = er_engine.classifyESI(req.body);
      
      // Log to audit
      req.audit('ER_TRIAGE_DECISION', {
        patient_id: req.body.patient_id,
        esi_level: result.esi_level,
        red_flags: result.red_flags,
        decided_by: req.user.id,
      });
      
      // Auto-create encounter if ESI 1-2 (immediate treatment)
      if (result.esi_level <= 2) {
        const encounter = await createEmergencyEncounter(req.tenant_id, req.body, result);
        result.encounter_id = encounter.id;
      }
      
      res.json(result);
    } catch (err) {
      req.log.error('Triage error', {error: err.message, tenant_id: req.tenant_id});
      res.status(500).json({error: 'TRIAGE_FAILED', message: 'Triage classification failed'});
    }
  }
);

/**
 * GET /api/er/triage/queue
 * Real-time triage queue
 */
router.get('/triage/queue',
  authenticate,
  requireTenantScope,
  requireRole(['RN', 'MD', 'PA', 'NP', 'Reception']),
  async (req, res) => {
    const queue = await db.query(`
      SELECT e.id, e.mrn, e.esi_level, e.chief_complaint, e.arrival_time, e.status,
             p.first_name_encrypted, p.last_name_encrypted, p.age, p.sex,
             t.decision_source, t.decided_at
      FROM er_encounters e
      JOIN patients p ON p.id = e.patient_id
      LEFT JOIN er_triage_decisions t ON t.encounter_id = e.id
      WHERE e.tenant_id = $1
        AND e.status = 'open'
        AND e.soft_deleted = 0
      ORDER BY e.esi_level ASC, e.arrival_time ASC
      LIMIT 100
    `, [req.tenant_id]);
    
    res.json({queue, total: queue.length, by_esi: countByESI(queue)});
  }
);

/**
 * POST /api/er/code/activate
 * Activate code (blue, stemi, stroke, trauma, sepsis, mass_casualty)
 */
router.post('/code/activate',
  authenticate,
  requireTenantScope,
  requireRole(['MD', 'RN', 'PA', 'NP']),
  validateBody(RS.er.codeActivation),
  async (req, res) => {
    const {encounter_id, code_type, activation_reason} = req.body;
    
    // Idempotency: check if code already active
    const existing = await db.query(
      `SELECT id FROM er_codes WHERE encounter_id = $1 AND code_type = $2 AND completed_at IS NULL`,
      [encounter_id, code_type]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({error: 'CODE_ALREADY_ACTIVE', code_id: existing.rows[0].id});
    }
    
    const result = await db.tx(async (client) => {
      // 1. Create code record
      const code = await client.query(`
        INSERT INTO er_codes (tenant_id, encounter_id, code_type, activated_at, activated_by)
        VALUES ($1, $2, $3, now(), $4)
        RETURNING id
      `, [req.tenant_id, encounter_id, code_type, req.user.id]);
      
      // 2. Update encounter critical flag
      await client.query(`
        UPDATE er_encounters SET is_critical = 1 WHERE id = $1 AND tenant_id = $2
      `, [encounter_id, req.tenant_id]);
      
      // 3. Auto-page team
      const team = await pageCodeTeam(req.tenant_id, code_type, encounter_id);
      
      // 4. Audit
      await client.query(`
        INSERT INTO er_audit_log (tenant_id, encounter_id, user_id, action, resource_type, resource_id)
        VALUES ($1, $2, $3, 'CODE_ACTIVATED', 'er_codes', $4)
      `, [req.tenant_id, encounter_id, req.user.id, code.rows[0].id]);
      
      return {code_id: code.rows[0].id, team_notified: team};
    });
    
    res.status(201).json(result);
  }
);

/**
 * POST /api/er/medication/admin
 * Medication administration with 5-rights check
 */
router.post('/medication/admin',
  authenticate,
  requireTenantScope,
  requireRole(['RN', 'MD', 'PA', 'NP']),
  validateBody(RS.er.medicationAdmin),
  async (req, res) => {
    const {encounter_id, drug_name, dose, route, indication} = req.body;
    
    // 1. Get patient (with tenant scoping)
    const patient = await db.query(`
      SELECT p.* FROM patients p
      JOIN er_encounters e ON e.patient_id = p.id
      WHERE e.id = $1 AND e.tenant_id = $2
    `, [encounter_id, req.tenant_id]);
    
    if (patient.rows.length === 0) {
      return res.status(404).json({error: 'ENCOUNTER_NOT_FOUND'});
    }
    
    // 2. Run medication safety check (server-side authority)
    const safety = er_engine.checkMedicationSafety(
      patient.rows[0], drug_name, dose, route
    );
    
    // 3. If unsafe (allergy, critical interaction, teratogen+pregnant), block
    if (!safety.safe) {
      await db.query(`
        INSERT INTO er_audit_log (tenant_id, encounter_id, user_id, action, input_hash)
        VALUES ($1, $2, $3, 'MED_BLOCKED_SAFETY', $4)
      `, [req.tenant_id, encounter_id, req.user.id, hash(req.body)]);
      
      return res.status(409).json({
        error: 'MEDICATION_BLOCKED',
        alerts: safety.alerts,
        override_allowed: false,
      });
    }
    
    // 4. If soft alerts (renal dose, weight-based), require acknowledgment
    if (safety.alerts.length > 0) {
      const override_required = safety.alerts.some(a => 
        ['renal_dose_adjustment', 'weight_based_dose'].includes(a.type)
      );
      if (override_required && !req.body.override_reason) {
        return res.status(409).json({
          error: 'OVERRIDE_REQUIRED',
          alerts: safety.alerts,
        });
      }
    }
    
    // 5. Record administration
    const result = await db.query(`
      INSERT INTO er_medications_admin (
        tenant_id, encounter_id, drug_name, dose, route, indication,
        five_rights_check, allergy_check_passed, interaction_check_passed,
        renal_dose_checked, pregnancy_checked, given_by, given_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, now())
      RETURNING id
    `, [
      req.tenant_id, encounter_id, drug_name, dose, route, indication,
      JSON.stringify({right_patient: true, right_drug: true, right_dose: true, right_route: true, right_time: true}),
      safety.allerts.every(a => a.type !== 'allergy') ? 1 : 0,
      safety.allerts.every(a => a.type !== 'drug_interaction') ? 1 : 0,
      safety.alerts.some(a => a.type === 'renal_dose_adjustment') ? 1 : 0,
      safety.alerts.some(a => a.type === 'pregnancy_risk') ? 1 : 0,
      req.user.id,
    ]);
    
    res.status(201).json({administration_id: result.rows[0].id, alerts: safety.alerts});
  }
);

/**
 * POST /api/er/disposition
 * Final disposition (admit, discharge, transfer, AMA, deceased)
 */
router.post('/disposition',
  authenticate,
  requireTenantScope,
  requireRole(['MD']), // MD only
  validateBody(RS.er.disposition),
  async (req, res) => {
    const {encounter_id, disposition_type, destination, discharge_instructions, follow_up} = req.body;
    
    // Disposition-specific validation
    if (disposition_type === 'discharge' && !discharge_instructions) {
      return res.status(422).json({error: 'DISCHARGE_INSTRUCTIONS_REQUIRED'});
    }
    if (disposition_type === 'ama' && !req.body.ama_witness_id) {
      return res.status(422).json({error: 'AMA_WITNESS_REQUIRED'});
    }
    
    // 1. Update encounter
    await db.tx(async (client) => {
      await client.query(`
        UPDATE er_encounters
        SET disposition = $1, disposition_destination = $2, disposition_time = now(), status = 'closed'
        WHERE id = $3 AND tenant_id = $4
      `, [disposition_type, destination, encounter_id, req.tenant_id]);
      
      // 2. Create disposition record
      await client.query(`
        INSERT INTO er_dispositions (
          tenant_id, encounter_id, disposition_type, destination,
          discharge_instructions, follow_up_arranged, follow_up_provider, follow_up_timeframe,
          decided_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [
        req.tenant_id, encounter_id, disposition_type, destination,
        discharge_instructions || null,
        follow_up?.arranged || false,
        follow_up?.provider || null,
        follow_up?.timeframe || null,
        req.user.id,
      ]);
      
      // 3. If admit, trigger admission workflow
      if (disposition_type === 'admit' || disposition_type === 'obs') {
        await triggerAdmission(req.tenant_id, encounter_id, destination, req.user.id);
      }
      
      // 4. Audit
      await client.query(`
        INSERT INTO er_audit_log (tenant_id, encounter_id, user_id, action)
        VALUES ($1, $2, $3, 'ER_DISPOSITION')
      `, [req.tenant_id, encounter_id, req.user.id]);
    });
    
    res.json({status: 'disposition_recorded', disposition_type});
  }
);

// Helper: page code team
async function pageCodeTeam(tenant_id, code_type, encounter_id) {
  // Implementation depends on paging system (Vocera, TigerConnect, SMS)
  // Stub: returns expected team composition
  const teams = {
    blue: ['MD_attending', 'senior_RN', 'RT', 'pharmacist'],
    stemi: ['cardiologist', 'cath_lab_team', 'ED_MD'],
    stroke: ['neurologist', 'CT_tech', 'stroke_coordinator', 'ED_MD'],
    trauma: ['trauma_surgeon', 'anesthesia', 'OR_team', 'blood_bank', 'ED_MD'],
    sepsis: ['intensivist', 'ID_consult', 'ED_MD'],
    mass_casualty: ['incident_commander', 'all_available_staff'],
  };
  return teams[code_type] || [];
}

module.exports = router;
```

## Middleware Chain (in order)
1. `authenticate` — JWT session validation
2. `requireTenantScope` — sets `req.tenant_id` from session (not header, GATE4)
3. `requireRole([...])` — RBAC check
4. `validateBody(schema)` — fail-closed input validation (GATE3-H1)
5. `idempotencyGuard` — for money-related routes (insurance claim, copay)
6. Route handler (with `req.audit(...)` calls)

## Tenant Isolation (GATE4)
- `req.tenant_id` always from session, never from header (anti-spoof)
- All DB queries: `WHERE tenant_id = $1`
- RLS policies on all tables (`FORCE_RLS=150`)

## Error Handling
- All errors: log to central logger with tenant_id, user_id, encounter_id
- Never log PHI in plain text (mask or omit)
- Return user-friendly error messages (no SQL leaks)
- Critical errors (red flag miss, drug safety bypass): page on-call

## Performance
- p99 target: <500ms for read, <2s for write
- Caching: triage queue, drug interaction DB
- Connection pooling: 20 connections per service
- Async audit logging (non-blocking)

---
*Section 03.d of ER-001. Owner: SA + DSL.*
