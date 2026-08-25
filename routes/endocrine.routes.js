const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeEndocrineRouter({ addVAT, calcVAT, getRequestTenantContext, logAudit, pool, requireAuth, requireRole, requireTenantScope, RS, validateBody }) {
    const router = express.Router();
router.post('/api/endocrine/glucose', requireAuth, requireRole('patients', 'prescriptions'), async (req, res) => {
    try {
        const { patient_id, glucose_value, log_type, notes } = req.body;
        const { tenantId, facilityId } = getRequestTenantContext(req);
        
        if (!patient_id || !glucose_value || !log_type) {
            return res.status(400).json({ error: 'Patient ID, Glucose Value, and Log Type are required' });
        }
        
        const result = await pool.query(
            'INSERT INTO diabetes_glucose_logs (patient_id, doctor_id, glucose_value, log_type, notes, tenant_id, facility_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
            [patient_id, req.session.user?.id || null, glucose_value, log_type, notes || '', tenantId || 1, facilityId || null]
        );
        
        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_GLUCOSE_LOG', 'Endocrinology',
            `Recorded blood glucose (${glucose_value} mg/dL, ${log_type}) for patient #${patient_id}`, req.ip);
            
        res.json({ id: result.rows[0].id, success: true });
    } catch (e) {
        console.error('[Endocrine Glucose Create Error]', e);
        res.status(500).json({ error: 'Server error' });
    }
});
router.get('/api/endocrine/glucose/patient/:patient_id', requireAuth, requireRole('patients', 'prescriptions'), async (req, res) => {
    try {
        const { patient_id } = req.params;
        const { tenantId } = getRequestTenantContext(req);
        const tenantCheck = tenantId ? ' AND tenant_id=$2' : '';
        const tenantParams = tenantId ? [patient_id, tenantId] : [patient_id];
        
        const result = await pool.query(
            `SELECT dgl.*, su.display_name as doctor_name 
             FROM diabetes_glucose_logs dgl 
             LEFT JOIN system_users su ON dgl.doctor_id = su.id 
             WHERE dgl.patient_id=$1${tenantCheck} 
             ORDER BY dgl.id DESC`,
            tenantParams
        );
        
        res.json(result.rows);
    } catch (e) {
        console.error('[Endocrine Glucoses Get Error]', e);
        res.status(500).json({ error: 'Server error' });
    }
});
router.post('/api/endocrine/insulin', requireAuth, requireRole('patients', 'prescriptions'), async (req, res) => {
    try {
        const { patient_id, insulin_type, dosage } = req.body;
        const { tenantId, facilityId } = getRequestTenantContext(req);
        
        if (!patient_id || !insulin_type || !dosage) {
            return res.status(400).json({ error: 'Patient ID, Insulin Type, and Dosage are required' });
        }
        
        const result = await pool.query(
            'INSERT INTO insulin_regimens (patient_id, doctor_id, insulin_type, dosage, is_active, tenant_id, facility_id) VALUES ($1, $2, $3, $4, true, $5, $6) RETURNING id',
            [patient_id, req.session.user?.id || null, insulin_type, dosage, tenantId || 1, facilityId || null]
        );
        
        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_INSULIN_REGIMEN', 'Endocrinology',
            `Prescribed insulin regimen (${insulin_type}, ${dosage}) for patient #${patient_id}`, req.ip);
            
        res.json({ id: result.rows[0].id, success: true });
    } catch (e) {
        console.error('[Endocrine Insulin Create Error]', e);
        res.status(500).json({ error: 'Server error' });
    }
});
router.get('/api/endocrine/insulin/patient/:patient_id', requireAuth, requireRole('patients', 'prescriptions'), async (req, res) => {
    try {
        const { patient_id } = req.params;
        const { tenantId } = getRequestTenantContext(req);
        const tenantCheck = tenantId ? ' AND tenant_id=$2' : '';
        const tenantParams = tenantId ? [patient_id, tenantId] : [patient_id];
        
        const result = await pool.query(
            `SELECT ir.*, su.display_name as doctor_name 
             FROM insulin_regimens ir 
             LEFT JOIN system_users su ON ir.doctor_id = su.id 
             WHERE ir.patient_id=$1${tenantCheck} AND ir.is_active=true 
             ORDER BY ir.id DESC`,
            tenantParams
        );
        
        res.json(result.rows);
    } catch (e) {
        console.error('[Endocrine Insulins Get Error]', e);
        res.status(500).json({ error: 'Server error' });
    }
});
router.put('/api/endocrine/insulin/:id/deactivate', requireAuth, requireRole('patients', 'prescriptions'), async (req, res) => {
    try {
        const { id } = req.params;
        const { tenantId } = getRequestTenantContext(req);
        const tenantCheck = tenantId ? ' AND tenant_id=$2' : '';
        const tenantParams = tenantId ? [id, tenantId] : [id];
        
        const result = await pool.query(
            `UPDATE insulin_regimens 
             SET is_active=false 
             WHERE id=$1${tenantCheck} 
             RETURNING id`,
            tenantParams
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Insulin regimen not found or unauthorized' });
        }
        
        logAudit(req.session.user?.id, req.session.user?.display_name, 'DEACTIVATE_INSULIN_REGIMEN', 'Endocrinology',
            `Deactivated insulin regimen #${id}`, req.ip);
            
        res.json({ id: result.rows[0].id, success: true });
    } catch (e) {
        console.error('[Endocrine Insulin Deactivate Error]', e);
        res.status(500).json({ error: 'Server error' });
    }
});

    return router;
}
