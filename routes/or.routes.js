const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeOrRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, checkAndTriggerAutoReorder, E12_WHO_ORDER, E12_WHO_PHASE_TO_STATE, e12IntId, e12IsValidSurgeryTransition, e12LoadSurgery, e12NormalizeStatus, e12RequireTenant, e12WhoNextState, optionalReadFallback, requirePermission }) {
    const router = express.Router();
router.get('/api/or/slots', requireAuth, requireRole('surgery', 'doctor', 'nursing'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = e12RequireTenant(req);

        const conds = [];

        const params = [];

        if (tenantId) { params.push(tenantId); conds.push(`tenant_id=$${params.length}`); }

        const roomId = e12IntId(req.query.room_id);

        if (req.query.room_id !== undefined && roomId === null) return res.status(400).json({ error: 'Invalid room_id' });

        if (roomId) { params.push(roomId); conds.push(`room_id=$${params.length}`); }

        if (req.query.date) { params.push(req.query.date); conds.push(`slot_date=$${params.length}`); }

        let q = 'SELECT * FROM or_slots';

        if (conds.length) q += ' WHERE ' + conds.join(' AND ');

        q += ' ORDER BY slot_date, slot_start_time';

        res.json((await pool.query(q, params)).rows);

    } catch (e) {

        if (optionalReadFallback(res, e)) return;

        res.status(e.statusCode || 500).json({ error: e.statusCode ? e.message : 'Server error' });

    }

});

