'use strict';
// Wave 85 — Discharge Summaries: structured discharge documentation
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true,
        version: '1.0.0',
        module: 'discharge-summaries',
        endpoints: [
            'GET /summaries',
            'GET /summaries/:id',
            'POST /summaries',
            'PUT /summaries/:id',
            'POST /summaries/:id/sign',
            'POST /summaries/:id/lock',
            'GET /summaries/patient/:patientId',
            'GET /unsigned',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

router.get('/summaries', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, authored_by, from_date, to_date, limit = 50 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT s.*, p.full_name AS patient_name, p.mrn, u.full_name AS author_name FROM discharge_summaries s
                   LEFT JOIN patients p ON p.id = s.patient_id LEFT JOIN users u ON u.id = s.authored_by WHERE s.tenant_id = $1`;
        if (patient_id) { sql += ` AND s.patient_id = $${params.length + 1}`; params.push(patient_id); }
        if (authored_by) { sql += ` AND s.authored_by = $${params.length + 1}`; params.push(authored_by); }
        if (from_date) { sql += ` AND s.discharge_date >= $${params.length + 1}`; params.push(from_date); }
        if (to_date) { sql += ` AND s.discharge_date <= $${params.length + 1}`; params.push(to_date); }
        sql += ` ORDER BY s.discharge_date DESC NULLS LAST, s.created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(x => ({
            ...x,
            los_days: x.admission_date && x.discharge_date ? Math.round((new Date(x.discharge_date) - new Date(x.admission_date)) / 86400000) : null
        }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/summaries/:id', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT s.*, p.full_name AS patient_name, p.mrn, u.full_name AS author_name FROM discharge_summaries s
             LEFT JOIN patients p ON p.id = s.patient_id LEFT JOIN users u ON u.id = s.authored_by
             WHERE s.tenant_id = $1 AND s.id = $2`,
            [req.tenantId, req.params.id]
        );
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'summary_not_found' });
        const row = r.rows[0];
        const los_days = row.admission_date && row.discharge_date ? Math.round((new Date(row.discharge_date) - new Date(row.admission_date)) / 86400000) : null;
        res.json({ ok: true, summary: row, los_days });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/summaries', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const {
            patient_id, admission_date, discharge_date = new Date(),
            diagnosis_primary, diagnosis_secondary, procedures, hospital_course,
            discharge_medications, follow_up, patient_instructions,
            diet_activity_restrictions, pending_results, authored_by
        } = req.body;

        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!diagnosis_primary) return res.status(400).json({ ok: false, error: 'diagnosis_primary_required' });
        if (!hospital_course) return res.status(400).json({ ok: false, error: 'hospital_course_required' });
        if (admission_date && discharge_date && new Date(discharge_date) < new Date(admission_date)) {
            return res.status(400).json({ ok: false, error: 'discharge_date_before_admission' });
        }

        const r = await db.query(
            `INSERT INTO discharge_summaries (tenant_id, patient_id, authored_by, admission_date, discharge_date,
                                              diagnosis_primary, diagnosis_secondary, procedures, hospital_course,
                                              discharge_medications, follow_up, patient_instructions,
                                              diet_activity_restrictions, pending_results)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,
            [req.tenantId, patient_id, authored_by || req.user?.id || null, admission_date || null, discharge_date,
             diagnosis_primary, diagnosis_secondary || null,
             procedures ? JSON.stringify(procedures) : null,
             hospital_course,
             discharge_medications ? JSON.stringify(discharge_medications) : null,
             follow_up || null, patient_instructions || null,
             diet_activity_restrictions || null, pending_results || null]
        );
        res.status(201).json({ ok: true, summary: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.put('/summaries/:id', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const allowed = ['admission_date','discharge_date','diagnosis_primary','diagnosis_secondary','hospital_course','follow_up','patient_instructions','diet_activity_restrictions','pending_results'];
        const sets = [];
        const params = [req.tenantId, req.params.id];
        let i = 3;
        for (const k of allowed) {
            if (k in req.body) { sets.push(`${k} = $${i++}`); params.push(req.body[k]); }
        }
        for (const k of ['procedures','discharge_medications']) {
            if (k in req.body) { sets.push(`${k} = $${i++}`); params.push(req.body[k] ? JSON.stringify(req.body[k]) : null); }
        }
        if (!sets.length) return res.status(400).json({ ok: false, error: 'no_fields' });
        sets.push(`updated_at = NOW()`);
        const r = await db.query(
            `UPDATE discharge_summaries SET ${sets.join(', ')} WHERE tenant_id = $1 AND id = $2 AND signed_at IS NULL AND locked_at IS NULL RETURNING *`,
            params
        );
        if (!r.rows.length) return res.status(409).json({ ok: false, error: 'cannot_update_signed_or_locked' });
        res.json({ ok: true, summary: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/summaries/:id/sign', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const r = await db.query(
            `UPDATE discharge_summaries SET signed_at = NOW(), updated_at = NOW()
             WHERE tenant_id = $1 AND id = $2 AND signed_at IS NULL RETURNING *`,
            [req.tenantId, req.params.id]
        );
        if (!r.rows.length) return res.status(409).json({ ok: false, error: 'already_signed_or_not_found' });
        res.json({ ok: true, summary: r.rows[0], signed_at: r.rows[0].signed_at });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/summaries/:id/lock', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const r = await db.query(
            `UPDATE discharge_summaries SET locked_at = NOW(), updated_at = NOW()
             WHERE tenant_id = $1 AND id = $2 AND signed_at IS NOT NULL AND locked_at IS NULL RETURNING *`,
            [req.tenantId, req.params.id]
        );
        if (!r.rows.length) return res.status(409).json({ ok: false, error: 'cannot_lock_unsigned_or_already_locked' });
        res.json({ ok: true, summary: r.rows[0], locked_at: r.rows[0].locked_at });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/summaries/patient/:patientId', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT s.*, u.full_name AS author_name FROM discharge_summaries s LEFT JOIN users u ON u.id = s.authored_by
             WHERE s.tenant_id = $1 AND s.patient_id = $2 ORDER BY s.discharge_date DESC NULLS LAST`,
            [req.tenantId, req.params.patientId]
        );
        res.json({ ok: true, count: r.rows.length, latest: r.rows[0] || null, history: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/unsigned', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT s.*, p.full_name AS patient_name, p.mrn, u.full_name AS author_name FROM discharge_summaries s
             LEFT JOIN patients p ON p.id = s.patient_id LEFT JOIN users u ON u.id = s.authored_by
             WHERE s.tenant_id = $1 AND s.signed_at IS NULL ORDER BY s.discharge_date DESC NULLS LAST LIMIT 100`,
            [req.tenantId]
        );
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE signed_at IS NOT NULL) AS signed,
                    COUNT(*) FILTER (WHERE locked_at IS NOT NULL) AS locked,
                    AVG(EXTRACT(DAY FROM (discharge_date - admission_date)))::NUMERIC(10,2) AS avg_los_days
             FROM discharge_summaries WHERE tenant_id = $1 AND discharge_date >= NOW() - INTERVAL '90 days'`,
            [req.tenantId]
        );
        res.json({ ok: true, summary_90d: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
