const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeBloodBankRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, BB_NEAR_EXPIRY_DAYS, BB_VALID_COMPONENTS, bbCompat, e13RequireTenant, e13Respond }) {
    const router = express.Router();
router.get('/api/bloodbank/units', requireAuth, requireRole('bloodbank', 'lab', 'nursing', 'doctor'), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e13RequireTenant(req);

        const { status, blood_type, component } = req.query;

        const params = [tenantId];

        const conds = ['tenant_id = $1'];

        if (status) { params.push(String(status)); conds.push(`status = $${params.length}`); }

        if (blood_type) { params.push(String(blood_type)); conds.push(`blood_type = $${params.length}`); }

        if (component) { params.push(String(component)); conds.push(`component = $${params.length}`); }

        const q = `SELECT * FROM blood_bank_units WHERE ${conds.join(' AND ')} ORDER BY expiry_date ASC NULLS LAST, id DESC`;

        const rows = (await pool.query(q, params)).rows;

        // Annotate FEFO/expiry status (server-computed; client must not infer authority)

        const annotated = rows.map(u => {

            const days = bbCompat.daysUntilExpiry(u.expiry_date);

            return {

                ...u,

                days_until_expiry: days,

                is_expired: days !== null && days < 0,

                near_expiry: days !== null && days >= 0 && days <= BB_NEAR_EXPIRY_DAYS,

            };

        });

        res.json(annotated);

    } catch (e) { e13Respond(res, e); }

});

router.post('/api/bloodbank/units', requireAuth, requireRole('bloodbank', 'lab'), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e13RequireTenant(req);

        const { facilityId } = getRequestTenantContext(req);

        const { bag_number, blood_type, rh_factor, component, donor_id, collection_date, expiry_date, volume_ml, storage_location, notes } = req.body;

        const comp = BB_VALID_COMPONENTS.includes(component) ? component : 'Whole Blood';

        // Validate ABO is a real group (anti-garbage; status authority is server-side)

        const parsed = bbCompat.parseBloodType(blood_type, rh_factor);

        if (!parsed.abo || !parsed.rh) {

            return res.status(422).json({ error: 'Invalid blood type / Rh' });

        }

        let donorParam = null;

        if (donor_id !== undefined && donor_id !== null && String(donor_id).trim() !== '') {

            const d = Number(donor_id);

            if (!Number.isInteger(d) || d <= 0) return res.status(422).json({ error: 'Invalid donor id' });

            // donor must belong to this tenant (IDOR guard)

            const dRow = (await pool.query('SELECT id FROM blood_bank_donors WHERE id=$1 AND tenant_id=$2', [d, tenantId])).rows[0];

            if (!dRow) return res.status(404).json({ error: 'Donor not found' });

            donorParam = d;

        }

        const result = await pool.query(

            `INSERT INTO blood_bank_units (tenant_id, facility_id, bag_number, blood_type, rh_factor, component, donor_id, collection_date, expiry_date, volume_ml, status, storage_location, notes, created_by)

             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'Available',$11,$12,$13) RETURNING id`,

            [tenantId, facilityId || null, bag_number || '', parsed.abo, parsed.rh, comp, donorParam, collection_date || '', expiry_date || '', Number(volume_ml) || 450, storage_location || '', notes || '', req.session.user?.id || null]);

        logAudit(req.session.user?.id, req.session.user?.display_name || req.session.user?.name, 'CREATE_UNIT', 'BloodBank', `Created unit ${bag_number || ''} ${parsed.abo}${parsed.rh} ${comp}`, req.ip);

        const row = (await pool.query('SELECT * FROM blood_bank_units WHERE id=$1 AND tenant_id=$2', [result.rows[0].id, tenantId])).rows[0];

        res.json(row);

    } catch (e) { e13Respond(res, e); }

});

