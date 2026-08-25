const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeIcuRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, specialtyScores, cds, e9IntId, e9LoadActiveIcuAdmission, e9PostFlowsheet, e9PostScore, e9RequireTenant, icuScoring }) {
    const router = express.Router();
router.post('/api/icu/assessments', requireAuth, requireRole('patients', 'prescriptions'), async (req, res) => {

    try {

        const { 

            patient_id, assessment_date,

            apache_temp, apache_map, apache_hr, apache_rr, apache_pao2, apache_ph, apache_na, apache_k, apache_creatinine, apache_hct, apache_wbc, apache_gcs,

            apache_age_points, apache_chronic_points, apache_ii_score,

            sofa_pao2_fio2, sofa_platelets, sofa_bilirubin, sofa_map_vasopressor, sofa_gcs, sofa_creatinine, sofa_score,

            clinical_notes

        } = req.body;

        const { tenantId, facilityId } = getRequestTenantContext(req);

        

        if (!patient_id) {

            return res.status(400).json({ error: 'Patient ID is required' });

        }



        // APACHE-II / SOFA totals are server-side authority values: computed as the sum of

        // the submitted point components (each strictly range-validated — garbage 422s

        // instead of silently becoming 0 points). Client-sent apache_ii_score/sofa_score

        // are NEVER trusted: a spoofed SOFA 0 would rank the sickest patient as the

        // healthiest on the acuity board.

        const apacheRes = specialtyScores.sumAPACHE2Points({

            temp: apache_temp, map: apache_map, hr: apache_hr, rr: apache_rr, pao2: apache_pao2,

            ph: apache_ph, na: apache_na, k: apache_k, creatinine: apache_creatinine,

            hct: apache_hct, wbc: apache_wbc, gcs_points: apache_gcs,

            age_points: apache_age_points, chronic_points: apache_chronic_points

        });

        if (!apacheRes.ok) return res.status(422).json({ error: `APACHE-II rejected: ${apacheRes.error}` });

        const sofaRes = specialtyScores.sumSOFAPoints({

            pao2_fio2: sofa_pao2_fio2, platelets: sofa_platelets, bilirubin: sofa_bilirubin,

            map_vasopressor: sofa_map_vasopressor, gcs: sofa_gcs, creatinine: sofa_creatinine

        });

        if (!sofaRes.ok) return res.status(422).json({ error: `SOFA rejected: ${sofaRes.error}` });



        const result = await pool.query(

            `INSERT INTO icu_assessments

             (patient_id, doctor_id, assessment_date,

              apache_temp, apache_map, apache_hr, apache_rr, apache_pao2, apache_ph, apache_na, apache_k, apache_creatinine, apache_hct, apache_wbc, apache_gcs,

              apache_age_points, apache_chronic_points, apache_ii_score,

              sofa_pao2_fio2, sofa_platelets, sofa_bilirubin, sofa_map_vasopressor, sofa_gcs, sofa_creatinine, sofa_score,

              clinical_notes, tenant_id, facility_id)

             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28) RETURNING id`,

            [

                patient_id,

                req.session.user?.id || null,

                assessment_date || new Date().toISOString().slice(0, 10),

                apacheRes.points.temp,

                apacheRes.points.map,

                apacheRes.points.hr,

                apacheRes.points.rr,

                apacheRes.points.pao2,

                apacheRes.points.ph,

                apacheRes.points.na,

                apacheRes.points.k,

                apacheRes.points.creatinine,

                apacheRes.points.hct,

                apacheRes.points.wbc,

                apacheRes.points.gcs_points,

                apacheRes.points.age_points,

                apacheRes.points.chronic_points,

                apacheRes.total,

                sofaRes.points.pao2_fio2,

                sofaRes.points.platelets,

                sofaRes.points.bilirubin,

                sofaRes.points.map_vasopressor,

                sofaRes.points.gcs,

                sofaRes.points.creatinine,

                sofaRes.total,

                clinical_notes || '',

                tenantId || 1,

                facilityId || null

            ]

        );

        

        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_ICU_ASSESSMENT', 'IntensiveCare',

            `Recorded ICU assessment for patient #${patient_id} with APACHE II ${apache_ii_score} and SOFA ${sofa_score}`, req.ip);

            

        res.json({ id: result.rows[0].id, success: true });

    } catch (e) {

        console.error('[ICU Assessment Create Error]', e);

        res.status(500).json({ error: 'Server error' });

    }

});

router.get('/api/icu/assessments/patient/:patient_id', requireAuth, requireRole('patients', 'prescriptions'), async (req, res) => {

    try {

        const { patient_id } = req.params;

        const { tenantId } = getRequestTenantContext(req);

        const tenantCheck = tenantId ? ' AND tenant_id=$2' : '';

        const tenantParams = tenantId ? [patient_id, tenantId] : [patient_id];

        

        const result = await pool.query(

            `SELECT ia.*, su.display_name as doctor_name 

             FROM icu_assessments ia 

             LEFT JOIN system_users su ON ia.doctor_id = su.id 

             WHERE ia.patient_id=$1${tenantCheck} 

             ORDER BY ia.id DESC`,

            tenantParams

        );

        

        res.json(result.rows);

    } catch (e) {

        console.error('[ICU Assessment Get Error]', e);

        res.status(500).json({ error: 'Server error' });

    }

});

