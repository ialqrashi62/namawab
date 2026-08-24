const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeInfectionRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, e17RequireTenant, optionalReadFallback, E17_AMS_SEVERITY, E17_PRECAUTION_TYPES }) {
    const router = express.Router();
router.get('/api/infection/surveillance', requireAuth, requireRole('infection'), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e17RequireTenant(req);

        res.json((await pool.query('SELECT * FROM infection_surveillance WHERE tenant_id=$1 ORDER BY id DESC', [tenantId])).rows);

    } catch (e) { res.status(e.statusCode || 500).json({ error: e.statusCode ? e.message : 'Server error' }); }

});

router.post('/api/infection/surveillance', requireAuth, requireRole('infection'), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e17RequireTenant(req);

        const { patient_id, patient_name, infection_type, infection_site, organism, sensitivity, hai_category, device_related, device_type, ward, bed, isolation_type, notes } = req.body;

        let pid = parseInt(patient_id, 10);

        if (!Number.isInteger(pid) || pid <= 0) pid = 0;

        if (pid > 0) {

            const chk = (await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [pid, tenantId])).rows[0];

            if (!chk) return res.status(403).json({ error: 'Invalid patient context or access denied' });

        }

        const r = await pool.query('INSERT INTO infection_surveillance (patient_id,patient_name,infection_type,infection_site,organism,sensitivity,detection_date,hai_category,device_related,device_type,ward,bed,isolation_type,reported_by,notes,tenant_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *',

            [pid, patient_name || '', infection_type || '', infection_site || '', organism || '', sensitivity || '', new Date().toISOString().split('T')[0], hai_category || '', device_related ? 1 : 0, device_type || '', ward || '', bed || '', isolation_type || '', req.session.user?.display_name || '', notes || '', tenantId]);

        logAudit(req.session.user?.id, req.session.user?.display_name || '', 'CREATE_HAI', 'Infection', `Surveillance ${infection_type || ''} hai=${hai_category || ''}`, req.ip);

        res.json(r.rows[0]);

    } catch (e) { res.status(e.statusCode || 500).json({ error: e.statusCode ? e.message : 'Server error' }); }

});

router.get('/api/infection/outbreaks', requireAuth, requireRole('infection'), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e17RequireTenant(req);

        res.json((await pool.query('SELECT * FROM infection_outbreaks WHERE tenant_id=$1 ORDER BY id DESC', [tenantId])).rows);

    } catch (e) { res.status(e.statusCode || 500).json({ error: e.statusCode ? e.message : 'Server error' }); }

});

router.post('/api/infection/outbreaks', requireAuth, requireRole('infection'), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e17RequireTenant(req);

        // L1 FIX: reported_by stamped from session, not trusted from request body.

        const reportedBy = req.session.user?.display_name || req.session.user?.name || '';

        const { outbreak_name, organism, affected_ward, investigation_notes, control_measures } = req.body;

        const r = await pool.query('INSERT INTO infection_outbreaks (outbreak_name,organism,start_date,affected_ward,investigation_notes,control_measures,reported_by,tenant_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',

            [outbreak_name || '', organism || '', new Date().toISOString().split('T')[0], affected_ward || '', investigation_notes || '', control_measures || '', reportedBy, tenantId]);

        res.json(r.rows[0]);

    } catch (e) { res.status(e.statusCode || 500).json({ error: e.statusCode ? e.message : 'Server error' }); }

});

router.put('/api/infection/outbreaks/:id', requireAuth, requireRole('infection'), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e17RequireTenant(req);

        const { status, total_cases, control_measures } = req.body;

        const sets = []; const vals = []; let i = 1;

        if (status) { sets.push(`status=$${i++}`); vals.push(status); if (status === 'Resolved') { sets.push(`end_date=$${i++}`); vals.push(new Date().toISOString().split('T')[0]); } }

        if (total_cases !== undefined) { sets.push(`total_cases=$${i++}`); vals.push(total_cases); }

        if (control_measures) { sets.push(`control_measures=$${i++}`); vals.push(control_measures); }

        if (!sets.length) return res.json({ success: true });

        vals.push(req.params.id); vals.push(tenantId);

        await pool.query(`UPDATE infection_outbreaks SET ${sets.join(',')} WHERE id=$${i++} AND tenant_id=$${i}`, vals);

        res.json({ success: true });

    } catch (e) { res.status(e.statusCode || 500).json({ error: e.statusCode ? e.message : 'Server error' }); }

});

