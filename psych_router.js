'use strict';
// Wave 80 — Psychiatry: full Mental Status Examination (MSE) + structured eval
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const MSE_FIELDS = [
    'mse_appearance','mse_behavior','mse_speech','mse_mood','mse_affect',
    'mse_thought_process','mse_thought_content','mse_perception',
    'mse_cognition','mse_insight','mse_judgment'
];

const VALID_AFFECT = ['euthymic','depressed','anxious','irritable','elevated','labile','blunted','flat','congruent','incongruent','restricted','tearful'];
const VALID_INSIGHT = ['good','fair','limited','poor','absent'];
const VALID_JUDGMENT = ['intact','impaired','severely_impaired'];

function detectSuicideRisk({ thought_content, mood }) {
    const lc = (thought_content || '').toLowerCase();
    const md = (mood || '').toLowerCase();
    if (/(suicid|kill myself|end my life|hurt myself|self.?harm|hopeless|worthless)/.test(lc)) return 'high';
    if (md.includes('depressed') || md.includes('hopeless')) return 'moderate';
    return 'low';
}

function detectCognitiveImpairment({ cognition }) {
    const lc = (cognition || '').toLowerCase();
    if (/(oriented x?0|disoriented|confused|unable to|severe)/.test(lc)) return 'severe';
    if (/(oriented x?1|oriented x?2|partial|impaired|mild)/.test(lc)) return 'mild';
    if (/(oriented x?3|a&o x3|alert)/.test(lc)) return 'none';
    return 'unknown';
}

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true,
        version: '1.0.0',
        module: 'psychiatry',
        endpoints: [
            'GET /evaluations',
            'GET /evaluations/:id',
            'POST /evaluations',
            'PUT /evaluations/:id',
            'GET /evaluations/patient/:patientId',
            'GET /evaluations/:id/risk-flags',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

router.get('/evaluations', requireAuth, requireTenantScope, requireRole('psychiatrist'), async (req, res) => {
    try {
        const { patient_id, doctor_id, limit = 50, offset = 0 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT e.*, p.full_name AS patient_name, p.mrn, u.full_name AS doctor_name FROM psychiatric_evaluations e
                   LEFT JOIN patients p ON p.id = e.patient_id LEFT JOIN users u ON u.id = e.doctor_id WHERE e.tenant_id = $1`;
        if (patient_id) { sql += ` AND e.patient_id = $${params.length + 1}`; params.push(patient_id); }
        if (doctor_id) { sql += ` AND e.doctor_id = $${params.length + 1}`; params.push(doctor_id); }
        sql += ` ORDER BY e.evaluation_date DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(parseInt(limit), parseInt(offset));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/evaluations/:id', requireAuth, requireTenantScope, requireRole('psychiatrist'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT e.*, p.full_name AS patient_name, p.mrn, u.full_name AS doctor_name FROM psychiatric_evaluations e
             LEFT JOIN patients p ON p.id = e.patient_id LEFT JOIN users u ON u.id = e.doctor_id
             WHERE e.tenant_id = $1 AND e.id = $2`,
            [req.tenantId, req.params.id]
        );
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'evaluation_not_found' });
        res.json({ ok: true, evaluation: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/evaluations', requireAuth, requireTenantScope, requireRole('psychiatrist'), async (req, res) => {
    try {
        const body = req.body || {};
        if (!body.patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });

        const fields = ['evaluation_date = $3'];
        const params = [req.tenantId, body.patient_id, body.evaluation_date || new Date()];
        let i = 4;
        for (const k of MSE_FIELDS) {
            if (k in body) { fields.push(`${k} = $${i++}`); params.push(body[k]); }
        }
        for (const k of ['doctor_id','diagnostic_summary']) {
            if (k in body) { fields.push(`${k} = $${i++}`); params.push(body[k]); }
        }
        if (!body.doctor_id) { fields.push(`doctor_id = $${i++}`); params.push(req.user?.id || null); }

        const cols = ['tenant_id','patient_id'];
        const vals = ['$1','$2'];
        i = 3;
        for (const k of MSE_FIELDS) {
            if (k in body) { cols.push(k); vals.push(`$${i++}`); }
        }
        for (const k of ['evaluation_date','doctor_id','diagnostic_summary']) {
            if (k in body) { cols.push(k); vals.push(`$${i++}`); }
        }
        cols.push('evaluation_date'); vals.push(`$${i++}`); params.push(body.evaluation_date || new Date());
        if (!body.doctor_id) { cols.push('doctor_id'); vals.push(`$${i++}`); params.push(req.user?.id || null); }

        const sql = `INSERT INTO psychiatric_evaluations (${cols.join(', ')}) VALUES (${vals.join(', ')}) RETURNING *`;
        const r = await db.query(sql, params);
        const evalRow = r.rows[0];

        const risk = detectSuicideRisk(evalRow);
        const cognition = detectCognitiveImpairment(evalRow);

        res.status(201).json({ ok: true, evaluation: evalRow, computed: { suicide_risk: risk, cognitive_impairment: cognition } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.put('/evaluations/:id', requireAuth, requireTenantScope, requireRole('psychiatrist'), async (req, res) => {
    try {
        const sets = [];
        const params = [req.tenantId, req.params.id];
        let i = 3;
        for (const k of [...MSE_FIELDS, 'diagnostic_summary']) {
            if (k in req.body) { sets.push(`${k} = $${i++}`); params.push(req.body[k]); }
        }
        if (!sets.length) return res.status(400).json({ ok: false, error: 'no_fields' });
        const r = await db.query(
            `UPDATE psychiatric_evaluations SET ${sets.join(', ')} WHERE tenant_id = $1 AND id = $2 RETURNING *`,
            params
        );
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'evaluation_not_found' });
        res.json({ ok: true, evaluation: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/evaluations/patient/:patientId', requireAuth, requireTenantScope, requireRole('psychiatrist'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT e.*, u.full_name AS doctor_name FROM psychiatric_evaluations e LEFT JOIN users u ON u.id = e.doctor_id
             WHERE e.tenant_id = $1 AND e.patient_id = $2 ORDER BY e.evaluation_date DESC LIMIT 20`,
            [req.tenantId, req.params.patientId]
        );
        res.json({ ok: true, count: r.rows.length, latest: r.rows[0] || null, history: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/evaluations/:id/risk-flags', requireAuth, requireTenantScope, requireRole('psychiatrist'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT mse_thought_content, mse_mood, mse_cognition, mse_insight, mse_judgment FROM psychiatric_evaluations
             WHERE tenant_id = $1 AND id = $2`,
            [req.tenantId, req.params.id]
        );
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'evaluation_not_found' });
        const row = r.rows[0];
        const flags = [];
        const suicide_risk = detectSuicideRisk(row);
        if (suicide_risk !== 'low') flags.push({ type: 'suicide_risk', level: suicide_risk });
        const cog = detectCognitiveImpairment(row);
        if (cog !== 'none' && cog !== 'unknown') flags.push({ type: 'cognitive_impairment', level: cog });
        if (row.mse_insight && ['poor','absent'].includes(row.mse_insight)) flags.push({ type: 'poor_insight', level: row.mse_insight });
        if (row.mse_judgment && row.mse_judgment !== 'intact') flags.push({ type: 'impaired_judgment', level: row.mse_judgment });
        res.json({ ok: true, flags, has_critical_flags: flags.some(f => f.level === 'high' || f.level === 'severe' || f.level === 'poor' || f.level === 'absent') });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const totals = await db.query(
            `SELECT COUNT(*) AS total, COUNT(DISTINCT patient_id) AS unique_patients,
                    COUNT(DISTINCT doctor_id) AS providers
             FROM psychiatric_evaluations WHERE tenant_id = $1 AND evaluation_date >= NOW() - INTERVAL '90 days'`,
            [req.tenantId]
        );
        const affect = await db.query(
            `SELECT mse_affect, COUNT(*) AS count FROM psychiatric_evaluations WHERE tenant_id = $1 AND mse_affect IS NOT NULL
             GROUP BY mse_affect ORDER BY count DESC`,
            [req.tenantId]
        );
        res.json({ ok: true, summary_90d: totals.rows[0], affect_distribution: affect.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