router.get('/api/icu/patients', requireAuth, requireRole('icu', 'nursing', 'doctor'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = e9RequireTenant(req);

        const rows = (await pool.query(

            `SELECT a.*, b.bed_number, w.ward_name, w.ward_name_ar, w.ward_type

             FROM admissions a

             LEFT JOIN beds b ON a.bed_id = b.id AND b.tenant_id = $1

             JOIN wards w ON COALESCE(b.ward_id, a.ward_id) = w.id AND w.tenant_id = $1

             WHERE a.status='Active' AND a.tenant_id = $1 AND w.ward_type IN ('ICU','NICU','CCU')

             ORDER BY a.admission_date DESC`, [tenantId])).rows;

        res.json(rows);

    } catch (e) {

        if (e.e9Status) return res.status(e.e9Status).json({ error: e.message });

        res.status(500).json({ error: 'Server error' });

    }

});

router.post('/api/icu/flowsheet', requireAuth, requireRole('icu', 'nursing', 'doctor'), requireTenantScope, e9PostFlowsheet);

router.post('/api/icu/monitoring', requireAuth, requireRole('icu', 'nursing', 'doctor'), requireTenantScope, e9PostFlowsheet);



async function e9GetFlowsheet(req, res) {

    try {

        const { tenantId } = e9RequireTenant(req);

        const admissionId = e9IntId(req.query.admission_id != null ? req.query.admission_id : req.params.admissionId);

        if (!admissionId) return res.status(422).json({ error: 'Valid admission_id is required' });

        const own = (await pool.query('SELECT id FROM admissions WHERE id=$1 AND tenant_id=$2', [admissionId, tenantId])).rows[0];

        if (!own) return res.status(404).json({ error: 'Admission not found' });

        const rows = (await pool.query(

            'SELECT * FROM icu_monitoring WHERE admission_id=$1 AND tenant_id=$2 ORDER BY monitor_time DESC LIMIT 50',

            [admissionId, tenantId])).rows;

        res.json(rows);

    } catch (e) {

        if (e.e9Status) return res.status(e.e9Status).json({ error: e.message });

        res.status(500).json({ error: 'Server error' });

    }

}

router.get('/api/icu/flowsheet', requireAuth, requireRole('icu', 'nursing', 'doctor'), requireTenantScope, e9GetFlowsheet);

router.get('/api/icu/monitoring/:admissionId', requireAuth, requireRole('icu', 'nursing', 'doctor'), requireTenantScope, e9GetFlowsheet);



// ----- Ventilator records (settings + measured) — icu_ventilator -----

router.post('/api/icu/ventilator', requireAuth, requireRole('icu', 'nursing', 'doctor'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId, facilityId } = e9RequireTenant(req);

        const adm = await e9LoadActiveIcuAdmission(req.body.admission_id, tenantId);

        const b = req.body;

        const num = v => { const n = Number(v); return Number.isFinite(n) ? n : 0; };

        const r = await pool.query(

            `INSERT INTO icu_ventilator (admission_id,patient_id,vent_mode,fio2,tidal_volume,respiratory_rate,peep,pip,ie_ratio,ps,ett_size,ett_position,cuff_pressure,notes,recorded_by,tenant_id,facility_id)

             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) RETURNING *`,

            [adm.id, adm.patient_id, String(b.vent_mode || ''), num(b.fio2) || 21, num(b.tidal_volume), num(b.respiratory_rate), num(b.peep), num(b.pip), String(b.ie_ratio || '1:2'), num(b.ps), String(b.ett_size || ''), String(b.ett_position || ''), num(b.cuff_pressure), String(b.notes || ''), String(b.recorded_by || req.session.user?.display_name || ''), tenantId, facilityId || null]);

        logAudit(req.session.user?.id, req.session.user?.display_name, 'ICU_VENTILATOR', 'ICU',

            `Ventilator record for admission #${adm.id} (mode ${b.vent_mode || '-'})`, req.ip);

        res.json(r.rows[0]);

    } catch (e) {

        if (e.e9Status) return res.status(e.e9Status).json({ error: e.message });

        res.status(500).json({ error: 'Server error' });

    }

});

router.post('/api/icu/monitoring', requireAuth, requireRole('icu', 'nursing', 'doctor'), requireTenantScope, e9PostFlowsheet);



async function e9GetFlowsheet(req, res) {

    try {

        const { tenantId } = e9RequireTenant(req);

        const admissionId = e9IntId(req.query.admission_id != null ? req.query.admission_id : req.params.admissionId);

        if (!admissionId) return res.status(422).json({ error: 'Valid admission_id is required' });

        const own = (await pool.query('SELECT id FROM admissions WHERE id=$1 AND tenant_id=$2', [admissionId, tenantId])).rows[0];

        if (!own) return res.status(404).json({ error: 'Admission not found' });

        const rows = (await pool.query(

            'SELECT * FROM icu_monitoring WHERE admission_id=$1 AND tenant_id=$2 ORDER BY monitor_time DESC LIMIT 50',

            [admissionId, tenantId])).rows;

        res.json(rows);

    } catch (e) {

        if (e.e9Status) return res.status(e.e9Status).json({ error: e.message });

        res.status(500).json({ error: 'Server error' });

    }

}