router.post('/api/or/slots/reserve', requireAuth, requireRole('surgery', 'doctor'), requireTenantScope, async (req, res) => {

    let tenantCtx;

    try { tenantCtx = e12RequireTenant(req); }

    catch (e) { return res.status(e.statusCode || 500).json({ error: e.message }); }

    const { tenantId, facilityId } = tenantCtx;



    const surgeryId = e12IntId(req.body.surgery_id);

    const roomId = e12IntId(req.body.room_id);

    const surgeonId = e12IntId(req.body.surgeon_id);

    const slot_date = req.body.slot_date;

    const slot_start_time = req.body.slot_start_time;

    const slot_end_time = req.body.slot_end_time;

    const duration = Number.isInteger(Number(req.body.duration_minutes)) ? Number(req.body.duration_minutes) : 60;

    if (!surgeryId || !roomId || !surgeonId || !slot_date || !slot_start_time || !slot_end_time) {

        return res.status(400).json({ error: 'surgery_id, room_id, surgeon_id, slot_date, slot_start_time, slot_end_time required' });

    }

    if (String(slot_end_time) <= String(slot_start_time)) {

        return res.status(422).json({ error: 'slot_end_time must be after slot_start_time' });

    }



    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        // Bind tenant on this dedicated client for RLS defense-in-depth.

        if (tenantId) await client.query("SELECT set_config('app.tenant_id', $1, false)", [String(tenantId)]);



        // Verify surgery, room & surgeon all belong to this tenant.

        const surgeryQ = tenantId ? 'SELECT id, patient_id FROM surgeries WHERE id=$1 AND tenant_id=$2 FOR UPDATE'

                                  : 'SELECT id, patient_id FROM surgeries WHERE id=$1 FOR UPDATE';

        const surgery = (await client.query(surgeryQ, tenantId ? [surgeryId, tenantId] : [surgeryId])).rows[0];

        if (!surgery) { await client.query('ROLLBACK'); client.release(); return res.status(404).json({ error: 'Surgery not found' }); }



        const roomQ = tenantId ? 'SELECT id FROM operating_rooms WHERE id=$1 AND tenant_id=$2'

                               : 'SELECT id FROM operating_rooms WHERE id=$1';

        const room = (await client.query(roomQ, tenantId ? [roomId, tenantId] : [roomId])).rows[0];

        if (!room) { await client.query('ROLLBACK'); client.release(); return res.status(403).json({ error: 'Invalid operating room context or access denied' }); }



        const surgeonQ = tenantId ? 'SELECT su.id FROM system_users su JOIN user_tenants ut ON ut.user_id = su.id WHERE su.id = $1 AND ut.tenant_id = $2'

                                  : 'SELECT id FROM system_users WHERE id=$1';

        const surgeon = (await client.query(surgeonQ, tenantId ? [surgeonId, tenantId] : [surgeonId])).rows[0];

        if (!surgeon) { await client.query('ROLLBACK'); client.release(); return res.status(403).json({ error: 'Invalid surgeon context or access denied' }); }



        // Conflict detection: lock candidate conflicting rows (room OR surgeon overlap on same date),

        // ordered by id ascending to avoid deadlocks. Overlap = start < existing_end AND end > existing_start.

        // I1 FIX: tenantId is guaranteed non-null here (e12RequireTenant throws 403 on null tenant),

        // so the no-tenant else branch (which had mis-numbered $N bindings) is removed entirely.

        const conflictQ = `SELECT id, room_id, surgeon_id FROM or_slots

               WHERE tenant_id=$1 AND slot_date=$2 AND status <> 'Cancelled'

                 AND (room_id=$3 OR surgeon_id=$4)

                 AND (slot_start_time < $6 AND slot_end_time > $5)

               ORDER BY id ASC FOR UPDATE`;

        const conflictParams = [tenantId, slot_date, roomId, surgeonId, slot_start_time, slot_end_time];

        const conflicts = (await client.query(conflictQ, conflictParams)).rows;

        if (conflicts.length > 0) {

            await client.query('ROLLBACK'); client.release();

            const roomClash = conflicts.some(c => c.room_id === roomId);

            const surgeonClash = conflicts.some(c => c.surgeon_id === surgeonId);

            return res.status(409).json({

                error: 'Slot conflict: ' + (roomClash ? 'operating room already booked' : '') +

                       (roomClash && surgeonClash ? ' and ' : '') +

                       (surgeonClash ? 'surgeon already booked' : '') + ' for this time window'

            });

        }



        const ins = await client.query(

            `INSERT INTO or_slots (tenant_id, facility_id, surgery_id, room_id, surgeon_id, slot_date, slot_start_time, slot_end_time, duration_minutes, status, created_at)

             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'Booked',CURRENT_TIMESTAMP) RETURNING id`,

            [tenantId, facilityId, surgeryId, roomId, surgeonId, slot_date, slot_start_time, slot_end_time, duration]);



        // Reflect schedule on the surgery row (tenant scoped).

        const updQ = tenantId

            ? 'UPDATE surgeries SET scheduled_date=$1, scheduled_time=$2, surgeon_id=$3 WHERE id=$4 AND tenant_id=$5'

            : 'UPDATE surgeries SET scheduled_date=$1, scheduled_time=$2, surgeon_id=$3 WHERE id=$4';

        await client.query(updQ, tenantId ? [slot_date, slot_start_time, surgeonId, surgeryId, tenantId] : [slot_date, slot_start_time, surgeonId, surgeryId]);



        await client.query('COMMIT');

        client.release();

        logAudit(req.session.user?.id, req.session.user?.display_name || '', 'RESERVE_OR_SLOT', 'Surgery', `Reserved OR slot ${ins.rows[0].id} room ${roomId} surgeon ${surgeonId} for surgery ${surgeryId}`, req.ip);

        res.json({ success: true, id: ins.rows[0].id });

    } catch (e) {

        try { await client.query('ROLLBACK'); } catch (_) {}

        client.release();

        console.error('OR reserve error:', e.message);

        res.status(500).json({ error: 'Server error' });

    }

});

router.put('/api/or/slots/:id/cancel', requireAuth, requireRole('surgery', 'doctor'), requireTenantScope, requirePermission('or:cancel'), async (req, res) => {

    try {

        const { tenantId } = e12RequireTenant(req);

        const slotId = e12IntId(req.params.id);

        if (!slotId) return res.status(400).json({ error: 'Invalid slot id' });

        const q = tenantId

            ? "UPDATE or_slots SET status='Cancelled' WHERE id=$1 AND tenant_id=$2 RETURNING id"

            : "UPDATE or_slots SET status='Cancelled' WHERE id=$1 RETURNING id";

        const r = await pool.query(q, tenantId ? [slotId, tenantId] : [slotId]);

        if (!r.rows[0]) return res.status(404).json({ error: 'Slot not found' });

        logAudit(req.session.user?.id, req.session.user?.display_name || '', 'CANCEL_OR_SLOT', 'Surgery', `Cancelled OR slot ${slotId}`, req.ip);

        res.json({ success: true });

    } catch (e) { res.status(e.statusCode || 500).json({ error: e.statusCode ? e.message : 'Server error' }); }

});