router.post('/api/infection/exposures', requireAuth, requireRole('infection'), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e17RequireTenant(req);

        // L1 FIX: reported_by stamped from session, not trusted from request body.

        const reportedBy = req.session.user?.display_name || req.session.user?.name || '';

        const { employee_id, employee_name, exposure_type, source_patient, body_fluid, ppe_worn, action_taken, followup_date } = req.body;

        const r = await pool.query('INSERT INTO employee_exposures (employee_id,employee_name,exposure_type,exposure_date,source_patient,body_fluid,ppe_worn,action_taken,followup_date,reported_by,tenant_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *',

            [employee_id || '', employee_name || '', exposure_type || '', new Date().toISOString().split('T')[0], source_patient || '', body_fluid || '', ppe_worn || '', action_taken || '', followup_date || null, reportedBy, tenantId]);

        res.json(r.rows[0]);

    } catch (e) { res.status(e.statusCode || 500).json({ error: e.statusCode ? e.message : 'Server error' }); }

});

router.get('/api/infection/exposures', requireAuth, requireRole('infection'), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e17RequireTenant(req);

        res.json((await pool.query('SELECT * FROM employee_exposures WHERE tenant_id=$1 ORDER BY id DESC', [tenantId])).rows);

    } catch (e) { res.status(e.statusCode || 500).json({ error: e.statusCode ? e.message : 'Server error' }); }

});

router.post('/api/infection/hand-hygiene', requireAuth, requireRole('infection'), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e17RequireTenant(req);

        // auditor stamped from session (L1 fix for consistency).

        const auditor = req.session.user?.display_name || req.session.user?.name || req.body.auditor || '';

        const { department, moments_observed, moments_compliant, notes } = req.body;

        const obs = parseInt(moments_observed, 10) || 0;

        const comp = parseInt(moments_compliant, 10) || 0;

        const rate = obs > 0 ? parseFloat((comp / obs * 100).toFixed(1)) : 0;

        const r = await pool.query('INSERT INTO hand_hygiene_audits (audit_date,auditor,department,moments_observed,moments_compliant,compliance_rate,notes,tenant_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',

            [new Date().toISOString().split('T')[0], auditor, department || '', obs, comp, rate, notes || '', tenantId]);

        res.json(r.rows[0]);

    } catch (e) { res.status(e.statusCode || 500).json({ error: e.statusCode ? e.message : 'Server error' }); }

});

router.get('/api/infection/hand-hygiene', requireAuth, requireRole('infection'), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e17RequireTenant(req);

        res.json((await pool.query('SELECT * FROM hand_hygiene_audits WHERE tenant_id=$1 ORDER BY id DESC', [tenantId])).rows);

    } catch (e) { res.status(e.statusCode || 500).json({ error: e.statusCode ? e.message : 'Server error' }); }

});

router.get('/api/infection/stats', requireAuth, requireRole('infection'), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e17RequireTenant(req);

        const total = (await pool.query('SELECT COUNT(*) as cnt FROM infection_surveillance WHERE tenant_id=$1', [tenantId])).rows[0].cnt;

        const hai = (await pool.query("SELECT COUNT(*) as cnt FROM infection_surveillance WHERE tenant_id=$1 AND hai_category != ''", [tenantId])).rows[0].cnt;

        const activeIso = (await pool.query("SELECT COUNT(*) as cnt FROM hai_isolation WHERE tenant_id=$1 AND status='Active'", [tenantId])).rows[0].cnt;

        const openAms = (await pool.query("SELECT COUNT(*) as cnt FROM ams_flags WHERE tenant_id=$1 AND status='Open'", [tenantId])).rows[0].cnt;

        res.json({ totalInfections: total, haiCount: hai, activeIsolations: activeIso, openAmsFlags: openAms });

    } catch (e) {

        if (optionalReadFallback(res, e, { totalInfections: 0, haiCount: 0, activeIsolations: 0, openAmsFlags: 0 })) return;

        res.status(e.statusCode || 500).json({ error: e.statusCode ? e.message : 'Server error' });

    }

});

router.get('/api/infection/isolation', requireAuth, requireRole('infection'), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e17RequireTenant(req);

        res.json((await pool.query('SELECT * FROM hai_isolation WHERE tenant_id=$1 ORDER BY id DESC', [tenantId])).rows);

    } catch (e) {

        if (optionalReadFallback(res, e)) return;

        res.status(e.statusCode || 500).json({ error: e.statusCode ? e.message : 'Server error' });

    }

});