router.put('/api/bloodbank/units/:id/discard', requireAuth, requireRole('bloodbank', 'lab'), requireTenantScope, async (req, res) => {

    const client = await pool.connect();

    try {

        const tenantId = e13RequireTenant(req);

        const unitId = Number(req.params.id);

        if (!Number.isInteger(unitId) || unitId <= 0) { client.release(); return res.status(422).json({ error: 'Invalid unit id' }); }

        await client.query('BEGIN');

        const u = (await client.query('SELECT id, status, bag_number FROM blood_bank_units WHERE id=$1 AND tenant_id=$2 FOR UPDATE', [unitId, tenantId])).rows[0];

        if (!u) { await client.query('ROLLBACK'); client.release(); return res.status(404).json({ error: 'Unit not found' }); }

        if (u.status === 'Transfused' || u.status === 'Issued') {

            await client.query('ROLLBACK'); client.release();

            return res.status(409).json({ error: `Cannot discard a unit in status ${u.status}` });

        }

        await client.query("UPDATE blood_bank_units SET status='Discarded', updated_at=CURRENT_TIMESTAMP WHERE id=$1 AND tenant_id=$2", [unitId, tenantId]);

        await client.query('COMMIT');

        client.release();

        logAudit(req.session.user?.id, req.session.user?.display_name || req.session.user?.name, 'DISCARD_UNIT', 'BloodBank', `Discarded unit #${unitId} (${u.bag_number || ''})`, req.ip);

        res.json({ success: true });

    } catch (e) {

        try { await client.query('ROLLBACK'); } catch (_) {}

        client.release();

        e13Respond(res, e);

    }

});

router.get('/api/bloodbank/crossmatch', requireAuth, requireRole('bloodbank', 'lab', 'doctor', 'nursing'), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e13RequireTenant(req);

        const { patient_id } = req.query;

        if (patient_id) {

            const pid = Number(patient_id);

            if (!Number.isInteger(pid) || pid <= 0) return res.status(422).json({ error: 'Invalid patient id' });

            const rows = (await pool.query('SELECT * FROM blood_bank_crossmatch WHERE patient_id=$1 AND tenant_id=$2 ORDER BY id DESC', [pid, tenantId])).rows;

            return res.json(rows);

        }

        const rows = (await pool.query('SELECT * FROM blood_bank_crossmatch WHERE tenant_id=$1 ORDER BY id DESC', [tenantId])).rows;

        res.json(rows);

    } catch (e) { e13Respond(res, e); }

});

router.post('/api/bloodbank/crossmatch', requireAuth, requireRole('bloodbank', 'lab', 'doctor'), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e13RequireTenant(req);

        const { patient_id, units_needed, unit_id, surgery_id, notes } = req.body;

        const pid = Number(patient_id);

        if (!Number.isInteger(pid) || pid <= 0) return res.status(422).json({ error: 'Invalid patient id' });



        // Patient must belong to this tenant; ABO/Rh is server-authoritative (anti-spoof).

        const patient = (await pool.query('SELECT id, name_ar, name_en, blood_type FROM patients WHERE id=$1 AND tenant_id=$2', [pid, tenantId])).rows[0];

        if (!patient) return res.status(404).json({ error: 'Patient not found' });

        const patientName = patient.name_en || patient.name_ar || '';

        const recipient = bbCompat.parseBloodType(patient.blood_type);

        if (!recipient.abo || !recipient.rh) {

            // Incomplete recipient typing must block — never falsely reassure (E6).

            return res.status(422).json({ error: 'Patient blood type not established; crossmatch blocked', reason: 'INCOMPLETE_RECIPIENT_TYPE' });

        }



        let resolvedUnit = null;

        let compat = null;

        if (unit_id !== undefined && unit_id !== null && String(unit_id).trim() !== '') {

            const uid = Number(unit_id);

            if (!Number.isInteger(uid) || uid <= 0) return res.status(422).json({ error: 'Invalid unit id' });

            resolvedUnit = (await pool.query('SELECT id, blood_type, rh_factor, component, status FROM blood_bank_units WHERE id=$1 AND tenant_id=$2', [uid, tenantId])).rows[0];

            if (!resolvedUnit) return res.status(404).json({ error: 'Unit not found' });

            compat = bbCompat.isABORhCompatible(patient.blood_type, null, resolvedUnit.blood_type, resolvedUnit.rh_factor, resolvedUnit.component);

            if (!compat.compatible) {

                // FAIL-CLOSED: incompatible crossmatch is rejected and never stored Compatible.

                logAudit(req.session.user?.id, req.session.user?.display_name || req.session.user?.name, 'CROSSMATCH_BLOCKED', 'BloodBank', `Blocked incompatible crossmatch patient #${pid} (${recipient.abo}${recipient.rh}) vs unit #${uid}: ${compat.reason}`, req.ip);

                return res.status(422).json({ error: 'ABO/Rh incompatible — crossmatch blocked', reason: compat.reason, compatible: false });

            }

        }



        // result is SERVER-computed: Compatible only when a unit was validated; otherwise Pending.

        const serverResult = resolvedUnit ? 'Compatible' : 'Pending';

        const patientBloodType = recipient.abo + recipient.rh;

        const result = await pool.query(

            `INSERT INTO blood_bank_crossmatch (tenant_id, patient_id, patient_name, patient_blood_type, units_needed, unit_id, lab_technician, result, surgery_id, notes, created_by)

             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id`,

            [tenantId, pid, patientName, patientBloodType, Number(units_needed) || 1, resolvedUnit ? resolvedUnit.id : null, req.session.user?.display_name || req.session.user?.name || '', serverResult, Number(surgery_id) || null, notes || '', req.session.user?.id || null]);

        logAudit(req.session.user?.id, req.session.user?.display_name || req.session.user?.name, 'CREATE_CROSSMATCH', 'BloodBank', `Crossmatch patient #${pid} result=${serverResult}${resolvedUnit ? ' unit #' + resolvedUnit.id : ''}`, req.ip);

        const row = (await pool.query('SELECT * FROM blood_bank_crossmatch WHERE id=$1 AND tenant_id=$2', [result.rows[0].id, tenantId])).rows[0];

        // On success: omit `compatible:false`. When a unit was validated it is compatible (incompatible already returned 422 above);

        // pending crossmatches (no unit) carry no compatibility verdict yet.

        res.json(resolvedUnit ? { ...row, compatible: true, compatibility: compat } : { ...row });

    } catch (e) { e13Respond(res, e); }

});

