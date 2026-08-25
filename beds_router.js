// filepath: namaweb/beds_router.js
// Hospital bed management. Adapts to existing `beds` table (ward_id, current_patient_id, current_admission_id, isolation_type, branch_id).
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const VALID_BED_TYPES = ['standard', 'icu', 'isolation', 'pediatric', 'maternity', 'psychiatric', 'emergency'];
const VALID_STATUS = ['available', 'occupied', 'cleaning', 'maintenance', 'reserved', 'offline'];

// GET /api/beds?status=available
router.get('/', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const { status, bed_type } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (status) { params.push(status); conditions.push(`status = $${params.length}`); }
        if (bed_type) { params.push(bed_type); conditions.push(`bed_type = $${params.length}`); }
        params.push(Math.min(+req.query.limit || 200, 1000));
        const r = await db.query(`
            SELECT b.id, b.bed_number, b.bed_type, b.room_number, b.status, b.ward_id,
                   b.current_patient_id, p.name_en, p.name_ar, b.notes, b.isolation_type
            FROM beds b
            LEFT JOIN patients p ON p.id = b.current_patient_id
            WHERE ${conditions.join(' AND ')}
            ORDER BY b.ward_id, b.bed_number
            LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, beds: r.rows });
    } catch (err) {
        console.error('GET /api/beds', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// POST /api/beds/:id/admit  Body: { patient_id, admission_id? }
router.post('/:id/admit', requireAuth, requireTenantScope, requireRole('doctor', 'nurse'), async (req, res) => {
    try {
        const { patient_id, admission_id } = req.body;
        if (!patient_id) return res.status(400).json({ error: 'missing_patient_id' });
        const r = await db.query(`
            UPDATE beds SET status = 'occupied', current_patient_id = $3, current_admission_id = $4, updated_at = NOW()
            WHERE id = $1 AND tenant_id = $2 AND status = 'available'
            RETURNING id, status, current_patient_id
        `, [req.params.id, req.tenantId, patient_id, admission_id || null]);
        if (r.rows.length === 0) return res.status(409).json({ error: 'bed_not_available' });
        res.json({ ok: true, ...r.rows[0] });
    } catch (err) {
        console.error('POST /api/beds/admit', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// POST /api/beds/:id/discharge
router.post('/:id/discharge', requireAuth, requireTenantScope, requireRole('doctor', 'nurse'), async (req, res) => {
    try {
        const r = await db.query(`
            UPDATE beds SET status = 'cleaning', current_patient_id = NULL, current_admission_id = NULL, updated_at = NOW()
            WHERE id = $1 AND tenant_id = $2 AND status = 'occupied'
            RETURNING id, status
        `, [req.params.id, req.tenantId]);
        if (r.rows.length === 0) return res.status(409).json({ error: 'bed_not_occupied' });
        res.json({ ok: true, ...r.rows[0], message: 'Patient discharged. Bed marked for cleaning.' });
    } catch (err) {
        console.error('POST /api/beds/discharge', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// POST /api/beds/:id/status  Body: { status }
router.post('/:id/status', requireAuth, requireTenantScope, requireRole('admin', 'nurse'), async (req, res) => {
    try {
        const { status } = req.body;
        if (!VALID_STATUS.includes(status)) return res.status(400).json({ error: 'invalid_status', valid: VALID_STATUS });
        const r = await db.query(`
            UPDATE beds SET status = $3, updated_at = NOW()
            WHERE id = $1 AND tenant_id = $2 RETURNING id, status
        `, [req.params.id, req.tenantId, status]);
        if (r.rows.length === 0) return res.status(404).json({ error: 'not_found' });
        res.json({ ok: true, ...r.rows[0] });
    } catch (err) {
        console.error('POST /api/beds/status', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// GET /api/beds/stats
router.get('/stats', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT status, bed_type, COUNT(*) as cnt FROM beds
            WHERE tenant_id = $1 GROUP BY status, bed_type ORDER BY status, bed_type
        `, [req.tenantId]);
        const tot = await db.query(`
            SELECT COUNT(*) as total,
                   COUNT(*) FILTER (WHERE status = 'occupied') as occupied,
                   COUNT(*) FILTER (WHERE status = 'available') as available,
                   COUNT(*) FILTER (WHERE status = 'cleaning') as cleaning,
                   COUNT(*) FILTER (WHERE status = 'maintenance') as maintenance,
                   COUNT(*) FILTER (WHERE status = 'reserved') as reserved
            FROM beds WHERE tenant_id = $1
        `, [req.tenantId]);
        const total = +tot.rows[0].total;
        const occ = +tot.rows[0].occupied;
        res.json({
            ok: true,
            summary: { ...tot.rows[0], total, occupancy_rate_pct: total > 0 ? +((occ / total) * 100).toFixed(1) : 0 },
            breakdown: r.rows
        });
    } catch (err) {
        console.error('GET /api/beds/stats', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', valid_bed_types: VALID_BED_TYPES, valid_status: VALID_STATUS, timestamp: new Date().toISOString() });
});

module.exports = router;