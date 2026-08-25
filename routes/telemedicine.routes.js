const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function TelemedicineRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }) {
    const router = express.Router();
router.get('/api/telemedicine/sessions', requireAuth, requireRole('telemedicine'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        res.json((await pool.query('SELECT * FROM telemedicine_sessions WHERE tenant_id=$1 ORDER BY scheduled_date DESC, scheduled_time DESC', [tenantId])).rows);

    }

    catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/telemedicine/sessions', requireAuth, requireRole('telemedicine'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId, facilityId } = getRequestTenantContext(req);

        const { patient_id, patient_name, speciality, session_type, scheduled_date, scheduled_time, duration_minutes, notes } = req.body;

        const link = 'https://meet.nama.sa/' + require('crypto').randomBytes(16).toString('hex');

        const result = await pool.query('INSERT INTO telemedicine_sessions (patient_id, patient_name, doctor, speciality, session_type, scheduled_date, scheduled_time, duration_minutes, meeting_link, notes, tenant_id, facility_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *',

            [patient_id, patient_name || '', req.session.user.name, speciality || '', session_type || 'Video', scheduled_date || '', scheduled_time || '', duration_minutes || 15, link, notes || '', tenantId, facilityId]);

        res.json(result.rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.put('/api/telemedicine/sessions/:id', requireAuth, requireRole('telemedicine'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const { status, diagnosis, prescription } = req.body;

        await pool.query('UPDATE telemedicine_sessions SET status=$1, diagnosis=$2, prescription=$3 WHERE id=$4 AND tenant_id=$5', [status || 'Completed', diagnosis || '', prescription || '', req.params.id, tenantId]);

        res.json({ success: true });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});


    return router;
}