router.put('/api/or/surgeries/:id/status', requireAuth, requireRole('surgery', 'doctor', 'nursing'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = e12RequireTenant(req);

        const surgeryId = e12IntId(req.params.id);

        if (!surgeryId) return res.status(400).json({ error: 'Invalid surgery id' });

        const target = e12NormalizeStatus(req.body.status);



        const surgery = await e12LoadSurgery(surgeryId, tenantId);

        if (!surgery) return res.status(404).json({ error: 'Surgery not found' });



        const current = e12NormalizeStatus(surgery.status || 'Scheduled');

        if (!e12IsValidSurgeryTransition(current, target)) {

            return res.status(409).json({ error: `Invalid surgery status transition from "${current}" to "${target}"` });

        }



        // Phase-gating: cannot start the operation (InProgress) without WHO Time-Out completed.

        if (target === 'InProgress') {

            const clQ = tenantId

                ? 'SELECT state FROM who_surgical_checklist WHERE surgery_id=$1 AND tenant_id=$2'

                : 'SELECT state FROM who_surgical_checklist WHERE surgery_id=$1';

            const cl = (await pool.query(clQ, tenantId ? [surgeryId, tenantId] : [surgeryId])).rows[0];

            const reachedTimeOut = cl && (E12_WHO_ORDER.indexOf(cl.state) >= E12_WHO_ORDER.indexOf('Time-Out'));

            if (!reachedTimeOut) {

                return res.status(409).json({ error: 'WHO Time-Out must be completed before incision (InProgress)' });

            }

            // CONSENT GATE: a signed surgical consent for THIS patient (same tenant) must be on file

            // before incision. Emergency override allowed with a documented reason (audited). FAIL-SAFE:

            // if the consent table cannot be queried, ALLOW but audit an inconclusive warning — never

            // hard-block an operation on an infrastructure error.

            if (surgery.patient_id) {

                let consentN = null;

                try {

                    const cQ = tenantId

                        ? "SELECT COUNT(*)::int AS n FROM patient_consents pc JOIN patients p ON pc.patient_id=p.id WHERE pc.patient_id=$1 AND p.tenant_id=$2 AND COALESCE(pc.signature_data,'')<>''"

                        : "SELECT COUNT(*)::int AS n FROM patient_consents pc WHERE pc.patient_id=$1 AND COALESCE(pc.signature_data,'')<>''";

                    consentN = (await pool.query(cQ, tenantId ? [surgery.patient_id, tenantId] : [surgery.patient_id])).rows[0].n;

                } catch (consentErr) {

                    logAudit(req.session.user?.id, req.session.user?.display_name || '', 'CONSENT_CHECK_INCONCLUSIVE', 'Surgery',

                        `Consent check failed for surgery ${surgeryId} patient #${surgery.patient_id} (allowed, verify manually): ${String(consentErr.message).slice(0, 120)}`, req.ip);

                }

                if (consentN === 0) {

                    const ovr = String(req.body.consent_override_reason || '').trim();

                    if (!ovr) {

                        return res.status(409).json({ error: 'Signed surgical consent required before incision', code: 'CONSENT_REQUIRED' });

                    }

                    logAudit(req.session.user?.id, req.session.user?.display_name || '', 'CONSENT_OVERRIDE', 'Surgery',

                        `Incision without consent on file for surgery ${surgeryId} patient #${surgery.patient_id}: ${ovr.slice(0, 160)}`, req.ip);

                }

            }

        }

        // Cannot complete the surgery without WHO Sign-Out (checklist Completed).

        if (target === 'Completed') {

            const clQ = tenantId

                ? 'SELECT state FROM who_surgical_checklist WHERE surgery_id=$1 AND tenant_id=$2'

                : 'SELECT state FROM who_surgical_checklist WHERE surgery_id=$1';

            const cl = (await pool.query(clQ, tenantId ? [surgeryId, tenantId] : [surgeryId])).rows[0];

            if (!cl || cl.state !== 'Completed') {

                return res.status(409).json({ error: 'WHO Sign-Out must be completed before the surgery can be Completed' });

            }



            // PACU Aldrete Score Gate (Safety Gate): prevent discharging from PACU with Aldrete < 9 without documented override

            const pacuQ = tenantId

                ? 'SELECT aldrete_score FROM pacu_records WHERE surgery_id=$1 AND tenant_id=$2'

                : 'SELECT aldrete_score FROM pacu_records WHERE surgery_id=$1';

            const pacu = (await pool.query(pacuQ, tenantId ? [surgeryId, tenantId] : [surgeryId])).rows[0];

            if (pacu) {

                const score = pacu.aldrete_score;

                if (score !== null && score !== undefined && score < 9) {

                    const overrideReason = String(req.body.override_reason || req.body.pacu_override_reason || '').trim();

                    if (!overrideReason) {

                        return res.status(409).json({

                            error: 'Patient cannot be discharged from PACU with Aldrete Score < 9 without a documented anesthesiologist override reason.',

                            code: 'PACU_ALDRETE_BELOW_MINIMUM'

                        });

                    }

                    logAudit(req.session.user?.id, req.session.user?.display_name || '', 'PACU_ALDRETE_OVERRIDE', 'Surgery',

                        `Discharged from PACU with Aldrete Score ${score} < 9 for surgery ${surgeryId} patient #${surgery.patient_id} with reason: ${overrideReason.slice(0, 160)}`, req.ip);

                }

            }

        }



        const updQ = tenantId

            ? 'UPDATE surgeries SET status=$1 WHERE id=$2 AND tenant_id=$3'

            : 'UPDATE surgeries SET status=$1 WHERE id=$2';

        await pool.query(updQ, tenantId ? [target, surgeryId, tenantId] : [target, surgeryId]);

        logAudit(req.session.user?.id, req.session.user?.display_name || '', 'UPDATE_SURGERY_STATUS', 'Surgery', `Surgery ${surgeryId} status ${current} -> ${target}`, req.ip);

        res.json({ success: true, status: target });

    } catch (e) { res.status(e.statusCode || 500).json({ error: e.statusCode ? e.message : 'Server error' }); }

});

