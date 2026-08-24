const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeMarRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, cds, getPatientActiveMeds, isHighAlertMed, MAR_TIME_WINDOW_MIN, marNorm }) {
    const router = express.Router();
router.post('/api/mar/administer', requireAuth, requireRole('nursing', 'doctor'), requireTenantScope, async (req, res) => {

    const {

        prescription_ref, emar_order_id, patient_id,

        scanned_drug, scanned_dose, scanned_route, scanned_patient_id,

        scheduled_at, override_reason, witness_user_id, notes,

    } = req.body || {};

    const { tenantId, facilityId } = getRequestTenantContext(req);

    const uid = req.session.user?.id;

    const uname = req.session.user?.name || req.session.user?.display_name || '';

    // Null tenant => fail-closed (requireTenantScope already blocks in production; belt-and-braces here).

    if (!tenantId) return res.status(403).json({ error: 'Tenant scope required' });

    const reason = (override_reason == null) ? '' : String(override_reason).trim();

    const auditBlock = (action, detail) => logAudit(uid, uname, action, 'Nursing',

        `${detail} | tenant #${tenantId} by user #${uid}`, req.ip);



    try {

        // ----- Resolve the AUTHORITATIVE source row (drug/dose/route/patient) SERVER-SIDE -----

        // Prefer prescription_ref (pharmacy_prescriptions_queue); else an emar_orders row.

        let src = null;       // { patient_id, medication, dose, route }

        if (prescription_ref) {

            const r = (await pool.query(

                'SELECT id, patient_id, medication_name, dosage, frequency FROM pharmacy_prescriptions_queue WHERE id=$1 AND tenant_id=$2',

                [prescription_ref, tenantId])).rows[0];

            if (!r) return res.status(404).json({ error: 'Prescription not found' });

            // I1: pharmacy_prescriptions_queue has NO route column (no DDL allowed). Use route=null so the

            // Right-Route check below treats the scanned route as authoritative (no spurious override). The

            // emar_orders path (which HAS a route) keeps the hard Right-Route enforcement.

            src = { patient_id: r.patient_id, medication: r.medication_name, dose: r.dosage, route: null };

        } else if (emar_order_id) {

            const r = (await pool.query(

                'SELECT id, patient_id, medication, dose, route FROM emar_orders WHERE id=$1 AND tenant_id=$2',

                [emar_order_id, tenantId])).rows[0];

            if (!r) return res.status(404).json({ error: 'Order not found' });

            src = { patient_id: r.patient_id, medication: r.medication, dose: r.dose, route: r.route };

        } else {

            return res.status(422).json({ error: 'A prescription_ref or emar_order_id is required', blocked: true });

        }



        // ----- RIGHT PATIENT -----

        // The source row's patient must belong to this tenant.

        const pat = (await pool.query('SELECT id, allergies FROM patients WHERE id=$1 AND tenant_id=$2', [src.patient_id, tenantId])).rows[0];

        if (!pat) return res.status(404).json({ error: 'Patient not found' });

        // The submitted/scanned patient must MATCH the prescription's patient.

        const claimedPatient = (scanned_patient_id != null ? scanned_patient_id : patient_id);

        if (claimedPatient == null || Number(claimedPatient) !== Number(src.patient_id)) {

            auditBlock('MAR_WRONG_PATIENT', `Right-Patient FAIL: claimed #${claimedPatient} != prescribed #${src.patient_id}`);

            return res.status(422).json({ error: 'Right Patient failed: scanned patient does not match the prescription', right: 'patient', blocked: true });

        }



        // ----- RIGHT DRUG ----- (scanned barcode/name must match prescribed drug; never trust client string blindly)

        if (scanned_drug != null && marNorm(scanned_drug) && marNorm(scanned_drug) !== marNorm(src.medication)) {

            auditBlock('MAR_WRONG_DRUG', `Right-Drug FAIL: scanned "${scanned_drug}" != prescribed "${src.medication}" (patient #${src.patient_id})`);

            return res.status(422).json({ error: 'Right Drug failed: scanned drug does not match the prescription', right: 'drug', blocked: true });

        }



        // ----- RIGHT DOSE ----- (must equal prescribed dose unless override_reason supplied)

        if (scanned_dose != null && marNorm(scanned_dose) && marNorm(scanned_dose) !== marNorm(src.dose)) {

            if (!reason) {

                auditBlock('MAR_WRONG_DOSE', `Right-Dose FAIL: given "${scanned_dose}" != prescribed "${src.dose}" (patient #${src.patient_id})`);

                return res.status(422).json({ error: 'Right Dose failed: dose differs from prescription (override_reason required)', right: 'dose', requires_override_reason: true, blocked: true });

            }

            auditBlock('MAR_OVERRIDE_DOSE', `Dose override: given "${scanned_dose}" vs prescribed "${src.dose}". Reason: ${reason.slice(0, 160)}`);

        }



        // ----- RIGHT ROUTE ----- (must equal prescribed route unless override_reason)

        // I1: only enforce when the source route is a KNOWN non-null value (emar_orders path). For the

        // prescription path src.route is null (queue has no route column), so the scanned route is accepted

        // as authoritative and recorded — no spurious mismatch/override polluting the audit trail.

        if (src.route != null && scanned_route != null && marNorm(scanned_route) && marNorm(scanned_route) !== marNorm(src.route)) {

            if (!reason) {

                auditBlock('MAR_WRONG_ROUTE', `Right-Route FAIL: given "${scanned_route}" != prescribed "${src.route}" (patient #${src.patient_id})`);

                return res.status(422).json({ error: 'Right Route failed: route differs from prescription (override_reason required)', right: 'route', requires_override_reason: true, blocked: true });

            }

            auditBlock('MAR_OVERRIDE_ROUTE', `Route override: given "${scanned_route}" vs prescribed "${src.route}". Reason: ${reason.slice(0, 160)}`);

        }

        // I1: when the source route is unknown (prescription path), record the scanned route as authoritative.

        if (src.route == null && scanned_route != null && marNorm(scanned_route)) {

            src.route = String(scanned_route).trim();

        }



        // ----- RIGHT TIME ----- (scheduled_at vs SERVER clock within tolerance; outside => override_reason)

        if (scheduled_at) {

            const sched = new Date(scheduled_at);

            if (!isNaN(sched.getTime())) {

                const driftMin = Math.abs(Date.now() - sched.getTime()) / 60000;

                if (driftMin > MAR_TIME_WINDOW_MIN) {

                    if (!reason) {

                        auditBlock('MAR_WRONG_TIME', `Right-Time FAIL: ${driftMin.toFixed(0)}min outside ${MAR_TIME_WINDOW_MIN}min window (patient #${src.patient_id})`);

                        return res.status(422).json({ error: `Right Time failed: ${Math.round(driftMin)} min outside the ${MAR_TIME_WINDOW_MIN}-min window (override_reason required)`, right: 'time', requires_override_reason: true, blocked: true });

                    }

                    auditBlock('MAR_OVERRIDE_TIME', `Time override: ${driftMin.toFixed(0)}min out of window. Reason: ${reason.slice(0, 160)}`);

                }

            }

        }



        // ----- CDS AT ADMINISTRATION (fail-SAFE; never a silent OK) -----

        let cdsAlerts = [];

        try {

            cdsAlerts = cdsAlerts.concat(cds.checkDrugAllergy(src.medication, pat.allergies));

        } catch (e) {

            // I3: inability to VERIFY an allergy is a hard-stop (fail-safe), not a soft warning. severity:'critical'

            // makes cds.decide() block administration unless an override_reason is supplied (then it is audited).

            cdsAlerts.push({ rule: 'allergy', severity: 'critical', message: 'CDS allergy check unavailable — verify manually',

                message_en: 'CDS allergy check unavailable — verify manually', message_ar: 'تعذّر فحص الحساسية — تأكد يدوياً', overridable: true, fail_safe: true });

        }

        try {

            const activeMeds = await getPatientActiveMeds(src.patient_id, tenantId);

            const others = (activeMeds || []).filter(m => marNorm(m) !== marNorm(src.medication));

            cdsAlerts = cdsAlerts.concat(cds.checkDrugDrugInteraction([src.medication].concat(others)));

        } catch (e) {

            cdsAlerts.push({ rule: 'drug-drug', severity: 'warning', message: 'Active medications unavailable — interaction check inconclusive',

                message_en: 'Active medications unavailable — interaction check inconclusive', message_ar: 'تعذّر جلب الأدوية الفعالة — فحص التداخل غير حاسم', overridable: true, subjects: [], fail_safe: true });

        }

        const cdsDecision = cds.decide(cdsAlerts, reason);

        if (!cdsDecision.allow) {

            auditBlock('MAR_CDS_BLOCK', `CDS hard-stop at administration (patient #${src.patient_id}, ${src.medication}): ${cdsAlerts.filter(a => a.severity === 'critical').map(a => a.message_en || a.message).join('; ').slice(0, 200)}`);

            return res.status(422).json({ error: 'CDS hard-stop at administration', blocked: true, requires_override_reason: true, alerts: cdsAlerts });

        }

        const cdsCriticals = cdsAlerts.filter(a => a.severity === 'critical');

        if (cdsCriticals.length > 0 && cdsDecision.reason) {

            auditBlock('MAR_CDS_OVERRIDE', `CDS override at administration (patient #${src.patient_id}, ${src.medication}). Reason: ${String(cdsDecision.reason).slice(0, 160)}. Alerts: ${cdsCriticals.map(a => a.message_en || a.message).join('; ').slice(0, 200)}`);

        }



        // ----- WITNESS GATE (high-alert drug => DISTINCT, real, same-tenant second user) -----

        const highAlert = isHighAlertMed(src.medication);

        let witnessName = '';

        let witnessId = null;

        if (highAlert) {

            if (witness_user_id == null || String(witness_user_id).trim() === '') {

                auditBlock('MAR_WITNESS_REQUIRED', `High-alert "${src.medication}" without witness (patient #${src.patient_id})`);

                return res.status(422).json({ error: 'High-alert medication requires a second-nurse witness', high_alert: true, requires_witness: true, blocked: true });

            }

            // C1: compare as INTEGERS. A space-padded value like ' 5' is cast to int 5 by PostgreSQL, so a

            // string compare (`' 5' === '5'` => false) could let a nurse witness themselves. Parse both sides;

            // reject a non-numeric/NaN witness outright, and use the parsed int for the self-check AND the DB

            // lookup so a padded value cannot slip through.

            witnessId = parseInt(witness_user_id, 10);

            if (Number.isNaN(witnessId)) {

                auditBlock('MAR_WITNESS_REQUIRED', `High-alert "${src.medication}" witness id not a valid integer (patient #${src.patient_id})`);

                return res.status(422).json({ error: 'Witness id is invalid', high_alert: true, requires_witness: true, blocked: true });

            }

            if (witnessId === parseInt(uid, 10)) {

                auditBlock('MAR_WITNESS_REQUIRED', `High-alert "${src.medication}" witness == administering nurse (patient #${src.patient_id})`);

                return res.status(422).json({ error: 'Witness must be a different user from the administering nurse', high_alert: true, requires_witness: true, blocked: true });

            }

            // system_users has NO tenant_id column (global user table); tenant membership lives in

            // user_tenants(user_id, tenant_id, is_active). Verify the witness is a REAL, ACTIVE user

            // who is a member of THIS tenant (fail-closed: no membership row => reject).

            const w = (await pool.query(

                `SELECT su.id, su.display_name

                   FROM system_users su

                   JOIN user_tenants ut ON ut.user_id = su.id

                  WHERE su.id=$1 AND su.is_active=1 AND ut.tenant_id=$2 AND ut.is_active=true`,

                [witnessId, tenantId])).rows[0];

            if (!w) {

                auditBlock('MAR_WITNESS_REQUIRED', `High-alert "${src.medication}" witness #${witness_user_id} not a valid same-tenant active user (patient #${src.patient_id})`);

                return res.status(422).json({ error: 'Witness is not a valid active user in this tenant', high_alert: true, requires_witness: true, blocked: true });

            }

            witnessName = w.display_name || '';

        }



        // ----- RECORD (status FORCED server-side; explicit tenant_id stamped) -----

        const cdsSummary = cdsAlerts.map(a => a.message_en || a.message).filter(Boolean).join('; ').slice(0, 500);

        const result = await pool.query(

            `INSERT INTO mar_administrations

               (tenant_id, facility_id, patient_id, prescription_ref, medication, dose, route,

                scheduled_at, administered_at, administered_by, administered_by_name,

                witness_by, witness_by_name, status, override_reason, cds_warnings, notes)

             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,CURRENT_TIMESTAMP,$9,$10,$11,$12,'given',$13,$14,$15)

             RETURNING *`,

            [tenantId, facilityId || null, src.patient_id, prescription_ref || null,

             src.medication || '', src.dose || '', src.route || '',

             scheduled_at || null, uid || null, uname,

             highAlert ? witnessId : null, witnessName,

             reason, cdsSummary, notes || '']);



        logAudit(uid, uname, 'MAR_ADMINISTRATION', 'Nursing',

            `MAR administered: patient #${src.patient_id} ${src.medication} ${src.dose || ''} ${src.route || ''}${highAlert ? ` (high-alert, witness #${witnessId})` : ''}${reason ? ` [override: ${reason.slice(0, 80)}]` : ''} | tenant #${tenantId}`, req.ip);

        res.json({ success: true, administration: result.rows[0], cds_alerts: cdsAlerts });

    } catch (e) {

        res.status(500).json({ error: 'Server error' });

    }

});


    return router;
}