router.put('/api/bloodbank/crossmatch/:id/validate', requireAuth, requireRole('bloodbank', 'lab'), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e13RequireTenant(req);

        const cmId = Number(req.params.id);

        if (!Number.isInteger(cmId) || cmId <= 0) return res.status(422).json({ error: 'Invalid crossmatch id' });

        const { unit_id } = req.body;

        const uid = Number(unit_id);

        if (!Number.isInteger(uid) || uid <= 0) return res.status(422).json({ error: 'Invalid unit id' });



        const cm = (await pool.query('SELECT * FROM blood_bank_crossmatch WHERE id=$1 AND tenant_id=$2', [cmId, tenantId])).rows[0];

        if (!cm) return res.status(404).json({ error: 'Crossmatch not found' });

        const patient = (await pool.query('SELECT id, blood_type FROM patients WHERE id=$1 AND tenant_id=$2', [cm.patient_id, tenantId])).rows[0];

        if (!patient) return res.status(404).json({ error: 'Patient not found' });

        const unit = (await pool.query('SELECT id, blood_type, rh_factor, component FROM blood_bank_units WHERE id=$1 AND tenant_id=$2', [uid, tenantId])).rows[0];

        if (!unit) return res.status(404).json({ error: 'Unit not found' });



        const compat = bbCompat.isABORhCompatible(patient.blood_type, null, unit.blood_type, unit.rh_factor, unit.component);

        if (!compat.compatible) {

            await pool.query("UPDATE blood_bank_crossmatch SET result='Incompatible', unit_id=$1, updated_at=CURRENT_TIMESTAMP WHERE id=$2 AND tenant_id=$3", [uid, cmId, tenantId]);

            logAudit(req.session.user?.id, req.session.user?.display_name || req.session.user?.name, 'CROSSMATCH_INCOMPATIBLE', 'BloodBank', `Crossmatch #${cmId} marked Incompatible: ${compat.reason}`, req.ip);

            return res.status(422).json({ error: 'ABO/Rh incompatible', reason: compat.reason, compatible: false });

        }

        await pool.query("UPDATE blood_bank_crossmatch SET result='Compatible', unit_id=$1, updated_at=CURRENT_TIMESTAMP WHERE id=$2 AND tenant_id=$3", [uid, cmId, tenantId]);

        logAudit(req.session.user?.id, req.session.user?.display_name || req.session.user?.name, 'CROSSMATCH_COMPATIBLE', 'BloodBank', `Crossmatch #${cmId} validated Compatible vs unit #${uid}`, req.ip);

        res.json({ success: true, compatible: true, compatibility: compat });

    } catch (e) { e13Respond(res, e); }

});