router.get('/api/or/surgeries/:id/who-checklist', requireAuth, requireRole('surgery', 'doctor', 'nursing'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = e12RequireTenant(req);

        const surgeryId = e12IntId(req.params.id);

        if (!surgeryId) return res.status(400).json({ error: 'Invalid surgery id' });

        const surgery = await e12LoadSurgery(surgeryId, tenantId);

        if (!surgery) return res.status(404).json({ error: 'Surgery not found' });

        const q = tenantId

            ? 'SELECT * FROM who_surgical_checklist WHERE surgery_id=$1 AND tenant_id=$2'

            : 'SELECT * FROM who_surgical_checklist WHERE surgery_id=$1';

        const row = (await pool.query(q, tenantId ? [surgeryId, tenantId] : [surgeryId])).rows[0];

        res.json(row || { surgery_id: surgeryId, state: 'Not Started', sign_in_completed: 0, time_out_completed: 0, sign_out_completed: 0 });

    } catch (e) { res.status(e.statusCode || 500).json({ error: e.statusCode ? e.message : 'Server error' }); }

});

router.post('/api/or/surgeries/:id/who-checklist/:phase', requireAuth, requireRole('surgery', 'doctor', 'nursing'), requireTenantScope, async (req, res) => {

    const client = await pool.connect();

    try {

        const { tenantId, facilityId } = e12RequireTenant(req);

        const surgeryId = e12IntId(req.params.id);

        const phase = String(req.params.phase || '').toLowerCase();

        if (!surgeryId) { client.release(); return res.status(400).json({ error: 'Invalid surgery id' }); }

        if (!E12_WHO_PHASE_TO_STATE[phase]) { client.release(); return res.status(400).json({ error: 'Unknown checklist phase' }); }



        await client.query('BEGIN');

        if (tenantId) await client.query("SELECT set_config('app.tenant_id', $1, false)", [String(tenantId)]);



        const sQ = tenantId ? 'SELECT id, patient_id FROM surgeries WHERE id=$1 AND tenant_id=$2'

                            : 'SELECT id, patient_id FROM surgeries WHERE id=$1';

        const surgery = (await client.query(sQ, tenantId ? [surgeryId, tenantId] : [surgeryId])).rows[0];

        if (!surgery) { await client.query('ROLLBACK'); client.release(); return res.status(404).json({ error: 'Surgery not found' }); }



        // Lock the checklist row (or create at Not Started).

        const exQ = tenantId ? 'SELECT * FROM who_surgical_checklist WHERE surgery_id=$1 AND tenant_id=$2 FOR UPDATE'

                             : 'SELECT * FROM who_surgical_checklist WHERE surgery_id=$1 FOR UPDATE';

        let cl = (await client.query(exQ, tenantId ? [surgeryId, tenantId] : [surgeryId])).rows[0];

        if (!cl) {

            const insTxt = `INSERT INTO who_surgical_checklist (surgery_id, patient_id, state, tenant_id, facility_id, created_at)

                            VALUES ($1,$2,'Not Started',$3,$4,CURRENT_TIMESTAMP) RETURNING *`;

            cl = (await client.query(insTxt, [surgeryId, surgery.patient_id || 0, tenantId, facilityId])).rows[0];

        }



        const decision = e12WhoNextState(cl.state, phase);

        if (!decision.ok) {

            await client.query('ROLLBACK'); client.release();

            return res.status(409).json({ error: decision.error });

        }



        // Authority fields (who/when) computed server-side — never trusted from client.

        const actor = req.session.user?.display_name || req.session.user?.name || '';

        const phaseCol = phase === 'sign-in' ? 'sign_in' : phase === 'time-out' ? 'time_out' : 'sign_out';

        const updTxt = tenantId

            ? `UPDATE who_surgical_checklist SET ${phaseCol}_completed=1, ${phaseCol}_completed_by=$1, ${phaseCol}_at=CURRENT_TIMESTAMP, state=$2 WHERE surgery_id=$3 AND tenant_id=$4`

            : `UPDATE who_surgical_checklist SET ${phaseCol}_completed=1, ${phaseCol}_completed_by=$1, ${phaseCol}_at=CURRENT_TIMESTAMP, state=$2 WHERE surgery_id=$3`;

        await client.query(updTxt, tenantId ? [actor, decision.newState, surgeryId, tenantId] : [actor, decision.newState, surgeryId]);



        await client.query('COMMIT');

        client.release();

        logAudit(req.session.user?.id, actor, 'WHO_CHECKLIST_' + phaseCol.toUpperCase(), 'Surgery', `WHO ${phase} completed for surgery ${surgeryId}; state=${decision.newState}`, req.ip);

        res.json({ success: true, state: decision.newState });

    } catch (e) {

        try { await client.query('ROLLBACK'); } catch (_) {}

        client.release();

        res.status(e.statusCode || 500).json({ error: e.statusCode ? e.message : 'Server error' });

    }

});

