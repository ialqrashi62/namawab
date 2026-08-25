'use strict';
// Wave 77 — Social Work: psychosocial assessments + case-management
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const VALID_RISK = ['low','moderate','high','critical'];

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true,
        version: '1.0.0',
        module: 'social-work',
        endpoints: [
            'GET /assessments',
            'GET /assessments/:id',
            'POST /assessments',
            'PUT /assessments/:id',
            'GET /assessments/patient/:patientId',
            'POST /assessments/:id/recommend',
            'GET /high-risk',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

function deriveRisk(score, hasFinancial, hasSupport) {
    if (score !== null && score !== undefined) {
        if (score >= 75) return 'critical';
        if (score >= 50) return 'high';
        if (score >= 25) return 'moderate';
        return 'low';
    }
    if (hasFinancial && !hasSupport) return 'high';
    if (hasFinancial || !hasSupport) return 'moderate';
    return 'low';
}

// ===== ASSESSMENTS =====
router.get('/assessments', requireAuth, requireTenantScope, requireRole('social_worker'), async (req, res) => {
    try {
        const { patient_id, risk_level, limit = 50, offset = 0 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT s.*, p.full_name AS patient_name, p.mrn, u.full_name AS performed_by_name FROM social_work_assessments s
                   LEFT JOIN patients p ON p.id = s.patient_id LEFT JOIN users u ON u.id = s.performed_by WHERE s.tenant_id = $1`;
        if (patient_id) { sql += ` AND s.patient_id = $${params.length + 1}`; params.push(patient_id); }
        if (risk_level) { sql += ` AND s.risk_level = $${params.length + 1}`; params.push(risk_level); }
        sql += ` ORDER BY s.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(parseInt(limit), parseInt(offset));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/assessments/:id', requireAuth, requireTenantScope, requireRole('social_worker'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT s.*, p.full_name AS patient_name, p.mrn, u.full_name AS performed_by_name FROM social_work_assessments s
             LEFT JOIN patients p ON p.id = s.patient_id LEFT JOIN users u ON u.id = s.performed_by WHERE s.tenant_id = $1 AND s.id = $2`,
            [req.tenantId, req.params.id]
        );
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'assessment_not_found' });
        res.json({ ok: true, assessment: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/assessments', requireAuth, requireTenantScope, requireRole('social_worker'), async (req, res) => {
    try {
        const {
            patient_id, encounter_id, psychosocial_issues, support_system, financial_concerns,
            referrals, follow_up, score, recommendation, performed_by, engine_name,
            input_payload, output_payload
        } = req.body;

        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });

        const hasFinancial = Boolean(financial_concerns && (typeof financial_concerns === 'string' ? financial_concerns.trim() : financial_concerns.length));
        const hasSupport = Boolean(support_system && (typeof support_system === 'string' ? support_system.trim() : support_system.length));
        const risk_level = req.body.risk_level || deriveRisk(score, hasFinancial, hasSupport);
        if (!VALID_RISK.includes(risk_level)) return res.status(400).json({ ok: false, error: 'invalid_risk_level' });

        const r = await db.query(
            `INSERT INTO social_work_assessments (tenant_id, patient_id, encounter_id, psychosocial_issues, support_system, financial_concerns, referrals, follow_up,
                                                  created_by, updated_by, engine_name, input_payload, output_payload, score, risk_level, recommendation, performed_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) RETURNING *`,
            [req.tenantId, patient_id, encounter_id || null,
             psychosocial_issues ? JSON.stringify(psychosocial_issues) : null,
             support_system ? JSON.stringify(support_system) : null,
             financial_concerns ? JSON.stringify(financial_concerns) : null,
             referrals ? JSON.stringify(referrals) : null,
             follow_up || null,
             req.user?.id || null, req.user?.id || null,
             engine_name || null,
             input_payload ? JSON.stringify(input_payload) : null,
             output_payload ? JSON.stringify(output_payload) : null,
             score !== undefined ? score : null,
             risk_level,
             recommendation || null,
             performed_by || req.user?.id || null]
        );
        res.status(201).json({ ok: true, assessment: r.rows[0], derived_risk: risk_level });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.put('/assessments/:id', requireAuth, requireTenantScope, requireRole('social_worker'), async (req, res) => {
    try {
        const allowed = ['psychosocial_issues','support_system','financial_concerns','referrals','follow_up','score','risk_level','recommendation'];
        const sets = [];
        const params = [req.tenantId, req.params.id];
        let i = 3;
        for (const k of allowed) {
            if (k in req.body) {
                let v = req.body[k];
                if (['psychosocial_issues','support_system','financial_concerns','referrals'].includes(k) && v && typeof v === 'object') v = JSON.stringify(v);
                sets.push(`${k} = $${i++}`); params.push(v);
            }
        }
        if (!sets.length) return res.status(400).json({ ok: false, error: 'no_fields' });
        sets.push(`updated_at = NOW()`, `updated_by = $${i++}`); params.push(req.user?.id || null);
        const r = await db.query(
            `UPDATE social_work_assessments SET ${sets.join(', ')} WHERE tenant_id = $1 AND id = $2 RETURNING *`,
            params
        );
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'assessment_not_found' });
        res.json({ ok: true, assessment: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/assessments/patient/:patientId', requireAuth, requireTenantScope, requireRole('social_worker'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT s.*, u.full_name AS performed_by_name FROM social_work_assessments s LEFT JOIN users u ON u.id = s.performed_by
             WHERE s.tenant_id = $1 AND s.patient_id = $2 ORDER BY s.created_at DESC LIMIT 20`,
            [req.tenantId, req.params.patientId]
        );
        res.json({ ok: true, count: r.rows.length, latest: r.rows[0] || null, history: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/assessments/:id/recommend', requireAuth, requireTenantScope, requireRole('social_worker'), async (req, res) => {
    try {
        const { recommendation } = req.body;
        if (!recommendation) return res.status(400).json({ ok: false, error: 'recommendation_required' });
        const r = await db.query(
            `UPDATE social_work_assessments SET recommendation = $3, updated_at = NOW(), updated_by = $4
             WHERE tenant_id = $1 AND id = $2 RETURNING *`,
            [req.tenantId, req.params.id, recommendation, req.user?.id || null]
        );
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'assessment_not_found' });
        res.json({ ok: true, assessment: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/high-risk', requireAuth, requireTenantScope, requireRole('social_worker'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT s.*, p.full_name AS patient_name, p.mrn FROM social_work_assessments s LEFT JOIN patients p ON p.id = s.patient_id
             WHERE s.tenant_id = $1 AND s.risk_level IN ('high','critical') ORDER BY s.created_at DESC LIMIT 100`,
            [req.tenantId]
        );
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT risk_level, COUNT(*) AS count, AVG(score)::NUMERIC(10,2) AS avg_score FROM social_work_assessments
             WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '90 days' GROUP BY risk_level`,
            [req.tenantId]
        );
        const trends = await db.query(
            `SELECT date_trunc('week', created_at) AS week, COUNT(*) AS count FROM social_work_assessments
             WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '90 days' GROUP BY week ORDER BY week DESC LIMIT 12`,
            [req.tenantId]
        );
        res.json({ ok: true, risk_distribution: r.rows, weekly_trends: trends.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
