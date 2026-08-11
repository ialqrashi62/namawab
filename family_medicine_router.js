// filepath: namaweb/family_medicine_router.js
// Family Medicine — Express router
// Pattern: nm-router-middleware
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole, validateBody, idempotencyGuard } = require('./mw');
const RS = require('./route_schemas');
const engine = require('./family_medicine_engine');

// GET /api/family_medicine/health
router.get('/health', (req, res) => res.json({ ok: true, dept: 'family_medicine', version: engine.VERSION }));

// GET /api/family_medicine/patients
router.get('/patients',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse', 'receptionist', 'admin', 'owner'),
    async (req, res) => {
        try {
            const limit = Math.min(+req.query.limit || 50, 200);
            const { rows } = await db.query(`
                SELECT id, mrn, name_ar, name_en, age, sex, chief_complaint, status
                FROM family_medicine_patients
                WHERE tenant_id = $1
                ORDER BY updated_at DESC
                LIMIT $2
            `, [req.tenantId, limit]);
            res.json({ patients: rows, total: rows.length });
        } catch (err) {
            console.error('GET /family_medicine/patients', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// GET /api/family_medicine/patients/:id
router.get('/patients/:id',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse', 'admin', 'owner'),
    async (req, res) => {
        try {
            const { rows } = await db.query(`
                SELECT * FROM family_medicine_patients
                WHERE tenant_id = $1 AND id = $2
            `, [req.tenantId, +req.params.id]);
            if (rows.length === 0) return res.status(404).json({ error: 'not_found' });
            res.json(rows[0]);
        } catch (err) {
            console.error('GET /family_medicine/patients/:id', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/family_medicine/visits
router.post('/visits',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.familyMedicineVisitCreate),
    idempotencyGuard,
    async (req, res) => {
        try {
            const v = req.validated;
            const { rows } = await db.query(`
                INSERT INTO family_medicine_visits
                  (tenant_id, patient_id, visit_date, chief_complaint, sbp, hr, weight, height,
                   diagnosis, notes, attending_user_id)
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
                RETURNING id, visit_date, diagnosis
            `, [
                req.tenantId, v.patient_id, v.visit_date, v.chief_complaint,
                v.sbp || null, v.hr || null, v.weight || null, v.height || null,
                v.diagnosis || null, v.notes || null, req.userId
            ]);
            res.status(201).json({ id: rows[0].id, ...rows[0] });
        } catch (err) {
            console.error('POST /family_medicine/visits', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/family_medicine/assessments/wellness
router.post('/assessments/wellness',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.familyMedicineWellness),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.wellnessScore(req.validated);
            const { rows } = await db.query(`
                INSERT INTO family_medicine_wellness
                  (tenant_id, patient_id, assessed_by, payload, score, risk, result)
                VALUES ($1,$2,$3,$4,$5,$6,$7)
                RETURNING id
            `, [req.tenantId, req.validated.patient_id, req.userId,
                req.validated, result.score, result.risk, result]);
            res.status(201).json({ id: rows[0].id, ...result });
        } catch (err) {
            console.error('POST /wellness', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/family_medicine/assessments/chronic-count
router.post('/assessments/chronic-count',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.familyMedicineChronic),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.chronicDiseaseCount(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /chronic-count', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/family_medicine/assessments/vaccinations
router.post('/assessments/vaccinations',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.familyMedicineVaccinations),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.vaccinationSchedule(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /vaccinations', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/family_medicine/assessments/family-history
router.post('/assessments/family-history',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.familyMedicineFamilyHistory),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.familyHistoryRisk(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /family-history', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/family_medicine/assessments/preventive
router.post('/assessments/preventive',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.familyMedicinePreventive),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.preventiveScreening(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /preventive', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

module.exports = router;