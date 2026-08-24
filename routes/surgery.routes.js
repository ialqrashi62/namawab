const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeSurgeryRouter({ addVAT, calcVAT, getRequestTenantContext, logAudit, pool, requireAuth, requireRole, requireTenantScope, RS, validateBody }) {
    const router = express.Router();
router.post('/api/surgery/checklists', requireAuth, requireRole('patients', 'prescriptions'), async (req, res) => {
    try {
        const { 
            patient_id, surgery_date, procedure_name, 
            sign_in_confirmed, time_out_confirmed, sign_out_confirmed, notes 
        } = req.body;
        const { tenantId, facilityId } = getRequestTenantContext(req);
        
        if (!patient_id || !procedure_name) {
            return res.status(400).json({ error: 'Patient ID and Procedure Name are required' });
        }
        
        const result = await pool.query(
            `INSERT INTO surgical_checklists 
             (patient_id, doctor_id, surgery_date, procedure_name, sign_in_confirmed, time_out_confirmed, sign_out_confirmed, notes, tenant_id, facility_id) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
            [
                patient_id,
                req.session.user?.id || null,
                surgery_date || new Date().toISOString().slice(0, 10),
                procedure_name,
                !!sign_in_confirmed,
                !!time_out_confirmed,
                !!sign_out_confirmed,
                notes || '',
                tenantId || 1,
                facilityId || null
            ]
        );
        
        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_SURGICAL_CHECKLIST', 'General Surgery',
            `Recorded surgical safety checklist for patient #${patient_id}`, req.ip);
            
        res.json({ id: result.rows[0].id, success: true });
    } catch (e) {
        console.error('[Surgical Checklist Create Error]', e);
        res.status(500).json({ error: 'Server error' });
    }
});
router.get('/api/surgery/checklists/patient/:patient_id', requireAuth, requireRole('patients', 'prescriptions'), async (req, res) => {
    try {
        const { patient_id } = req.params;
        const { tenantId } = getRequestTenantContext(req);
        const tenantCheck = tenantId ? ' AND tenant_id=$2' : '';
        const tenantParams = tenantId ? [patient_id, tenantId] : [patient_id];
        
        const result = await pool.query(
            `SELECT sc.*, su.display_name as doctor_name 
             FROM surgical_checklists sc 
             LEFT JOIN system_users su ON sc.doctor_id = su.id 
             WHERE sc.patient_id=$1${tenantCheck} 
             ORDER BY sc.id DESC`,
            tenantParams
        );
        
        res.json(result.rows);
    } catch (e) {
        console.error('[Surgical Checklist Get Error]', e);
        res.status(500).json({ error: 'Server error' });
    }
});
router.post('/api/surgery/timelogs', requireAuth, requireRole('patients', 'prescriptions'), async (req, res) => {
    try {
        const { 
            patient_id, procedure_name, 
            anesthesia_start_time, incision_time, closure_time, anesthesia_end_time 
        } = req.body;
        const { tenantId, facilityId } = getRequestTenantContext(req);
        
        if (!patient_id || !procedure_name) {
            return res.status(400).json({ error: 'Patient ID and Procedure Name are required' });
        }
        
        const result = await pool.query(
            `INSERT INTO surgical_time_logs 
             (patient_id, doctor_id, procedure_name, anesthesia_start_time, incision_time, closure_time, anesthesia_end_time, tenant_id, facility_id) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
            [
                patient_id,
                req.session.user?.id || null,
                procedure_name,
                anesthesia_start_time || null,
                incision_time || null,
                closure_time || null,
                anesthesia_end_time || null,
                tenantId || 1,
                facilityId || null
            ]
        );
        
        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_SURGICAL_TIMELOG', 'General Surgery',
            `Recorded surgical time log for patient #${patient_id}`, req.ip);
            
        res.json({ id: result.rows[0].id, success: true });
    } catch (e) {
        console.error('[Surgical Time Log Create Error]', e);
        res.status(500).json({ error: 'Server error' });
    }
});
router.get('/api/surgery/timelogs/patient/:patient_id', requireAuth, requireRole('patients', 'prescriptions'), async (req, res) => {
    try {
        const { patient_id } = req.params;
        const { tenantId } = getRequestTenantContext(req);
        const tenantCheck = tenantId ? ' AND tenant_id=$2' : '';
        const tenantParams = tenantId ? [patient_id, tenantId] : [patient_id];
        
        const result = await pool.query(
            `SELECT stl.*, su.display_name as doctor_name 
             FROM surgical_time_logs stl 
             LEFT JOIN system_users su ON stl.doctor_id = su.id 
             WHERE stl.patient_id=$1${tenantCheck} 
             ORDER BY stl.id DESC`,
            tenantParams
        );
        
        res.json(result.rows);
    } catch (e) {
        console.error('[Surgical Time Log Get Error]', e);
        res.status(500).json({ error: 'Server error' });
    }
});
router.post('/api/surgery/cpb', requireAuth, requireRole('patients', 'prescriptions'), async (req, res) => {
    try {
        const { 
            patient_id, bypass_date, pump_time, cross_clamp_time, flow_rate, min_temp, notes 
        } = req.body;
        const { tenantId, facilityId } = getRequestTenantContext(req);
        
        if (!patient_id) {
            return res.status(400).json({ error: 'Patient ID is required' });
        }
        
        const result = await pool.query(
            `INSERT INTO cpb_logs 
             (patient_id, doctor_id, bypass_date, pump_time, cross_clamp_time, flow_rate, min_temp, notes, tenant_id, facility_id) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
            [
                patient_id,
                req.session.user?.id || null,
                bypass_date || new Date().toISOString().slice(0, 10),
                pump_time === undefined ? 0 : parseInt(pump_time),
                cross_clamp_time === undefined ? 0 : parseInt(cross_clamp_time),
                flow_rate === undefined ? 0.00 : parseFloat(flow_rate),
                min_temp === undefined ? 37.0 : parseFloat(min_temp),
                notes || '',
                tenantId || 1,
                facilityId || null
            ]
        );
        
        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_CPB_LOG', 'Cardiothoracic',
            `Recorded cardiopulmonary bypass log for patient #${patient_id}`, req.ip);
            
        res.json({ id: result.rows[0].id, success: true });
    } catch (e) {
        console.error('[CPB Log Create Error]', e);
        res.status(500).json({ error: 'Server error' });
    }
});
router.get('/api/surgery/cpb/patient/:patient_id', requireAuth, requireRole('patients', 'prescriptions'), async (req, res) => {
    try {
        const { patient_id } = req.params;
        const { tenantId } = getRequestTenantContext(req);
        const tenantCheck = tenantId ? ' AND tenant_id=$2' : '';
        const tenantParams = tenantId ? [patient_id, tenantId] : [patient_id];
        
        const result = await pool.query(
            `SELECT c.*, su.display_name as doctor_name 
             FROM cpb_logs c 
             LEFT JOIN system_users su ON c.doctor_id = su.id 
             WHERE c.patient_id=$1${tenantCheck} 
             ORDER BY c.id DESC`,
            tenantParams
        );
        
        res.json(result.rows);
    } catch (e) {
        console.error('[CPB Log Get Error]', e);
        res.status(500).json({ error: 'Server error' });
    }
});
router.post('/api/surgery/count-sheet', requireAuth, requireRole('doctor', 'nursing'), requireTenantScope, async (req, res) => {
    try {
        const { tenantId: tid } = getRequestTenantContext(req);
        const {
            surgery_id,
            sponge_count_initial, sponge_count_final,
            needle_count_initial, needle_count_final,
            instrument_count_initial, instrument_count_final,
            witness1_name, witness2_name, notes
        } = req.body;

        if (!surgery_id) {
            return res.status(400).json({ error: 'surgery_id is required' });
        }

        // Compares counts
        const match = (parseInt(sponge_count_initial) === parseInt(sponge_count_final)) &&
                      (parseInt(needle_count_initial) === parseInt(needle_count_final)) &&
                      (parseInt(instrument_count_initial) === parseInt(instrument_count_final));

        const r = await pool.query(`
            INSERT INTO surgery_count_sheets 
            (surgery_id, sponge_count_initial, sponge_count_final, needle_count_initial, needle_count_final, instrument_count_initial, instrument_count_final, counts_match, witness1_name, witness2_name, notes, tenant_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *
        `, [
            parseInt(surgery_id),
            parseInt(sponge_count_initial) || 0, parseInt(sponge_count_final) || 0,
            parseInt(needle_count_initial) || 0, parseInt(needle_count_final) || 0,
            parseInt(instrument_count_initial) || 0, parseInt(instrument_count_final) || 0,
            match, witness1_name || '', witness2_name || '', notes || '', tid
        ]);

        logAudit(req.session.user.id, req.session.user.display_name || req.session.user.name, 'CREATE_SURGERY_COUNT_SHEET', 'Surgery', 
            `Recorded surgical counts for surgery #${surgery_id}. Matches: ${match}`, tid);

        res.json(r.rows[0]);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});
router.get('/api/surgery/count-sheet/:surgeryId', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { tenantId: tid } = getRequestTenantContext(req);
        const sid = parseInt(req.params.surgeryId);

        const r = await pool.query('SELECT * FROM surgery_count_sheets WHERE surgery_id=$1 AND tenant_id=$2 ORDER BY id DESC', [sid, tid]);
        res.json(r.rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

    return router;
}