router.get('/api/bloodbank/transfusions', requireAuth, requireRole('bloodbank', 'lab', 'nursing', 'doctor'), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e13RequireTenant(req);

        const rows = (await pool.query('SELECT * FROM blood_bank_transfusions WHERE tenant_id=$1 ORDER BY id DESC', [tenantId])).rows;

        res.json(rows);

    } catch (e) { e13Respond(res, e); }

});

router.post('/api/bloodbank/transfuse', requireAuth, requireRole('bloodbank', 'nursing', 'doctor'), requireTenantScope, async (req, res) => {

    const client = await pool.connect();

    try {

        const tenantId = e13RequireTenant(req);

        const { facilityId } = getRequestTenantContext(req);

        const { patient_id, unit_id, volume_ml, start_time, notes, crossmatch_id } = req.body;

        const pid = Number(patient_id);

        const uid = Number(unit_id);

        if (!Number.isInteger(pid) || pid <= 0) { client.release(); return res.status(422).json({ error: 'Invalid patient id' }); }

        if (!Number.isInteger(uid) || uid <= 0) { client.release(); return res.status(422).json({ error: 'Invalid unit id' }); }



        await client.query('BEGIN');



        // Patient ownership + server-authoritative ABO/Rh

        const patient = (await client.query('SELECT id, name_ar, name_en, blood_type FROM patients WHERE id=$1 AND tenant_id=$2', [pid, tenantId])).rows[0];

        if (!patient) { await client.query('ROLLBACK'); client.release(); return res.status(404).json({ error: 'Patient not found' }); }



        // Lock the unit row before any status decision (race-safe; no double-issue).

        const unit = (await client.query('SELECT * FROM blood_bank_units WHERE id=$1 AND tenant_id=$2 FOR UPDATE', [uid, tenantId])).rows[0];

        if (!unit) { await client.query('ROLLBACK'); client.release(); return res.status(404).json({ error: 'Unit not found' }); }



        // Expiry + status gate (FEFO; expired never issuable; reserved/used -> 409)

        const issuable = bbCompat.isUnitIssuable(unit);

        if (!issuable.issuable) {

            await client.query('ROLLBACK'); client.release();

            const code = issuable.reason === 'UNIT_EXPIRED' ? 422 : 409;

            logAudit(req.session.user?.id, req.session.user?.display_name || req.session.user?.name, 'TRANSFUSE_BLOCKED', 'BloodBank', `Blocked transfuse unit #${uid} -> patient #${pid}: ${issuable.reason}`, req.ip);

            return res.status(code).json({ error: 'Unit not issuable', reason: issuable.reason });

        }



        // ABO/Rh compatibility under the lock — fail-closed 422.

        const compat = bbCompat.isABORhCompatible(patient.blood_type, null, unit.blood_type, unit.rh_factor, unit.component);

        if (!compat.compatible) {

            await client.query('ROLLBACK'); client.release();

            logAudit(req.session.user?.id, req.session.user?.display_name || req.session.user?.name, 'TRANSFUSE_BLOCKED', 'BloodBank', `Blocked incompatible transfuse unit #${uid} -> patient #${pid}: ${compat.reason}`, req.ip);

            return res.status(422).json({ error: 'ABO/Rh incompatible — transfusion blocked', reason: compat.reason, compatible: false });

        }



        // Optional crossmatch linkage must belong to tenant + this patient + be Compatible.

        // F2-FIX: added AND result='Compatible' — a Pending or Incompatible crossmatch

        //         must NOT be used to authorise a transfusion.

        let cmId = null;

        if (crossmatch_id !== undefined && crossmatch_id !== null && String(crossmatch_id).trim() !== '') {

            const c = Number(crossmatch_id);

            if (!Number.isInteger(c) || c <= 0) { await client.query('ROLLBACK'); client.release(); return res.status(422).json({ error: 'Invalid crossmatch id' }); }

            const cmRow = (await client.query("SELECT id, result FROM blood_bank_crossmatch WHERE id=$1 AND tenant_id=$2 AND patient_id=$3", [c, tenantId, pid])).rows[0];

            if (!cmRow) { await client.query('ROLLBACK'); client.release(); return res.status(404).json({ error: 'Crossmatch not found for patient' }); }

            if (cmRow.result !== 'Compatible') { await client.query('ROLLBACK'); client.release(); return res.status(409).json({ error: 'Crossmatch not in Compatible status', result: cmRow.result }); }

            cmId = c;

        }



        // Atomic status flip: Available -> Transfused (guard status in WHERE to defeat any TOCTOU).

        const upd = await client.query("UPDATE blood_bank_units SET status='Transfused', updated_at=CURRENT_TIMESTAMP WHERE id=$1 AND tenant_id=$2 AND status='Available'", [uid, tenantId]);

        if (upd.rowCount !== 1) { await client.query('ROLLBACK'); client.release(); return res.status(409).json({ error: 'Unit already issued (concurrent)' }); }



        const patientName = patient.name_en || patient.name_ar || '';

        const ins = await client.query(

            `INSERT INTO blood_bank_transfusions (tenant_id, facility_id, patient_id, patient_name, unit_id, crossmatch_id, bag_number, blood_type, component, administered_by, start_time, volume_ml, notes, created_by)

             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING id`,

            [tenantId, facilityId || null, pid, patientName, uid, cmId, unit.bag_number || '', (unit.blood_type || '') + (unit.rh_factor || ''), unit.component || '', req.session.user?.display_name || req.session.user?.name || '', start_time || new Date().toISOString(), Number(volume_ml) || unit.volume_ml || 0, notes || '', req.session.user?.id || null]);



        await client.query('COMMIT');

        client.release();

        logAudit(req.session.user?.id, req.session.user?.display_name || req.session.user?.name, 'TRANSFUSE_UNIT', 'BloodBank', `Transfused unit #${uid} (${unit.bag_number || ''}) -> patient #${pid}`, req.ip);

        const row = (await pool.query('SELECT * FROM blood_bank_transfusions WHERE id=$1 AND tenant_id=$2', [ins.rows[0].id, tenantId])).rows[0];

        res.json({ ...row, compatible: true });

    } catch (e) {

        try { await client.query('ROLLBACK'); } catch (_) {}

        client.release();

        e13Respond(res, e);

    }

});

