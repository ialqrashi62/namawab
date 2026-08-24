const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makePediatricsRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, specialtyScores }) {
    const router = express.Router();
router.post('/api/pediatrics/growth', requireAuth, requireRole('patients', 'prescriptions'), async (req, res) => {

    try {

        const { 

            patient_id, record_date, apgar_1min, apgar_5min, weight_kg, height_cm, head_circ_cm 

        } = req.body;

        const { tenantId, facilityId } = getRequestTenantContext(req);

        

        if (!patient_id) {

            return res.status(400).json({ error: 'Patient ID is required' });

        }



        // APGAR is 0-10 by definition; out-of-range/garbage 422s instead of being stored

        // verbatim onto the neonatal growth record (absent stays NULL).

        const apgar1Res = specialtyScores.validateAPGARTotal(apgar_1min);

        if (!apgar1Res.ok) return res.status(422).json({ error: `APGAR 1-min rejected: ${apgar1Res.error}` });

        const apgar5Res = specialtyScores.validateAPGARTotal(apgar_5min);

        if (!apgar5Res.ok) return res.status(422).json({ error: `APGAR 5-min rejected: ${apgar5Res.error}` });



        const result = await pool.query(

            `INSERT INTO pediatric_growth_records

             (patient_id, doctor_id, record_date, apgar_1min, apgar_5min, weight_kg, height_cm, head_circ_cm, tenant_id, facility_id) 

             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,

            [

                patient_id,

                req.session.user?.id || null,

                record_date || new Date().toISOString().slice(0, 10),

                apgar1Res.total,

                apgar5Res.total,

                weight_kg === undefined || weight_kg === '' ? null : parseFloat(weight_kg),

                height_cm === undefined || height_cm === '' ? null : parseFloat(height_cm),

                head_circ_cm === undefined || head_circ_cm === '' ? null : parseFloat(head_circ_cm),

                tenantId || 1,

                facilityId || null

            ]

        );

        

        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_PEDIATRIC_GROWTH_RECORD', 'Pediatrics',

            `Recorded pediatric growth details for patient #${patient_id}`, req.ip);

            

        res.json({ id: result.rows[0].id, success: true });

    } catch (e) {

        console.error('[Pediatric Growth Record Create Error]', e);

        res.status(500).json({ error: 'Server error' });

    }

});

router.get('/api/pediatrics/growth/patient/:patient_id', requireAuth, requireRole('patients', 'prescriptions'), async (req, res) => {

    try {

        const { patient_id } = req.params;

        const { tenantId } = getRequestTenantContext(req);

        const tenantCheck = tenantId ? ' AND tenant_id=$2' : '';

        const tenantParams = tenantId ? [patient_id, tenantId] : [patient_id];

        

        const result = await pool.query(

            `SELECT pg.*, su.display_name as doctor_name 

             FROM pediatric_growth_records pg 

             LEFT JOIN system_users su ON pg.doctor_id = su.id 

             WHERE pg.patient_id=$1${tenantCheck} 

             ORDER BY pg.id DESC`,

            tenantParams

        );

        

        res.json(result.rows);

    } catch (e) {

        console.error('[Pediatric Growth Record Get Error]', e);

        res.status(500).json({ error: 'Server error' });

    }

});

router.get('/api/pediatrics/immunization-schedule', requireAuth, async (req, res) => {

    // Saudi MOH National Immunization Program 2024 — جدول التطعيمات الوطني السعودي

    const schedule = [

        { age: 'عند الولادة', age_en: 'Birth', vaccines: ['BCG (سل)', 'HBV1 (التهاب الكبد B الجرعة الأولى)'] },

        { age: 'شهرين', age_en: '2 months', vaccines: ['DTaP-IPV-Hib-HBV2', 'PCV13-1', 'RV1'] },

        { age: '4 أشهر', age_en: '4 months', vaccines: ['DTaP-IPV-Hib2', 'PCV13-2', 'RV2'] },

        { age: '6 أشهر', age_en: '6 months', vaccines: ['DTaP-IPV-Hib-HBV3', 'PCV13-3', 'RV3 (إذا لزم)'] },

        { age: '12 شهراً', age_en: '12 months', vaccines: ['MMR1 (حصبة نكاف حصبة ألمانية)', 'Varicella1 (جديري ماء)', 'HBV3 (إذا لم يُعطَ سابقاً)'] },

        { age: '18 شهراً', age_en: '18 months', vaccines: ['DTaP-IPV-Hib Booster', 'PCV13 Booster', 'MMR2', 'Varicella2'] },

        { age: '4-6 سنوات', age_en: '4-6 years', vaccines: ['DTaP-IPV Booster', 'MMR3 (إذا لزم)'] },

        { age: '11-12 سنة', age_en: '11-12 years', vaccines: ['Tdap', 'HPV (2 جرعات)', 'MenACWY-1'] },

        { age: '16-18 سنة', age_en: '16-18 years', vaccines: ['MenACWY Booster', 'Influenza سنوياً'] },

        { age: 'سنوي', age_en: 'Annual', vaccines: ['Influenza (كل سنة من عمر 6 شهور)'] },

    ];

    res.json(schedule);

});

router.get('/api/pediatrics/immunization-records/:patientId', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const { patientId } = req.params;

        const pOwn = (await pool.query('SELECT id, name_ar, dob, gender FROM patients WHERE id=$1 AND tenant_id=$2', [patientId, tenantId])).rows[0];

        if (!pOwn) return res.status(404).json({ error: 'Patient not found' });

        const records = (await pool.query(

            'SELECT * FROM pediatric_immunizations WHERE patient_id=$1 AND tenant_id=$2 ORDER BY given_date DESC',

            [patientId, tenantId]

        )).rows;

        res.json({ patient: pOwn, immunizations: records });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/pediatrics/immunization', requireAuth, requireRole('doctor', 'nursing', 'patients'), requireTenantScope, async (req, res) => {

    try {

        const { patient_id, vaccine_name, dose_number, given_date, batch_number, site, route, next_due, notes } = req.body;

        const { tenantId, facilityId } = getRequestTenantContext(req);

        if (!patient_id || !vaccine_name) return res.status(400).json({ error: 'patient_id and vaccine_name required' });

        const pOwn = (await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [patient_id, tenantId])).rows[0];

        if (!pOwn) return res.status(404).json({ error: 'Patient not found' });

        const result = await pool.query(

            `INSERT INTO pediatric_immunizations

             (patient_id, vaccine_name, dose_number, given_date, batch_number, site, route, next_due, notes, given_by, tenant_id, facility_id)

             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING id`,

            [patient_id, vaccine_name, dose_number || 1, given_date || new Date().toISOString().slice(0,10),

             batch_number || '', site || '', route || 'IM', next_due || null, notes || '',

             req.session.user.name, tenantId, facilityId || null]

        );

        logAudit(req.session.user.id, req.session.user.name, 'PEDIATRIC_IMMUNIZATION', 'Pediatrics',

            `Vaccine ${vaccine_name} given to patient #${patient_id}`, req.ip);

        res.json({ id: result.rows[0].id, success: true });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/pediatrics/weight-based-dose', requireAuth, async (req, res) => {

    const { drug, weight_kg, age_months } = req.query;

    if (!drug || !weight_kg) return res.status(400).json({ error: 'drug and weight_kg required' });

    const wt = parseFloat(weight_kg);

    if (isNaN(wt) || wt <= 0 || wt > 200) return res.status(400).json({ error: 'Invalid weight' });

    // Common pediatric dose reference (mg/kg/dose) — FOR REFERENCE ONLY, not a prescription

    const DOSE_REF = {

        'Paracetamol': { mg_per_kg: 15, max_dose_mg: 1000, frequency: 'Q4-6H PRN', max_daily_mg_per_kg: 90 },

        'Ibuprofen':   { mg_per_kg: 10, max_dose_mg: 400,  frequency: 'Q6-8H PRN', max_daily_mg_per_kg: 40 },

        'Amoxicillin': { mg_per_kg: 25, max_dose_mg: 500,  frequency: 'Q8H', max_daily_mg_per_kg: 90 },

        'Azithromycin':{ mg_per_kg: 10, max_dose_mg: 500,  frequency: 'Once daily 5 days', max_daily_mg_per_kg: 10 },

        'Cetirizine':  { mg_per_kg: 0.25,max_dose_mg: 10,  frequency: 'Once daily', max_daily_mg_per_kg: 0.25 },

        'Salbutamol':  { mg_per_kg: 0.15,max_dose_mg: 5,   frequency: 'Q4-6H PRN (inhaler preferred)', max_daily_mg_per_kg: 1 },

    };

    const drugKey = Object.keys(DOSE_REF).find(k => k.toLowerCase() === (drug||'').toLowerCase().trim());

    if (!drugKey) return res.json({

        disclaimer: 'CLINICAL_DECISION_SUPPORT_ONLY — Not a prescription. Verify with pharmacist.',

        message: `Drug "${drug}" not in reference. Please consult pharmacy formulary.`,

        available_drugs: Object.keys(DOSE_REF)

    });

    const ref = DOSE_REF[drugKey];

    const calculated_mg = +(wt * ref.mg_per_kg).toFixed(1);

    const dose_mg = +Math.min(calculated_mg, ref.max_dose_mg).toFixed(1);

    const max_daily = +(wt * ref.max_daily_mg_per_kg).toFixed(1);

    res.json({

        drug: drugKey, weight_kg: wt,

        calculated_dose_mg: dose_mg,

        frequency: ref.frequency,

        max_single_dose_mg: ref.max_dose_mg,

        max_daily_dose_mg: max_daily,

        disclaimer: 'CLINICAL_DECISION_SUPPORT_ONLY — For physician/pharmacist reference only. Always verify with licensed pharmacist before prescribing.',

        disclaimer_ar: 'نظام دعم القرار السريري فقط — للإشارة فقط. التحقق من الصيدلاني المرخص إلزامي قبل الوصف.'

    });

});

router.post('/api/pediatrics/apgar', requireAuth, requireRole('doctor', 'nursing'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId: tid } = getRequestTenantContext(req);

        const { patient_id, mother_id, apgar_1min, apgar_5min, apgar_10min, details, notes } = req.body;

        if (!patient_id) {

            return res.status(400).json({ error: 'patient_id is required' });

        }



        // IDOR check

        const patCheck = await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [parseInt(patient_id), tid]);

        if (!patCheck.rows.length) {

            return res.status(403).json({ error: 'Patient access denied' });

        }



        const r = await pool.query(`

            INSERT INTO neonatal_apgar_scores (patient_id, mother_id, apgar_1min, apgar_5min, apgar_10min, details, assessed_by, notes, tenant_id)

            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *

        `, [

            parseInt(patient_id),

            mother_id ? parseInt(mother_id) : null,

            parseInt(apgar_1min) || 0,

            parseInt(apgar_5min) || 0,

            parseInt(apgar_10min) || 0,

            JSON.stringify(details || {}),

            req.session.user.display_name || req.session.user.name,

            notes || '', tid

        ]);



        logAudit(req.session.user.id, req.session.user.display_name || req.session.user.name, 'CREATE_APGAR_SCORE', 'Pediatrics', 

            `Recorded Apgar score for newborn patient #${patient_id} (1min: ${apgar_1min}, 5min: ${apgar_5min})`, tid);



        res.json(r.rows[0]);

    } catch (e) {

        res.status(500).json({ error: e.message });

    }

});

router.get('/api/pediatrics/apgar/:patientId', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId: tid } = getRequestTenantContext(req);

        const pid = parseInt(req.params.patientId);



        // IDOR check

        const patCheck = await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [pid, tid]);

        if (!patCheck.rows.length) {

            return res.status(403).json({ error: 'Patient access denied' });

        }



        const r = await pool.query('SELECT * FROM neonatal_apgar_scores WHERE patient_id=$1 AND tenant_id=$2 ORDER BY id DESC', [pid, tid]);

        res.json(r.rows);

    } catch (e) {

        res.status(500).json({ error: e.message });

    }

});


    return router;
}
