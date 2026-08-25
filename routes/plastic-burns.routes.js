const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makePlasticBurnsRouter({ addVAT, calcVAT, getRequestTenantContext, logAudit, pool, requireAuth, requireRole, requireTenantScope, RS, validateBody }) {
    const router = express.Router();
router.post('/api/plastic-burns/assessments', requireAuth, requireRole('patients', 'prescriptions'), async (req, res) => {
    try {
        const { 
            patient_id, assessment_date, weight_kg,
            head_percent, torso_front_percent, torso_back_percent,
            left_arm_percent, right_arm_percent, left_leg_percent, right_leg_percent, perineum_percent,
            tbsa_percent, parkland_fluid_ml, fluid_first_8h_ml, fluid_next_16h_ml,
            clinical_notes
        } = req.body;
        const { tenantId, facilityId } = getRequestTenantContext(req);
        
        if (!patient_id || !weight_kg || tbsa_percent === undefined) {
            return res.status(400).json({ error: 'Patient ID, weight, and TBSA percentage are required' });
        }
        
        const result = await pool.query(
            `INSERT INTO burn_assessments 
             (patient_id, doctor_id, assessment_date, weight_kg,
              head_percent, torso_front_percent, torso_back_percent,
              left_arm_percent, right_arm_percent, left_leg_percent, right_leg_percent, perineum_percent,
              tbsa_percent, parkland_fluid_ml, fluid_first_8h_ml, fluid_next_16h_ml,
              clinical_notes, tenant_id, facility_id) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19) RETURNING id`,
            [
                patient_id,
                req.session.user?.id || null,
                assessment_date || new Date().toISOString().slice(0, 10),
                parseFloat(weight_kg),
                parseFloat(head_percent || 0),
                parseFloat(torso_front_percent || 0),
                parseFloat(torso_back_percent || 0),
                parseFloat(left_arm_percent || 0),
                parseFloat(right_arm_percent || 0),
                parseFloat(left_leg_percent || 0),
                parseFloat(right_leg_percent || 0),
                parseFloat(perineum_percent || 0),
                parseFloat(tbsa_percent),
                parseFloat(parkland_fluid_ml || 0),
                parseFloat(fluid_first_8h_ml || 0),
                parseFloat(fluid_next_16h_ml || 0),
                clinical_notes || '',
                tenantId || 1,
                facilityId || null
            ]
        );
        
        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_BURN_ASSESSMENT', 'PlasticBurns',
            `Recorded burn assessment for patient #${patient_id} with TBSA ${tbsa_percent}%`, req.ip);
            
        res.json({ id: result.rows[0].id, success: true });
    } catch (e) {
        console.error('[Plastic Burns Assessment Create Error]', e);
        res.status(500).json({ error: 'Server error' });
    }
});
router.get('/api/plastic-burns/assessments/patient/:patient_id', requireAuth, requireRole('patients', 'prescriptions'), async (req, res) => {
    try {
        const { patient_id } = req.params;
        const { tenantId } = getRequestTenantContext(req);
        const tenantCheck = tenantId ? ' AND tenant_id=$2' : '';
        const tenantParams = tenantId ? [patient_id, tenantId] : [patient_id];
        
        const result = await pool.query(
            `SELECT ba.*, su.display_name as doctor_name 
             FROM burn_assessments ba 
             LEFT JOIN system_users su ON ba.doctor_id = su.id 
             WHERE ba.patient_id=$1${tenantCheck} 
             ORDER BY ba.id DESC`,
            tenantParams
        );
        
        res.json(result.rows);
    } catch (e) {
        console.error('[Plastic Burns Assessment Get Error]', e);
        res.status(500).json({ error: 'Server error' });
    }
});
router.post('/api/plastic-burns/photos', requireAuth, requireRole('patients', 'prescriptions'), async (req, res) => {
    try {
        const { patient_id, photo_date, body_region, description, is_confidential } = req.body;
        const { tenantId, facilityId } = getRequestTenantContext(req);
        
        if (!patient_id || !body_region) {
            return res.status(400).json({ error: 'Patient ID and body region are required' });
        }
        
        const result = await pool.query(
            `INSERT INTO clinical_photos_meta 
             (patient_id, doctor_id, photo_date, body_region, description, is_confidential, tenant_id, facility_id) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
            [
                patient_id,
                req.session.user?.id || null,
                photo_date || new Date().toISOString().slice(0, 10),
                body_region,
                description || '',
                is_confidential !== undefined ? is_confidential : true,
                tenantId || 1,
                facilityId || null
            ]
        );
        
        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_CLINICAL_PHOTO_META', 'PlasticBurns',
            `Recorded clinical photo meta for patient #${patient_id} - ${body_region}`, req.ip);
            
        res.json({ id: result.rows[0].id, success: true });
    } catch (e) {
        console.error('[Plastic Burns Photo Create Error]', e);
        res.status(500).json({ error: 'Server error' });
    }
});
router.get('/api/plastic-burns/photos/patient/:patient_id', requireAuth, requireRole('patients', 'prescriptions'), async (req, res) => {
    try {
        const { patient_id } = req.params;
        const { tenantId } = getRequestTenantContext(req);
        const tenantCheck = tenantId ? ' AND tenant_id=$2' : '';
        const tenantParams = tenantId ? [patient_id, tenantId] : [patient_id];
        
        const result = await pool.query(
            `SELECT cpm.*, su.display_name as doctor_name 
             FROM clinical_photos_meta cpm 
             LEFT JOIN system_users su ON cpm.doctor_id = su.id 
             WHERE cpm.patient_id=$1${tenantCheck} 
             ORDER BY cpm.id DESC`,
            tenantParams
        );
        
        res.json(result.rows);
    } catch (e) {
        console.error('[Plastic Burns Photo Get Error]', e);
        res.status(500).json({ error: 'Server error' });
    }
});

    return router;
}