router.post('/api/bloodbank/transfusions/:id/reaction', requireAuth, requireRole('bloodbank', 'nursing', 'doctor'), requireTenantScope, async (req, res) => {

    const client = await pool.connect();

    try {

        const tenantId = e13RequireTenant(req);

        const txId = Number(req.params.id);

        if (!Number.isInteger(txId) || txId <= 0) { client.release(); return res.status(422).json({ error: 'Invalid transfusion id' }); }

        // Lock the transfusion row so concurrent reaction reports are serialised.

        await client.query('BEGIN');

        const tx = (await client.query('SELECT id, unit_id, patient_id FROM blood_bank_transfusions WHERE id=$1 AND tenant_id=$2 FOR UPDATE', [txId, tenantId])).rows[0];

        if (!tx) { await client.query('ROLLBACK'); client.release(); return res.status(404).json({ error: 'Transfusion not found' }); }

        const { reaction_type, severity, reaction_details, vital_signs_after, action_taken } = req.body;

        const sev = ['Mild', 'Moderate', 'Severe', 'Fatal'].includes(severity) ? severity : 'Mild';

        const ins = await client.query(

            `INSERT INTO blood_bank_transfusion_reactions (tenant_id, transfusion_id, unit_id, patient_id, reaction_type, severity, reaction_details, vital_signs_after, action_taken, reported_by, created_by)

             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id`,

            [tenantId, txId, tx.unit_id, tx.patient_id, reaction_type || '', sev, reaction_details || '', vital_signs_after || '', action_taken || '', req.session.user?.display_name || req.session.user?.name || '', req.session.user?.id || null]);

        await client.query('UPDATE blood_bank_transfusions SET adverse_reaction=1, reaction_details=$1, updated_at=CURRENT_TIMESTAMP WHERE id=$2 AND tenant_id=$3', [reaction_details || sev, txId, tenantId]);

        await client.query('COMMIT');

        client.release();

        logAudit(req.session.user?.id, req.session.user?.display_name || req.session.user?.name, 'TRANSFUSION_REACTION', 'BloodBank', `Reaction (${sev}) reported on transfusion #${txId} unit #${tx.unit_id}`, req.ip);

        res.json({ success: true, reaction_id: ins.rows[0].id, unit_id: tx.unit_id });

    } catch (e) {

        try { await client.query('ROLLBACK'); } catch (_) {}

        client.release();

        e13Respond(res, e);

    }

});