router.get('/api/icu/flowsheet', requireAuth, requireRole('icu', 'nursing', 'doctor'), requireTenantScope, e9GetFlowsheet);

router.get('/api/icu/monitoring/:admissionId', requireAuth, requireRole('icu', 'nursing', 'doctor'), requireTenantScope, e9GetFlowsheet);



// ----- Ventilator records (settings + measured) — icu_ventilator -----

router.post('/api/icu/ventilator', requireAuth, requireRole('icu', 'nursing', 'doctor'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId, facilityId } = e9RequireTenant(req);

        const adm = await e9LoadActiveIcuAdmission(req.body.admission_id, tenantId);

        const b = req.body;

        const num = v => { const n = Number(v); return Number.isFinite(n) ? n : 0; };

        const r = await pool.query(

            `INSERT INTO icu_ventilator (admission_id,patient_id,vent_mode,fio2,tidal_volume,respiratory_rate,peep,pip,ie_ratio,ps,ett_size,ett_position,cuff_pressure,notes,recorded_by,tenant_id,facility_id)

             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) RETURNING *`,

            [adm.id, adm.patient_id, String(b.vent_mode || ''), num(b.fio2) || 21, num(b.tidal_volume), num(b.respiratory_rate), num(b.peep), num(b.pip), String(b.ie_ratio || '1:2'), num(b.ps), String(b.ett_size || ''), String(b.ett_position || ''), num(b.cuff_pressure), String(b.notes || ''), String(b.recorded_by || req.session.user?.display_name || ''), tenantId, facilityId || null]);

        logAudit(req.session.user?.id, req.session.user?.display_name, 'ICU_VENTILATOR', 'ICU',

            `Ventilator record for admission #${adm.id} (mode ${b.vent_mode || '-'})`, req.ip);

        res.json(r.rows[0]);

    } catch (e) {

        if (e.e9Status) return res.status(e.e9Status).json({ error: e.message });

        res.status(500).json({ error: 'Server error' });

    }

});

router.get('/api/icu/flowsheet', requireAuth, requireRole('icu', 'nursing', 'doctor'), requireTenantScope, e9GetFlowsheet);

router.get('/api/icu/monitoring/:admissionId', requireAuth, requireRole('icu', 'nursing', 'doctor'), requireTenantScope, e9GetFlowsheet);



// ----- Ventilator records (settings + measured) — icu_ventilator -----

router.post('/api/icu/ventilator', requireAuth, requireRole('icu', 'nursing', 'doctor'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId, facilityId } = e9RequireTenant(req);

        const adm = await e9LoadActiveIcuAdmission(req.body.admission_id, tenantId);

        const b = req.body;

        const num = v => { const n = Number(v); return Number.isFinite(n) ? n : 0; };

        const r = await pool.query(

            `INSERT INTO icu_ventilator (admission_id,patient_id,vent_mode,fio2,tidal_volume,respiratory_rate,peep,pip,ie_ratio,ps,ett_size,ett_position,cuff_pressure,notes,recorded_by,tenant_id,facility_id)

             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) RETURNING *`,

            [adm.id, adm.patient_id, String(b.vent_mode || ''), num(b.fio2) || 21, num(b.tidal_volume), num(b.respiratory_rate), num(b.peep), num(b.pip), String(b.ie_ratio || '1:2'), num(b.ps), String(b.ett_size || ''), String(b.ett_position || ''), num(b.cuff_pressure), String(b.notes || ''), String(b.recorded_by || req.session.user?.display_name || ''), tenantId, facilityId || null]);

        logAudit(req.session.user?.id, req.session.user?.display_name, 'ICU_VENTILATOR', 'ICU',

            `Ventilator record for admission #${adm.id} (mode ${b.vent_mode || '-'})`, req.ip);

        res.json(r.rows[0]);

    } catch (e) {

        if (e.e9Status) return res.status(e.e9Status).json({ error: e.message });

        res.status(500).json({ error: 'Server error' });

    }

});

router.get('/api/icu/monitoring/:admissionId', requireAuth, requireRole('icu', 'nursing', 'doctor'), requireTenantScope, e9GetFlowsheet);



// ----- Ventilator records (settings + measured) — icu_ventilator -----

router.post('/api/icu/ventilator', requireAuth, requireRole('icu', 'nursing', 'doctor'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId, facilityId } = e9RequireTenant(req);

        const adm = await e9LoadActiveIcuAdmission(req.body.admission_id, tenantId);

        const b = req.body;

        const num = v => { const n = Number(v); return Number.isFinite(n) ? n : 0; };

        const r = await pool.query(

            `INSERT INTO icu_ventilator (admission_id,patient_id,vent_mode,fio2,tidal_volume,respiratory_rate,peep,pip,ie_ratio,ps,ett_size,ett_position,cuff_pressure,notes,recorded_by,tenant_id,facility_id)

             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) RETURNING *`,

            [adm.id, adm.patient_id, String(b.vent_mode || ''), num(b.fio2) || 21, num(b.tidal_volume), num(b.respiratory_rate), num(b.peep), num(b.pip), String(b.ie_ratio || '1:2'), num(b.ps), String(b.ett_size || ''), String(b.ett_position || ''), num(b.cuff_pressure), String(b.notes || ''), String(b.recorded_by || req.session.user?.display_name || ''), tenantId, facilityId || null]);

        logAudit(req.session.user?.id, req.session.user?.display_name, 'ICU_VENTILATOR', 'ICU',

            `Ventilator record for admission #${adm.id} (mode ${b.vent_mode || '-'})`, req.ip);

        res.json(r.rows[0]);

    } catch (e) {

        if (e.e9Status) return res.status(e.e9Status).json({ error: e.message });

        res.status(500).json({ error: 'Server error' });

    }

});

