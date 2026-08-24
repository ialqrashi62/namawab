const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeCardiologyRouter({ addVAT, calcVAT, getRequestTenantContext, logAudit, pool, requireAuth, requireRole, requireTenantScope, RS, validateBody }) {
    const router = express.Router();
router.post('/api/cardiology/procedures', requireAuth, requireRole('patients', 'prescriptions'), async (req, res) => {
    try {
        const { patient_id, procedure_type, findings, recommendations } = req.body;
        const { tenantId, facilityId } = getRequestTenantContext(req);
        
        if (!patient_id || !procedure_type) {
            return res.status(400).json({ error: 'Patient ID and Procedure Type are required' });
        }
        
        const result = await pool.query(
            'INSERT INTO cardiology_procedures (patient_id, doctor_id, procedure_type, findings, recommendations, tenant_id, facility_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
            [patient_id, req.session.user?.id || null, procedure_type, findings || '', recommendations || '', tenantId || 1, facilityId || null]
        );
        
        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_CARDIOLOGY_PROCEDURE', 'Cardiology',
            `Created ${procedure_type} report for patient #${patient_id}`, req.ip);
            
        res.json({ id: result.rows[0].id, success: true });
    } catch (e) {
        console.error('[Cardiology Procedure Create Error]', e);
        res.status(500).json({ error: 'Server error' });
    }
});
router.get('/api/cardiology/procedures/patient/:patient_id', requireAuth, requireRole('patients', 'prescriptions'), async (req, res) => {
    try {
        const { patient_id } = req.params;
        const { tenantId } = getRequestTenantContext(req);
        const tenantCheck = tenantId ? ' AND tenant_id=$2' : '';
        const tenantParams = tenantId ? [patient_id, tenantId] : [patient_id];
        
        const result = await pool.query(
            `SELECT cp.*, su.display_name as doctor_name 
             FROM cardiology_procedures cp 
             LEFT JOIN system_users su ON cp.doctor_id = su.id 
             WHERE cp.patient_id=$1${tenantCheck} 
             ORDER BY cp.id DESC`,
            tenantParams
        );
        
        res.json(result.rows);
    } catch (e) {
        console.error('[Cardiology Procedures Get Error]', e);
        res.status(500).json({ error: 'Server error' });
    }
});
router.post('/api/cardiology/ecg', requireAuth, requireRole('patients', 'prescriptions'), async (req, res) => {
    try {
        const { patient_id, leads_data, heart_rate, interpretation } = req.body;
        const { tenantId, facilityId } = getRequestTenantContext(req);
        
        if (!patient_id || !leads_data) {
            return res.status(400).json({ error: 'Patient ID and Leads Data are required' });
        }
        
        const result = await pool.query(
            'INSERT INTO ecg_records (patient_id, doctor_id, leads_data, heart_rate, interpretation, tenant_id, facility_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
            [patient_id, req.session.user?.id || null, JSON.stringify(leads_data), heart_rate || null, interpretation || '', tenantId || 1, facilityId || null]
        );
        
        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_ECG_RECORD', 'Cardiology',
            `Saved ECG record for patient #${patient_id}`, req.ip);
            
        res.json({ id: result.rows[0].id, success: true });
    } catch (e) {
        console.error('[Cardiology ECG Save Error]', e);
        res.status(500).json({ error: 'Server error' });
    }
});
router.get('/api/cardiology/ecg/patient/:patient_id', requireAuth, requireRole('patients', 'prescriptions'), async (req, res) => {
    try {
        const { patient_id } = req.params;
        const { tenantId } = getRequestTenantContext(req);
        const tenantCheck = tenantId ? ' AND tenant_id=$2' : '';
        const tenantParams = tenantId ? [patient_id, tenantId] : [patient_id];
        
        const result = await pool.query(
            `SELECT er.*, su.display_name as doctor_name 
             FROM ecg_records er 
             LEFT JOIN system_users su ON er.doctor_id = su.id 
             WHERE er.patient_id=$1${tenantCheck} 
             ORDER BY er.id DESC`,
            tenantParams
        );
        
        res.json(result.rows);
    } catch (e) {
        console.error('[Cardiology ECGs Get Error]', e);
        res.status(500).json({ error: 'Server error' });
    }
});
router.get('/api/cardiology/ecg/:id', requireAuth, requireRole('patients', 'prescriptions'), async (req, res) => {
    try {
        const { id } = req.params;
        const { tenantId } = getRequestTenantContext(req);
        const tenantCheck = tenantId ? ' AND tenant_id=$2' : '';
        const tenantParams = tenantId ? [id, tenantId] : [id];
        
        const result = await pool.query(
            `SELECT er.*, su.display_name as doctor_name 
             FROM ecg_records er 
             LEFT JOIN system_users su ON er.doctor_id = su.id 
             WHERE er.id=$1${tenantCheck}`,
            tenantParams
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'ECG record not found' });
        }
        
        res.json(result.rows[0]);
    } catch (e) {
        console.error('[Cardiology ECG Get Single Error]', e);
        res.status(500).json({ error: 'Server error' });
    }
});
router.get('/api/cardiology/cath-reports/:patient_id', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { tenantId } = getRequestTenantContext(req);
        const { patient_id } = req.params;
        const result = await pool.query(
            'SELECT * FROM cardiology_cath_reports WHERE patient_id = $1 AND tenant_id = $2 ORDER BY created_at DESC',
            [patient_id, tenantId]
        );
        res.json(result.rows);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.post('/api/cardiology/cath-reports', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { patient_id, blockage_lad, blockage_lcx, blockage_rca, findings } = req.body;
        const { tenantId, facilityId } = getRequestTenantContext(req);
        if (!patient_id) {
            return res.status(400).json({ error: 'patient_id is required' });
        }
        const result = await pool.query(
            'INSERT INTO cardiology_cath_reports (patient_id, blockage_lad, blockage_lcx, blockage_rca, findings, tenant_id, facility_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [patient_id, blockage_lad || 0, blockage_lcx || 0, blockage_rca || 0, findings || '', tenantId, facilityId]
        );
        res.json(result.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

    return router;
}