router.post('/api/infection/isolation', requireAuth, requireRole('infection'), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e17RequireTenant(req);

        const { facilityId } = getRequestTenantContext(req);

        const { patient_id, patient_name, surveillance_id, precaution_type, hai_category, organism, ward, bed, notes } = req.body;

        const pid = parseInt(patient_id, 10);

        if (!Number.isInteger(pid) || pid <= 0) return res.status(400).json({ error: 'patient_id required' });

        // IDOR guard: patient must belong to caller's tenant.

        const chk = (await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [pid, tenantId])).rows[0];

        if (!chk) return res.status(403).json({ error: 'Invalid patient context or access denied' });

        const prec = E17_PRECAUTION_TYPES.includes(precaution_type) ? precaution_type : 'contact';

        let sid = parseInt(surveillance_id, 10);

        if (!Number.isInteger(sid) || sid <= 0) sid = null;

        const r = await pool.query(

            `INSERT INTO hai_isolation (tenant_id,facility_id,patient_id,patient_name,surveillance_id,precaution_type,hai_category,organism,ward,bed,status,notes,created_by)

             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'Active',$11,$12) RETURNING *`,

            [tenantId, facilityId, pid, patient_name || '', sid, prec, hai_category || '', organism || '', ward || '', bed || '', notes || '', req.session.user?.display_name || '']);

        logAudit(req.session.user?.id, req.session.user?.display_name || '', 'CREATE_ISOLATION', 'Infection', `Isolation ${prec} for patient ${pid}`, req.ip);

        res.json(r.rows[0]);

    } catch (e) { res.status(e.statusCode || 500).json({ error: e.statusCode ? e.message : 'Server error' }); }

});

router.put('/api/infection/isolation/:id', requireAuth, requireRole('infection'), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e17RequireTenant(req);

        const id = parseInt(req.params.id, 10);

        if (!Number.isInteger(id) || id <= 0) return res.status(404).json({ error: 'Not found' });

        const cur = (await pool.query('SELECT * FROM hai_isolation WHERE id=$1 AND tenant_id=$2', [id, tenantId])).rows[0];

        if (!cur) return res.status(404).json({ error: 'Not found or unauthorized' });

        const { status } = req.body;

        if (!['Active', 'Resolved', 'Discontinued'].includes(status)) return res.status(400).json({ error: 'Invalid status' });

        const resolvedAt = (status === 'Resolved' || status === 'Discontinued') ? new Date().toISOString() : null;

        const r = await pool.query('UPDATE hai_isolation SET status=$1, resolved_at=$2 WHERE id=$3 AND tenant_id=$4 RETURNING *', [status, resolvedAt, id, tenantId]);

        logAudit(req.session.user?.id, req.session.user?.display_name || '', 'UPDATE_ISOLATION', 'Infection', `Isolation ${id} -> ${status}`, req.ip);

        res.json(r.rows[0]);

    } catch (e) { res.status(e.statusCode || 500).json({ error: e.statusCode ? e.message : 'Server error' }); }

});

router.get('/api/infection/ams', requireAuth, requireRole('infection'), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e17RequireTenant(req);

        res.json((await pool.query('SELECT * FROM ams_flags WHERE tenant_id=$1 ORDER BY id DESC', [tenantId])).rows);

    } catch (e) {

        if (optionalReadFallback(res, e)) return;

        res.status(e.statusCode || 500).json({ error: e.statusCode ? e.message : 'Server error' });

    }

});

router.post('/api/infection/ams', requireAuth, requireRole('infection'), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e17RequireTenant(req);

        const { facilityId } = getRequestTenantContext(req);

        const { patient_id, patient_name, antibiotic, flag_reason, severity, notes } = req.body;

        const pid = parseInt(patient_id, 10);

        if (!Number.isInteger(pid) || pid <= 0) return res.status(400).json({ error: 'patient_id required' });

        const chk = (await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [pid, tenantId])).rows[0];

        if (!chk) return res.status(403).json({ error: 'Invalid patient context or access denied' });

        const sev = E17_AMS_SEVERITY.includes(severity) ? severity : 'Advisory';

        const r = await pool.query(

            `INSERT INTO ams_flags (tenant_id,facility_id,patient_id,patient_name,antibiotic,flag_reason,severity,flagged_by,status,notes)

             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'Open',$9) RETURNING *`,

            [tenantId, facilityId, pid, patient_name || '', antibiotic || '', flag_reason || '', sev, req.session.user?.display_name || '', notes || '']);

        logAudit(req.session.user?.id, req.session.user?.display_name || '', 'CREATE_AMS_FLAG', 'Infection', `AMS ${antibiotic || ''} severity=${sev} for patient ${pid}`, req.ip);

        res.json(r.rows[0]);

    } catch (e) { res.status(e.statusCode || 500).json({ error: e.statusCode ? e.message : 'Server error' }); }

});