router.post('/api/icu/ventilator', requireAuth, requireRole('icu', 'nursing', 'doctor'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId, facilityId } = e9RequireTenant(req);

        const adm = await e9LoadActiveIcuAdmission(req.body.admission_id, tenantId);

        const b = req.body;

        const num = v => { const n = Number(v); return Number.isFinite(n) ? n : 0; };

        const r = await pool.query(

            `INSERT INTO icu_ventilator (admission_id,patient_id,vent_mode,fio2,tidal_volume,respiratory_rate,peep,pip,ie_ratio,ps,ett_size,ett_position,cuff_pressure,notes,recorded_by,tenant_id,facility_id)

             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) RETURNING *`,

            [adm.id, adm.patient_id, String(b.vent_mode || ''), num(b.fio2) || 21, num(b.tidal_volume), num(b.respiratory_rate), num(b.peep), num(b.pip), String(b.ie_ratio || '1:2'), num(b.ps), String(b.ett_size || ''), String(b.ett_position || ''), num(b.cuff_pressure), String(b.notes || ''), String(b.recorded_by || req.session.user?.display_name || ''), tenantId, facilityId || null]);

        logAudit(req.session.user?.id, req.session.user?.display_name, 'ICU_VENTILATOR', 'ICU',

            `Ventilator record for admission #${adm.id} (mode ${b.vent_mode || '-'})`, req.ip);

        res.json(r.rows[0]);

    } catch (e) {

        if (e.e9Status) return res.status(e.e9Status).json({ error: e.message });

        res.status(500).json({ error: 'Server error' });

    }

});

router.get('/api/icu/ventilator/:admissionId', requireAuth, requireRole('icu', 'nursing', 'doctor'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = e9RequireTenant(req);

        const admissionId = e9IntId(req.params.admissionId);

        if (!admissionId) return res.status(422).json({ error: 'Valid admission_id is required' });

        const own = (await pool.query('SELECT id FROM admissions WHERE id=$1 AND tenant_id=$2', [admissionId, tenantId])).rows[0];

        if (!own) return res.status(404).json({ error: 'Admission not found' });

        const rows = (await pool.query(

            'SELECT * FROM icu_ventilator WHERE admission_id=$1 AND tenant_id=$2 ORDER BY created_at DESC LIMIT 20',

            [admissionId, tenantId])).rows;

        res.json(rows);

    } catch (e) {

        if (e.e9Status) return res.status(e.e9Status).json({ error: e.message });

        res.status(500).json({ error: 'Server error' });

    }

});

router.post('/api/icu/infusion', requireAuth, requireRole('icu', 'nursing', 'doctor'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId, facilityId } = e9RequireTenant(req);

        const adm = await e9LoadActiveIcuAdmission(req.body.admission_id, tenantId);

        const b = req.body;

        const drug = String(b.drug || b.medication || '').trim();

        if (!drug) return res.status(422).json({ error: 'drug is required' });

        const num = v => { const n = Number(v); return Number.isFinite(n) ? n : 0; };



        // Bonus: server-derived allergy safety check (advisory; never client-trusted).

        let allergyWarning = null;

        try {

            const allergyRows = (await pool.query(

                'SELECT allergies FROM patients WHERE id=$1 AND tenant_id=$2', [adm.patient_id, tenantId])).rows[0];

            if (allergyRows && allergyRows.allergies) {

                const alerts = cds.checkDrugAllergy({ name: drug }, allergyRows.allergies);

                if (Array.isArray(alerts) && alerts.length) {

                    allergyWarning = alerts.map(a => a.message || a.reason || String(a)).join('; ');

                }

            }

        } catch (_) { /* fail-safe: allergy lookup failure must not block infusion record */ }



        const r = await pool.query(

            `INSERT INTO icu_infusions (admission_id,patient_id,drug,concentration,rate,rate_unit,dose,dose_unit,route,status,allergy_warning,notes,recorded_by,tenant_id,facility_id)

             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *`,

            [adm.id, adm.patient_id, drug, String(b.concentration || ''), num(b.rate), String(b.rate_unit || 'mL/hr'), num(b.dose), String(b.dose_unit || ''), String(b.route || 'IV'), String(b.status || 'Running'), allergyWarning, String(b.notes || ''), String(b.recorded_by || req.session.user?.display_name || ''), tenantId, facilityId || null]);

        logAudit(req.session.user?.id, req.session.user?.display_name, 'ICU_INFUSION', 'ICU',

            `Infusion ${drug} for admission #${adm.id}${allergyWarning ? ' [ALLERGY WARNING: ' + allergyWarning + ']' : ''}`, req.ip);

        res.json({ ...r.rows[0], allergy_warning: allergyWarning });

    } catch (e) {

        if (e.e9Status) return res.status(e.e9Status).json({ error: e.message });

        res.status(500).json({ error: 'Server error' });

    }

});

