'use strict';
// Wave 114 — Bed management (transfers + status history) + Transport requests + Queue display advertisements
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const VALID_TRANSFER_REASON = ['acuity_change','isolation_required','step_down','specialty_consult','equipment_availability','patient_request','discharge_planning','overflow','renovation','other'];
const VALID_BED_STATUS = ['available','occupied','cleaning','dirty','reserved','out_of_service','maintenance','isolation_pending','housekeeping','blocked'];
const VALID_TRANSPORT_TYPE = ['wheelchair','stretcher','bed','ambulatory','porter_only','oxygen_support','iv_pole','monitored'];
const VALID_TRANSPORT_PRIORITY = ['routine','urgent','emergent','stat'];
const VALID_TRANSPORT_STATUS = ['requested','assigned','in_progress','completed','cancelled','no_show','delayed'];
const VALID_SPECIAL_NEEDS = ['none','oxygen','iv_pole','monitor','ventilator','isolation','suction','restraints','pediatric_security','security_required','language_interpreter'];
const VALID_RISK = ['low','moderate','high','critical'];

function transportDuration(pickup, dropoff) {
    if (!pickup || !dropoff) return null;
    const ms = new Date(dropoff) - new Date(pickup);
    return Math.round(ms / 60000);
}

function waitTime(requestTime, currentTime) {
    if (!requestTime) return null;
    return Math.round((new Date(currentTime || Date.now()) - new Date(requestTime)) / 60000);
}

function waitSeverity(minutes) {
    if (minutes === null) return null;
    if (minutes < 15) return 'within_target';
    if (minutes < 30) return 'acceptable';
    if (minutes < 60) return 'delayed';
    return 'critically_delayed';
}

function bedAvailabilityScore(status) {
    const map = { available: 1.0, cleaning: 0.8, dirty: 0.6, reserved: 0.4, isolation_pending: 0.3, housekeeping: 0.2, maintenance: 0.1, blocked: 0.0, out_of_service: 0.0, occupied: null };
    return map[status];
}

function transferRisk(fromWard, toWard, reason) {
    if (reason === 'acuity_change' || reason === 'emergent') return 'high';
    if (reason === 'isolation_required') return 'moderate';
    if (reason === 'patient_request' || reason === 'discharge_planning') return 'low';
    return 'standard';
}

