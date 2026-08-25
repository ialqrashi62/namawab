const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeQualityRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, e17CanSeeConfidential, e17ComputeRisk, e17IsValidCapaTransition, e17IsValidIncidentTransition, e17RequireTenant, optionalReadFallback, E17_CAPA_TYPES, E17_INCIDENT_HARM, E17_INCIDENT_SEVERITY, E17_INCIDENT_TYPES }) {
    const router = express.Router();
router.get('/api/quality/incidents', requireAuth, requireRole('quality'), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e17RequireTenant(req);

        // Confidential incidents hidden from non-privileged roles (defense-in-depth on top of RLS).

        const q = e17CanSeeConfidential(req)

            ? 'SELECT * FROM quality_incidents WHERE tenant_id=$1 ORDER BY id DESC'

            : 'SELECT * FROM quality_incidents WHERE tenant_id=$1 AND confidential=0 ORDER BY id DESC';

        res.json((await pool.query(q, [tenantId])).rows);

    } catch (e) { res.status(e.statusCode || 500).json({ error: e.statusCode ? e.message : 'Server error' }); }

});

router.post('/api/quality/incidents', requireAuth, requireRole('quality'), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e17RequireTenant(req);

        const { facilityId } = getRequestTenantContext(req);

        const { incident_type, severity, harm_level, near_miss, confidential, incident_date, incident_time, department, location, patient_id, patient_name, description, immediate_action, encounter_id, visit_id } = req.body;



        // Anti-spoof: validate authority fields server-side; reject unknown enum values.

        const sev = E17_INCIDENT_SEVERITY.includes(severity) ? severity : 'low';

        const harm = E17_INCIDENT_HARM.includes(harm_level) ? harm_level : 'None';

        const itype = E17_INCIDENT_TYPES.includes(incident_type) ? incident_type : 'other';

        const isNearMiss = (near_miss === true || near_miss === 1 || near_miss === '1' || itype === 'near_miss') ? 1 : 0;

        const isConfidential = (confidential === true || confidential === 1 || confidential === '1') ? 1 : 0;



        // Validate optional patient reference belongs to this tenant (IDOR guard).

        let pid = parseInt(patient_id, 10);

        if (!Number.isInteger(pid) || pid <= 0) pid = 0;

        if (pid > 0) {

            const chk = (await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [pid, tenantId])).rows[0];

            if (!chk) return res.status(403).json({ error: 'Invalid patient context or access denied' });

        }



        const r = await pool.query(

            `INSERT INTO quality_incidents

             (incident_type,severity,harm_level,near_miss,confidential,incident_date,incident_time,department,location,patient_id,patient_name,description,immediate_action,reported_by,encounter_id,visit_id,status,workflow_state,tenant_id,facility_id)

             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,'Open','Open',$17,$18) RETURNING *`,

            [itype, sev, harm, isNearMiss, isConfidential, incident_date || new Date().toISOString().split('T')[0], incident_time || '', department || '', location || '', pid, patient_name || '', description || '', immediate_action || '', req.session.user?.display_name || req.session.user?.name || '', encounter_id || null, visit_id || null, tenantId, facilityId]

        );

        logAudit(req.session.user?.id, req.session.user?.display_name || '', 'CREATE_INCIDENT', 'Quality', `Reported ${itype} severity=${sev} harm=${harm}${isConfidential ? ' [confidential]' : ''}`, req.ip);

        res.json(r.rows[0]);

    } catch (e) { console.error('[POST QUALITY INCIDENT ERROR]', e); res.status(e.statusCode || 500).json({ error: e.statusCode ? e.message : 'Server error' }); }

});