router.get('/api/icu/infusion/:admissionId', requireAuth, requireRole('icu', 'nursing', 'doctor'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = e9RequireTenant(req);

        const admissionId = e9IntId(req.params.admissionId);

        if (!admissionId) return res.status(422).json({ error: 'Valid admission_id is required' });

        const own = (await pool.query('SELECT id FROM admissions WHERE id=$1 AND tenant_id=$2', [admissionId, tenantId])).rows[0];

        if (!own) return res.status(404).json({ error: 'Admission not found' });

        const rows = (await pool.query(

            'SELECT * FROM icu_infusions WHERE admission_id=$1 AND tenant_id=$2 ORDER BY created_at DESC LIMIT 50',

            [admissionId, tenantId])).rows;

        res.json(rows);

    } catch (e) {

        if (e.e9Status) return res.status(e.e9Status).json({ error: e.message });

        res.status(500).json({ error: 'Server error' });

    }

});

router.post('/api/icu/score', requireAuth, requireRole('icu', 'nursing', 'doctor'), requireTenantScope, e9PostScore);

router.post('/api/icu/scores', requireAuth, requireRole('icu', 'nursing', 'doctor'), requireTenantScope, e9PostScore);



router.get('/api/icu/scores/:admissionId', requireAuth, requireRole('icu', 'nursing', 'doctor'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = e9RequireTenant(req);

        const admissionId = e9IntId(req.params.admissionId);

        if (!admissionId) return res.status(422).json({ error: 'Valid admission_id is required' });

        const own = (await pool.query('SELECT id FROM admissions WHERE id=$1 AND tenant_id=$2', [admissionId, tenantId])).rows[0];

        if (!own) return res.status(404).json({ error: 'Admission not found' });

        const rows = (await pool.query(

            'SELECT * FROM icu_scores WHERE admission_id=$1 AND tenant_id=$2 ORDER BY created_at DESC',

            [admissionId, tenantId])).rows;

        res.json(rows);

    } catch (e) {

        if (e.e9Status) return res.status(e.e9Status).json({ error: e.message });

        res.status(500).json({ error: 'Server error' });

    }

});

router.post('/api/icu/scores', requireAuth, requireRole('icu', 'nursing', 'doctor'), requireTenantScope, e9PostScore);



router.get('/api/icu/scores/:admissionId', requireAuth, requireRole('icu', 'nursing', 'doctor'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = e9RequireTenant(req);

        const admissionId = e9IntId(req.params.admissionId);

        if (!admissionId) return res.status(422).json({ error: 'Valid admission_id is required' });

        const own = (await pool.query('SELECT id FROM admissions WHERE id=$1 AND tenant_id=$2', [admissionId, tenantId])).rows[0];

        if (!own) return res.status(404).json({ error: 'Admission not found' });

        const rows = (await pool.query(

            'SELECT * FROM icu_scores WHERE admission_id=$1 AND tenant_id=$2 ORDER BY created_at DESC',

            [admissionId, tenantId])).rows;

        res.json(rows);

    } catch (e) {

        if (e.e9Status) return res.status(e.e9Status).json({ error: e.message });

        res.status(500).json({ error: 'Server error' });

    }

});

router.get('/api/icu/scores/:admissionId', requireAuth, requireRole('icu', 'nursing', 'doctor'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = e9RequireTenant(req);

        const admissionId = e9IntId(req.params.admissionId);

        if (!admissionId) return res.status(422).json({ error: 'Valid admission_id is required' });

        const own = (await pool.query('SELECT id FROM admissions WHERE id=$1 AND tenant_id=$2', [admissionId, tenantId])).rows[0];

        if (!own) return res.status(404).json({ error: 'Admission not found' });

        const rows = (await pool.query(

            'SELECT * FROM icu_scores WHERE admission_id=$1 AND tenant_id=$2 ORDER BY created_at DESC',

            [admissionId, tenantId])).rows;

        res.json(rows);

    } catch (e) {

        if (e.e9Status) return res.status(e.e9Status).json({ error: e.message });

        res.status(500).json({ error: 'Server error' });

    }

});