router.get('/api/or/surgeries/:id/pacu', requireAuth, requireRole('surgery', 'doctor', 'nursing'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = e12RequireTenant(req);

        const surgeryId = e12IntId(req.params.id);

        if (!surgeryId) return res.status(400).json({ error: 'Invalid surgery id' });

        const surgery = await e12LoadSurgery(surgeryId, tenantId);

        if (!surgery) return res.status(404).json({ error: 'Surgery not found' });

        const q = tenantId ? 'SELECT * FROM pacu_records WHERE surgery_id=$1 AND tenant_id=$2'

                           : 'SELECT * FROM pacu_records WHERE surgery_id=$1';

        res.json((await pool.query(q, tenantId ? [surgeryId, tenantId] : [surgeryId])).rows[0] || null);

    } catch (e) { res.status(e.statusCode || 500).json({ error: e.statusCode ? e.message : 'Server error' }); }

});

router.post('/api/or/surgeries/:id/pacu', requireAuth, requireRole('surgery', 'doctor', 'nursing'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId, facilityId } = e12RequireTenant(req);

        const surgeryId = e12IntId(req.params.id);

        if (!surgeryId) return res.status(400).json({ error: 'Invalid surgery id' });

        const surgery = await e12LoadSurgery(surgeryId, tenantId);

        if (!surgery) return res.status(404).json({ error: 'Surgery not found' });



        const clQ = tenantId ? 'SELECT state FROM who_surgical_checklist WHERE surgery_id=$1 AND tenant_id=$2'

                             : 'SELECT state FROM who_surgical_checklist WHERE surgery_id=$1';

        const cl = (await pool.query(clQ, tenantId ? [surgeryId, tenantId] : [surgeryId])).rows[0];

        if (!cl || cl.state !== 'Completed') {

            return res.status(409).json({ error: 'WHO Sign-Out must be completed before opening a PACU record' });

        }



        const b = req.body;

        // Aldrete score is an authority field: compute & clamp server-side (0..10) from its 5 components (0..2 each).

        const comp = ['activity', 'respiration', 'circulation', 'consciousness', 'oxygen'];

        let aldrete = null;

        const provided = comp.filter(c => b[c] !== undefined && b[c] !== null && b[c] !== '');

        if (provided.length === comp.length) {

            aldrete = comp.reduce((sum, c) => {

                let v = parseInt(b[c], 10); if (!Number.isInteger(v)) v = 0; if (v < 0) v = 0; if (v > 2) v = 2;

                return sum + v;

            }, 0);

        }

        const dischargeStatus = b.discharge_status === 'Discharged' ? (aldrete !== null && aldrete >= 9 ? 'Discharged' : 'In Recovery') : 'In Recovery';



        const exQ = tenantId ? 'SELECT id FROM pacu_records WHERE surgery_id=$1 AND tenant_id=$2'

                             : 'SELECT id FROM pacu_records WHERE surgery_id=$1';

        const existing = (await pool.query(exQ, tenantId ? [surgeryId, tenantId] : [surgeryId])).rows[0];



        if (existing) {

            const updQ = tenantId

                ? `UPDATE pacu_records SET start_time=$1, end_time=$2, pain_score=$3, bp=$4, hr=$5, spo2=$6, temp=$7, aldrete_score=$8, discharge_status=$9, recovery_nurse=$10, notes=$11 WHERE surgery_id=$12 AND tenant_id=$13`

                : `UPDATE pacu_records SET start_time=$1, end_time=$2, pain_score=$3, bp=$4, hr=$5, spo2=$6, temp=$7, aldrete_score=$8, discharge_status=$9, recovery_nurse=$10, notes=$11 WHERE surgery_id=$12`;

            const p = [b.start_time || '', b.end_time || '', parseInt(b.pain_score, 10) || 0, b.bp || '', b.hr || '', b.spo2 || '', b.temp || '', aldrete, dischargeStatus, req.session.user?.display_name || '', b.notes || '', surgeryId];

            if (tenantId) p.push(tenantId);

            await pool.query(updQ, p);

        } else {

            await pool.query(

                `INSERT INTO pacu_records (surgery_id, patient_id, start_time, end_time, pain_score, bp, hr, spo2, temp, aldrete_score, discharge_status, recovery_nurse, notes, tenant_id, facility_id, created_at)

                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,CURRENT_TIMESTAMP)`,

                [surgeryId, surgery.patient_id || 0, b.start_time || '', b.end_time || '', parseInt(b.pain_score, 10) || 0, b.bp || '', b.hr || '', b.spo2 || '', b.temp || '', aldrete, dischargeStatus, req.session.user?.display_name || '', b.notes || '', tenantId, facilityId]);

        }

        logAudit(req.session.user?.id, req.session.user?.display_name || '', 'PACU_RECORD', 'Surgery', `PACU record saved for surgery ${surgeryId}; aldrete=${aldrete}`, req.ip);

        const rq = tenantId ? 'SELECT * FROM pacu_records WHERE surgery_id=$1 AND tenant_id=$2' : 'SELECT * FROM pacu_records WHERE surgery_id=$1';

        res.json((await pool.query(rq, tenantId ? [surgeryId, tenantId] : [surgeryId])).rows[0]);

    } catch (e) { res.status(e.statusCode || 500).json({ error: e.statusCode ? e.message : 'Server error' }); }

});

