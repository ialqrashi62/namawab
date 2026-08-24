const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeQueueRouter({ addVAT, calcVAT, getRequestTenantContext, logAudit, pool, requireAuth, requireRole, requireTenantScope, RS, validateBody }) {
    const router = express.Router();
router.get('/api/queue/patients', requireAuth, async (req, res) => {
    try {
        const { tenantId } = getRequestTenantContext(req);
        const result = await pool.query(
            `SELECT w.*, p.name_ar, p.name_en, p.file_number, p.dob, p.phone
             FROM waiting_queue w
             JOIN patients p ON w.patient_id = p.id
             WHERE w.tenant_id = $1 AND w.status != 'ReadyForDischarge' AND w.status != 'NoShow'
             ORDER BY w.triage_level ASC, w.check_in_time ASC`,
            [tenantId]
        );
        res.json(result.rows);
    } catch (e) {
        console.error('Error fetching queue:', e);
        res.status(500).json({ error: 'Server error' });
    }
});
router.post('/api/queue/checkin', requireAuth, async (req, res) => {
    try {
        const { tenantId } = getRequestTenantContext(req);
        const { patient_id, doctor, department, triage_level, exam_room_id, acuity_notes } = req.body;
        
        const check = await pool.query(
            "SELECT id FROM waiting_queue WHERE patient_id = $1 AND tenant_id = $2 AND status != 'ReadyForDischarge' AND status != 'NoShow'",
            [patient_id, tenantId]
        );
        if (check.rows.length > 0) {
            return res.status(400).json({ error: 'Patient already in waiting queue' });
        }

        const patient = (await pool.query("SELECT name_ar, name_en FROM patients WHERE id = $1 AND tenant_id = $2", [patient_id, tenantId])).rows[0];
        if (!patient) return res.status(404).json({ error: 'Patient not found' });
        const patient_name = patient.name_ar || patient.name_en || '';

        const result = await pool.query(
            `INSERT INTO waiting_queue (tenant_id, patient_id, patient_name, doctor, department, triage_level, exam_room_id, acuity_notes, status, check_in_time)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'CheckedIn', CURRENT_TIMESTAMP)
             RETURNING *`,
            [tenantId, patient_id, patient_name, doctor || '', department || '', triage_level || 5, exam_room_id || '', acuity_notes || '']
        );
        
        await pool.query(
            `UPDATE patients SET status = 'Waiting' WHERE id = $1 AND tenant_id = $2`,
            [patient_id, tenantId]
        );

        res.status(201).json(result.rows[0]);
    } catch (e) {
        console.error('Error checking in patient:', e);
        res.status(500).json({ error: 'Server error' });
    }
});
router.put('/api/queue/patients/:id/status', requireAuth, async (req, res) => {
    try {
        const { tenantId } = getRequestTenantContext(req);
        const { status } = req.body;
        
        const result = await pool.query(
            `UPDATE waiting_queue 
             SET status = $1, updated_at = CURRENT_TIMESTAMP
             WHERE id = $2 AND tenant_id = $3
             RETURNING *`,
            [status, req.params.id, tenantId]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Queue record not found' });
        }
        
        const queueRec = result.rows[0];
        let pStatus = 'Waiting';
        if (status === 'InConsultation') pStatus = 'With Doctor';
        else if (status === 'Triage') pStatus = 'With Nurse';
        else if (status === 'ReadyForDischarge') pStatus = 'Discharged';
        else if (status === 'NoShow') pStatus = 'No Show';
        
        await pool.query(
            `UPDATE patients SET status = $1 WHERE id = $2 AND tenant_id = $3`,
            [pStatus, queueRec.patient_id, tenantId]
        );

        res.json(queueRec);
    } catch (e) {
        console.error('Error updating status:', e);
        res.status(500).json({ error: 'Server error' });
    }
});
router.put('/api/queue/patients/:id/triage', requireAuth, async (req, res) => {
    try {
        const { tenantId } = getRequestTenantContext(req);
        const { triage_level, acuity_notes, exam_room_id } = req.body;
        
        const result = await pool.query(
            `UPDATE waiting_queue 
             SET triage_level = $1, acuity_notes = $2, exam_room_id = $3, status = 'WaitingForProvider', updated_at = CURRENT_TIMESTAMP
             WHERE id = $4 AND tenant_id = $5
             RETURNING *`,
            [triage_level, acuity_notes || '', exam_room_id || '', req.params.id, tenantId]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Queue record not found' });
        }
        res.json(result.rows[0]);
    } catch (e) {
        console.error('Error saving triage:', e);
        res.status(500).json({ error: 'Server error' });
    }
});
router.put('/api/queue/patients/:id/call', requireAuth, async (req, res) => {
    try {
        const { tenantId } = getRequestTenantContext(req);
        const record = (await pool.query(
            `SELECT w.*, p.name_ar, p.name_en 
             FROM waiting_queue w 
             JOIN patients p ON w.patient_id = p.id
             WHERE w.id = $1 AND w.tenant_id = $2`,
            [req.params.id, tenantId]
        )).rows[0];
        
        if (!record) return res.status(404).json({ error: 'Queue record not found' });
        
        res.json({ success: true, message: 'Patient calling broadcasted', patient_name: record.name_ar || record.name_en, room: record.exam_room_id });
    } catch (e) {
        console.error('Error calling patient:', e);
        res.status(500).json({ error: 'Server error' });
    }
});
router.get('/api/queue/ads', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM queue_advertisements WHERE is_active=1 ORDER BY display_order')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.post('/api/queue/ads', requireAuth, async (req, res) => {
    try {
        const { title, image_path, duration_seconds } = req.body;
        const result = await pool.query('INSERT INTO queue_advertisements (title, image_path, duration_seconds) VALUES ($1,$2,$3) RETURNING id',
            [title || '', image_path || '', duration_seconds || 10]);
        res.json((await pool.query('SELECT * FROM queue_advertisements WHERE id=$1', [result.rows[0].id])).rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

    return router;
}