router.post('/api/icu/fluid-balance', requireAuth, requireRole('icu', 'nursing', 'doctor'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId, facilityId } = e9RequireTenant(req);

        const adm = await e9LoadActiveIcuAdmission(req.body.admission_id, tenantId);

        const b = req.body;

        const ti = (parseInt(b.iv_fluids) || 0) + (parseInt(b.oral_intake) || 0) + (parseInt(b.blood_products) || 0) + (parseInt(b.medications_iv) || 0);

        const to = (parseInt(b.urine) || 0) + (parseInt(b.drains) || 0) + (parseInt(b.ngt_output) || 0) + (parseInt(b.stool) || 0) + (parseInt(b.vomit) || 0) + (parseInt(b.insensible) || 0);

        const r = await pool.query(

            `INSERT INTO icu_fluid_balance (admission_id,patient_id,balance_date,shift,iv_fluids,oral_intake,blood_products,medications_iv,total_intake,urine,drains,ngt_output,stool,vomit,insensible,total_output,net_balance,recorded_by,tenant_id,facility_id)

             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20) RETURNING *`,

            [adm.id, adm.patient_id, new Date().toISOString().split('T')[0], String(b.shift || 'Day'), parseInt(b.iv_fluids) || 0, parseInt(b.oral_intake) || 0, parseInt(b.blood_products) || 0, parseInt(b.medications_iv) || 0, ti, parseInt(b.urine) || 0, parseInt(b.drains) || 0, parseInt(b.ngt_output) || 0, parseInt(b.stool) || 0, parseInt(b.vomit) || 0, parseInt(b.insensible) || 0, to, ti - to, String(b.recorded_by || req.session.user?.display_name || ''), tenantId, facilityId || null]);

        logAudit(req.session.user?.id, req.session.user?.display_name, 'ICU_FLUID_BALANCE', 'ICU',

            `Fluid balance admission #${adm.id}: in ${ti} out ${to} net ${ti - to}`, req.ip);

        res.json(r.rows[0]);

    } catch (e) {

        if (e.e9Status) return res.status(e.e9Status).json({ error: e.message });

        res.status(500).json({ error: 'Server error' });

    }

});

router.get('/api/icu/fluid-balance/:admissionId', requireAuth, requireRole('icu', 'nursing', 'doctor'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = e9RequireTenant(req);

        const admissionId = e9IntId(req.params.admissionId);

        if (!admissionId) return res.status(422).json({ error: 'Valid admission_id is required' });

        const own = (await pool.query('SELECT id FROM admissions WHERE id=$1 AND tenant_id=$2', [admissionId, tenantId])).rows[0];

        if (!own) return res.status(404).json({ error: 'Admission not found' });

        const rows = (await pool.query(

            'SELECT * FROM icu_fluid_balance WHERE admission_id=$1 AND tenant_id=$2 ORDER BY created_at DESC',

            [admissionId, tenantId])).rows;

        res.json(rows);

    } catch (e) {

        if (e.e9Status) return res.status(e.e9Status).json({ error: e.message });

        res.status(500).json({ error: 'Server error' });

    }

});

router.get('/api/icu/board', requireAuth, requireRole('icu', 'nursing', 'doctor'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = e9RequireTenant(req);

        const patients = (await pool.query(

            `SELECT a.id AS admission_id, a.patient_id, a.patient_name, a.diagnosis, a.attending_doctor, a.admission_date,

                    b.bed_number, w.ward_name, w.ward_name_ar, w.ward_type

             FROM admissions a

             LEFT JOIN beds b ON a.bed_id = b.id AND b.tenant_id = $1

             JOIN wards w ON COALESCE(b.ward_id, a.ward_id) = w.id AND w.tenant_id = $1

             WHERE a.status='Active' AND a.tenant_id = $1 AND w.ward_type IN ('ICU','NICU','CCU')`,

            [tenantId])).rows;



        const board = [];

        for (const p of patients) {

            const score = (await pool.query(

                'SELECT sofa, gcs, apache_ii, score_date FROM icu_scores WHERE admission_id=$1 AND tenant_id=$2 ORDER BY created_at DESC LIMIT 1',

                [p.admission_id, tenantId])).rows[0] || null;

            const vent = (await pool.query(

                'SELECT vent_mode, fio2, peep FROM icu_ventilator WHERE admission_id=$1 AND tenant_id=$2 ORDER BY created_at DESC LIMIT 1',

                [p.admission_id, tenantId])).rows[0] || null;

            const sofa = score ? Number(score.sofa) || 0 : null;

            const apache = score ? Number(score.apache_ii) || 0 : null;

            const gcs = (score && score.gcs != null) ? Number(score.gcs) : null; // NULL gcs (unmeasured) stays null — Number(null)=0 would wrongly add (15-0)=15

            // Acuity sort key: highest SOFA first, then APACHE, then lowest GCS. No score => treat as

            // unknown (sorted after scored patients, NOT as low acuity).

            const acuity = (sofa !== null ? sofa : -1) * 1000 + (apache !== null ? apache : 0) + (gcs !== null ? (15 - gcs) : 0);

            board.push({

                admission_id: p.admission_id, patient_id: p.patient_id, patient_name: p.patient_name,

                diagnosis: p.diagnosis, attending_doctor: p.attending_doctor, admission_date: p.admission_date,

                bed_number: p.bed_number, ward_name: p.ward_name, ward_name_ar: p.ward_name_ar, ward_type: p.ward_type,

                latest_sofa: sofa, latest_apache: apache, latest_gcs: gcs,

                sofa_band: sofa === null ? null : icuScoring.sofaBand(sofa).band,

                on_ventilator: !!vent, vent_mode: vent ? vent.vent_mode : null,

                acuity

            });

        }

        // Sort descending by acuity (sickest first).

        board.sort((x, y) => y.acuity - x.acuity);

        res.json({ board, count: board.length });

    } catch (e) {

        if (e.e9Status) return res.status(e.e9Status).json({ error: e.message });

        res.status(500).json({ error: 'Server error' });

    }

});