function adEligibility(ad) {
    if (!ad.is_active) return { eligible: false, reason: 'inactive' };
    if (ad.duration_seconds < 5 || ad.duration_seconds > 60) return { eligible: false, reason: 'duration_out_of_range_5_60' };
    if (ad.display_order < 0) return { eligible: false, reason: 'invalid_display_order' };
    return { eligible: true };
}

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true,
        version: '1.0.0',
        module: 'bed-transport',
        endpoints: [
            'GET /bed-transfers',
            'POST /bed-transfers',
            'GET /bed-status-history',
            'POST /bed-status-history',
            'GET /transport-requests',
            'POST /transport-requests',
            'POST /transport-requests/:id/complete',
            'GET /queue-ads',
            'POST /queue-ads',
            'GET /bed-availability',
            'GET /transport-duration',
            'GET /wait-severity',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

// ===== BED TRANSFERS =====
router.get('/bed-transfers', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { patient_id, from_ward, to_ward, since, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT t.*, p.full_name AS patient_lookup FROM bed_transfers t LEFT JOIN patients p ON p.id = t.patient_id WHERE t.tenant_id = $1`;
        if (patient_id) { sql += ` AND t.patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (from_ward) { sql += ` AND t.from_ward = $${params.length + 1}`; params.push(parseInt(from_ward)); }
        if (to_ward) { sql += ` AND t.to_ward = $${params.length + 1}`; params.push(parseInt(to_ward)); }
        if (since) { sql += ` AND t.transfer_date >= $${params.length + 1}`; params.push(since); }
        sql += ` ORDER BY t.transfer_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/bed-transfers', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { admission_id, patient_id, from_ward, from_bed, to_ward, to_bed, transfer_reason, transferred_by } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!to_ward) return res.status(400).json({ ok: false, error: 'to_ward_required' });
        if (!to_bed) return res.status(400).json({ ok: false, error: 'to_bed_required' });
        if (transfer_reason && !VALID_TRANSFER_REASON.includes(transfer_reason)) return res.status(400).json({ ok: false, error: 'invalid_transfer_reason' });
        if (!transferred_by) return res.status(400).json({ ok: false, error: 'transferred_by_required' });

        const risk = transferRisk(from_ward, to_ward, transfer_reason);

        const r = await db.query(
            `INSERT INTO bed_transfers (tenant_id, admission_id, patient_id, from_ward, from_bed, to_ward, to_bed, transfer_reason, transferred_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [req.tenantId, admission_id || null, parseInt(patient_id), from_ward || null, from_bed || null,
             parseInt(to_ward), parseInt(to_bed), transfer_reason || null, transferred_by]
        );

        if (admission_id) {
            await db.query(
                `INSERT INTO bed_status_history (tenant_id, bed_id, admission_id, patient_id, from_status, to_status, reason, changed_by)
                 VALUES ($1,$2,$3,$4,'occupied','occupied',$5,$6)`,
                [req.tenantId, parseInt(to_bed), admission_id, parseInt(patient_id), `Transfer from bed ${from_bed || 'unknown'} to ${to_bed}`, transferred_by]
            );
        }

        res.status(201).json({ ok: true, transfer: r.rows[0], computed: { risk } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== BED STATUS HISTORY =====
router.get('/bed-status-history', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { bed_id, patient_id, since, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM bed_status_history WHERE tenant_id = $1`;
        if (bed_id) { sql += ` AND bed_id = $${params.length + 1}`; params.push(parseInt(bed_id)); }
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (since) { sql += ` AND changed_at >= $${params.length + 1}`; params.push(since); }
        sql += ` ORDER BY changed_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/bed-status-history', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { bed_id, admission_id, patient_id, from_status, to_status, reason, changed_by } = req.body;
        if (!bed_id) return res.status(400).json({ ok: false, error: 'bed_id_required' });
        if (!to_status) return res.status(400).json({ ok: false, error: 'to_status_required' });
        if (!VALID_BED_STATUS.includes(from_status || 'unknown') && from_status && !VALID_BED_STATUS.includes(from_status)) {
            return res.status(400).json({ ok: false, error: 'invalid_from_status' });
        }
        if (!VALID_BED_STATUS.includes(to_status)) return res.status(400).json({ ok: false, error: 'invalid_to_status' });
        if (!changed_by) return res.status(400).json({ ok: false, error: 'changed_by_required' });

        const r = await db.query(
            `INSERT INTO bed_status_history (tenant_id, bed_id, admission_id, patient_id, from_status, to_status, reason, changed_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
            [req.tenantId, parseInt(bed_id), admission_id || null, patient_id || null,
             from_status || null, to_status, reason || null, changed_by]
        );
        res.status(201).json({ ok: true, history: r.rows[0], computed: { availability_score: bedAvailabilityScore(to_status) } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== TRANSPORT REQUESTS =====
router.get('/transport-requests', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { patient_id, status, transport_type, priority, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT t.*, p.full_name AS patient_lookup, (CURRENT_TIMESTAMP - t.request_time) AS waiting_minutes FROM transport_requests t LEFT JOIN patients p ON p.id = t.patient_id WHERE t.tenant_id = $1`;
        if (patient_id) { sql += ` AND t.patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (status) { sql += ` AND t.status = $${params.length + 1}`; params.push(status); }
        if (transport_type) { sql += ` AND t.transport_type = $${params.length + 1}`; params.push(transport_type); }
        if (priority) { sql += ` AND t.priority = $${params.length + 1}`; params.push(priority); }
        sql += ` ORDER BY CASE WHEN t.priority = 'stat' THEN 0 WHEN t.priority = 'emergent' THEN 1 WHEN t.priority = 'urgent' THEN 2 ELSE 3 END, t.request_time ASC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/transport-requests', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { patient_id, patient_name, from_location, to_location, transport_type, priority, requested_by, assigned_porter, special_needs, status, notes } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!from_location) return res.status(400).json({ ok: false, error: 'from_location_required' });
        if (!to_location) return res.status(400).json({ ok: false, error: 'to_location_required' });
        if (!requested_by) return res.status(400).json({ ok: false, error: 'requester_required' });
        if (transport_type && !VALID_TRANSPORT_TYPE.includes(transport_type)) return res.status(400).json({ ok: false, error: 'invalid_transport_type' });
        if (priority && !VALID_TRANSPORT_PRIORITY.includes(priority)) return res.status(400).json({ ok: false, error: 'invalid_priority' });
        if (status && !VALID_TRANSPORT_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status' });

        const r = await db.query(
            `INSERT INTO transport_requests (tenant_id, patient_id, patient_name, from_location, to_location, transport_type, priority, requested_by, assigned_porter, special_needs, status, notes)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
            [req.tenantId, parseInt(patient_id), patient_name || null, from_location, to_location,
             transport_type || 'wheelchair', priority || 'routine', requested_by,
             assigned_porter || null, special_needs || null, status || 'requested', notes || null]
        );
        res.status(201).json({ ok: true, request: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/transport-requests/:id/complete', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { dropoff_time } = req.body;
        const finalDropoff = dropoff_time || new Date().toISOString();
        const r = await db.query(
            `UPDATE transport_requests SET status = 'completed', dropoff_time = $1 WHERE tenant_id = $2 AND id = $3 RETURNING *`,
            [finalDropoff, req.tenantId, req.params.id]
        );
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'request_not_found' });
        const req2 = r.rows[0];
        res.json({
            ok: true, request: req2,
            computed: { transport_duration_minutes: transportDuration(req2.pickup_time, finalDropoff) }
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== QUEUE ADVERTISEMENTS =====
router.get('/queue-ads', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { is_active, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM queue_advertisements WHERE tenant_id = $1`;
        if (is_active !== undefined) { sql += ` AND is_active = $${params.length + 1}`; params.push(parseInt(is_active)); }
        sql += ` ORDER BY display_order ASC, created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/queue-ads', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { title, image_path, display_order, duration_seconds, is_active } = req.body;
        if (!title) return res.status(400).json({ ok: false, error: 'title_required' });
        if (duration_seconds !== undefined && (duration_seconds < 5 || duration_seconds > 60)) return res.status(400).json({ ok: false, error: 'duration_out_of_range_5_60' });
        if (display_order !== undefined && display_order < 0) return res.status(400).json({ ok: false, error: 'display_order_must_be_positive' });

        const r = await db.query(
            `INSERT INTO queue_advertisements (tenant_id, title, image_path, display_order, duration_seconds, is_active)
             VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
            [req.tenantId, title, image_path || null, display_order || 0, duration_seconds || 10, is_active === undefined ? 1 : (is_active ? 1 : 0)]
        );
        res.status(201).json({ ok: true, ad: r.rows[0], computed: adEligibility(r.rows[0]) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== UTILITIES =====
router.get('/bed-availability', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { status } = req.query;
        if (!status) return res.status(400).json({ ok: false, error: 'status_required' });
        res.json({ ok: true, status, availability_score: bedAvailabilityScore(status) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/transport-duration', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { pickup_time, dropoff_time } = req.query;
        if (!pickup_time || !dropoff_time) return res.status(400).json({ ok: false, error: 'pickup_and_dropoff_required' });
        res.json({ ok: true, duration_minutes: transportDuration(pickup_time, dropoff_time) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/wait-severity', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { minutes } = req.query;
        if (minutes === undefined) return res.status(400).json({ ok: false, error: 'minutes_required' });
        res.json({ ok: true, minutes: parseInt(minutes), classification: waitSeverity(parseInt(minutes)) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const transfers = await db.query(`SELECT transfer_reason, COUNT(*) AS count FROM bed_transfers WHERE tenant_id = $1 AND transfer_date >= NOW() - INTERVAL '90 days' GROUP BY transfer_reason ORDER BY count DESC`, [req.tenantId]);
        const bedStatus = await db.query(`SELECT to_status, COUNT(*) AS count FROM bed_status_history WHERE tenant_id = $1 AND changed_at >= NOW() - INTERVAL '90 days' GROUP BY to_status ORDER BY count DESC`, [req.tenantId]);
        const transport = await db.query(`SELECT status, transport_type, priority, COUNT(*) AS count FROM transport_requests WHERE tenant_id = $1 GROUP BY status, transport_type, priority ORDER BY count DESC`, [req.tenantId]);
        const ads = await db.query(`SELECT COUNT(*) AS total_ads, COUNT(*) FILTER (WHERE is_active = 1) AS active_ads FROM queue_advertisements WHERE tenant_id = $1`, [req.tenantId]);
        res.json({ ok: true, transfers_90d: transfers.rows, bed_status_90d: bedStatus.rows, transport_breakdown: transport.rows, queue_ads: ads.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
