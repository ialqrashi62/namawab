const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeOrthopedicsRouter({ addVAT, calcVAT, getRequestTenantContext, logAudit, pool, requireAuth, requireRole, requireTenantScope, RS, validateBody }) {
    const router = express.Router();
router.post('/api/orthopedics/implants', requireAuth, requireRole('patients', 'prescriptions'), async (req, res) => {
    try {
        const { 
            patient_id, implant_date, implant_type, manufacturer, model_name,
            serial_number, size_dimension, batch_lot_number, clinical_notes
        } = req.body;
        const { tenantId, facilityId } = getRequestTenantContext(req);
        
        if (!patient_id || !implant_type || !manufacturer || !serial_number) {
            return res.status(400).json({ error: 'Patient ID, implant type, manufacturer, and serial number are required' });
        }
        
        const result = await pool.query(
            `INSERT INTO orthopedic_implants 
             (patient_id, doctor_id, implant_date, implant_type, manufacturer, model_name,
              serial_number, size_dimension, batch_lot_number, clinical_notes, tenant_id, facility_id) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id`,
            [
                patient_id,
                req.session.user?.id || null,
                implant_date || new Date().toISOString().slice(0, 10),
                implant_type,
                manufacturer,
                model_name || '',
                serial_number,
                size_dimension || '',
                batch_lot_number || '',
                clinical_notes || '',
                tenantId || 1,
                facilityId || null
            ]
        );
        
        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_ORTHOPEDIC_IMPLANT', 'Orthopedics',
            `Recorded orthopedic implant ${implant_type} (S/N: ${serial_number}) for patient #${patient_id}`, req.ip);
            
        res.json({ id: result.rows[0].id, success: true });
    } catch (e) {
        console.error('[Orthopedics Implant Create Error]', e);
        res.status(500).json({ error: 'Server error' });
    }
});
router.get('/api/orthopedics/implants/patient/:patient_id', requireAuth, requireRole('patients', 'prescriptions'), async (req, res) => {
    try {
        const { patient_id } = req.params;
        const { tenantId } = getRequestTenantContext(req);
        const tenantCheck = tenantId ? ' AND tenant_id=$2' : '';
        const tenantParams = tenantId ? [patient_id, tenantId] : [patient_id];
        
        const result = await pool.query(
            `SELECT oi.*, su.display_name as doctor_name 
             FROM orthopedic_implants oi 
             LEFT JOIN system_users su ON oi.doctor_id = su.id 
             WHERE oi.patient_id=$1${tenantCheck} 
             ORDER BY oi.id DESC`,
            tenantParams
        );
        
        res.json(result.rows);
    } catch (e) {
        console.error('[Orthopedics Implant Get Error]', e);
        res.status(500).json({ error: 'Server error' });
    }
});
router.post('/api/orthopedics/rom', requireAuth, requireRole('patients', 'prescriptions'), async (req, res) => {
    try {
        const { 
            patient_id, assessment_date, joint_name, lateral_side, movement_type, angle_degrees, is_restricted
        } = req.body;
        const { tenantId, facilityId } = getRequestTenantContext(req);
        
        if (!patient_id || !joint_name || !lateral_side || !movement_type || angle_degrees === undefined) {
            return res.status(400).json({ error: 'Patient ID, joint name, side, movement type, and angle are required' });
        }
        
        const result = await pool.query(
            `INSERT INTO joint_rom_assessments 
             (patient_id, doctor_id, assessment_date, joint_name, lateral_side, movement_type, angle_degrees, is_restricted, tenant_id, facility_id) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
            [
                patient_id,
                req.session.user?.id || null,
                assessment_date || new Date().toISOString().slice(0, 10),
                joint_name,
                lateral_side,
                movement_type,
                parseInt(angle_degrees),
                is_restricted === true,
                tenantId || 1,
                facilityId || null
            ]
        );
        
        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_JOINT_ROM_ASSESSMENT', 'Orthopedics',
            `Recorded ROM assessment for patient #${patient_id} - ${joint_name} ${lateral_side} ${movement_type}: ${angle_degrees}°`, req.ip);
            
        res.json({ id: result.rows[0].id, success: true });
    } catch (e) {
        console.error('[Orthopedics ROM Create Error]', e);
        res.status(500).json({ error: 'Server error' });
    }
});
router.get('/api/orthopedics/rom/patient/:patient_id', requireAuth, requireRole('patients', 'prescriptions'), async (req, res) => {
    try {
        const { patient_id } = req.params;
        const { tenantId } = getRequestTenantContext(req);
        const tenantCheck = tenantId ? ' AND tenant_id=$2' : '';
        const tenantParams = tenantId ? [patient_id, tenantId] : [patient_id];
        
        const result = await pool.query(
            `SELECT jra.*, su.display_name as doctor_name 
             FROM joint_rom_assessments jra 
             LEFT JOIN system_users su ON jra.doctor_id = su.id 
             WHERE jra.patient_id=$1${tenantCheck} 
             ORDER BY jra.id DESC`,
            tenantParams
        );
        
        res.json(result.rows);
    } catch (e) {
        console.error('[Orthopedics ROM Get Error]', e);
        res.status(500).json({ error: 'Server error' });
    }
});

    return router;
}