router.post('/api/icu/daily-goals', requireAuth, requireRole('icu', 'doctor', 'nursing'), requireTenantScope, async (req, res) => {

    try {

        const {

            admission_id, patient_id, patient_name, goal_date,

            // Ventilator goals

            vent_goal_fio2, vent_goal_peep, vent_goal_tv, vent_wean_plan,

            // Sedation / Analgesia

            sedation_target_rass,   // Target RASS score (-2 to 0 typically)

            daily_sat,              // Daily Sedation Awakening Trial (SAT)

            daily_sbt,              // Daily Spontaneous Breathing Trial (SBT)

            pain_goal_nrs,          // Pain target (NRS)

            delirium_cam_icu,       // CAM-ICU assessment

            // DVT / VTE Prevention

            dvt_prophylaxis,        // هيبارين / ضغط ميكانيكي

            stress_ulcer_prophy,    // PPI / H2 blocker

            // Nutrition

            nutrition_route,        // PO / NG / TPN

            caloric_goal_kcal,

            protein_goal_g,

            // Infection / Lines

            line_necessity_reviewed, // هل مراجعة ضرورة الكاتيتر

            foley_necessity_reviewed,

            oral_care_done,         // VAP prevention

            hob_elevation,          // رأس السرير 30-45 درجة

            // Mobility

            mobility_goal,          // Sitting / Standing / Ambulate

            // Family

            family_update_done,

            // Daily goals text

            medical_goals, nursing_goals, goals_discussed_with_team,

            notes

        } = req.body;

        const { tenantId, facilityId } = getRequestTenantContext(req);

        if (!admission_id || !patient_id) return res.status(400).json({ error: 'admission_id and patient_id required' });

        // Verify admission belongs to tenant

        const admCheck = (await pool.query('SELECT id FROM admissions WHERE id=$1 AND tenant_id=$2', [admission_id, tenantId])).rows[0];

        if (!admCheck) return res.status(404).json({ error: 'Admission not found' });

        const today = goal_date || new Date().toISOString().slice(0,10);

        // Upsert: one record per admission per day

        const existing = (await pool.query(

            'SELECT id FROM icu_daily_goals WHERE admission_id=$1 AND goal_date=$2 AND tenant_id=$3',

            [admission_id, today, tenantId]

        )).rows[0];

        let result;

        if (existing) {

            result = await pool.query(

                `UPDATE icu_daily_goals SET

                 patient_name=$1, vent_goal_fio2=$2, vent_goal_peep=$3, vent_goal_tv=$4, vent_wean_plan=$5,

                 sedation_target_rass=$6, daily_sat=$7, daily_sbt=$8, pain_goal_nrs=$9, delirium_cam_icu=$10,

                 dvt_prophylaxis=$11, stress_ulcer_prophy=$12, nutrition_route=$13, caloric_goal_kcal=$14,

                 protein_goal_g=$15, line_necessity_reviewed=$16, foley_necessity_reviewed=$17,

                 oral_care_done=$18, hob_elevation=$19, mobility_goal=$20, family_update_done=$21,

                 medical_goals=$22, nursing_goals=$23, goals_discussed_with_team=$24, notes=$25,

                 updated_by=$26, updated_at=NOW()

                 WHERE id=$27 RETURNING id`,

                [patient_name||'', vent_goal_fio2||null, vent_goal_peep||null, vent_goal_tv||null, vent_wean_plan||'',

                 sedation_target_rass||null, daily_sat||false, daily_sbt||false, pain_goal_nrs||3, delirium_cam_icu||'',

                 dvt_prophylaxis||'', stress_ulcer_prophy||'', nutrition_route||'', caloric_goal_kcal||null,

                 protein_goal_g||null, line_necessity_reviewed||false, foley_necessity_reviewed||false,

                 oral_care_done||false, hob_elevation||true, mobility_goal||'', family_update_done||false,

                 medical_goals||'', nursing_goals||'', goals_discussed_with_team||false, notes||'',

                 req.session.user.name, existing.id]

            );

        } else {

            result = await pool.query(

                `INSERT INTO icu_daily_goals

                 (admission_id, patient_id, patient_name, goal_date,

                  vent_goal_fio2, vent_goal_peep, vent_goal_tv, vent_wean_plan,

                  sedation_target_rass, daily_sat, daily_sbt, pain_goal_nrs, delirium_cam_icu,

                  dvt_prophylaxis, stress_ulcer_prophy, nutrition_route, caloric_goal_kcal, protein_goal_g,

                  line_necessity_reviewed, foley_necessity_reviewed, oral_care_done, hob_elevation,

                  mobility_goal, family_update_done, medical_goals, nursing_goals,

                  goals_discussed_with_team, notes, created_by, tenant_id, facility_id)

                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31)

                 RETURNING id`,

                [admission_id, patient_id, patient_name||'', today,

                 vent_goal_fio2||null, vent_goal_peep||null, vent_goal_tv||null, vent_wean_plan||'',

                 sedation_target_rass||null, daily_sat||false, daily_sbt||false, pain_goal_nrs||3, delirium_cam_icu||'',

                 dvt_prophylaxis||'', stress_ulcer_prophy||'', nutrition_route||'', caloric_goal_kcal||null,

                 protein_goal_g||null, line_necessity_reviewed||false, foley_necessity_reviewed||false,

                 oral_care_done||false, hob_elevation||true, mobility_goal||'', family_update_done||false,

                 medical_goals||'', nursing_goals||'', goals_discussed_with_team||false, notes||'',

                 req.session.user.name, tenantId, facilityId||null]

            );

        }

        logAudit(req.session.user.id, req.session.user.name, 'ICU_DAILY_GOALS', 'ICU',

            `Daily goals ${existing?'updated':'created'} for admission #${admission_id} date ${today}`, req.ip);

        res.json({ id: result.rows[0].id, date: today, upserted: !!existing, success: true });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/icu/daily-goals/:admissionId', requireAuth, requireRole('icu', 'doctor', 'nursing'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const { date } = req.query;

        const admCheck = (await pool.query('SELECT id FROM admissions WHERE id=$1 AND tenant_id=$2', [req.params.admissionId, tenantId])).rows[0];

        if (!admCheck) return res.status(404).json({ error: 'Admission not found' });

        let q = 'SELECT * FROM icu_daily_goals WHERE admission_id=$1 AND tenant_id=$2';

        const params = [req.params.admissionId, tenantId];

        if (date) { q += ' AND goal_date=$3'; params.push(date); }

        q += ' ORDER BY goal_date DESC LIMIT 30';

        const records = (await pool.query(q, params)).rows;

        res.json(records);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/icu/prevention-bundles', requireAuth, requireRole('icu', 'doctor', 'nursing'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const { admission_id } = req.query;

        if (!admission_id) {

            return res.status(400).json({ error: 'admission_id is required' });

        }

        const result = await pool.query(

            'SELECT * FROM icu_prevention_bundles WHERE tenant_id = $1 AND admission_id = $2 ORDER BY audit_date DESC, bundle_type ASC',

            [tenantId, parseInt(admission_id)]

        );

        res.json(result.rows);

    } catch (e) {

        res.status(500).json({ error: 'Server error' });

    }

});