router.get('/api/bloodbank/units/:id/lookback', requireAuth, requireRole('bloodbank', 'lab', 'doctor'), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e13RequireTenant(req);

        const uid = Number(req.params.id);

        if (!Number.isInteger(uid) || uid <= 0) return res.status(422).json({ error: 'Invalid unit id' });

        const unit = (await pool.query('SELECT * FROM blood_bank_units WHERE id=$1 AND tenant_id=$2', [uid, tenantId])).rows[0];

        if (!unit) return res.status(404).json({ error: 'Unit not found' });

        // Sibling units from the same donor (recall scope)

        const siblings = unit.donor_id

            ? (await pool.query('SELECT id, bag_number, blood_type, rh_factor, component, status, expiry_date FROM blood_bank_units WHERE donor_id=$1 AND tenant_id=$2 ORDER BY id', [unit.donor_id, tenantId])).rows

            : [];

        const transfusions = (await pool.query('SELECT id, patient_id, patient_name, start_time, adverse_reaction FROM blood_bank_transfusions WHERE unit_id=$1 AND tenant_id=$2 ORDER BY id', [uid, tenantId])).rows;

        let reactions = [];

        try {

            reactions = (await pool.query('SELECT id, transfusion_id, severity, reaction_type, created_at FROM blood_bank_transfusion_reactions WHERE unit_id=$1 AND tenant_id=$2 ORDER BY id', [uid, tenantId])).rows;

        } catch (reactionErr) {

            if (!/relation .* does not exist/i.test(reactionErr.message || '')) throw reactionErr;

        }

        res.json({ unit, donor_id: unit.donor_id || null, sibling_units: siblings, transfusions, reactions });

    } catch (e) { e13Respond(res, e); }

});

router.put('/api/bloodbank/units/:id/recall', requireAuth, requireRole('bloodbank', 'lab'), requireTenantScope, async (req, res) => {

    const client = await pool.connect();

    try {

        const tenantId = e13RequireTenant(req);

        const uid = Number(req.params.id);

        if (!Number.isInteger(uid) || uid <= 0) { client.release(); return res.status(422).json({ error: 'Invalid unit id' }); }

        await client.query('BEGIN');

        const unit = (await client.query('SELECT id, status, bag_number FROM blood_bank_units WHERE id=$1 AND tenant_id=$2 FOR UPDATE', [uid, tenantId])).rows[0];

        if (!unit) { await client.query('ROLLBACK'); client.release(); return res.status(404).json({ error: 'Unit not found' }); }

        if (unit.status === 'Transfused') {

            // Already in a patient — cannot un-transfuse; recall is informational (lookback) only.

            await client.query('ROLLBACK'); client.release();

            logAudit(req.session.user?.id, req.session.user?.display_name || req.session.user?.name, 'RECALL_TRANSFUSED', 'BloodBank', `Recall flagged on already-transfused unit #${uid}; use lookback`, req.ip);

            return res.status(409).json({ error: 'Unit already transfused; use lookback to trace recipients', status: 'Transfused' });

        }

        await client.query("UPDATE blood_bank_units SET status='Discarded', notes=COALESCE(notes,'')||' [RECALLED]', updated_at=CURRENT_TIMESTAMP WHERE id=$1 AND tenant_id=$2", [uid, tenantId]);

        await client.query('COMMIT');

        client.release();

        logAudit(req.session.user?.id, req.session.user?.display_name || req.session.user?.name, 'RECALL_UNIT', 'BloodBank', `Recalled (discarded) unit #${uid} (${unit.bag_number || ''})`, req.ip);

        res.json({ success: true, status: 'Discarded' });

    } catch (e) {

        try { await client.query('ROLLBACK'); } catch (_) {}

        client.release();

        e13Respond(res, e);

    }

});

