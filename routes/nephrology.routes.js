const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeNephrologyRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }) {
    const router = express.Router();
router.post('/api/nephrology/dialysis', requireAuth, requireRole('patients', 'prescriptions'), async (req, res) => {

    try {

        const { 

            patient_id, 

            session_date, 

            dialysis_type,

            duration_hours, 

            notes,

            // Legacy parameter names

            weight_pre, 

            weight_post, 

            blood_flow_rate, 

            ultrafiltration_volume,

            // New parameter names

            pre_weight_kg,

            post_weight_kg,

            blood_flow_rate_ml_min,

            dialysate_flow_rate_ml_min,

            ultrafiltration_target_liters

        } = req.body;

        const { tenantId, facilityId } = getRequestTenantContext(req);

        

        if (!patient_id) {

            return res.status(400).json({ error: 'Patient ID is required' });

        }



        // Unify parameters (prefer new ones, fallback to legacy)

        const final_pre_weight = pre_weight_kg !== undefined ? parseFloat(pre_weight_kg) : (weight_pre !== undefined ? parseFloat(weight_pre) : null);

        const final_post_weight = post_weight_kg !== undefined ? parseFloat(post_weight_kg) : (weight_post !== undefined ? parseFloat(weight_post) : null);

        const final_blood_flow = blood_flow_rate_ml_min !== undefined ? parseInt(blood_flow_rate_ml_min) : (blood_flow_rate !== undefined ? parseInt(blood_flow_rate) : null);

        const final_uf_volume = ultrafiltration_target_liters !== undefined ? parseFloat(ultrafiltration_target_liters) : (ultrafiltration_volume !== undefined ? parseFloat(ultrafiltration_volume) : null);

        

        const result = await pool.query(

            `INSERT INTO dialysis_sessions 

             (patient_id, doctor_id, session_date, dialysis_type, duration_hours, pre_weight_kg, weight_pre, post_weight_kg, weight_post, blood_flow_rate_ml_min, blood_flow_rate, dialysate_flow_rate_ml_min, ultrafiltration_target_liters, ultrafiltration_volume, notes, tenant_id, facility_id) 

             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING id`,

            [

                patient_id, 

                req.session.user?.id || null, 

                session_date || new Date().toISOString().slice(0, 10), 

                dialysis_type || 'Hemodialysis',

                duration_hours !== undefined ? parseFloat(duration_hours) : null,

                final_pre_weight,

                final_pre_weight,

                final_post_weight,

                final_post_weight,

                final_blood_flow,

                final_blood_flow,

                dialysate_flow_rate_ml_min !== undefined ? parseInt(dialysate_flow_rate_ml_min) : null,

                final_uf_volume,

                final_uf_volume,

                notes || '', 

                tenantId || 1, 

                facilityId || null

            ]

        );

        

        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_DIALYSIS_SESSION', 'Nephrology',

            `Recorded dialysis session for patient #${patient_id}`, req.ip);

            

        res.json({ id: result.rows[0].id, success: true });

    } catch (e) {

        console.error('[Nephrology Dialysis Create Error]', e);

        res.status(500).json({ error: 'Server error' });

    }

});

router.get('/api/nephrology/dialysis/patient/:patient_id', requireAuth, requireRole('patients', 'prescriptions'), async (req, res) => {

    try {

        const { patient_id } = req.params;

        const { tenantId } = getRequestTenantContext(req);

        const tenantCheck = tenantId ? ' AND tenant_id=$2' : '';

        const tenantParams = tenantId ? [patient_id, tenantId] : [patient_id];

        

        const result = await pool.query(

            `SELECT ds.*, su.display_name as doctor_name 

             FROM dialysis_sessions ds 

             LEFT JOIN system_users su ON ds.doctor_id = su.id 

             WHERE ds.patient_id=$1${tenantCheck} 

             ORDER BY ds.id DESC`,

            tenantParams

        );

        

        res.json(result.rows);

    } catch (e) {

        console.error('[Nephrology Dialysis Get Error]', e);

        res.status(500).json({ error: 'Server error' });

    }

});


    return router;
}