router.put('/api/quality/incidents/:id', requireAuth, requireRole('quality'), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e17RequireTenant(req);

        const id = parseInt(req.params.id, 10);

        if (!Number.isInteger(id) || id <= 0) return res.status(404).json({ error: 'Not found' });



        // Load current row (tenant-scoped) to enforce the state machine server-side.

        const cur = (await pool.query('SELECT * FROM quality_incidents WHERE id=$1 AND tenant_id=$2', [id, tenantId])).rows[0];

        if (!cur) return res.status(404).json({ error: 'Not found or unauthorized' });

        // SECURITY-HOOK FIX: confidential incident gate — non-privileged roles cannot mutate confidential incidents.

        if (cur.confidential && !e17CanSeeConfidential(req)) return res.status(404).json({ error: 'Not found or unauthorized' });



        const { status, assigned_to, root_cause, corrective_action, preventive_action } = req.body;

        const sets = []; const vals = []; let i = 1;

        if (status !== undefined && status !== null && status !== cur.workflow_state) {

            // State machine: reject invalid transitions (legacy 'Closed' shortcut also validated).

            if (!e17IsValidIncidentTransition(cur.workflow_state, status)) {

                return res.status(409).json({ error: `Invalid incident transition ${cur.workflow_state} -> ${status}` });

            }

            sets.push(`workflow_state=$${i++}`); vals.push(status);

            sets.push(`status=$${i++}`); vals.push(status === 'Closed' ? 'Closed' : 'Open');

            if (status === 'Closed') { sets.push(`closed_date=$${i++}`); vals.push(new Date().toISOString().split('T')[0]); }

        }

        if (assigned_to !== undefined) { sets.push(`assigned_to=$${i++}`); vals.push(assigned_to); }

        if (root_cause !== undefined) { sets.push(`root_cause=$${i++}`); vals.push(root_cause); }

        if (corrective_action !== undefined) { sets.push(`corrective_action=$${i++}`); vals.push(corrective_action); }

        if (preventive_action !== undefined) { sets.push(`preventive_action=$${i++}`); vals.push(preventive_action); }

        if (!sets.length) return res.json(cur);

        vals.push(id); vals.push(tenantId);

        const r = await pool.query(`UPDATE quality_incidents SET ${sets.join(',')} WHERE id=$${i++} AND tenant_id=$${i} RETURNING *`, vals);

        logAudit(req.session.user?.id, req.session.user?.display_name || '', 'UPDATE_INCIDENT', 'Quality', `Incident ${id} -> ${status || cur.workflow_state}`, req.ip);

        res.json(r.rows[0]);

    } catch (e) { res.status(e.statusCode || 500).json({ error: e.statusCode ? e.message : 'Server error' }); }

});

router.get('/api/quality/satisfaction', requireAuth, requireRole('quality'), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e17RequireTenant(req);

        res.json((await pool.query('SELECT * FROM quality_patient_satisfaction WHERE tenant_id=$1 ORDER BY id DESC', [tenantId])).rows);

    } catch (e) { res.status(e.statusCode || 500).json({ error: e.statusCode ? e.message : 'Server error' }); }

});

router.post('/api/quality/satisfaction', requireAuth, requireRole('quality'), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e17RequireTenant(req);

        const { patient_id, patient_name, department, overall_rating, cleanliness, staff_courtesy, wait_time, communication, pain_management, food_quality, comments, would_recommend } = req.body;

        const pid = parseInt(patient_id, 10);

        // I2 FIX: IDOR guard — non-null patient_id must belong to this tenant; anonymous surveys (null/0) are allowed.

        if (pid && pid > 0) {

            const chk = (await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [pid, tenantId])).rows[0];

            if (!chk) return res.status(403).json({ error: 'Invalid patient context or access denied' });

        }

        const r = await pool.query(

            'INSERT INTO quality_patient_satisfaction (patient_id,patient_name,department,survey_date,overall_rating,cleanliness,staff_courtesy,wait_time,communication,pain_management,food_quality,comments,would_recommend,tenant_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *',

            [pid > 0 ? pid : 0, patient_name || '', department || '', new Date().toISOString().split('T')[0], overall_rating, cleanliness, staff_courtesy, wait_time, communication, pain_management, food_quality, comments, would_recommend ? 1 : 0, tenantId]);

        res.json(r.rows[0]);

    } catch (e) { res.status(e.statusCode || 500).json({ error: e.statusCode ? e.message : 'Server error' }); }

});

router.get('/api/quality/kpis', requireAuth, requireRole('quality'), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e17RequireTenant(req);

        res.json((await pool.query('SELECT * FROM quality_kpis WHERE tenant_id=$1 ORDER BY id DESC', [tenantId])).rows);

    } catch (e) { res.status(e.statusCode || 500).json({ error: e.statusCode ? e.message : 'Server error' }); }

});