router.get('/api/bloodbank/donors', requireAuth, requireRole('bloodbank', 'lab'), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e13RequireTenant(req);

        const rows = (await pool.query('SELECT * FROM blood_bank_donors WHERE tenant_id=$1 ORDER BY id DESC', [tenantId])).rows;

        res.json(rows);

    } catch (e) { e13Respond(res, e); }

});

router.post('/api/bloodbank/donors', requireAuth, requireRole('bloodbank', 'lab'), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e13RequireTenant(req);

        const { donor_name, donor_name_ar, national_id, phone, blood_type, rh_factor, age, gender, medical_history, notes } = req.body;

        const parsed = bbCompat.parseBloodType(blood_type, rh_factor);

        // F3-FIX: mirror unit-creation gate — reject garbage ABO/Rh instead of storing raw client value.

        if (!parsed.abo || !parsed.rh) return res.status(422).json({ error: 'Invalid blood type / Rh' });

        const result = await pool.query(

            `INSERT INTO blood_bank_donors (tenant_id, donor_name, donor_name_ar, national_id, phone, blood_type, rh_factor, age, gender, last_donation_date, medical_history, notes, created_by)

             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,CURRENT_DATE::TEXT,$10,$11,$12) RETURNING id`,

            [tenantId, donor_name || '', donor_name_ar || '', national_id || '', phone || '', parsed.abo, parsed.rh, Number(age) || 0, gender || '', medical_history || '', notes || '', req.session.user?.id || null]);

        logAudit(req.session.user?.id, req.session.user?.display_name || req.session.user?.name, 'CREATE_DONOR', 'BloodBank', `Registered donor ${donor_name || ''}`, req.ip);

        const row = (await pool.query('SELECT * FROM blood_bank_donors WHERE id=$1 AND tenant_id=$2', [result.rows[0].id, tenantId])).rows[0];

        res.json(row);

    } catch (e) { e13Respond(res, e); }

});

router.get('/api/bloodbank/stats', requireAuth, requireRole('bloodbank', 'lab', 'nursing', 'doctor'), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e13RequireTenant(req);

        const total = (await pool.query("SELECT COUNT(*)::int AS cnt FROM blood_bank_units WHERE status='Available' AND tenant_id=$1", [tenantId])).rows[0].cnt;

        // F4-FIX: added lower bound >= CURRENT_DATE so already-expired units are excluded from "Expiring Soon".

        const expiring = (await pool.query("SELECT COUNT(*)::int AS cnt FROM blood_bank_units WHERE status='Available' AND tenant_id=$1 AND expiry_date <> '' AND expiry_date >= CURRENT_DATE::TEXT AND expiry_date <= (CURRENT_DATE + INTERVAL '7 days')::TEXT", [tenantId])).rows[0].cnt;

        const todayTransfusions = (await pool.query("SELECT COUNT(*)::int AS cnt FROM blood_bank_transfusions WHERE tenant_id=$1 AND created_at::date = CURRENT_DATE", [tenantId])).rows[0].cnt;

        const byType = (await pool.query("SELECT blood_type, rh_factor, COUNT(*)::int AS cnt FROM blood_bank_units WHERE status='Available' AND tenant_id=$1 GROUP BY blood_type, rh_factor ORDER BY blood_type", [tenantId])).rows;

        const totalDonors = (await pool.query('SELECT COUNT(*)::int AS cnt FROM blood_bank_donors WHERE tenant_id=$1', [tenantId])).rows[0].cnt;

        const pendingCrossmatch = (await pool.query("SELECT COUNT(*)::int AS cnt FROM blood_bank_crossmatch WHERE result='Pending' AND tenant_id=$1", [tenantId])).rows[0].cnt;

        let reactions = 0;

        try {

            reactions = (await pool.query('SELECT COUNT(*)::int AS cnt FROM blood_bank_transfusion_reactions WHERE tenant_id=$1', [tenantId])).rows[0].cnt;

        } catch (reactionErr) {

            if (!/relation .* does not exist/i.test(reactionErr.message || '')) throw reactionErr;

        }

        res.json({ total, expiring, todayTransfusions, byType, totalDonors, pendingCrossmatch, reactions });

    } catch (e) { e13Respond(res, e); }

});


    return router;
}
