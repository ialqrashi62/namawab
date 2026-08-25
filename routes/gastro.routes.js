const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeGastroRouter({ addVAT, calcVAT, getRequestTenantContext, logAudit, pool, requireAuth, requireRole, requireTenantScope, RS, validateBody }) {
    const router = express.Router();
router.post('/api/gastro/endoscopy', requireAuth, requireRole('patients', 'prescriptions'), async (req, res) => {
    try {
        const { patient_id, endoscopy_type, indications, findings, complications, recommendations } = req.body;
        const { tenantId, facilityId } = getRequestTenantContext(req);
        
        if (!patient_id || !endoscopy_type) {
            return res.status(400).json({ error: 'Patient ID and Endoscopy Type are required' });
        }
        
        const result = await pool.query(
            'INSERT INTO endoscopy_reports (patient_id, doctor_id, endoscopy_type, indications, findings, complications, recommendations, tenant_id, facility_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
            [patient_id, req.session.user?.id || null, endoscopy_type, indications || '', findings || '', complications || '', recommendations || '', tenantId || 1, facilityId || null]
        );
        
        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_ENDOSCOPY_REPORT', 'Gastroenterology',
            `Created ${endoscopy_type} report for patient #${patient_id}`, req.ip);
            
        res.json({ id: result.rows[0].id, success: true });
    } catch (e) {
        console.error('[Gastro Endoscopy Create Error]', e);
        res.status(500).json({ error: 'Server error' });
    }
});
router.get('/api/gastro/endoscopy/patient/:patient_id', requireAuth, requireRole('patients', 'prescriptions'), async (req, res) => {
    try {
        const { patient_id } = req.params;
        const { tenantId } = getRequestTenantContext(req);
        const tenantCheck = tenantId ? ' AND tenant_id=$2' : '';
        const tenantParams = tenantId ? [patient_id, tenantId] : [patient_id];
        
        const result = await pool.query(
            `SELECT er.*, su.display_name as doctor_name 
             FROM endoscopy_reports er 
             LEFT JOIN system_users su ON er.doctor_id = su.id 
             WHERE er.patient_id=$1${tenantCheck} 
             ORDER BY er.id DESC`,
            tenantParams
        );
        
        res.json(result.rows);
    } catch (e) {
        console.error('[Gastro Endoscopies Get Error]', e);
        res.status(500).json({ error: 'Server error' });
    }
});
router.post('/api/gastro/biopsy', requireAuth, requireRole('patients', 'prescriptions'), async (req, res) => {
    try {
        const { patient_id, specimen_source, clinical_notes } = req.body;
        const { tenantId, facilityId } = getRequestTenantContext(req);
        
        if (!patient_id || !specimen_source) {
            return res.status(400).json({ error: 'Patient ID and Specimen Source are required' });
        }
        
        const result = await pool.query(
            'INSERT INTO biopsy_samples (patient_id, doctor_id, specimen_source, clinical_notes, status, tenant_id, facility_id) VALUES ($1, $2, $3, $4, \'Pending\', $5, $6) RETURNING id',
            [patient_id, req.session.user?.id || null, specimen_source, clinical_notes || '', tenantId || 1, facilityId || null]
        );
        
        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_BIOPSY_REQUEST', 'Gastroenterology',
            `Requested biopsy of ${specimen_source} for patient #${patient_id}`, req.ip);
            
        res.json({ id: result.rows[0].id, success: true });
    } catch (e) {
        console.error('[Gastro Biopsy Create Error]', e);
        res.status(500).json({ error: 'Server error' });
    }
});
router.get('/api/gastro/biopsy/patient/:patient_id', requireAuth, requireRole('patients', 'prescriptions'), async (req, res) => {
    try {
        const { patient_id } = req.params;
        const { tenantId } = getRequestTenantContext(req);
        const tenantCheck = tenantId ? ' AND tenant_id=$2' : '';
        const tenantParams = tenantId ? [patient_id, tenantId] : [patient_id];
        
        const result = await pool.query(
            `SELECT bs.*, su.display_name as doctor_name 
             FROM biopsy_samples bs 
             LEFT JOIN system_users su ON bs.doctor_id = su.id 
             WHERE bs.patient_id=$1${tenantCheck} 
             ORDER BY bs.id DESC`,
            tenantParams
        );
        
        res.json(result.rows);
    } catch (e) {
        console.error('[Gastro Biopsies Get Error]', e);
        res.status(500).json({ error: 'Server error' });
    }
});
router.put('/api/gastro/biopsy/:id/result', requireAuth, requireRole('patients', 'prescriptions'), async (req, res) => {
    try {
        const { id } = req.params;
        const { result_findings } = req.body;
        const { tenantId } = getRequestTenantContext(req);
        const tenantCheck = tenantId ? ' AND tenant_id=$3' : '';
        const tenantParams = tenantId ? [result_findings, id, tenantId] : [result_findings, id];
        
        const result = await pool.query(
            `UPDATE biopsy_samples 
             SET status='Resulted', result_findings=$1 
             WHERE id=$2${tenantCheck} 
             RETURNING id`,
            tenantParams
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Biopsy sample not found or unauthorized' });
        }
        
        logAudit(req.session.user?.id, req.session.user?.display_name, 'UPDATE_BIOPSY_RESULT', 'Gastroenterology',
            `Recorded biopsy result for sample #${id}`, req.ip);
            
        res.json({ id: result.rows[0].id, success: true });
    } catch (e) {
        console.error('[Gastro Biopsy Result Update Error]', e);
        res.status(500).json({ error: 'Server error' });
    }
});

    return router;
}
