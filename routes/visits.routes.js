const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeVisitsRouter({ addVAT, calcVAT, getRequestTenantContext, logAudit, pool, requireAuth, requireRole, requireTenantScope, RS, validateBody }) {
    const router = express.Router();
router.post('/api/visits', requireAuth, async (req, res) => {
    try {
        const { patient_id, visit_type, department, doctor, chief_complaint } = req.body;
        const count = (await pool.query('SELECT COUNT(*) as cnt FROM patient_visits WHERE patient_id=$1', [patient_id])).rows[0].cnt;
        const visitNum = 'V-' + patient_id + '-' + (parseInt(count) + 1);
        const result = await pool.query('INSERT INTO patient_visits (patient_id, visit_number, visit_type, department, doctor, chief_complaint, created_by) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
            [patient_id, visitNum, visit_type || 'Walk-in', department || '', doctor || '', chief_complaint || '', req.session.user?.display_name || '']);
        await pool.query('UPDATE patients SET last_visit_at=NOW(), total_visits=total_visits+1 WHERE id=$1', [patient_id]);
        res.json(result.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.get('/api/visits/:patient_id', requireAuth, async (req, res) => {
    try {
        res.json((await pool.query('SELECT * FROM patient_visits WHERE patient_id=$1 ORDER BY created_at DESC', [req.params.patient_id])).rows);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.post('/api/visits/lifecycle', requireAuth, async (req, res) => {
    try {
        // visit_lifecycle schema provisioned out-of-band (route_level_ddl_cleanup_candidate_*); no DDL in handler.
        const { patient_id, patient_name, appointment_id, doctor, department } = req.body;
        const result = await pool.query(
            'INSERT INTO visit_lifecycle (patient_id, patient_name, appointment_id, doctor, department, status, arrived_at) VALUES ($1,$2,$3,$4,$5,$6,CURRENT_TIMESTAMP) RETURNING *',
            [patient_id, patient_name, appointment_id, doctor, department, 'arrived']
        );
        res.json(result.rows[0]);
    } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});
router.put('/api/visits/lifecycle/:id', requireAuth, async (req, res) => {
    try {
        const { status } = req.body;
        const visit = (await pool.query('SELECT * FROM visit_lifecycle WHERE id=$1', [req.params.id])).rows[0];
        if (!visit) return res.status(404).json({ error: 'Visit not found' });

        const timeFields = {
            'triage': 'triage_at', 'in_consultation': 'consult_start', 'consultation_done': 'consult_end',
            'lab_pending': 'lab_sent_at', 'lab_done': 'lab_done_at',
            'pharmacy_pending': 'pharmacy_sent_at', 'pharmacy_done': 'pharmacy_done_at',
            'payment': 'payment_at', 'completed': 'completed_at'
        };

        const field = timeFields[status];
        let extra = '';
        if (status === 'in_consultation' && visit.arrived_at) {
            const waitMs = Date.now() - new Date(visit.arrived_at).getTime();
            extra = ', wait_time_minutes=' + Math.round(waitMs / 60000);
        }
        if (status === 'consultation_done' && visit.consult_start) {
            const consultMs = Date.now() - new Date(visit.consult_start).getTime();
            extra = ', consult_duration_minutes=' + Math.round(consultMs / 60000);
        }
        if (status === 'completed' && visit.arrived_at) {
            const totalMs = Date.now() - new Date(visit.arrived_at).getTime();
            extra = ', total_duration_minutes=' + Math.round(totalMs / 60000);
        }

        await pool.query('UPDATE visit_lifecycle SET status=$1' + (field ? ', ' + field + '=CURRENT_TIMESTAMP' : '') + extra + ' WHERE id=$2', [status, req.params.id]);
        const updated = (await pool.query('SELECT * FROM visit_lifecycle WHERE id=$1', [req.params.id])).rows[0];
        res.json(updated);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.get('/api/visits/lifecycle/today', requireAuth, async (req, res) => {
    try {
        // visit_lifecycle schema provisioned out-of-band; no DDL in handler.
        const { doctor } = req.query;
        let q = "SELECT * FROM visit_lifecycle WHERE created_at::date = CURRENT_DATE";
        let p = [];
        if (doctor) { q += " AND doctor=$1"; p = [doctor]; }
        q += " ORDER BY arrived_at DESC";
        const rows = (await pool.query(q, p)).rows;
        res.json(rows);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

    return router;
}
