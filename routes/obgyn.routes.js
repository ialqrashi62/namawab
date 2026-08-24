const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeObgynRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, e14IntId, e14PatientInTenant, e14PregnancyInTenant, e14RequireTenant, OB_RBAC, obEngine, optionalReadFallback }) {
    const router = express.Router();
router.post('/api/obgyn/pregnancies', requireAuth, requireRole('patients', 'prescriptions'), async (req, res) => {

    try {

        // NOTE: this is the EFFECTIVE handler for POST /api/obgyn/pregnancies — a second,

        // richer registration exists further down (~14203) but Express routes to the FIRST

        // match, so it is shadowed/dead. To avoid silent data loss we accept BOTH payload

        // shapes here: the specialty (e1) UI sends lmp_date/edd_date/living; the OB-module UI

        // sends lmp (no _date) + living_children and expects a server-computed EDD. Previously

        // the OB-module payload stored NULL dates (it only reads lmp_date). We normalise the

        // aliases and compute EDD server-side (Naegele via ob_engine) when only LMP is given.

        const {

            patient_id, lmp_date, edd_date, lmp, gravida, para, abortions, living, living_children, gestational_weeks, notes

        } = req.body;

        const { tenantId, facilityId } = getRequestTenantContext(req);



        if (!patient_id) {

            return res.status(400).json({ error: 'Patient ID is required' });

        }



        const lmpVal = lmp_date || lmp || null;

        // EDD is a server-side authority value: prefer an explicit edd_date, else compute from

        // LMP (never trust a client-computed EDD when we can derive it). NULL if no LMP.

        const eddVal = edd_date || (lmpVal ? obEngine.computeEDD(lmpVal) : null);

        const livingVal = living !== undefined ? living : living_children;

        // Server-derive gestational weeks from LMP when the client did not send them.

        let gestWeeks = gestational_weeks === undefined ? null : parseInt(gestational_weeks);

        if (gestWeeks === null && lmpVal) {

            const ga = obEngine.gestationalAgeFromLMP(lmpVal);

            if (ga && Number.isInteger(ga.weeks)) gestWeeks = ga.weeks;

        }



        const result = await pool.query(

            `INSERT INTO obgyn_pregnancies

             (patient_id, doctor_id, lmp_date, edd_date, gravida, para, abortions, living, gestational_weeks, notes, tenant_id, facility_id)

             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id`,

            [

                patient_id,

                req.session.user?.id || null,

                lmpVal,

                eddVal,

                gravida === undefined ? 0 : parseInt(gravida),

                para === undefined ? 0 : parseInt(para),

                abortions === undefined ? 0 : parseInt(abortions),

                livingVal === undefined || livingVal === null ? 0 : parseInt(livingVal),

                gestWeeks,

                notes || '',

                tenantId || 1,

                facilityId || null

            ]

        );

        

        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_OBGYN_PREGNANCY', 'OBGYN',

            `Recorded pregnancy details for patient #${patient_id}`, req.ip);

            

        res.json({ id: result.rows[0].id, success: true });

    } catch (e) {

        console.error('[OBGYN Pregnancy Create Error]', e);

        res.status(500).json({ error: 'Server error' });

    }

});

router.get('/api/obgyn/pregnancies/patient/:patient_id', requireAuth, requireRole('patients', 'prescriptions'), async (req, res) => {

    try {

        const { patient_id } = req.params;

        const { tenantId } = getRequestTenantContext(req);

        const tenantCheck = tenantId ? ' AND tenant_id=$2' : '';

        const tenantParams = tenantId ? [patient_id, tenantId] : [patient_id];

        

        const result = await pool.query(

            `SELECT op.*, su.display_name as doctor_name 

             FROM obgyn_pregnancies op 

             LEFT JOIN system_users su ON op.doctor_id = su.id 

             WHERE op.patient_id=$1${tenantCheck} 

             ORDER BY op.id DESC`,

            tenantParams

        );

        

        res.json(result.rows);

    } catch (e) {

        console.error('[OBGYN Pregnancy Get Error]', e);

        res.status(500).json({ error: 'Server error' });

    }

});