router.put('/api/infection/ams/:id', requireAuth, requireRole('infection'), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e17RequireTenant(req);

        const id = parseInt(req.params.id, 10);

        if (!Number.isInteger(id) || id <= 0) return res.status(404).json({ error: 'Not found' });

        const cur = (await pool.query('SELECT * FROM ams_flags WHERE id=$1 AND tenant_id=$2', [id, tenantId])).rows[0];

        if (!cur) return res.status(404).json({ error: 'Not found or unauthorized' });

        const { status, review_outcome, notes } = req.body;

        const sets = []; const vals = []; let i = 1;

        if (status !== undefined) {

            if (!['Open', 'Reviewed', 'Closed'].includes(status)) return res.status(400).json({ error: 'Invalid status' });

            sets.push(`status=$${i++}`); vals.push(status);

            if (status === 'Reviewed' || status === 'Closed') {

                sets.push(`reviewed_by=$${i++}`); vals.push(req.session.user?.display_name || '');

                sets.push(`reviewed_at=$${i++}`); vals.push(new Date().toISOString());

            }

        }

        if (review_outcome !== undefined) { sets.push(`review_outcome=$${i++}`); vals.push(review_outcome); }

        if (notes !== undefined) { sets.push(`notes=$${i++}`); vals.push(notes); }

        if (!sets.length) return res.json(cur);

        vals.push(id); vals.push(tenantId);

        const r = await pool.query(`UPDATE ams_flags SET ${sets.join(',')} WHERE id=$${i++} AND tenant_id=$${i} RETURNING *`, vals);

        logAudit(req.session.user?.id, req.session.user?.display_name || '', 'UPDATE_AMS_FLAG', 'Infection', `AMS ${id} -> ${status || cur.status}`, req.ip);

        res.json(r.rows[0]);

    } catch (e) { res.status(e.statusCode || 500).json({ error: e.statusCode ? e.message : 'Server error' }); }

});

router.get('/api/infection-control/reports', requireAuth, requireRole('infection'), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e17RequireTenant(req);

        res.json((await pool.query('SELECT * FROM infection_control_reports WHERE tenant_id=$1 ORDER BY created_at DESC', [tenantId])).rows);

    } catch (e) { res.status(e.statusCode || 500).json({ error: e.statusCode ? e.message : 'Server error' }); }

});

router.post('/api/infection-control/reports', requireAuth, requireRole('infection'), requireTenantScope, async (req, res) => {

    try {

        // C1 FIX: fail-closed tenant required; unscoped fallback removed.

        const tenantId = e17RequireTenant(req);

        const { patient_name, infection_type, ward, isolation_type, culture_results, action_taken, status } = req.body;

        const reportedBy = req.session.user?.display_name || req.session.user?.name || '';

        const r = await pool.query(

            'INSERT INTO infection_control_reports (patient_name,infection_type,ward,isolation_type,culture_results,action_taken,status,reported_by,tenant_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *',

            [patient_name || '', infection_type || '', ward || '', isolation_type || '', culture_results || '', action_taken || '', status || 'active', reportedBy, tenantId]

        );

        res.json(r.rows[0]);

    } catch (e) { res.status(e.statusCode || 500).json({ error: e.statusCode ? e.message : 'Server error' }); }

});

router.put('/api/infection-control/reports/:id', requireAuth, requireRole('infection'), requireTenantScope, async (req, res) => {

    try {

        // C1 FIX: fail-closed tenant required; unscoped fallback removed.

        const tenantId = e17RequireTenant(req);

        const { status } = req.body;

        const r = await pool.query(

            'UPDATE infection_control_reports SET status=$1 WHERE id=$2 AND tenant_id=$3 RETURNING *',

            [status, req.params.id, tenantId]);

        if (r.rows.length === 0) return res.status(404).json({ error: 'Not found or unauthorized' });

        res.json(r.rows[0]);

    } catch (e) { res.status(e.statusCode || 500).json({ error: e.statusCode ? e.message : 'Server error' }); }

});


    return router;
}
