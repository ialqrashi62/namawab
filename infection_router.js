'use strict';
// Wave 78 — Infection Control: HAI surveillance + isolation + outbreak tracking
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const VALID_HAI = ['HAI-UTI','HAI-SSI','HAI-BSI','HAI-VAP','HAI-CDI','HAI-MRSA','HAI-VRE','HAI-ESBL','community','colonization'];
const VALID_ISOLATION = ['standard','contact','droplet','airborne','protective','reverse'];
const VALID_OUTCOME = ['recovered','active','deceased','transferred','unknown'];

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true,
        version: '1.0.0',
        module: 'infection-control',
        endpoints: [
            'GET /surveillance',
            'GET /surveillance/:id',
            'POST /surveillance',
            'PUT /surveillance/:id',
            'GET /surveillance/patient/:patientId',
            'GET /by-organism',
            'GET /by-ward',
            'GET /active-isolations',
            'GET /device-related',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

router.get('/surveillance', requireAuth, requireTenantScope, requireRole('infection_control'), async (req, res) => {
    try {
        const { patient_id, hai_category, ward, isolation_type, device_related, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT s.*, u.full_name AS reported_by_name FROM infection_surveillance s LEFT JOIN users u ON u.id = s.reported_by WHERE s.tenant_id = $1`;
        if (patient_id) { sql += ` AND s.patient_id = $${params.length + 1}`; params.push(patient_id); }
        if (hai_category) { sql += ` AND s.hai_category = $${params.length + 1}`; params.push(hai_category); }
        if (ward) { sql += ` AND s.ward = $${params.length + 1}`; params.push(ward); }
        if (isolation_type) { sql += ` AND s.isolation_type = $${params.length + 1}`; params.push(isolation_type); }
        if (device_related !== undefined) { sql += ` AND s.device_related = $${params.length + 1}`; params.push(device_related === 'true'); }
        sql += ` ORDER BY s.detection_date DESC NULLS LAST, s.created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/surveillance/:id', requireAuth, requireTenantScope, requireRole('infection_control'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT s.*, u.full_name AS reported_by_name FROM infection_surveillance s LEFT JOIN users u ON u.id = s.reported_by
             WHERE s.tenant_id = $1 AND s.id = $2`,
            [req.tenantId, req.params.id]
        );
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'record_not_found' });
        res.json({ ok: true, record: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/surveillance', requireAuth, requireTenantScope, requireRole('infection_control'), async (req, res) => {
    try {
        const {
            patient_id, patient_name, infection_type, infection_site, organism, sensitivity,
            detection_date = new Date(), hai_category, device_related = false, device_type,
            ward, bed, isolation_type, outcome = 'active', reported_by, notes
        } = req.body;

        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (hai_category && !VALID_HAI.includes(hai_category)) return res.status(400).json({ ok: false, error: 'invalid_hai_category', valid: VALID_HAI });
        if (isolation_type && !VALID_ISOLATION.includes(isolation_type)) return res.status(400).json({ ok: false, error: 'invalid_isolation_type', valid: VALID_ISOLATION });
        if (!VALID_OUTCOME.includes(outcome)) return res.status(400).json({ ok: false, error: 'invalid_outcome' });
        if (device_related && !device_type) return res.status(400).json({ ok: false, error: 'device_type_required_when_device_related' });

        const r = await db.query(
            `INSERT INTO infection_surveillance (patient_id, patient_name, infection_type, infection_site, organism, sensitivity, detection_date, hai_category, device_related, device_type, ward, bed, isolation_type, outcome, reported_by, notes, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) RETURNING *`,
            [patient_id, patient_name || null, infection_type || null, infection_site || null, organism || null,
             sensitivity ? JSON.stringify(sensitivity) : null,
             detection_date, hai_category || null, device_related, device_type || null,
             ward || null, bed || null, isolation_type || null, outcome,
             reported_by || req.user?.id || null, notes || null, req.tenantId]
        );
        res.status(201).json({ ok: true, record: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.put('/surveillance/:id', requireAuth, requireTenantScope, requireRole('infection_control'), async (req, res) => {
    try {
        const allowed = ['infection_type','infection_site','organism','isolation_type','ward','bed','outcome','notes','device_type'];
        const sets = [];
        const params = [req.tenantId, req.params.id];
        let i = 3;
        for (const k of allowed) {
            if (k in req.body) { sets.push(`${k} = $${i++}`); params.push(req.body[k]); }
        }
        if ('sensitivity' in req.body) { sets.push(`sensitivity = $${i++}`); params.push(req.body.sensitivity ? JSON.stringify(req.body.sensitivity) : null); }
        if (!sets.length) return res.status(400).json({ ok: false, error: 'no_fields' });
        const r = await db.query(
            `UPDATE infection_surveillance SET ${sets.join(', ')} WHERE tenant_id = $1 AND id = $2 RETURNING *`,
            params
        );
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'record_not_found' });
        res.json({ ok: true, record: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/surveillance/patient/:patientId', requireAuth, requireTenantScope, requireRole('infection_control'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT * FROM infection_surveillance WHERE tenant_id = $1 AND patient_id = $2 ORDER BY detection_date DESC NULLS LAST, created_at DESC`,
            [req.tenantId, req.params.patientId]
        );
        res.json({ ok: true, count: r.rows.length, rows: r.rows, active_isolation: r.rows.find(x => x.outcome === 'active' && x.isolation_type) || null });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/by-organism', requireAuth, requireTenantScope, requireRole('infection_control'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT organism, COUNT(*) AS count, COUNT(DISTINCT ward) AS affected_wards FROM infection_surveillance
             WHERE tenant_id = $1 AND organism IS NOT NULL AND detection_date >= NOW() - INTERVAL '90 days'
             GROUP BY organism ORDER BY count DESC LIMIT 25`,
            [req.tenantId]
        );
        res.json({ ok: true, organisms: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/by-ward', requireAuth, requireTenantScope, requireRole('infection_control'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT ward, COUNT(*) AS total, COUNT(*) FILTER (WHERE hai_category LIKE 'HAI-%') AS hai_count,
                    COUNT(*) FILTER (WHERE device_related = true) AS device_count
             FROM infection_surveillance WHERE tenant_id = $1 AND ward IS NOT NULL AND detection_date >= NOW() - INTERVAL '90 days'
             GROUP BY ward ORDER BY total DESC`,
            [req.tenantId]
        );
        res.json({ ok: true, wards: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/active-isolations', requireAuth, requireTenantScope, requireRole('infection_control'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT isolation_type, COUNT(*) AS count FROM infection_surveillance
             WHERE tenant_id = $1 AND outcome = 'active' AND isolation_type IS NOT NULL
             GROUP BY isolation_type ORDER BY count DESC`,
            [req.tenantId]
        );
        res.json({ ok: true, isolation_buckets: r.rows, total: r.rows.reduce((a, b) => a + parseInt(b.count), 0) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/device-related', requireAuth, requireTenantScope, requireRole('infection_control'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT device_type, COUNT(*) AS count, COUNT(DISTINCT patient_id) AS unique_patients FROM infection_surveillance
             WHERE tenant_id = $1 AND device_related = true AND device_type IS NOT NULL
             GROUP BY device_type ORDER BY count DESC`,
            [req.tenantId]
        );
        res.json({ ok: true, devices: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const totals = await db.query(
            `SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE hai_category LIKE 'HAI-%') AS hai_total,
                    COUNT(*) FILTER (WHERE outcome = 'active') AS active,
                    COUNT(*) FILTER (WHERE outcome = 'recovered') AS recovered,
                    COUNT(*) FILTER (WHERE outcome = 'deceased') AS deceased,
                    COUNT(*) FILTER (WHERE device_related = true) AS device_related_total
             FROM infection_surveillance WHERE tenant_id = $1 AND detection_date >= NOW() - INTERVAL '90 days'`,
            [req.tenantId]
        );
        const byCat = await db.query(
            `SELECT hai_category, COUNT(*) AS count FROM infection_surveillance WHERE tenant_id = $1 AND hai_category IS NOT NULL
             GROUP BY hai_category ORDER BY count DESC`,
            [req.tenantId]
        );
        res.json({ ok: true, summary_90d: totals.rows[0], by_category: byCat.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