router.post('/api/quality/kpis', requireAuth, requireRole('quality'), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e17RequireTenant(req);

        const { kpi_name, kpi_name_ar, category, target_value, actual_value, unit, period, department } = req.body;

        // Anti-spoof: status is derived server-side from target vs actual, never trusted from client.

        const tgt = parseFloat(target_value) || 0;

        const act = parseFloat(actual_value) || 0;

        const status = act >= tgt ? 'On Track' : (tgt > 0 && act >= tgt * 0.8) ? 'At Risk' : 'Below Target';

        const r = await pool.query(

            'INSERT INTO quality_kpis (kpi_name,kpi_name_ar,category,target_value,actual_value,unit,period,department,status,tenant_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *',

            [kpi_name || '', kpi_name_ar || '', category || '', tgt, act, unit || '%', period || '', department || '', status, tenantId]);

        res.json(r.rows[0]);

    } catch (e) { res.status(e.statusCode || 500).json({ error: e.statusCode ? e.message : 'Server error' }); }

});

router.get('/api/quality/stats', requireAuth, requireRole('quality'), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e17RequireTenant(req);

        const open = (await pool.query("SELECT COUNT(*) as cnt FROM quality_incidents WHERE tenant_id=$1 AND workflow_state<>'Closed'", [tenantId])).rows[0].cnt;

        const total = (await pool.query('SELECT COUNT(*) as cnt FROM quality_incidents WHERE tenant_id=$1', [tenantId])).rows[0].cnt;

        const avgSat = (await pool.query('SELECT COALESCE(AVG(overall_rating),0) as avg FROM quality_patient_satisfaction WHERE tenant_id=$1', [tenantId])).rows[0].avg;

        const kpiOnTrack = (await pool.query("SELECT COUNT(*) as cnt FROM quality_kpis WHERE tenant_id=$1 AND status='On Track'", [tenantId])).rows[0].cnt;

        const kpiTotal = (await pool.query('SELECT COUNT(*) as cnt FROM quality_kpis WHERE tenant_id=$1', [tenantId])).rows[0].cnt;

        const openCapa = (await pool.query("SELECT COUNT(*) as cnt FROM quality_capa WHERE tenant_id=$1 AND status IN ('Pending','InProgress')", [tenantId])).rows[0].cnt;

        const openRisks = (await pool.query("SELECT COUNT(*) as cnt FROM quality_risk_register WHERE tenant_id=$1 AND status<>'Closed'", [tenantId])).rows[0].cnt;

        res.json({ openIncidents: open, totalIncidents: total, avgSatisfaction: parseFloat(parseFloat(avgSat).toFixed(1)), kpiOnTrack, kpiTotal, openCapa, openRisks });

    } catch (e) {

        if (optionalReadFallback(res, e, { openIncidents: 0, totalIncidents: 0, avgSatisfaction: 0, kpiOnTrack: 0, kpiTotal: 0, openCapa: 0, openRisks: 0 })) return;

        res.status(e.statusCode || 500).json({ error: e.statusCode ? e.message : 'Server error' });

    }

});

router.get('/api/quality/incidents/:id/capa', requireAuth, requireRole('quality'), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e17RequireTenant(req);

        const incidentId = parseInt(req.params.id, 10);

        if (!Number.isInteger(incidentId) || incidentId <= 0) return res.status(404).json({ error: 'Not found' });

        // SECURITY-HOOK FIX: load incident with confidential flag; gate non-privileged roles.

        const inc = (await pool.query('SELECT id, confidential FROM quality_incidents WHERE id=$1 AND tenant_id=$2', [incidentId, tenantId])).rows[0];

        if (!inc) return res.status(404).json({ error: 'Not found or unauthorized' });

        if (inc.confidential && !e17CanSeeConfidential(req)) return res.status(404).json({ error: 'Not found or unauthorized' });

        res.json((await pool.query('SELECT * FROM quality_capa WHERE incident_id=$1 AND tenant_id=$2 ORDER BY id DESC', [incidentId, tenantId])).rows);

    } catch (e) { res.status(e.statusCode || 500).json({ error: e.statusCode ? e.message : 'Server error' }); }

});