router.get('/api/or/surgeries/:id/operative-note', requireAuth, requireRole('surgery', 'doctor'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = e12RequireTenant(req);

        const surgeryId = e12IntId(req.params.id);

        if (!surgeryId) return res.status(400).json({ error: 'Invalid surgery id' });

        const surgery = await e12LoadSurgery(surgeryId, tenantId);

        if (!surgery) return res.status(404).json({ error: 'Surgery not found' });

        const noteQ = tenantId ? 'SELECT * FROM operative_notes WHERE surgery_id=$1 AND tenant_id=$2'

                               : 'SELECT * FROM operative_notes WHERE surgery_id=$1';

        const note = (await pool.query(noteQ, tenantId ? [surgeryId, tenantId] : [surgeryId])).rows[0] || null;

        const consQ = tenantId ? 'SELECT * FROM or_consumption WHERE surgery_id=$1 AND tenant_id=$2 ORDER BY id'

                               : 'SELECT * FROM or_consumption WHERE surgery_id=$1 ORDER BY id';

        const consumption = (await pool.query(consQ, tenantId ? [surgeryId, tenantId] : [surgeryId])).rows;

        res.json({ note, consumption });

    } catch (e) { res.status(e.statusCode || 500).json({ error: e.statusCode ? e.message : 'Server error' }); }

});