router.get('/api/obgyn/pregnancies', requireAuth, requireRole(...OB_RBAC), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e14RequireTenant(req);

        if (tenantId === null) return res.status(403).json({ error: 'Tenant scope required' });

        const { patient_id, status } = req.query;

        let q = 'SELECT * FROM obgyn_pregnancies WHERE tenant_id=$1';

        const params = [tenantId];

        if (patient_id) { const pid = e14IntId(patient_id); if (pid === null) return res.status(400).json({ error: 'Invalid patient_id' }); params.push(pid); q += ' AND patient_id=$' + params.length; }

        if (status) { params.push(String(status)); q += ' AND status=$' + params.length; }

        q += ' ORDER BY created_at DESC';

        res.json((await pool.query(q, params)).rows);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/obgyn/pregnancies', requireAuth, requireRole(...OB_RBAC), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e14RequireTenant(req);

        if (tenantId === null) return res.status(403).json({ error: 'Tenant scope required' });

        const { patient_id, lmp, gravida, para, abortions, living_children,

            blood_group, rh_factor, risk_level, pre_pregnancy_weight, height,

            allergies, chronic_conditions, previous_cs, previous_complications,

            husband_name, husband_blood_group, attending_doctor } = req.body;



        // Cross-tenant guard: patient MUST belong to caller's tenant -> else 404

        const pid = await e14PatientInTenant(patient_id, tenantId);

        if (pid === null) return res.status(404).json({ error: 'Patient not found' });

        // resolve canonical patient name server-side (don't trust client display name)

        const patientRow = (await pool.query('SELECT COALESCE(name_ar, name_en, full_name, name, \'\') AS nm FROM patients WHERE id=$1 AND tenant_id=$2', [pid, tenantId])).rows[0];

        const patientName = patientRow ? patientRow.nm : '';



        // Anti-spoof: EDD via Naegele + GPAL validated/derived server-side.

        const edd = obEngine.computeEDD(lmp); // null if LMP invalid (stored as NULL — never guessed)

        const gpal = obEngine.computeGPAL({ gravida, para, abortion: abortions, living: living_children });

        if (!gpal.ok) return res.status(422).json({ error: 'Invalid obstetric history (GPAL): ' + gpal.error });



        const result = await pool.query(

            `INSERT INTO obgyn_pregnancies (tenant_id, patient_id, patient_name, lmp, edd, gravida, para, abortions, living_children,

             blood_group, rh_factor, risk_level, pre_pregnancy_weight, height, allergies, chronic_conditions,

             previous_cs, previous_complications, husband_name, husband_blood_group, attending_doctor, status, created_by)

             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23) RETURNING *`,

            [tenantId, pid, patientName, lmp || null, edd, gpal.gravida, gpal.para, gpal.abortion, gpal.living,

                blood_group || '', rh_factor || '', risk_level || 'Low', pre_pregnancy_weight || 0, height || 0,

                allergies || '', chronic_conditions || '', e14IntId(previous_cs) || 0, previous_complications || '',

                husband_name || '', husband_blood_group || '', attending_doctor || '', 'Active', req.session.user?.display_name || '']);

        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_PREGNANCY', 'OB/GYN',

            `Pregnancy for patient #${pid} (G${gpal.gravida}P${gpal.para}A${gpal.abortion}L${gpal.living}) LMP ${lmp || 'n/a'} EDD ${edd || 'n/a'}`, req.ip);

        res.json(result.rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.put('/api/obgyn/pregnancies/:id', requireAuth, requireRole(...OB_RBAC), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e14RequireTenant(req);

        if (tenantId === null) return res.status(403).json({ error: 'Tenant scope required' });

        const preg = await e14PregnancyInTenant(req.params.id, tenantId);

        if (!preg) return res.status(404).json({ error: 'Pregnancy not found' });



        // Whitelist updatable columns only — never accept id/tenant_id/patient_id/created_* /

        // authority fields (edd, living_children, status) from the client.

        const ALLOWED = new Set(['blood_group', 'rh_factor', 'risk_level', 'pre_pregnancy_weight', 'height',

            'allergies', 'chronic_conditions', 'previous_cs', 'previous_complications',

            'husband_name', 'husband_blood_group', 'attending_doctor']);

        const sets = [], params = [];

        for (const [k, v] of Object.entries(req.body || {})) {

            if (!ALLOWED.has(k)) continue;

            params.push(v); sets.push(k + '=$' + params.length);

        }

        // Recompute EDD only if a new LMP is supplied (authority field, server-derived).

        if (req.body && req.body.lmp) {

            const newEdd = obEngine.computeEDD(req.body.lmp);

            params.push(req.body.lmp); sets.push('lmp=$' + params.length);

            params.push(newEdd); sets.push('edd=$' + params.length);

        }

        // GPAL re-derivation when any component supplied.

        if (req.body && (req.body.gravida !== undefined || req.body.para !== undefined || req.body.abortions !== undefined || req.body.living_children !== undefined)) {

            const g = obEngine.computeGPAL({

                gravida: req.body.gravida ?? preg.gravida, para: req.body.para ?? preg.para,

                abortion: req.body.abortions ?? preg.abortions, living: req.body.living_children ?? preg.living_children

            });

            if (!g.ok) return res.status(422).json({ error: 'Invalid GPAL: ' + g.error });

            params.push(g.gravida); sets.push('gravida=$' + params.length);

            params.push(g.para); sets.push('para=$' + params.length);

            params.push(g.abortion); sets.push('abortions=$' + params.length);

            params.push(g.living); sets.push('living_children=$' + params.length);

        }

        if (!sets.length) return res.json(preg);

        params.push(preg.id); params.push(tenantId);

        await pool.query('UPDATE obgyn_pregnancies SET ' + sets.join(',') + ',updated_at=NOW() WHERE id=$' + (params.length - 1) + ' AND tenant_id=$' + params.length, params);

        logAudit(req.session.user?.id, req.session.user?.display_name, 'UPDATE_PREGNANCY', 'OB/GYN', `Pregnancy #${preg.id} updated`, req.ip);

        res.json((await pool.query('SELECT * FROM obgyn_pregnancies WHERE id=$1 AND tenant_id=$2', [preg.id, tenantId])).rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/obgyn/antenatal/:pregnancy_id', requireAuth, requireRole(...OB_RBAC), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e14RequireTenant(req);

        if (tenantId === null) return res.status(403).json({ error: 'Tenant scope required' });

        const preg = await e14PregnancyInTenant(req.params.pregnancy_id, tenantId);

        if (!preg) return res.status(404).json({ error: 'Pregnancy not found' });

        res.json((await pool.query('SELECT * FROM obgyn_antenatal_visits WHERE pregnancy_id=$1 AND tenant_id=$2 ORDER BY visit_number DESC', [preg.id, tenantId])).rows);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/obgyn/antenatal', requireAuth, requireRole(...OB_RBAC), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e14RequireTenant(req);

        if (tenantId === null) return res.status(403).json({ error: 'Tenant scope required' });

        const { pregnancy_id, gestational_age, weight, blood_pressure,

            systolic, diastolic, fundal_height, fetal_heart_rate, fetal_presentation,

            fetal_movement, edema, proteinuria, glucose_urine, hemoglobin,

            complaints, examination_notes, plan, next_visit } = req.body;

        // Ownership: pregnancy must belong to caller's tenant -> else 404

        const preg = await e14PregnancyInTenant(pregnancy_id, tenantId);

        if (!preg) return res.status(404).json({ error: 'Pregnancy not found' });

        const pid = preg.patient_id;



        const count = (await pool.query('SELECT COUNT(*) as cnt FROM obgyn_antenatal_visits WHERE pregnancy_id=$1 AND tenant_id=$2', [preg.id, tenantId])).rows[0].cnt;

        const firstVisit = (await pool.query('SELECT weight FROM obgyn_antenatal_visits WHERE pregnancy_id=$1 AND tenant_id=$2 ORDER BY visit_number LIMIT 1', [preg.id, tenantId])).rows[0];

        const wGain = firstVisit ? ((Number(weight) || 0) - (Number(firstVisit.weight) || 0)) : 0;

        // Server-derived GA label from stored LMP (anti-spoof; client value advisory only).

        const gaCalc = obEngine.gestationalAgeFromLMP(preg.lmp, next_visit || undefined);

        const gaLabel = gaCalc ? gaCalc.label : (gestational_age || '');

        // Server-side risk classification (client risk_flags ignored).

        const flags = obEngine.antenatalRiskFlags({ systolic, diastolic, proteinuria, hemoglobin, fetal_heart_rate, fetal_movement });



        const result = await pool.query(

            `INSERT INTO obgyn_antenatal_visits (tenant_id, pregnancy_id, patient_id, visit_number, gestational_age, weight, weight_gain,

             blood_pressure, systolic, diastolic, fundal_height, fetal_heart_rate, fetal_presentation,

             fetal_movement, edema, proteinuria, glucose_urine, hemoglobin, complaints, examination_notes,

             plan, next_visit, doctor, risk_flags) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24) RETURNING *`,

            [tenantId, preg.id, pid, parseInt(count) + 1, gaLabel, weight || 0, wGain,

                blood_pressure || '', e14IntId(systolic) || 0, e14IntId(diastolic) || 0, fundal_height || 0, e14IntId(fetal_heart_rate) || 0,

                fetal_presentation || '', fetal_movement || 'Active', edema || 'None', proteinuria || 'Negative',

                glucose_urine || 'Negative', hemoglobin || 0, complaints || '', examination_notes || '',

                plan || '', next_visit || null, req.session.user?.display_name || '', flags.join(', ')]);

        if (flags.length) {

            await pool.query('INSERT INTO notifications (target_role, title, message, type, module) VALUES ($1,$2,$3,$4,$5)',

                ['Doctor', 'OB/GYN Risk Alert', 'Patient #' + pid + ': ' + flags.join(', '), 'warning', 'OB/GYN']);

        }

        logAudit(req.session.user?.id, req.session.user?.display_name, 'ANTENATAL_VISIT', 'OB/GYN',

            `Antenatal visit pregnancy #${preg.id} GA ${gaLabel}${flags.length ? ' flags:' + flags.join('/') : ''}`, req.ip);

        res.json(result.rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/obgyn/partogram/:pregnancy_id', requireAuth, requireRole(...OB_RBAC), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e14RequireTenant(req);

        if (tenantId === null) return res.status(403).json({ error: 'Tenant scope required' });

        const preg = await e14PregnancyInTenant(req.params.pregnancy_id, tenantId);

        if (!preg) return res.status(404).json({ error: 'Pregnancy not found' });

        res.json((await pool.query('SELECT * FROM obgyn_partogram WHERE pregnancy_id=$1 AND tenant_id=$2 ORDER BY recorded_at ASC, id ASC', [preg.id, tenantId])).rows);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/obgyn/partogram', requireAuth, requireRole(...OB_RBAC), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e14RequireTenant(req);

        if (tenantId === null) return res.status(403).json({ error: 'Tenant scope required' });

        const b = req.body || {};

        const preg = await e14PregnancyInTenant(b.pregnancy_id, tenantId);

        if (!preg) return res.status(404).json({ error: 'Pregnancy not found' });

        // Server-side alert flags from this timepoint (anti-spoof).

        const flags = obEngine.antenatalRiskFlags({ fetal_heart_rate: b.fetal_heart_rate_baseline });

        const dil = e14IntId(b.cervical_dilation);

        if (dil !== null && (dil < 0 || dil > 10)) return res.status(422).json({ error: 'cervical_dilation must be 0-10' });

        const result = await pool.query(

            `INSERT INTO obgyn_partogram (tenant_id, pregnancy_id, patient_id, cervical_dilation, cervical_effacement,

             descent_station, contractions_per_10min, contraction_duration, contraction_intensity,

             fetal_heart_rate_baseline, fetal_heart_rate_variability, decelerations, molding, caput_succedaneum,

             meconium, amniotic_fluid, maternal_bp, maternal_hr, maternal_temp, oxytocin_units, notes, alert_flags, recorded_by, recorded_at)

             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23, NOW()) RETURNING *`,

            [tenantId, preg.id, preg.patient_id, dil || 0, e14IntId(b.cervical_effacement) || 0,

                e14IntId(b.descent_station) || 0, e14IntId(b.contractions_per_10min) || 0, e14IntId(b.contraction_duration) || 0, b.contraction_intensity || '',

                e14IntId(b.fetal_heart_rate_baseline) || 0, b.fetal_heart_rate_variability || '', b.decelerations || 'None', b.molding || 'None', b.caput_succedaneum || 'None',

                b.meconium ? 1 : 0, b.amniotic_fluid || '', b.maternal_bp || '', e14IntId(b.maternal_hr) || 0, b.maternal_temp || 0, b.oxytocin_units || 0, b.notes || '', flags.join(', '), req.session.user?.display_name || '']);

        logAudit(req.session.user?.id, req.session.user?.display_name, 'PARTOGRAM_ENTRY', 'OB/GYN',

            `Partogram pregnancy #${preg.id} dil ${dil || 0}cm FHR ${e14IntId(b.fetal_heart_rate_baseline) || 0}`, req.ip);

        res.json(result.rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/obgyn/ultrasounds/:pregnancy_id', requireAuth, requireRole(...OB_RBAC), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e14RequireTenant(req);

        if (tenantId === null) return res.status(403).json({ error: 'Tenant scope required' });

        const preg = await e14PregnancyInTenant(req.params.pregnancy_id, tenantId);

        if (!preg) return res.status(404).json({ error: 'Pregnancy not found' });

        res.json((await pool.query('SELECT * FROM obgyn_ultrasounds WHERE pregnancy_id=$1 AND tenant_id=$2 ORDER BY scan_date DESC, id DESC', [preg.id, tenantId])).rows);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/obgyn/ultrasounds', requireAuth, requireRole(...OB_RBAC), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e14RequireTenant(req);

        if (tenantId === null) return res.status(403).json({ error: 'Tenant scope required' });

        const b = req.body || {};

        const preg = await e14PregnancyInTenant(b.pregnancy_id, tenantId);

        if (!preg) return res.status(404).json({ error: 'Pregnancy not found' });

        // Server-derived GA from biometry + EFW percentile band (anti-spoof).

        const biometryGa = obEngine.gaFromBiometry({ bpd: b.bpd, hc: b.hc, ac: b.ac, fl: b.fl });

        const gaLabel = biometryGa.ok ? `${biometryGa.gaWeeks}+${biometryGa.gaDays} weeks` : (b.gestational_age || '');

        const pctl = obEngine.efwPercentileBand(biometryGa.ok ? biometryGa.gaWeeks : null, b.efw);

        const anomalies = [b.anomalies || '', pctl && pctl.flag ? pctl.flag : ''].filter(Boolean).join('; ');

        const result = await pool.query(

            `INSERT INTO obgyn_ultrasounds (tenant_id, pregnancy_id, patient_id, scan_type, gestational_age,

             bpd, hc, ac, fl, efw, efw_percentile, amniotic_fluid_index, placenta_location, placenta_grade,

             fetal_heart_rate, fetal_presentation, fetal_gender, number_of_fetuses, cervical_length,

             anomalies, findings, impression, performed_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23) RETURNING *`,

            [tenantId, preg.id, preg.patient_id, b.scan_type || 'Routine', gaLabel,

            b.bpd || 0, b.hc || 0, b.ac || 0, b.fl || 0, b.efw || 0, pctl ? pctl.band : '',

            b.amniotic_fluid_index || 0, b.placenta_location || '', b.placenta_grade || '', e14IntId(b.fetal_heart_rate) || 0,

            b.fetal_presentation || '', b.fetal_gender || 'Not determined', e14IntId(b.number_of_fetuses) || 1,

            b.cervical_length || 0, anomalies, b.findings || '', b.impression || '',

            req.session.user?.display_name || '']);

        logAudit(req.session.user?.id, req.session.user?.display_name, 'ULTRASOUND', 'OB/GYN',

            `US pregnancy #${preg.id} GA ${gaLabel}${pctl ? ' EFW ' + pctl.band : ''}`, req.ip);

        res.json(result.rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/obgyn/deliveries', requireAuth, requireRole(...OB_RBAC), requireTenantScope, async (req, res) => {

    const client = await pool.connect();

    try {

        const tenantId = e14RequireTenant(req);

        if (tenantId === null) { return res.status(403).json({ error: 'Tenant scope required' }); }

        const b = req.body || {};

        const pregId = e14IntId(b.pregnancy_id);

        if (pregId === null) { return res.status(400).json({ error: 'Invalid pregnancy_id' }); }



        // Bind tenant on this dedicated connection so RLS applies to the locking SELECT.

        await client.query("SELECT set_config('app.tenant_id', $1, true)", [String(tenantId)]);

        await client.query('BEGIN');

        // Lock the pregnancy row before flipping status (race-safe single-row lock).

        const pregRow = (await client.query('SELECT * FROM obgyn_pregnancies WHERE id=$1 AND tenant_id=$2 FOR UPDATE', [pregId, tenantId])).rows[0];

        if (!pregRow) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'Pregnancy not found' }); }

        // Server-side state machine: reject delivery on a non-Active pregnancy (409).

        const transition = obEngine.deliveryTransitionAllowed(pregRow.status);

        if (!transition.ok) { await client.query('ROLLBACK'); return res.status(409).json({ error: transition.error }); }



        // Anti-spoof APGAR: computed from components; fail-closed if incomplete provided.

        let apgar1 = 0, apgar5 = 0;

        if (b.apgar_1min_components) {

            const a1 = obEngine.computeAPGAR(b.apgar_1min_components);

            if (!a1.ok) { await client.query('ROLLBACK'); return res.status(422).json({ error: 'Incomplete APGAR (1 min): ' + (a1.missing || []).join(',') }); }

            apgar1 = a1.total;

        }

        if (b.apgar_5min_components) {

            const a5 = obEngine.computeAPGAR(b.apgar_5min_components);

            if (!a5.ok) { await client.query('ROLLBACK'); return res.status(422).json({ error: 'Incomplete APGAR (5 min): ' + (a5.missing || []).join(',') }); }

            apgar5 = a5.total;

        }



        const result = await client.query(

            `INSERT INTO obgyn_deliveries (tenant_id, pregnancy_id, patient_id, admission_id, delivery_date, gestational_age_at_delivery,

             delivery_type, delivery_method, indication_for_cs, anesthesia_type, labor_duration_hours,

             episiotomy, perineal_tear, blood_loss_ml, placenta_delivery, complications,

             attending_doctor, assisting_nurse, anesthetist, pediatrician, notes,

             apgar_1min, apgar_5min, baby_weight, baby_length, baby_head_circumference,

             baby_gender, baby_status, baby_anomalies, nicu_admission, nicu_reason, breastfeeding_initiated)

             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32) RETURNING *`,

            [tenantId, pregId, pregRow.patient_id, e14IntId(b.admission_id), b.delivery_date || new Date(), b.gestational_age_at_delivery || '',

            b.delivery_type || 'NVD', b.delivery_method || '', b.indication_for_cs || '', b.anesthesia_type || '',

            b.labor_duration_hours || 0, b.episiotomy ? 1 : 0, b.perineal_tear || 'None', e14IntId(b.blood_loss_ml) || 0,

            b.placenta_delivery || 'Complete', b.complications || '', b.attending_doctor || '',

            b.assisting_nurse || '', b.anesthetist || '', b.pediatrician || '', b.notes || '',

            apgar1, apgar5, e14IntId(b.baby_weight) || 0, b.baby_length || 0,

            b.baby_head_circumference || 0, b.baby_gender || '', b.baby_status || 'Alive',

            b.baby_anomalies || '', b.nicu_admission ? 1 : 0, b.nicu_reason || '', b.breastfeeding_initiated ? 1 : 0]);

        // Flip pregnancy status under the lock (state-machine commit).

        await client.query('UPDATE obgyn_pregnancies SET status=$1, delivery_date=$2, delivery_type=$3, outcome=$4, updated_at=NOW() WHERE id=$5 AND tenant_id=$6',

            ['Delivered', b.delivery_date || new Date(), b.delivery_type || 'NVD', b.baby_status || 'Alive', pregId, tenantId]);

        await client.query('COMMIT');

        logAudit(req.session.user?.id, req.session.user?.display_name, 'RECORD_DELIVERY', 'OB/GYN',

            `Delivery pregnancy #${pregId}: mode=${b.delivery_type || 'NVD'}, baby_wt=${e14IntId(b.baby_weight) || 0}g, APGAR 1'=${apgar1} 5'=${apgar5}`, req.ip);

        res.json(result.rows[0]);

    } catch (e) {

        try { await client.query('ROLLBACK'); } catch (_) { }

        res.status(500).json({ error: 'Server error' });

    } finally { client.release(); }

});

router.get('/api/obgyn/deliveries/:pregnancy_id', requireAuth, requireRole(...OB_RBAC), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e14RequireTenant(req);

        if (tenantId === null) return res.status(403).json({ error: 'Tenant scope required' });

        const preg = await e14PregnancyInTenant(req.params.pregnancy_id, tenantId);

        if (!preg) return res.status(404).json({ error: 'Pregnancy not found' });

        res.json((await pool.query('SELECT * FROM obgyn_deliveries WHERE pregnancy_id=$1 AND tenant_id=$2', [preg.id, tenantId])).rows);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/obgyn/neonatal/:delivery_id', requireAuth, requireRole(...OB_RBAC), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e14RequireTenant(req);

        if (tenantId === null) return res.status(403).json({ error: 'Tenant scope required' });

        const did = e14IntId(req.params.delivery_id);

        if (did === null) return res.status(400).json({ error: 'Invalid delivery_id' });

        const del = (await pool.query('SELECT id FROM obgyn_deliveries WHERE id=$1 AND tenant_id=$2', [did, tenantId])).rows[0];

        if (!del) return res.status(404).json({ error: 'Delivery not found' });

        res.json((await pool.query('SELECT * FROM obgyn_neonatal WHERE delivery_id=$1 AND tenant_id=$2 ORDER BY id', [did, tenantId])).rows);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/obgyn/neonatal', requireAuth, requireRole(...OB_RBAC), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e14RequireTenant(req);

        if (tenantId === null) return res.status(403).json({ error: 'Tenant scope required' });

        const b = req.body || {};

        const did = e14IntId(b.delivery_id);

        if (did === null) return res.status(400).json({ error: 'Invalid delivery_id' });

        // Ownership: delivery must belong to caller's tenant -> else 404

        const del = (await pool.query('SELECT id, patient_id FROM obgyn_deliveries WHERE id=$1 AND tenant_id=$2', [did, tenantId])).rows[0];

        if (!del) return res.status(404).json({ error: 'Delivery not found' });

        // Optional newborn patient must also be tenant-owned if provided.

        let babyPatientId = null;

        if (b.baby_patient_id !== undefined && b.baby_patient_id !== null && b.baby_patient_id !== '') {

            babyPatientId = await e14PatientInTenant(b.baby_patient_id, tenantId);

            if (babyPatientId === null) return res.status(404).json({ error: 'Newborn patient not found' });

        }

        // Anti-spoof APGAR: computed from components; fail-closed if incomplete.

        const a1 = obEngine.computeAPGAR(b.apgar_1min_components || {});

        const a5 = obEngine.computeAPGAR(b.apgar_5min_components || {});

        if (!a1.ok) return res.status(422).json({ error: 'Incomplete APGAR (1 min): ' + (a1.missing || []).join(',') });

        if (!a5.ok) return res.status(422).json({ error: 'Incomplete APGAR (5 min): ' + (a5.missing || []).join(',') });

        let apgar10 = 0;

        if (b.apgar_10min_components) {

            const a10 = obEngine.computeAPGAR(b.apgar_10min_components);

            if (!a10.ok) return res.status(422).json({ error: 'Incomplete APGAR (10 min): ' + (a10.missing || []).join(',') });

            apgar10 = a10.total;

        }

        const result = await pool.query(

            `INSERT INTO obgyn_neonatal (tenant_id, delivery_id, baby_patient_id, apgar_1min, apgar_5min, apgar_10min,

             birth_weight_grams, length_cm, head_circumference_cm, blood_group, coombs_test,

             resuscitation_needed, resuscitation_type, birth_injury, jaundice_onset, phototherapy_needed,

             hypoglycemia, hypothermia, congenital_abnormalities, feeding_type, feeding_established,

             discharge_destination, discharge_status, follow_up_plan, recorded_by)

             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25) RETURNING *`,

            [tenantId, did, babyPatientId, a1.total, a5.total, apgar10,

                e14IntId(b.birth_weight_grams) || 0, b.length_cm || 0, b.head_circumference_cm || 0, b.blood_group || '', b.coombs_test || 'Not Done',

                b.resuscitation_needed ? 1 : 0, b.resuscitation_type || '', b.birth_injury || '', b.jaundice_onset || '', b.phototherapy_needed ? 1 : 0,

                b.hypoglycemia ? 1 : 0, b.hypothermia ? 1 : 0, b.congenital_abnormalities || '', b.feeding_type || 'Breast', b.feeding_established ? 1 : 0,

                b.discharge_destination || 'Home', b.discharge_status || 'Healthy', b.follow_up_plan || '', req.session.user?.display_name || '']);

        logAudit(req.session.user?.id, req.session.user?.display_name, 'RECORD_NEONATAL', 'OB/GYN',

            `Neonatal delivery #${did}: APGAR 1'=${a1.total} 5'=${a5.total} wt=${e14IntId(b.birth_weight_grams) || 0}g resus=${b.resuscitation_needed ? 'Y' : 'N'}`, req.ip);

        res.json(result.rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/obgyn/nst', requireAuth, requireRole(...OB_RBAC), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e14RequireTenant(req);

        if (tenantId === null) return res.status(403).json({ error: 'Tenant scope required' });

        const b = req.body || {};

        const preg = await e14PregnancyInTenant(b.pregnancy_id, tenantId);

        if (!preg) return res.status(404).json({ error: 'Pregnancy not found' });

        const result = await pool.query(

            `INSERT INTO obgyn_nst (tenant_id, pregnancy_id, patient_id, duration_minutes, baseline_fhr, variability,

             accelerations, decelerations, contractions, result, interpretation, action_taken, performed_by)

             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,

            [tenantId, preg.id, preg.patient_id, b.duration_minutes || 20, e14IntId(b.baseline_fhr) || 0, b.variability || '',

            b.accelerations || 0, b.decelerations || 'None', b.contractions || 0, b.result || 'Reactive',

            b.interpretation || '', b.action_taken || '', req.session.user?.display_name || '']);

        if (b.result === 'Non-Reactive') {

            await pool.query('INSERT INTO notifications (target_role, title, message, type, module) VALUES ($1,$2,$3,$4,$5)',

                ['Doctor', 'Non-Reactive NST', 'Patient #' + preg.patient_id + ' - Non-reactive NST: ' + (b.interpretation || ''), 'danger', 'OB/GYN']);

        }

        logAudit(req.session.user?.id, req.session.user?.display_name, 'NST_ENTRY', 'OB/GYN',

            `NST pregnancy #${preg.id}: result=${b.result || 'Reactive'} fhr=${e14IntId(b.baseline_fhr) || 0} dur=${b.duration_minutes || 20}min`, req.ip);

        res.json(result.rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/obgyn/lab-panels', requireAuth, requireRole(...OB_RBAC), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e14RequireTenant(req);

        if (tenantId === null) return res.status(403).json({ error: 'Tenant scope required' });

        res.json((await pool.query('SELECT * FROM obgyn_lab_panels WHERE is_active=1 AND tenant_id=$1 ORDER BY id', [tenantId])).rows);

    } catch (e) { if (optionalReadFallback(res, e)) return; res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/obgyn/stats', requireAuth, requireRole(...OB_RBAC), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e14RequireTenant(req);

        if (tenantId === null) return res.status(403).json({ error: 'Tenant scope required' });



        // Schema for obgyn_pregnancies/obgyn_deliveries is provisioned out-of-band

        // (migrations/e14_ob_maternity_*.sql); no DDL in handler under restricted role.

        const params = [tenantId];

        const active = (await pool.query(`SELECT COUNT(*) as cnt FROM obgyn_pregnancies WHERE status='Active' AND tenant_id=$1`, params)).rows[0].cnt;

        const highRisk = (await pool.query(`SELECT COUNT(*) as cnt FROM obgyn_pregnancies WHERE status='Active' AND risk_level='High' AND tenant_id=$1`, params)).rows[0].cnt;

        const dueThisWeek = (await pool.query(`SELECT COUNT(*) as cnt FROM obgyn_pregnancies WHERE status='Active' AND edd BETWEEN CURRENT_DATE AND CURRENT_DATE + 7 AND tenant_id=$1`, params)).rows[0].cnt;

        const deliveredThisMonth = (await pool.query(`SELECT COUNT(*) as cnt FROM obgyn_deliveries WHERE delivery_date >= date_trunc('month', CURRENT_DATE) AND tenant_id=$1`, params)).rows[0].cnt;

        res.json({ activePregnancies: active, highRisk, dueThisWeek, deliveredThisMonth });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});


    return router;
}