router.post('/api/quality/incidents/:id/capa', requireAuth, requireRole('quality'), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e17RequireTenant(req);

        const { facilityId } = getRequestTenantContext(req);

        const incidentId = parseInt(req.params.id, 10);

        if (!Number.isInteger(incidentId) || incidentId <= 0) return res.status(404).json({ error: 'Not found' });

        // SECURITY-HOOK FIX: load incident with confidential flag; gate non-privileged roles from writing CAPA to confidential incidents.

        const inc = (await pool.query('SELECT id, confidential FROM quality_incidents WHERE id=$1 AND tenant_id=$2', [incidentId, tenantId])).rows[0];

        if (!inc) return res.status(404).json({ error: 'Not found or unauthorized' });

        if (inc.confidential && !e17CanSeeConfidential(req)) return res.status(404).json({ error: 'Not found or unauthorized' });



        const { capa_type, title, description, root_cause, owner_user_id, owner_name, due_date } = req.body;

        const ctype = E17_CAPA_TYPES.includes(capa_type) ? capa_type : 'Corrective';

        const ownerId = parseInt(owner_user_id, 10);

        const r = await pool.query(

            `INSERT INTO quality_capa (tenant_id,facility_id,incident_id,capa_type,title,description,root_cause,owner_user_id,owner_name,due_date,status,created_by)

             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'Pending',$11) RETURNING *`,

            [tenantId, facilityId, incidentId, ctype, title || '', description || '', root_cause || '', Number.isInteger(ownerId) ? ownerId : null, owner_name || '', due_date || null, req.session.user?.display_name || '']);

        logAudit(req.session.user?.id, req.session.user?.display_name || '', 'CREATE_CAPA', 'Quality', `CAPA(${ctype}) for incident ${incidentId}`, req.ip);

        res.json(r.rows[0]);

    } catch (e) { res.status(e.statusCode || 500).json({ error: e.statusCode ? e.message : 'Server error' }); }

});

router.put('/api/quality/capa/:id', requireAuth, requireRole('quality'), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e17RequireTenant(req);

        const id = parseInt(req.params.id, 10);

        if (!Number.isInteger(id) || id <= 0) return res.status(404).json({ error: 'Not found' });

        const cur = (await pool.query('SELECT * FROM quality_capa WHERE id=$1 AND tenant_id=$2', [id, tenantId])).rows[0];

        if (!cur) return res.status(404).json({ error: 'Not found or unauthorized' });

        // SECURITY-HOOK FIX: if CAPA is linked to a confidential incident, gate non-privileged roles.

        if (cur.incident_id) {

            const parentInc = (await pool.query('SELECT confidential FROM quality_incidents WHERE id=$1 AND tenant_id=$2', [cur.incident_id, tenantId])).rows[0];

            if (parentInc && parentInc.confidential && !e17CanSeeConfidential(req)) return res.status(404).json({ error: 'Not found or unauthorized' });

        }



        const { status, completion_notes, due_date, owner_name } = req.body;

        const sets = []; const vals = []; let i = 1;

        if (status !== undefined && status !== null && status !== cur.status) {

            // CAPA state machine: reject invalid transitions with 409.

            if (!e17IsValidCapaTransition(cur.status, status)) {

                return res.status(409).json({ error: `Invalid CAPA transition ${cur.status} -> ${status}` });

            }

            sets.push(`status=$${i++}`); vals.push(status);

            if (status === 'Completed') { sets.push(`completion_date=$${i++}`); vals.push(new Date().toISOString().split('T')[0]); }

            if (status === 'Verified') { sets.push(`verified_by=$${i++}`); vals.push(req.session.user?.display_name || ''); }

        }

        if (completion_notes !== undefined) { sets.push(`completion_notes=$${i++}`); vals.push(completion_notes); }

        if (due_date !== undefined) { sets.push(`due_date=$${i++}`); vals.push(due_date || null); }

        if (owner_name !== undefined) { sets.push(`owner_name=$${i++}`); vals.push(owner_name); }

        if (!sets.length) return res.json(cur);

        vals.push(id); vals.push(tenantId);

        const r = await pool.query(`UPDATE quality_capa SET ${sets.join(',')} WHERE id=$${i++} AND tenant_id=$${i} RETURNING *`, vals);

        logAudit(req.session.user?.id, req.session.user?.display_name || '', 'UPDATE_CAPA', 'Quality', `CAPA ${id} -> ${status || cur.status}`, req.ip);

        res.json(r.rows[0]);

    } catch (e) { res.status(e.statusCode || 500).json({ error: e.statusCode ? e.message : 'Server error' }); }

});