router.post('/api/icu/prevention-bundles', requireAuth, requireRole('icu', 'doctor', 'nursing'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId, facilityId } = getRequestTenantContext(req);

        const { admission_id, bundle_type, audit_date, checked_items, non_compliance_reason } = req.body;

        

        if (!admission_id) {

            return res.status(400).json({ error: 'admission_id is required' });

        }

        if (!bundle_type || !['VAP', 'CLABSI', 'CAUTI'].includes(bundle_type)) {

            return res.status(400).json({ error: 'Invalid or missing bundle_type. Must be VAP, CLABSI, or CAUTI' });

        }

        if (!audit_date) {

            return res.status(400).json({ error: 'audit_date is required' });

        }

        if (!checked_items || typeof checked_items !== 'object') {

            return res.status(400).json({ error: 'checked_items must be an object' });

        }

        

        // Define standard bundle checklist items

        const bundleKeys = {

            VAP: ['head_of_bed_elevation', 'sedation_interruption', 'pud_prophylaxis', 'dvt_prophylaxis', 'oral_care'],

            CLABSI: ['hand_hygiene', 'sterile_barrier', 'skin_antisepsis', 'site_selection', 'daily_review'],

            CAUTI: ['hand_hygiene', 'proper_indication', 'closed_drainage', 'unobstructed_flow', 'daily_review']

        };

        

        const keys = bundleKeys[bundle_type];

        let compliantCount = 0;

        keys.forEach(k => {

            if (checked_items[k] === true) compliantCount++;

        });

        

        const compliance_rate = parseFloat(((compliantCount / keys.length) * 100).toFixed(2));

        

        if (compliance_rate < 100.0 && (!non_compliance_reason || !non_compliance_reason.trim())) {

            return res.status(422).json({ error: 'non_compliance_reason is required when compliance rate is less than 100%' });

        }

        

        // Verify admission exists and belongs to the tenant

        const admissionCheck = await pool.query('SELECT 1 FROM admissions WHERE id = $1 AND tenant_id = $2', [parseInt(admission_id), tenantId]);

        if (admissionCheck.rowCount === 0) {

            return res.status(404).json({ error: 'Admission not found' });

        }

        

        // Upsert daily bundle

        const result = await pool.query(

            `INSERT INTO icu_prevention_bundles (tenant_id, facility_id, admission_id, bundle_type, audit_date, checked_items, compliance_rate, non_compliance_reason, recorded_by)

             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)

             ON CONFLICT (tenant_id, admission_id, bundle_type, audit_date)

             DO UPDATE SET checked_items = EXCLUDED.checked_items, compliance_rate = EXCLUDED.compliance_rate, non_compliance_reason = EXCLUDED.non_compliance_reason, recorded_by = EXCLUDED.recorded_by

             RETURNING *`,

            [tenantId, facilityId || null, parseInt(admission_id), bundle_type, audit_date, JSON.stringify(checked_items), compliance_rate, non_compliance_reason || null, req.session.user?.id || null]

        );

        

        logAudit(req.session.user?.id, req.session.user?.display_name || req.session.user?.name, 'ICU_PREVENTION_BUNDLE_RECORD', 'ICU', `Recorded ${bundle_type} bundle audit for admission #${admission_id} on ${audit_date}. Compliance: ${compliance_rate}%`, tenantId);

        

        res.status(201).json(result.rows[0]);

    } catch (e) {

        res.status(500).json({ error: 'Server error' });

    }

});


    return router;
}
