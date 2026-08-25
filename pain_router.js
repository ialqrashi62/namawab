'use strict';
// Wave 81 — Pain Management: VAS scoring + PCA pump tracking + trends
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

function vasCategory(score) {
    if (score === null || score === undefined) return null;
    if (score === 0) return 'none';
    if (score <= 3) return 'mild';
    if (score <= 6) return 'moderate';
    if (score <= 8) return 'severe';
    return 'worst';
}

function pcaEfficiency(deliveries, demands) {
    if (!demands || demands === 0) return null;
    const ratio = deliveries / demands;
    if (ratio >= 0.85) return 'good';
    if (ratio >= 0.5) return 'adequate';
    return 'suboptimal';
}

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true,
        version: '1.0.0',
        module: 'pain-management',
        endpoints: [
            'GET /assessments',
            'GET /assessments/:id',
            'POST /assessments',
            'GET /assessments/patient/:patientId',
            'GET /trends/:patientId',
            'GET /pca-monitor',
            'GET /high-pain-alerts',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

router.get('/assessments', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, doctor_id, from_date, to_date, min_vas, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT a.*, p.full_name AS patient_name, p.mrn, u.full_name AS doctor_name FROM pain_assessments a
                   LEFT JOIN patients p ON p.id = a.patient_id LEFT JOIN users u ON u.id = a.doctor_id WHERE a.tenant_id = $1`;
        if (patient_id) { sql += ` AND a.patient_id = $${params.length + 1}`; params.push(patient_id); }
        if (doctor_id) { sql += ` AND a.doctor_id = $${params.length + 1}`; params.push(doctor_id); }
        if (from_date) { sql += ` AND a.assessment_time >= $${params.length + 1}`; params.push(from_date); }
        if (to_date) { sql += ` AND a.assessment_time <= $${params.length + 1}`; params.push(to_date); }
        if (min_vas !== undefined) { sql += ` AND a.pain_score_vas >= $${params.length + 1}`; params.push(parseFloat(min_vas)); }
        sql += ` ORDER BY a.assessment_time DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/assessments/:id', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT a.*, p.full_name AS patient_name, p.mrn, u.full_name AS doctor_name FROM pain_assessments a
             LEFT JOIN patients p ON p.id = a.patient_id LEFT JOIN users u ON u.id = a.doctor_id
             WHERE a.tenant_id = $1 AND a.id = $2`,
            [req.tenantId, req.params.id]
        );
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'assessment_not_found' });
        res.json({ ok: true, assessment: r.rows[0], vas_category: vasCategory(r.rows[0].pain_score_vas) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/assessments', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const {
            patient_id, assessment_time = new Date(), pain_score_vas,
            pca_pump_used = false, pca_demands, pca_deliveries, notes, doctor_id
        } = req.body;

        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (pain_score_vas === undefined || pain_score_vas === null) return res.status(400).json({ ok: false, error: 'pain_score_vas_required' });
        const vas = parseFloat(pain_score_vas);
        if (!Number.isFinite(vas) || vas < 0 || vas > 10) return res.status(400).json({ ok: false, error: 'pain_score_vas_out_of_range_0_10' });

        if (pca_pump_used) {
            if (pca_deliveries !== undefined && pca_deliveries !== null && pca_deliveries > pca_demands) {
                return res.status(400).json({ ok: false, error: 'deliveries_cannot_exceed_demands' });
            }
        }

        const r = await db.query(
            `INSERT INTO pain_assessments (patient_id, doctor_id, assessment_time, pain_score_vas, pca_pump_used, pca_demands, pca_deliveries, notes, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [patient_id, doctor_id || req.user?.id || null, assessment_time, vas, pca_pump_used,
             pca_demands || null, pca_deliveries || null, notes || null, req.tenantId]
        );
        const row = r.rows[0];
        res.status(201).json({
            ok: true,
            assessment: row,
            vas_category: vasCategory(row.pain_score_vas),
            pca_efficiency: row.pca_pump_used ? pcaEfficiency(row.pca_deliveries, row.pca_demands) : null
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/assessments/patient/:patientId', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT a.*, u.full_name AS doctor_name FROM pain_assessments a LEFT JOIN users u ON u.id = a.doctor_id
             WHERE a.tenant_id = $1 AND a.patient_id = $2 ORDER BY a.assessment_time DESC LIMIT 50`,
            [req.tenantId, req.params.patientId]
        );
        const withCategory = r.rows.map(x => ({ ...x, vas_category: vasCategory(x.pain_score_vas) }));
        const avg = r.rows.length ? (r.rows.reduce((s, x) => s + (parseFloat(x.pain_score_vas) || 0), 0) / r.rows.length).toFixed(2) : null;
        const worst = r.rows.length ? Math.max(...r.rows.map(x => parseFloat(x.pain_score_vas) || 0)) : null;
        res.json({ ok: true, count: r.rows.length, latest: withCategory[0] || null, avg_vas: avg, worst_vas: worst, history: withCategory });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/trends/:patientId', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { days = 7 } = req.query;
        const r = await db.query(
            `SELECT date_trunc('hour', assessment_time) AS hour_bucket,
                    AVG(pain_score_vas)::NUMERIC(10,2) AS avg_vas,
                    MAX(pain_score_vas) AS max_vas, MIN(pain_score_vas) AS min_vas,
                    COUNT(*) AS measurements
             FROM pain_assessments WHERE tenant_id = $1 AND patient_id = $2
               AND assessment_time >= NOW() - ($3 || ' days')::INTERVAL
             GROUP BY hour_bucket ORDER BY hour_bucket`,
            [req.tenantId, req.params.patientId, days]
        );
        res.json({ ok: true, days: parseInt(days), buckets: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/pca-monitor', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT a.*, p.full_name AS patient_name, u.full_name AS doctor_name FROM pain_assessments a
             LEFT JOIN patients p ON p.id = a.patient_id LEFT JOIN users u ON u.id = a.doctor_id
             WHERE a.tenant_id = $1 AND a.pca_pump_used = true ORDER BY a.assessment_time DESC LIMIT 50`,
            [req.tenantId]
        );
        const enriched = r.rows.map(x => ({ ...x, pca_efficiency: pcaEfficiency(x.pca_deliveries, x.pca_demands), vas_category: vasCategory(x.pain_score_vas) }));
        const suboptimal = enriched.filter(x => x.pca_efficiency === 'suboptimal');
        res.json({ ok: true, count: enriched.length, suboptimal_count: suboptimal.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/high-pain-alerts', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT a.*, p.full_name AS patient_name FROM pain_assessments a LEFT JOIN patients p ON p.id = a.patient_id
             WHERE a.tenant_id = $1 AND a.pain_score_vas >= 7 AND a.assessment_time >= NOW() - INTERVAL '24 hours'
             ORDER BY a.assessment_time DESC LIMIT 100`,
            [req.tenantId]
        );
        const enriched = r.rows.map(x => ({ ...x, vas_category: vasCategory(x.pain_score_vas) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const totals = await db.query(
            `SELECT COUNT(*) AS total_assessments, AVG(pain_score_vas)::NUMERIC(10,2) AS avg_vas,
                    MAX(pain_score_vas) AS max_vas, COUNT(DISTINCT patient_id) AS unique_patients,
                    COUNT(*) FILTER (WHERE pca_pump_used = true) AS pca_used
             FROM pain_assessments WHERE tenant_id = $1 AND assessment_time >= NOW() - INTERVAL '90 days'`,
            [req.tenantId]
        );
        const dist = await db.query(
            `SELECT CASE
                WHEN pain_score_vas = 0 THEN 'none'
                WHEN pain_score_vas <= 3 THEN 'mild'
                WHEN pain_score_vas <= 6 THEN 'moderate'
                WHEN pain_score_vas <= 8 THEN 'severe'
                ELSE 'worst'
             END AS category, COUNT(*) AS count FROM pain_assessments
             WHERE tenant_id = $1 AND assessment_time >= NOW() - INTERVAL '90 days'
             GROUP BY category ORDER BY category`,
            [req.tenantId]
        );
        res.json({ ok: true, summary_90d: totals.rows[0], vas_distribution: dist.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