router.post('/api/or/surgeries/:id/operative-note', requireAuth, requireRole('surgery', 'doctor'), requireTenantScope, async (req, res) => {

    const client = await pool.connect();

    try {

        const { tenantId, facilityId } = e12RequireTenant(req);

        const surgeryId = e12IntId(req.params.id);

        if (!surgeryId) { client.release(); return res.status(400).json({ error: 'Invalid surgery id' }); }



        await client.query('BEGIN');

        if (tenantId) await client.query("SELECT set_config('app.tenant_id', $1, false)", [String(tenantId)]);



        const sQ = tenantId ? 'SELECT id, patient_id FROM surgeries WHERE id=$1 AND tenant_id=$2'

                            : 'SELECT id, patient_id FROM surgeries WHERE id=$1';

        const surgery = (await client.query(sQ, tenantId ? [surgeryId, tenantId] : [surgeryId])).rows[0];

        if (!surgery) { await client.query('ROLLBACK'); client.release(); return res.status(404).json({ error: 'Surgery not found' }); }



        const b = req.body;

        // Counts verification is an authority field: only TRUE if explicitly confirmed; otherwise 'Incomplete'.

        const countsVerified = (b.counts_verified === true || b.counts_verified === 1 || b.counts_verified === '1') ? 'Verified' : 'Incomplete';

        const surgeon = req.session.user?.display_name || req.session.user?.name || '';



        // Validate + lock consumption items (ascending id order) before any stock flip.

        const rawLines = Array.isArray(b.consumption) ? b.consumption : [];

        const lines = [];

        for (const l of rawLines) {

            const itemId = e12IntId(l.item_id);

            let qty = parseInt(l.qty_used, 10);

            if (itemId === null || !Number.isInteger(qty) || qty <= 0) {

                await client.query('ROLLBACK'); client.release();

                return res.status(422).json({ error: 'Each consumption line requires a valid integer item_id and qty_used > 0' });

            }

            lines.push({ itemId, qty });

        }

        // Detect whether the inventory table exists/has tenant scoping; decrement only if present.

        let inventoryPresent = false;

        try {

            const chk = await client.query("SELECT to_regclass('public.inventory_items') AS t");

            inventoryPresent = !!(chk.rows[0] && chk.rows[0].t);

        } catch (_) { inventoryPresent = false; }



        lines.sort((a, b2) => a.itemId - b2.itemId); // ascending id order — deadlock-safe locking



        // C1 FIX: idempotent re-save. Credit back any prior or_consumption rows BEFORE applying new

        // decrements so re-saving the operative note does not double-decrement stock. All locks are

        // taken in ascending item_id order (consistent across credit + debit passes) to prevent deadlocks.

        if (inventoryPresent) {

            // Step 1: load existing consumption rows for this surgery (prior save, if any), lock their

            // inventory items in ascending id order and credit back the old quantities.

            const prevConsQ = tenantId

                ? 'SELECT item_id, qty_used FROM or_consumption WHERE surgery_id=$1 AND tenant_id=$2 ORDER BY item_id ASC'

                : 'SELECT item_id, qty_used FROM or_consumption WHERE surgery_id=$1 ORDER BY item_id ASC';

            const prevRows = (await client.query(prevConsQ, tenantId ? [surgeryId, tenantId] : [surgeryId])).rows;

            for (const prev of prevRows) {

                const prevItemId = parseInt(prev.item_id, 10);

                const prevQty = parseInt(prev.qty_used, 10) || 0;

                if (prevQty <= 0) continue;

                // Lock the row (ascending id order — same as debit pass below, no deadlock)

                const lockPrevQ = tenantId

                    ? 'SELECT id, stock_qty FROM inventory_items WHERE id=$1 AND tenant_id=$2 FOR UPDATE'

                    : 'SELECT id, stock_qty FROM inventory_items WHERE id=$1 FOR UPDATE';

                await client.query(lockPrevQ, tenantId ? [prevItemId, tenantId] : [prevItemId]);

                // Credit back the previously decremented quantity

                const creditQ = tenantId

                    ? 'UPDATE inventory_items SET stock_qty = stock_qty + $1 WHERE id=$2 AND tenant_id=$3'

                    : 'UPDATE inventory_items SET stock_qty = stock_qty + $1 WHERE id=$2';

                await client.query(creditQ, tenantId ? [prevQty, prevItemId, tenantId] : [prevQty, prevItemId]);

            }



            // Step 2: validate + debit the new consumption lines against post-credit stock.

            for (const ln of lines) {

                const lockQ = tenantId

                    ? 'SELECT id, stock_qty FROM inventory_items WHERE id=$1 AND tenant_id=$2 FOR UPDATE'

                    : 'SELECT id, stock_qty FROM inventory_items WHERE id=$1 FOR UPDATE';

                const item = (await client.query(lockQ, tenantId ? [ln.itemId, tenantId] : [ln.itemId])).rows[0];

                if (!item) { await client.query('ROLLBACK'); client.release(); return res.status(404).json({ error: `Inventory item ${ln.itemId} not found in tenant scope` }); }

                if ((item.stock_qty || 0) < ln.qty) { await client.query('ROLLBACK'); client.release(); return res.status(409).json({ error: `Insufficient stock for item ${ln.itemId} (have ${item.stock_qty || 0}, need ${ln.qty})` }); }

            }

            for (const ln of lines) {

                const decQ = tenantId

                    ? 'UPDATE inventory_items SET stock_qty = stock_qty - $1 WHERE id=$2 AND tenant_id=$3'

                    : 'UPDATE inventory_items SET stock_qty = stock_qty - $1 WHERE id=$2';

                await client.query(decQ, tenantId ? [ln.qty, ln.itemId, tenantId] : [ln.qty, ln.itemId]);

                

                // Trigger auto-reorder alert check

                await checkAndTriggerAutoReorder(ln.itemId, tenantId, client);

            }

        }

        // Persist consumption lines (idempotent replace for this surgery).

        const delQ = tenantId ? 'DELETE FROM or_consumption WHERE surgery_id=$1 AND tenant_id=$2' : 'DELETE FROM or_consumption WHERE surgery_id=$1';

        await client.query(delQ, tenantId ? [surgeryId, tenantId] : [surgeryId]);

        for (const ln of lines) {

            await client.query(

                `INSERT INTO or_consumption (surgery_id, item_id, qty_used, tenant_id, facility_id, created_at) VALUES ($1,$2,$3,$4,$5,CURRENT_TIMESTAMP)`,

                [surgeryId, ln.itemId, ln.qty, tenantId, facilityId]);

        }



        // Upsert operative note.

        const exQ = tenantId ? 'SELECT id FROM operative_notes WHERE surgery_id=$1 AND tenant_id=$2' : 'SELECT id FROM operative_notes WHERE surgery_id=$1';

        const existing = (await client.query(exQ, tenantId ? [surgeryId, tenantId] : [surgeryId])).rows[0];

        const bloodLoss = parseInt(b.blood_loss_final, 10) || 0;

        if (existing) {

            const upd = tenantId

                ? `UPDATE operative_notes SET procedure_description=$1, findings=$2, complications=$3, blood_loss_final=$4, counts_verified=$5, specimen=$6, surgeon_signature=$7 WHERE surgery_id=$8 AND tenant_id=$9`

                : `UPDATE operative_notes SET procedure_description=$1, findings=$2, complications=$3, blood_loss_final=$4, counts_verified=$5, specimen=$6, surgeon_signature=$7 WHERE surgery_id=$8`;

            const p = [b.procedure_description || '', b.findings || '', b.complications || '', bloodLoss, countsVerified, b.specimen || '', surgeon, surgeryId];

            if (tenantId) p.push(tenantId);

            await client.query(upd, p);

        } else {

            await client.query(

                `INSERT INTO operative_notes (surgery_id, patient_id, procedure_description, findings, complications, blood_loss_final, counts_verified, specimen, surgeon_signature, tenant_id, facility_id, created_at)

                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,CURRENT_TIMESTAMP)`,

                [surgeryId, surgery.patient_id || 0, b.procedure_description || '', b.findings || '', b.complications || '', bloodLoss, countsVerified, b.specimen || '', surgeon, tenantId, facilityId]);

        }



        await client.query('COMMIT');

        client.release();

        logAudit(req.session.user?.id, surgeon, 'OPERATIVE_NOTE_SIGNED', 'Surgery', `Operative note saved for surgery ${surgeryId}; counts=${countsVerified}; lines=${lines.length}; inventoryDecremented=${inventoryPresent}`, req.ip);

        res.json({ success: true, counts_verified: countsVerified, inventory_decremented: inventoryPresent, lines: lines.length });

    } catch (e) {

        try { await client.query('ROLLBACK'); } catch (_) {}

        client.release();

        console.error('Operative note error:', e.message);

        res.status(500).json({ error: 'Server error' });

    }

});


    return router;
}
