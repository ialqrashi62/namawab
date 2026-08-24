const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makePrescriptionsRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, cds, getPatientActiveMeds }) {
    const router = express.Router();
router.get('/api/prescriptions', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { patient_id } = req.query;

        const { tenantId } = getRequestTenantContext(req);

        if (patient_id) {

            if (tenantId) {

                const patientCheck = (await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [patient_id, tenantId])).rows[0];

                if (!patientCheck) return res.status(404).json({ error: 'Patient not found' });

            }

            const query = tenantId ?

                'SELECT * FROM prescriptions WHERE patient_id=$1 AND tenant_id=$2 ORDER BY id DESC' :

                'SELECT * FROM prescriptions WHERE patient_id=$1 ORDER BY id DESC';

            const params = tenantId ? [patient_id, tenantId] : [patient_id];

            res.json((await pool.query(query, params)).rows);

        } else {

            const query = tenantId ?

                'SELECT * FROM prescriptions WHERE tenant_id=$1 ORDER BY id DESC' :

                'SELECT * FROM prescriptions ORDER BY id DESC';

            const params = tenantId ? [tenantId] : [];

            res.json((await pool.query(query, params)).rows);

        }

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/prescriptions', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { patient_id, medication_name, dosage, quantity_per_day, frequency, duration, override_reason } = req.body;

        const { tenantId, facilityId } = getRequestTenantContext(req);

        let prescribedPatient = null;

        if (tenantId && patient_id) {

            const patientCheck = (await pool.query('SELECT id, allergies FROM patients WHERE id=$1 AND tenant_id=$2', [patient_id, tenantId])).rows[0];

            if (!patientCheck) return res.status(404).json({ error: 'Patient not found' });

            prescribedPatient = patientCheck;

        } else if (patient_id) {

            prescribedPatient = (await pool.query('SELECT id, allergies FROM patients WHERE id=$1', [patient_id])).rows[0] || null;

        }



        // E1 CDS GATE (clinical safety, FAIL-SAFE): allergy + dose + DRUG-DRUG INTERACTION checks

        // BEFORE writing. A CRITICAL alert HARD-STOPS with 422 unless override_reason is provided

        // (then the override is AUDITED). This ENHANCES (does not replace) the client

        // checkAllergyBeforePrescribe/checkDrugInteractions.

        let rxCdsAlerts = [];

        try {

            rxCdsAlerts = rxCdsAlerts

                .concat(cds.checkDrugAllergy(medication_name, prescribedPatient ? prescribedPatient.allergies : null))

                .concat(cds.checkDoseRange(medication_name, dosage, null));

        } catch (e) {

            // FAIL-SAFE: if the engine itself errors, surface a warning rather than silently passing.

            rxCdsAlerts.push({ rule: 'dose', severity: 'warning', message: 'CDS unavailable — verify manually',

                message_en: 'CDS unavailable — verify manually', message_ar: 'تعذّر تشغيل CDS — تأكد يدوياً', overridable: true, fail_safe: true });

        }

        // CRITICAL-1: server-side DRUG-DRUG interaction. The patient's CURRENT active medications are

        // queried SERVER-SIDE (never trusted from the client) from the pharmacy prescriptions queue

        // (not yet dispensed/cancelled) + active med-type orders, scoped to this patient + tenant.

        // The new drug is checked against that authoritative list. FAIL-SAFE: if the active-med

        // lookup fails we surface a warning (never silently skip the interaction check).

        if (patient_id && medication_name) {

            try {

                const activeMeds = await getPatientActiveMeds(patient_id, tenantId);

                const ddAlerts = cds.checkDrugDrugInteraction([medication_name].concat(activeMeds));

                rxCdsAlerts = rxCdsAlerts.concat(ddAlerts);

            } catch (e) {

                // FAIL-SAFE: cannot enumerate current meds => interaction check inconclusive => warn.

                rxCdsAlerts.push({ rule: 'drug-drug', severity: 'warning',

                    message: 'Active medications unavailable — interaction check inconclusive',

                    message_en: 'Active medications unavailable — interaction check inconclusive',

                    message_ar: 'تعذّر جلب الأدوية الفعالة — فحص التداخل غير حاسم', overridable: true, subjects: [], fail_safe: true });

            }

        }

        const rxDecision = cds.decide(rxCdsAlerts, override_reason);

        if (!rxDecision.allow) {

            logAudit(req.session.user?.id, req.session.user?.display_name, 'CDS_BLOCK', 'Pharmacy',

                `Blocked prescription for patient #${patient_id} (${medication_name}): ${rxCdsAlerts.filter(a => a.severity === 'critical').map(a => a.message_en || a.message).join('; ').slice(0, 200)}`, req.ip);

            return res.status(422).json({ error: 'CDS hard-stop', blocked: true, requires_override_reason: true, alerts: rxCdsAlerts });

        }

        const rxCriticals = rxCdsAlerts.filter(a => a.severity === 'critical');

        if (rxCriticals.length > 0 && rxDecision.reason) {

            logAudit(req.session.user?.id, req.session.user?.display_name, 'CDS_OVERRIDE', 'Pharmacy',

                `Override (CRITICAL) prescription patient #${patient_id} (${medication_name}). Reason: ${String(rxDecision.reason).slice(0, 160)}. Alerts: ${rxCriticals.map(a => a.message_en || a.message).join('; ').slice(0, 200)}`, req.ip);

        }

        const rxText = `${medication_name || ''} | ${dosage || ''}${quantity_per_day && quantity_per_day !== '1' ? ' (×' + quantity_per_day + ')' : ''} | ${frequency || ''} | ${duration || ''}`;

        // pharmacy_prescriptions_queue columns provisioned out-of-band (route_level_ddl_batch_c); no DDL in handler

        const r = await pool.query(

            `INSERT INTO pharmacy_prescriptions_queue (patient_id, doctor_id, prescription_text, medication_name, dosage, quantity_per_day, frequency, duration, status, tenant_id, branch_id)

             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Pending', $9, $10) RETURNING *`,

            [patient_id, req.session.user?.id || 0, rxText, medication_name || '', dosage || '', quantity_per_day || '1', frequency || '', duration || '', tenantId || null, facilityId || null]

        );

        

        // Also insert into legacy prescriptions table for backward compatibility

        try {

            await pool.query(

                'INSERT INTO prescriptions (patient_id, medication_id, dosage, duration, status, tenant_id, facility_id) VALUES ($1,0,$2,$3,$4,$5,$6)',

                [patient_id, `${medication_name || ''} ${dosage || ''} ${frequency || ''}`, duration || '', 'Pending', tenantId || null, facilityId || null]

            );

        } catch (dbErr) {

            console.error('[CDS] Failed to insert into legacy prescriptions table:', dbErr.message);

        }



        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_PRESCRIPTION', 'Pharmacy',

            `Created prescription for patient #${patient_id}: ${medication_name}`, req.ip);

        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_PRESCRIPTION_QUEUE', 'Pharmacy',

            `Sent prescription to queue for patient #${patient_id}: ${medication_name}`, req.ip);

        res.json(r.rows[0]);

    } catch (e) { console.error('[CDS POST Error]', e); res.status(500).json({ error: 'Server error' }); }

});


    return router;
}