router.get('/api/quality/risks', requireAuth, requireRole('quality'), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e17RequireTenant(req);

        res.json((await pool.query('SELECT * FROM quality_risk_register WHERE tenant_id=$1 ORDER BY risk_score DESC, id DESC', [tenantId])).rows);

    } catch (e) {

        if (optionalReadFallback(res, e)) return;

        res.status(e.statusCode || 500).json({ error: e.statusCode ? e.message : 'Server error' });

    }

});

router.post('/api/quality/risks', requireAuth, requireRole('quality'), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e17RequireTenant(req);

        const { facilityId } = getRequestTenantContext(req);

        const { incident_id, risk_title, category, likelihood, impact, control_measure, owner_name, review_date } = req.body;

        // Anti-spoof: score + level computed server-side, never trusted from client.

        const rk = e17ComputeRisk(likelihood, impact);

        let incId = parseInt(incident_id, 10);

        if (!Number.isInteger(incId) || incId <= 0) incId = null;

        if (incId) {

            const inc = (await pool.query('SELECT id FROM quality_incidents WHERE id=$1 AND tenant_id=$2', [incId, tenantId])).rows[0];

            if (!inc) return res.status(403).json({ error: 'Invalid incident context or access denied' });

        }

        const r = await pool.query(

            `INSERT INTO quality_risk_register (tenant_id,facility_id,incident_id,risk_title,category,likelihood,impact,risk_score,risk_level,control_measure,owner_name,review_date,status,created_by)

             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'Open',$13) RETURNING *`,

            [tenantId, facilityId, incId, risk_title || '', category || '', rk.likelihood, rk.impact, rk.score, rk.level, control_measure || '', owner_name || '', review_date || null, req.session.user?.display_name || '']);

        logAudit(req.session.user?.id, req.session.user?.display_name || '', 'CREATE_RISK', 'Quality', `Risk "${(risk_title || '').slice(0, 40)}" score=${rk.score} level=${rk.level}`, req.ip);

        res.json(r.rows[0]);

    } catch (e) { res.status(e.statusCode || 500).json({ error: e.statusCode ? e.message : 'Server error' }); }

});

router.put('/api/quality/risks/:id', requireAuth, requireRole('quality'), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e17RequireTenant(req);

        const id = parseInt(req.params.id, 10);

        if (!Number.isInteger(id) || id <= 0) return res.status(404).json({ error: 'Not found' });

        const cur = (await pool.query('SELECT * FROM quality_risk_register WHERE id=$1 AND tenant_id=$2', [id, tenantId])).rows[0];

        if (!cur) return res.status(404).json({ error: 'Not found or unauthorized' });



        const { status, control_measure, residual_likelihood, residual_impact, review_date } = req.body;

        const sets = []; const vals = []; let i = 1;

        if (status !== undefined && ['Open', 'Mitigating', 'Closed'].includes(status)) { sets.push(`status=$${i++}`); vals.push(status); }

        if (control_measure !== undefined) { sets.push(`control_measure=$${i++}`); vals.push(control_measure); }

        if (residual_likelihood !== undefined && residual_impact !== undefined) {

            // Anti-spoof: residual score recomputed server-side.

            const rr = e17ComputeRisk(residual_likelihood, residual_impact);

            sets.push(`residual_likelihood=$${i++}`); vals.push(rr.likelihood);

            sets.push(`residual_impact=$${i++}`); vals.push(rr.impact);

            sets.push(`residual_score=$${i++}`); vals.push(rr.score);

        }

        if (review_date !== undefined) { sets.push(`review_date=$${i++}`); vals.push(review_date || null); }

        if (!sets.length) return res.json(cur);

        vals.push(id); vals.push(tenantId);

        const r = await pool.query(`UPDATE quality_risk_register SET ${sets.join(',')} WHERE id=$${i++} AND tenant_id=$${i} RETURNING *`, vals);

        logAudit(req.session.user?.id, req.session.user?.display_name || '', 'UPDATE_RISK', 'Quality', `Risk ${id} -> ${status || cur.status}`, req.ip);

        res.json(r.rows[0]);

    } catch (e) { res.status(e.statusCode || 500).json({ error: e.statusCode ? e.message : 'Server error' }); }

});


    return router;
}
