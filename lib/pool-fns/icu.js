// Extracted from server.js (behavior-preserving). Factory DI for pool-bound helpers.
const { e9RequireTenant } = require('../tenant-context');
module.exports = function makePoolFns({ pool, logAudit }) {
async function e9LoadActiveIcuAdmission(admissionId, tenantId) {
    const aid = e9IntId(admissionId);
    if (!aid) { const e = new Error('Valid admission_id is required'); e.e9Status = 422; throw e; }
    const row = (await pool.query(
        `SELECT a.id, a.patient_id, a.status, w.ward_type
         FROM admissions a
         LEFT JOIN beds b ON a.bed_id = b.id AND b.tenant_id = $2
         LEFT JOIN wards w ON COALESCE(b.ward_id, a.ward_id) = w.id AND w.tenant_id = $2
         WHERE a.id = $1 AND a.tenant_id = $2`,
        [aid, tenantId])).rows[0];
    if (!row) { const e = new Error('Admission not found'); e.e9Status = 404; throw e; }
    if (row.status !== 'Active') { const e = new Error(`Cannot record ICU data on a ${row.status} admission`); e.e9Status = 409; throw e; }
    if (!E9_ICU_WARD_TYPES.includes(row.ward_type)) {
        const e = new Error('Admission is not in an ICU/NICU/CCU ward'); e.e9Status = 409; throw e;
    }
    return row;
}

async function e9PostFlowsheet(req, res) {
    try {
        const { tenantId, facilityId } = e9RequireTenant(req);
        const adm = await e9LoadActiveIcuAdmission(req.body.admission_id, tenantId);
        const b = req.body;
        const num = v => { const n = Number(v); return Number.isFinite(n) ? n : 0; };
        const r = await pool.query(
            `INSERT INTO icu_monitoring (admission_id,patient_id,hr,sbp,dbp,map,rr,spo2,temp,etco2,cvp,fio2,peep,urine_output,notes,recorded_by,tenant_id,facility_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18) RETURNING *`,
            [adm.id, adm.patient_id, num(b.hr), num(b.sbp), num(b.dbp), num(b.map), num(b.rr), num(b.spo2), num(b.temp), num(b.etco2), num(b.cvp), num(b.fio2), num(b.peep), num(b.urine_output), String(b.notes || ''), String(b.recorded_by || req.session.user?.display_name || ''), tenantId, facilityId || null]);
        logAudit(req.session.user?.id, req.session.user?.display_name, 'ICU_FLOWSHEET', 'ICU',
            `Flowsheet row for admission #${adm.id} (patient #${adm.patient_id})`, req.ip);
        res.json(r.rows[0]);
    } catch (e) {
        if (e.e9Status) return res.status(e.e9Status).json({ error: e.message });
        res.status(500).json({ error: 'Server error' });
    }
}

async function e9PostScore(req, res) {
    try {
        const { tenantId, facilityId } = e9RequireTenant(req);
        const adm = await e9LoadActiveIcuAdmission(req.body.admission_id, tenantId);
        const b = req.body;

        // Server-authoritative scoring from raw observations (anti-spoof).
        const result = icuScoring.computeICUScores({
            vitals: b.vitals || {},
            gcs_eye: b.gcs_eye, gcs_verbal: b.gcs_verbal, gcs_motor: b.gcs_motor, gcs_total: b.gcs_total,
            pao2_fio2: b.pao2_fio2, pao2: b.pao2, fio2: b.fio2, ventilated: b.ventilated,
            platelets: b.platelets, bilirubin: b.bilirubin, creatinine: b.creatinine,
            urine_output_24h: b.urine_output_24h, urine_24h: b.urine_24h,
            map: b.map != null ? b.map : (b.vitals && b.vitals.map),
            dopamine: b.dopamine, dobutamine: b.dobutamine, epinephrine: b.epinephrine, norepinephrine: b.norepinephrine,
            temp: b.temp != null ? b.temp : (b.vitals && b.vitals.temp),
            hr: b.hr != null ? b.hr : (b.vitals && b.vitals.hr),
            rr: b.rr != null ? b.rr : (b.vitals && b.vitals.rr),
            spo2: b.spo2 != null ? b.spo2 : (b.vitals && b.vitals.spo2),
            age: b.age, chronic_health: b.chronic_health, immunocompromised: b.immunocompromised
        });

        // RASS / CAM-ICU / pain are observed nursing assessments (not derangement-derived) — accept
        // but clamp to safe ranges; Braden/Morse retained for backward compat (nursing scores).
        const clampInt = (v, lo, hi, dflt) => { const n = parseInt(v); return Number.isInteger(n) ? Math.max(lo, Math.min(hi, n)) : dflt; };
        const rass = clampInt(b.rass, -5, 4, 0);
        const cam = clampInt(b.cam_icu, 0, 1, 0);
        const braden = clampInt(b.braden, 6, 23, 23);
        const morse = clampInt(b.morse_fall, 0, 125, 0);
        const pain = clampInt(b.pain_score, 0, 10, 0);

        const r = await pool.query(
            `INSERT INTO icu_scores (admission_id,patient_id,score_date,apache_ii,sofa,gcs,rass,cam_icu,braden,morse_fall,pain_score,calculated_by,tenant_id,facility_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,
            [adm.id, adm.patient_id, new Date().toISOString().split('T')[0],
             result.apache, result.sofa, (result.gcs ?? null), rass, cam, braden, morse, pain,
             String(b.calculated_by || req.session.user?.display_name || ''), tenantId, facilityId || null]);
        logAudit(req.session.user?.id, req.session.user?.display_name, 'ICU_SCORE', 'ICU',
            `Acuity scored admission #${adm.id}: SOFA ${result.sofa} (${result.sofa_band}), GCS ${result.gcs}, APACHE ${result.apache} (${result.apache_band})`, req.ip);
        res.json({
            ...r.rows[0],
            sofa: result.sofa, sofa_band: result.sofa_band, sofa_mortality_risk: result.sofa_mortality_risk,
            gcs: result.gcs, gcs_band: result.gcs_band,
            apache: result.apache, apache_band: result.apache_band, apache_mortality_risk: result.apache_mortality_risk,
            complete: result.complete, components: result.components, missing: result.missing
        });
    } catch (e) {
        if (e.e9Status) return res.status(e.e9Status).json({ error: e.message });
        res.status(500).json({ error: 'Server error' });
    }
}
    return { e9LoadActiveIcuAdmission, e9PostFlowsheet, e9PostScore };
}
