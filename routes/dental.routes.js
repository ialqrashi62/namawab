const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeDentalRouter({ addVAT, calcVAT, getRequestTenantContext, logAudit, pool, requireAuth, requireRole, requireTenantScope, RS, validateBody }) {
    const router = express.Router();
router.get('/api/dental/records/:patient_id', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { tenantId } = getRequestTenantContext(req);
        const { patient_id } = req.params;
        const result = await pool.query(
            'SELECT * FROM dental_records WHERE patient_id = $1 AND tenant_id = $2 ORDER BY visit_date DESC',
            [patient_id, tenantId]
        );
        res.json(result.rows);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.post('/api/dental/records', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { patient_id, tooth_number, condition, treatment_done, affected_surfaces } = req.body;
        const { tenantId, facilityId } = getRequestTenantContext(req);
        if (!patient_id || !tooth_number) {
            return res.status(400).json({ error: 'patient_id and tooth_number are required' });
        }
        const result = await pool.query(
            'INSERT INTO dental_records (patient_id, tooth_number, condition, treatment_done, affected_surfaces, tenant_id, facility_id, visit_date) VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP) RETURNING *',
            [patient_id, tooth_number, condition || '', treatment_done || '', affected_surfaces || '', tenantId, facilityId]
        );
        res.json(result.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.get('/api/dental/periodontal/:patient_id', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { tenantId } = getRequestTenantContext(req);
        const { patient_id } = req.params;
        const result = await pool.query(
            'SELECT * FROM dental_periodontal_exams WHERE patient_id = $1 AND tenant_id = $2 ORDER BY exam_date DESC',
            [patient_id, tenantId]
        );
        res.json(result.rows);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.post('/api/dental/periodontal', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { patient_id, tooth_number, probing_depth, bleeding_on_probing, gingival_recession } = req.body;
        const { tenantId, facilityId } = getRequestTenantContext(req);
        if (!patient_id || !tooth_number) {
            return res.status(400).json({ error: 'patient_id and tooth_number are required' });
        }
        const result = await pool.query(
            'INSERT INTO dental_periodontal_exams (patient_id, tooth_number, probing_depth, bleeding_on_probing, gingival_recession, tenant_id, facility_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [patient_id, tooth_number, probing_depth || 0, bleeding_on_probing || false, gingival_recession || 0, tenantId, facilityId]
        );
        res.json(result.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.get('/api/dental/images/:patient_id', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { tenantId } = getRequestTenantContext(req);
        const { patient_id } = req.params;
        const result = await pool.query(
            'SELECT * FROM dental_images WHERE patient_id = $1 AND tenant_id = $2 ORDER BY created_at DESC',
            [patient_id, tenantId]
        );
        res.json(result.rows);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.post('/api/dental/images', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { patient_id, tooth_number, image_path, image_type } = req.body;
        const { tenantId, facilityId } = getRequestTenantContext(req);
        if (!patient_id || !tooth_number || !image_path) {
            return res.status(400).json({ error: 'patient_id, tooth_number and image_path are required' });
        }
        const result = await pool.query(
            'INSERT INTO dental_images (patient_id, tooth_number, image_path, image_type, tenant_id, facility_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [patient_id, tooth_number, image_path, image_type || 'X-Ray', tenantId, facilityId]
        );
        res.json(result.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

    return router;
}
