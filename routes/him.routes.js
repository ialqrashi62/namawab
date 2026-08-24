const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeHimRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, isHimOrAdmin, _himPushSource, optionalReadFallback }) {
    const router = express.Router();
router.get('/api/him/record/:patientId', requireAuth, requireRole('him', 'medical-records'), requireTenantScope, async (req, res) => {

    try {

        const pid = parseInt(req.params.patientId, 10);

        if (!Number.isFinite(pid)) return res.status(400).json({ error: 'Invalid patient id' });

        const { tenantId, facilityId } = getRequestTenantContext(req);

        const actor = req.session.user;



        // FAIL-CLOSED: no tenant context -> never run unfiltered PHI sub-queries. Return empty record.

        if (!tenantId) return res.status(403).json({ error: 'Tenant scope required' });



        // TENANT SCOPE: patient must belong to current tenant (explicit predicate + fail-closed -> 404)

        const patient = (await pool.query('SELECT id, name_en, name_ar, file_number FROM patients WHERE id=$1 AND tenant_id=$2', [pid, tenantId])).rows[0];

        if (!patient) return res.status(404).json({ error: 'Patient not found' });



        // --- HIM ACCESS AUDIT: every chart open MUST write a record_access_log row (who/what/when/tenant).

        // FAIL-CLOSED AUDIT: if the access cannot be logged, do NOT serve PHI (return 500). A record

        // view without a successful audit row is an HIPAA-unaccountable disclosure — refuse it. ---

        try {

            await pool.query(

                'INSERT INTO record_access_log (tenant_id, facility_id, patient_id, accessor_id, access_type, reason) VALUES ($1,$2,$3,$4,$5,$6)',

                [tenantId, facilityId || null, pid, actor.id, 'normal', '']

            );

        } catch (e) {

            console.error('record_access_log insert FAILED — refusing to serve PHI (audit fail-closed):', e.message);

            // record a loud audit_trail BREAK-style entry so the failed-to-log access is itself accountable

            logAudit(actor.id, actor.display_name || actor.name, 'VIEW_RECORD_AUDIT_FAIL', 'HIM', `BLOCKED record view patient #${pid}: access-log write failed (${e.message})`, req.ip);

            return res.status(500).json({ error: 'Access could not be logged; record view denied' });

        }

        logAudit(actor.id, actor.display_name || actor.name, 'VIEW_RECORD', 'HIM', `Viewed longitudinal record patient #${pid}`, req.ip);



        const events = [];

        // DEFENSE-IN-DEPTH: explicit tenant_id predicate on EVERY sub-query (independent of FORCE RLS).

        // FAIL-CLOSED: tenantId is guaranteed non-null here (patients fetch above already 404s a

        // cross-tenant patient and requireTenantScope 403s a null tenant in prod), but we still bind

        // tenant_id=$2 on every aggregation sub-query so a bypassing DB role cannot leak foreign rows.

        // Visits / encounters (visit_lifecycle is the nearest encounter table)

        await _himPushSource(events, 'SELECT id, diagnosis, complaint, visit_date, created_at FROM visits WHERE patient_id=$1 AND tenant_id=$2 ORDER BY id DESC LIMIT 500', [pid, tenantId],

            r => ({ type: 'visit', icon: '🏥', title: r.diagnosis || r.complaint || 'Visit', subtitle: r.complaint || '', date: r.visit_date || r.created_at }));

        await _himPushSource(events, 'SELECT id, status, stage, created_at FROM visit_lifecycle WHERE patient_id=$1 AND tenant_id=$2 ORDER BY id DESC LIMIT 500', [pid, tenantId],

            r => ({ type: 'encounter', icon: '📋', title: r.stage || 'Encounter', subtitle: r.status || '', date: r.created_at }));

        // Problems (E1 — optional)

        await _himPushSource(events, 'SELECT id, icd10, description, status, onset_date, created_at FROM problems WHERE patient_id=$1 AND tenant_id=$2 ORDER BY id DESC LIMIT 500', [pid, tenantId],

            r => ({ type: 'problem', icon: '⚠️', title: r.description || r.icd10 || 'Problem', subtitle: `${r.icd10 || ''} ${r.status || ''}`.trim(), date: r.onset_date || r.created_at }));

        // Clinical notes (E1 — optional, SOAP)

        await _himPushSource(events, 'SELECT id, note_type, assessment, created_at FROM clinical_notes WHERE patient_id=$1 AND tenant_id=$2 ORDER BY id DESC LIMIT 500', [pid, tenantId],

            r => ({ type: 'clinical_note', icon: '📝', title: r.note_type || 'Clinical Note', subtitle: r.assessment || '', date: r.created_at }));

        // Medical records

        await _himPushSource(events, 'SELECT id, diagnosis, symptoms, visit_date FROM medical_records WHERE patient_id=$1 AND tenant_id=$2 ORDER BY id DESC LIMIT 500', [pid, tenantId],

            r => ({ type: 'medical_record', icon: '🩺', title: r.diagnosis || 'Consultation', subtitle: r.symptoms || '', date: r.visit_date }));

        // Lab results (structured)

        await _himPushSource(events, 'SELECT id, order_type, status, created_at FROM lab_radiology_orders WHERE patient_id=$1 AND tenant_id=$2 AND is_radiology=0 ORDER BY id DESC LIMIT 500', [pid, tenantId],

            r => ({ type: 'lab', icon: '🔬', title: r.order_type || 'Lab', subtitle: r.status || '', date: r.created_at }));

        // Radiology

        await _himPushSource(events, 'SELECT id, order_type, status, created_at FROM lab_radiology_orders WHERE patient_id=$1 AND tenant_id=$2 AND is_radiology=1 ORDER BY id DESC LIMIT 500', [pid, tenantId],

            r => ({ type: 'radiology', icon: '📡', title: r.order_type || 'Radiology', subtitle: r.status || '', date: r.created_at }));

        // Prescriptions

        await _himPushSource(events, 'SELECT id, dosage, status, created_at FROM prescriptions WHERE patient_id=$1 AND tenant_id=$2 ORDER BY id DESC LIMIT 500', [pid, tenantId],

            r => ({ type: 'prescription', icon: '💊', title: r.dosage || 'Prescription', subtitle: r.status || '', date: r.created_at }));

        // Coding (E2 — structured codes)

        await _himPushSource(events, 'SELECT id, code_system, code, description, created_at FROM coding WHERE patient_id=$1 AND tenant_id=$2 ORDER BY id DESC LIMIT 500', [pid, tenantId],

            r => ({ type: 'coding', icon: '🏷️', title: `${r.code_system}: ${r.code}`, subtitle: r.description || '', date: r.created_at }));



        events.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

        res.json({ patient: { id: patient.id, name_en: patient.name_en, name_ar: patient.name_ar, file_number: patient.file_number }, events });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/him/coding', requireAuth, requireRole('him', 'medical-records'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        if (!tenantId) return res.json([]); // FAIL-CLOSED: never run unfiltered

        const { patient_id, encounter_ref } = req.query;

        // DEFENSE-IN-DEPTH: explicit tenant_id predicate (always), independent of FORCE RLS.

        const params = [tenantId], where = ['tenant_id=$1'];

        if (patient_id) { params.push(parseInt(patient_id, 10)); where.push(`patient_id=$${params.length}`); }

        if (encounter_ref) { params.push(parseInt(encounter_ref, 10)); where.push(`encounter_ref=$${params.length}`); }

        const sql = 'SELECT * FROM coding WHERE ' + where.join(' AND ') + ' ORDER BY id DESC LIMIT 500';

        res.json((await pool.query(sql, params)).rows);

    } catch (e) { if (optionalReadFallback(res, e)) return; res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/him/coding', requireAuth, requireRole('him', 'medical-records'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId, facilityId } = getRequestTenantContext(req);

        const actor = req.session.user;

        const { patient_id, encounter_ref, code_system, code, description } = req.body;

        const pid = parseInt(patient_id, 10);

        if (!Number.isFinite(pid)) return res.status(400).json({ error: 'patient_id required' });

        if (!code || !String(code).trim()) return res.status(400).json({ error: 'code required' });

        const cs = ['ICD10', 'SNOMED', 'CPT'].includes(code_system) ? code_system : 'ICD10';

        // tenant_id stamped from session (never from body)

        const result = await pool.query(

            'INSERT INTO coding (tenant_id, facility_id, patient_id, encounter_ref, code_system, code, description, coder_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',

            [tenantId, facilityId || null, pid, encounter_ref ? parseInt(encounter_ref, 10) : null, cs, String(code), description || '', actor.id]);

        logAudit(actor.id, actor.display_name || actor.name, 'ADD_CODING', 'HIM', `Coded ${cs} ${String(code)} patient #${pid}`, req.ip);

        res.json(result.rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/him/deficiencies', requireAuth, requireRole('him', 'medical-records'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        if (!tenantId) return res.json([]); // FAIL-CLOSED: never run unfiltered

        const deficiencies = [];

        // Unsigned medical records (missing signature) — explicit tenant_id predicate + FORCE RLS

        try {

            const unsigned = (await pool.query(

                "SELECT id, patient_id, visit_date FROM medical_records WHERE tenant_id=$1 AND COALESCE(emr_status,'') <> 'locked' ORDER BY id DESC LIMIT 200", [tenantId])).rows;

            unsigned.forEach(r => deficiencies.push({ type: 'unsigned_record', record_type: 'medical_records', record_id: r.id, patient_id: r.patient_id, detail: 'Record not signed/locked', date: r.visit_date }));

        } catch (e) { /* emr_status may be out-of-band; skip */ }

        // Records without any coding row (missing coding) — both sides tenant-scoped explicitly

        try {

            const uncoded = (await pool.query(

                "SELECT mr.id, mr.patient_id, mr.visit_date FROM medical_records mr WHERE mr.tenant_id=$1 AND NOT EXISTS (SELECT 1 FROM coding c WHERE c.patient_id = mr.patient_id AND c.tenant_id=$1) ORDER BY mr.id DESC LIMIT 200", [tenantId])).rows;

            uncoded.forEach(r => deficiencies.push({ type: 'missing_coding', record_type: 'medical_records', record_id: r.id, patient_id: r.patient_id, detail: 'No coding assigned', date: r.visit_date }));

        } catch (e) { /* coding table may not exist yet; skip */ }

        res.json(deficiencies);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/him/roi', requireAuth, requireRole('him', 'medical-records'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        if (!tenantId) return res.json([]); // FAIL-CLOSED: never run unfiltered

        // DEFENSE-IN-DEPTH: explicit tenant_id predicate (always), independent of FORCE RLS.

        res.json((await pool.query('SELECT * FROM roi_requests WHERE tenant_id=$1 ORDER BY id DESC LIMIT 500', [tenantId])).rows);

    } catch (e) { if (optionalReadFallback(res, e)) return; res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/him/roi', requireAuth, requireRole('him', 'medical-records'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId, facilityId } = getRequestTenantContext(req);

        const actor = req.session.user;

        const { patient_id, requester, purpose } = req.body;

        const pid = parseInt(patient_id, 10);

        if (!Number.isFinite(pid)) return res.status(400).json({ error: 'patient_id required' });

        if (!requester || !String(requester).trim()) return res.status(400).json({ error: 'requester required' });

        const result = await pool.query(

            "INSERT INTO roi_requests (tenant_id, facility_id, patient_id, requester, purpose, status, requested_by) VALUES ($1,$2,$3,$4,$5,'pending',$6) RETURNING *",

            [tenantId, facilityId || null, pid, String(requester), purpose || '', actor.id]);

        logAudit(actor.id, actor.display_name || actor.name, 'ROI_REQUEST', 'HIM', `ROI requested patient #${pid} by ${String(requester).slice(0, 80)}`, req.ip);

        res.json(result.rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.put('/api/him/roi/:id', requireAuth, requireRole('him', 'medical-records'), requireTenantScope, async (req, res) => {

    try {

        const actor = req.session.user;

        const id = parseInt(req.params.id, 10);

        if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid id' });

        const { tenantId } = getRequestTenantContext(req);

        if (!tenantId) return res.status(403).json({ error: 'Tenant scope required' }); // FAIL-CLOSED

        const action = req.body.action; // 'approve' | 'deny' | 'release'

        // DEFENSE-IN-DEPTH: tenant_id predicate on the current-row SELECT (cross-tenant -> 404).

        const cur = (await pool.query('SELECT id, status, requested_by FROM roi_requests WHERE id=$1 AND tenant_id=$2', [id, tenantId])).rows[0];

        if (!cur) return res.status(404).json({ error: 'ROI request not found' });

        // SEGREGATION OF DUTIES: the requester cannot approve their own ROI request.

        if (action === 'approve' && cur.requested_by === actor.id) return res.status(403).json({ error: 'Cannot self-approve ROI request' });

        let r, audit;

        // Every UPDATE also binds tenant_id=$3 so a bypassing DB role cannot mutate a foreign-tenant row.

        if (action === 'approve') {

            if (cur.status !== 'pending') return res.status(409).json({ error: 'Only pending requests can be approved' });

            r = await pool.query("UPDATE roi_requests SET status='approved', approved_by=$1 WHERE id=$2 AND status='pending' AND tenant_id=$3 RETURNING *", [actor.id, id, tenantId]);

            audit = 'ROI_APPROVE';

        } else if (action === 'deny') {

            if (cur.status !== 'pending') return res.status(409).json({ error: 'Only pending requests can be denied' });

            r = await pool.query("UPDATE roi_requests SET status='denied', approved_by=$1 WHERE id=$2 AND status='pending' AND tenant_id=$3 RETURNING *", [actor.id, id, tenantId]);

            audit = 'ROI_DENY';

        } else if (action === 'release') {

            if (cur.status !== 'approved') return res.status(409).json({ error: 'Only approved requests can be released' });

            r = await pool.query("UPDATE roi_requests SET status='released', released_at=now() WHERE id=$1 AND status='approved' AND tenant_id=$2 RETURNING *", [id, tenantId]);

            audit = 'ROI_RELEASE';

        } else {

            return res.status(400).json({ error: 'Invalid action (approve|deny|release)' });

        }

        if (!r || r.rowCount === 0) return res.status(409).json({ error: 'State changed; refresh and retry' });

        logAudit(actor.id, actor.display_name || actor.name, audit, 'HIM', `ROI #${id} -> ${r.rows[0].status}`, req.ip);

        res.json(r.rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/him/access-log', requireAuth, requireRole('him', 'medical-records'), requireTenantScope, async (req, res) => {

    try {

        if (!isHimOrAdmin(req)) return res.status(403).json({ error: 'Access denied' }); // strict HIM/Admin only

        const { tenantId } = getRequestTenantContext(req);

        if (!tenantId) return res.json([]); // FAIL-CLOSED: never run unfiltered

        // DEFENSE-IN-DEPTH: explicit tenant_id predicate (always), independent of FORCE RLS.

        const params = [tenantId], where = ['tenant_id=$1'];

        const { patient_id } = req.query;

        if (patient_id) { params.push(parseInt(patient_id, 10)); where.push(`patient_id=$${params.length}`); }

        const sql = 'SELECT * FROM record_access_log WHERE ' + where.join(' AND ') + ' ORDER BY id DESC LIMIT 500';

        res.json((await pool.query(sql, params)).rows);

    } catch (e) { if (optionalReadFallback(res, e)) return; res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/him/break-glass', requireAuth, requireRole('him', 'medical-records'), requireTenantScope, async (req, res) => {

    try {

        if (!isHimOrAdmin(req)) return res.status(403).json({ error: 'Access denied' }); // strict HIM/Admin only

        const { tenantId, facilityId } = getRequestTenantContext(req);

        if (!tenantId) return res.status(403).json({ error: 'Tenant scope required' }); // FAIL-CLOSED

        const actor = req.session.user;

        const { patient_id, reason } = req.body;

        const pid = parseInt(patient_id, 10);

        if (!Number.isFinite(pid)) return res.status(400).json({ error: 'patient_id required' });

        if (!reason || !String(reason).trim()) return res.status(400).json({ error: 'Break-glass reason required' });

        // record the emergency access (fail-closed tenant stamping)

        const result = await pool.query(

            "INSERT INTO record_access_log (tenant_id, facility_id, patient_id, accessor_id, access_type, reason) VALUES ($1,$2,$3,$4,'break_glass',$5) RETURNING *",

            [tenantId, facilityId || null, pid, actor.id, String(reason)]);

        // raise an audit ALERT

        logAudit(actor.id, actor.display_name || actor.name, 'BREAK_GLASS', 'HIM', `BREAK-GLASS access patient #${pid}: ${String(reason).slice(0, 200)}`, req.ip);

        res.json({ success: true, access: result.rows[0] });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});


    return router;
}
