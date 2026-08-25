const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makePathologyRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, pathologyEngine, optionalReadFallback }) {
    const router = express.Router();
router.get('/api/pathology/cases', requireAuth, requireRole('pathology', 'lab', 'doctor'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        if (!tenantId) return res.json([]); // fail-closed

        res.json((await pool.query('SELECT * FROM pathology_cases WHERE tenant_id=$1 ORDER BY created_at DESC', [tenantId])).rows);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/pathology/cases', requireAuth, requireRole('pathology', 'lab'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId, facilityId } = getRequestTenantContext(req);

        if (!tenantId) return res.status(403).json({ error: 'Tenant scope required' });

        const { patient_id, patient_name, specimen_type, collection_date } = req.body;

        const pid = parseInt(patient_id, 10);

        if (Number.isInteger(pid)) {

            const pat = await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [pid, tenantId]);

            if (!pat.rows[0]) return res.status(404).json({ error: 'Patient not found' }); // anti-IDOR

        }

        const result = await pool.query(

            'INSERT INTO pathology_cases (patient_id, patient_name, specimen_type, collection_date, received_date, status, tenant_id, facility_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',

            [Number.isInteger(pid) ? pid : null, patient_name || '', specimen_type || '',

             collection_date || new Date().toISOString().split('T')[0], new Date().toISOString().split('T')[0], 'Received', tenantId, facilityId || null]);

        logAudit(req.session.user?.id, req.session.user?.name, 'PATHOLOGY_CASE_CREATE', 'Pathology', JSON.stringify({ id: result.rows[0].id }), req.ip);

        res.json(result.rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.put('/api/pathology/cases/:id', requireAuth, requireRole('pathology'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const id = parseInt(req.params.id, 10);

        if (!Number.isInteger(id) || !tenantId) return res.status(400).json({ error: 'Invalid request' });

        const own = await pool.query('SELECT id FROM pathology_cases WHERE id=$1 AND tenant_id=$2', [id, tenantId]);

        if (!own.rows[0]) return res.status(404).json({ error: 'Not found' }); // cross-tenant -> 404

        const { gross_description, microscopic_findings, diagnosis, icd_code, stage, grade, status } = req.body;

        await pool.query('UPDATE pathology_cases SET gross_description=$1, microscopic_findings=$2, diagnosis=$3, icd_code=$4, stage=$5, grade=$6, status=$7, pathologist=$8, report_date=$9 WHERE id=$10 AND tenant_id=$11',

            [gross_description || '', microscopic_findings || '', diagnosis || '', icd_code || '', stage || '', grade || '', status || 'Reported', req.session.user.name, new Date().toISOString().split('T')[0], id, tenantId]);

        logAudit(req.session.user?.id, req.session.user?.name, 'PATHOLOGY_CASE_UPDATE', 'Pathology', JSON.stringify({ id }), req.ip);

        res.json({ success: true });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/pathology/specimens', requireAuth, requireRole('pathology', 'lab', 'doctor'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        if (!tenantId) return res.json([]); // fail-closed: no tenant -> zero rows

        const r = await pool.query(

            `SELECT s.*, r.state AS report_state, r.malignancy_flag, r.critical_flag, r.signed_at,

                    p.name AS patient_name

               FROM path_specimens s

               LEFT JOIN path_reports r ON r.specimen_id = s.id AND r.tenant_id = s.tenant_id

               LEFT JOIN patients p ON p.id = s.patient_id AND p.tenant_id = s.tenant_id

              WHERE s.tenant_id = $1

              ORDER BY s.created_at DESC`, [tenantId]);

        res.json(r.rows);

    } catch (e) { if (optionalReadFallback(res, e)) return; console.error('PATH list error:', e.message); res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/pathology/specimens/:id', requireAuth, requireRole('pathology', 'lab', 'doctor'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const sid = parseInt(req.params.id, 10);

        if (!Number.isInteger(sid)) return res.status(400).json({ error: 'Invalid id' });

        if (!tenantId) return res.status(404).json({ error: 'Not found' });

        const sp = await pool.query('SELECT * FROM path_specimens WHERE id=$1 AND tenant_id=$2', [sid, tenantId]);

        if (!sp.rows[0]) return res.status(404).json({ error: 'Not found' }); // cross-tenant -> 404

        const blocks = (await pool.query('SELECT * FROM path_blocks WHERE specimen_id=$1 AND tenant_id=$2 ORDER BY id', [sid, tenantId])).rows;

        const slides = (await pool.query('SELECT * FROM path_slides WHERE specimen_id=$1 AND tenant_id=$2 ORDER BY id', [sid, tenantId])).rows;

        const report = (await pool.query('SELECT * FROM path_reports WHERE specimen_id=$1 AND tenant_id=$2', [sid, tenantId])).rows[0] || null;

        res.json({ specimen: sp.rows[0], blocks, slides, report });

    } catch (e) { console.error('PATH get error:', e.message); res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/pathology/specimens', requireAuth, requireRole('pathology', 'lab'), requireTenantScope, async (req, res) => {

    const client = await pool.connect();

    try {

        const { tenantId, facilityId } = getRequestTenantContext(req);

        if (!tenantId) { client.release(); return res.status(403).json({ error: 'Tenant scope required' }); }

        const { patient_id, visit_id, specimen_type, site, clinical_details, priority } = req.body;

        const pid = parseInt(patient_id, 10);

        if (!Number.isInteger(pid)) { client.release(); return res.status(400).json({ error: 'patient_id required (integer)' }); }

        const allowedPriority = ['routine', 'urgent', 'stat'];

        const prio = allowedPriority.includes(priority) ? priority : 'routine';



        // F3: validate visit_id before BEGIN so we can early-return without a transaction.

        const vid = (visit_id != null && visit_id !== '') ? parseInt(visit_id, 10) : null;

        if (vid !== null && !Number.isInteger(vid)) { client.release(); return res.status(400).json({ error: 'visit_id must be integer' }); }



        await client.query('BEGIN');

        // F1: serialize per-tenant accession generation — prevents race that produces duplicate accession numbers.

        await client.query('SELECT pg_advisory_xact_lock($1::bigint)', [tenantId]);

        // 1. Validate patient belongs to the session tenant (anti-IDOR; 404 not 403).

        const pat = await client.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [pid, tenantId]);

        if (!pat.rows[0]) { await client.query('ROLLBACK'); client.release(); return res.status(404).json({ error: 'Patient not found' }); }



        // 2. Server-authoritative accession number (never from client) — lock today's count.

        const cnt = await client.query(

            "SELECT COUNT(*)::int AS c FROM path_specimens WHERE tenant_id=$1 AND received_at::date = CURRENT_DATE", [tenantId]);

        const accession = pathologyEngine.generateAccession(tenantId, cnt.rows[0].c);



        // 3. Insert specimen (state forced to 'Received'; tenant stamped from session).

        const ins = await client.query(

            `INSERT INTO path_specimens

               (tenant_id, facility_id, patient_id, visit_id, accession_number, specimen_type, site, clinical_details, priority, state, received_at, created_by)

             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'Received',CURRENT_TIMESTAMP,$10) RETURNING *`,

            [tenantId, facilityId || null, pid, vid, accession,

             specimen_type || '', site || '', clinical_details || '', prio, req.session.user?.id || null]);



        // 4. Create the companion report shell (state mirrors specimen).

        await client.query(

            `INSERT INTO path_reports (tenant_id, facility_id, specimen_id, state)

             VALUES ($1,$2,$3,'Received') ON CONFLICT (tenant_id, specimen_id) DO NOTHING`,

            [tenantId, facilityId || null, ins.rows[0].id]);



        await client.query('COMMIT');

        client.release();

        logAudit(req.session.user?.id, req.session.user?.name, 'PATHOLOGY_SPECIMEN_CREATE', 'Pathology',

            JSON.stringify({ specimen_id: ins.rows[0].id, accession, patient_id: pid }), req.ip);

        res.json(ins.rows[0]);

    } catch (e) {

        try { await client.query('ROLLBACK'); } catch (_) {}

        client.release();

        // F1: unique constraint on accession_number (23505) -> 409 to signal retry; avoids raw 500.

        if (e.code === '23505') return res.status(409).json({ error: 'Accession collision; please retry' });

        console.error('PATH create error:', e.message);

        res.status(500).json({ error: 'Server error' });

    }

});

router.post('/api/pathology/specimens/:id/blocks', requireAuth, requireRole('pathology', 'lab'), requireTenantScope, async (req, res) => {

    const client = await pool.connect();

    try {

        const { tenantId } = getRequestTenantContext(req);

        const sid = parseInt(req.params.id, 10);

        if (!Number.isInteger(sid) || !tenantId) { client.release(); return res.status(400).json({ error: 'Invalid request' }); }

        const { block_no, cassette_label, embedding_type } = req.body;

        await client.query('BEGIN');

        const sp = await client.query('SELECT id, state FROM path_specimens WHERE id=$1 AND tenant_id=$2 FOR UPDATE', [sid, tenantId]);

        if (!sp.rows[0]) { await client.query('ROLLBACK'); client.release(); return res.status(404).json({ error: 'Specimen not found' }); }

        if (sp.rows[0].state === 'SignedOut') { await client.query('ROLLBACK'); client.release(); return res.status(409).json({ error: 'Specimen signed out; immutable' }); }

        const ins = await client.query(

            `INSERT INTO path_blocks (tenant_id, specimen_id, block_no, cassette_label, embedding_type)

             VALUES ($1,$2,$3,$4,$5) RETURNING *`,

            [tenantId, sid, String(block_no || '').slice(0, 32) || ('B' + Date.now()), cassette_label || '', embedding_type || 'paraffin']);

        await client.query('UPDATE path_specimens SET blocks_count = blocks_count + 1, updated_at=CURRENT_TIMESTAMP WHERE id=$1 AND tenant_id=$2', [sid, tenantId]);

        await client.query('COMMIT');

        client.release();

        logAudit(req.session.user?.id, req.session.user?.name, 'PATHOLOGY_BLOCK_ADD', 'Pathology', JSON.stringify({ specimen_id: sid, block_id: ins.rows[0].id }), req.ip);

        res.json(ins.rows[0]);

    } catch (e) { try { await client.query('ROLLBACK'); } catch (_) {} client.release(); console.error('PATH block error:', e.message); res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/pathology/blocks/:blockId/slides', requireAuth, requireRole('pathology', 'lab'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const bid = parseInt(req.params.blockId, 10);

        if (!Number.isInteger(bid) || !tenantId) return res.status(400).json({ error: 'Invalid request' });

        const blk = await pool.query('SELECT id, specimen_id FROM path_blocks WHERE id=$1 AND tenant_id=$2', [bid, tenantId]);

        if (!blk.rows[0]) return res.status(404).json({ error: 'Block not found' });

        const { slide_no, stain_type } = req.body;

        const ins = await pool.query(

            `INSERT INTO path_slides (tenant_id, block_id, specimen_id, slide_no, stain_type)

             VALUES ($1,$2,$3,$4,$5) RETURNING *`,

            [tenantId, bid, blk.rows[0].specimen_id, String(slide_no || '').slice(0, 32) || ('S' + Date.now()), stain_type || 'H&E']);

        logAudit(req.session.user?.id, req.session.user?.name, 'PATHOLOGY_SLIDE_ADD', 'Pathology', JSON.stringify({ block_id: bid, slide_id: ins.rows[0].id }), req.ip);

        res.json(ins.rows[0]);

    } catch (e) { console.error('PATH slide error:', e.message); res.status(500).json({ error: 'Server error' }); }

});

router.put('/api/pathology/specimens/:id/state', requireAuth, requireRole('pathology', 'lab'), requireTenantScope, async (req, res) => {

    const client = await pool.connect();

    try {

        const { tenantId } = getRequestTenantContext(req);

        const sid = parseInt(req.params.id, 10);

        if (!Number.isInteger(sid) || !tenantId) { client.release(); return res.status(400).json({ error: 'Invalid request' }); }

        const target = String(req.body?.state || '');

        await client.query('BEGIN');

        const sp = await client.query('SELECT id, state FROM path_specimens WHERE id=$1 AND tenant_id=$2 FOR UPDATE', [sid, tenantId]);

        if (!sp.rows[0]) { await client.query('ROLLBACK'); client.release(); return res.status(404).json({ error: 'Specimen not found' }); }

        const current = sp.rows[0].state;

        if (!pathologyEngine.isValidTransition(current, target)) {

            await client.query('ROLLBACK'); client.release();

            return res.status(409).json({ error: `Invalid state transition ${current} -> ${target}` });

        }

        await client.query('UPDATE path_specimens SET state=$1, updated_at=CURRENT_TIMESTAMP WHERE id=$2 AND tenant_id=$3', [target, sid, tenantId]);

        await client.query('UPDATE path_reports SET state=$1, updated_at=CURRENT_TIMESTAMP WHERE specimen_id=$2 AND tenant_id=$3', [target, sid, tenantId]);

        await client.query('COMMIT');

        client.release();

        logAudit(req.session.user?.id, req.session.user?.name, 'PATHOLOGY_STATE_CHANGE', 'Pathology', JSON.stringify({ specimen_id: sid, from: current, to: target }), req.ip);

        res.json({ success: true, state: target });

    } catch (e) { try { await client.query('ROLLBACK'); } catch (_) {} client.release(); console.error('PATH state error:', e.message); res.status(500).json({ error: 'Server error' }); }

});

router.put('/api/pathology/specimens/:id/report', requireAuth, requireRole('pathology'), requireTenantScope, async (req, res) => {

    const client = await pool.connect();

    try {

        const { tenantId } = getRequestTenantContext(req);

        const sid = parseInt(req.params.id, 10);

        if (!Number.isInteger(sid) || !tenantId) { client.release(); return res.status(400).json({ error: 'Invalid request' }); }

        const { gross_text, micro_text, diagnosis, snomed_codes, icd10_codes } = req.body;

        await client.query('BEGIN');

        const rep = await client.query('SELECT id, state FROM path_reports WHERE specimen_id=$1 AND tenant_id=$2 FOR UPDATE', [sid, tenantId]);

        if (!rep.rows[0]) { await client.query('ROLLBACK'); client.release(); return res.status(404).json({ error: 'Report not found' }); }

        if (pathologyEngine.isImmutable(rep.rows[0].state)) {

            await client.query('ROLLBACK'); client.release();

            return res.status(409).json({ error: 'Report signed out and immutable; use addendum' });

        }

        // Server-derived flags (anti-spoof: ignore any client-supplied flag values).

        const snomed = Array.isArray(snomed_codes) ? snomed_codes.map(String).slice(0, 50) : [];

        const icd10 = Array.isArray(icd10_codes) ? icd10_codes.map(String).slice(0, 50) : [];

        const flags = pathologyEngine.deriveFlags({ diagnosis, micro_text, snomed_codes: snomed });

        await client.query(

            `UPDATE path_reports SET gross_text=$1, micro_text=$2, diagnosis=$3, snomed_codes=$4::jsonb,

                    icd10_codes=$5::jsonb, malignancy_flag=$6, critical_flag=$7, updated_at=CURRENT_TIMESTAMP

              WHERE specimen_id=$8 AND tenant_id=$9`,

            [gross_text || '', micro_text || '', diagnosis || '', JSON.stringify(snomed), JSON.stringify(icd10),

             flags.malignancy_flag, flags.critical_flag, sid, tenantId]);

        await client.query('COMMIT');

        client.release();

        logAudit(req.session.user?.id, req.session.user?.name, 'PATHOLOGY_REPORT_SAVE', 'Pathology', JSON.stringify({ specimen_id: sid, ...flags }), req.ip);

        res.json({ success: true, malignancy_flag: flags.malignancy_flag, critical_flag: flags.critical_flag });

    } catch (e) { try { await client.query('ROLLBACK'); } catch (_) {} client.release(); console.error('PATH report error:', e.message); res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/pathology/specimens/:id/signout', requireAuth, requireRole('pathology'), requireTenantScope, async (req, res) => {

    const client = await pool.connect();

    try {

        const { tenantId } = getRequestTenantContext(req);

        const sid = parseInt(req.params.id, 10);

        if (!Number.isInteger(sid) || !tenantId) { client.release(); return res.status(400).json({ error: 'Invalid request' }); }

        await client.query('BEGIN');

        const sp = await client.query('SELECT id, state FROM path_specimens WHERE id=$1 AND tenant_id=$2 FOR UPDATE', [sid, tenantId]);

        if (!sp.rows[0]) { await client.query('ROLLBACK'); client.release(); return res.status(404).json({ error: 'Specimen not found' }); }

        const current = sp.rows[0].state;

        if (current === 'SignedOut') { await client.query('ROLLBACK'); client.release(); return res.status(409).json({ error: 'Already signed out; addendum-only' }); }

        if (!pathologyEngine.isValidTransition(current, 'SignedOut')) {

            await client.query('ROLLBACK'); client.release();

            return res.status(409).json({ error: `Cannot sign out from ${current}; must reach Reported first` });

        }

        const rep = await client.query('SELECT id, diagnosis FROM path_reports WHERE specimen_id=$1 AND tenant_id=$2 FOR UPDATE', [sid, tenantId]);

        if (!rep.rows[0] || !String(rep.rows[0].diagnosis || '').trim()) {

            await client.query('ROLLBACK'); client.release();

            return res.status(409).json({ error: 'Cannot sign out: diagnosis required' });

        }

        await client.query('UPDATE path_specimens SET state=$1, updated_at=CURRENT_TIMESTAMP WHERE id=$2 AND tenant_id=$3', ['SignedOut', sid, tenantId]);

        await client.query(

            'UPDATE path_reports SET state=$1, signed_at=CURRENT_TIMESTAMP, signed_by=$2, pathologist_id=$2, updated_at=CURRENT_TIMESTAMP WHERE specimen_id=$3 AND tenant_id=$4',

            ['SignedOut', req.session.user?.id || null, sid, tenantId]);

        await client.query('COMMIT');

        client.release();

        logAudit(req.session.user?.id, req.session.user?.name, 'PATHOLOGY_SPECIMEN_SIGNOUT', 'Pathology', JSON.stringify({ specimen_id: sid }), req.ip);

        res.json({ success: true, state: 'SignedOut' });

    } catch (e) { try { await client.query('ROLLBACK'); } catch (_) {} client.release(); console.error('PATH signout error:', e.message); res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/pathology/specimens/:id/addendum', requireAuth, requireRole('pathology'), requireTenantScope, async (req, res) => {

    const client = await pool.connect();

    try {

        const { tenantId } = getRequestTenantContext(req);

        const sid = parseInt(req.params.id, 10);

        if (!Number.isInteger(sid) || !tenantId) { client.release(); return res.status(400).json({ error: 'Invalid request' }); }

        const text = String(req.body?.text || '').trim();

        if (!text) { client.release(); return res.status(400).json({ error: 'Addendum text required' }); }

        await client.query('BEGIN');

        const rep = await client.query('SELECT id, state, addenda, addendum_count FROM path_reports WHERE specimen_id=$1 AND tenant_id=$2 FOR UPDATE', [sid, tenantId]);

        if (!rep.rows[0]) { await client.query('ROLLBACK'); client.release(); return res.status(404).json({ error: 'Report not found' }); }

        if (rep.rows[0].state !== 'SignedOut') { await client.query('ROLLBACK'); client.release(); return res.status(409).json({ error: 'Addendum allowed only after sign-out' }); }

        const entry = { text, by: req.session.user?.name || '', by_id: req.session.user?.id || null, at: new Date().toISOString() };

        const existing = Array.isArray(rep.rows[0].addenda) ? rep.rows[0].addenda : [];

        existing.push(entry);

        await client.query(

            'UPDATE path_reports SET addenda=$1::jsonb, addendum_count=addendum_count+1, updated_at=CURRENT_TIMESTAMP WHERE specimen_id=$2 AND tenant_id=$3',

            [JSON.stringify(existing), sid, tenantId]);

        await client.query('COMMIT');

        client.release();

        logAudit(req.session.user?.id, req.session.user?.name, 'PATHOLOGY_ADDENDUM_ADD', 'Pathology', JSON.stringify({ specimen_id: sid }), req.ip);

        res.json({ success: true, addendum_count: (rep.rows[0].addendum_count || 0) + 1 });

    } catch (e) { try { await client.query('ROLLBACK'); } catch (_) {} client.release(); console.error('PATH addendum error:', e.message); res.status(500).json({ error: 'Server error' }); }

});

router.put('/api/pathology/specimens/:id', requireAuth, requireRole('pathology', 'lab'), requireTenantScope, (req, res) => {

    res.status(409).json({ error: 'Deprecated: use PUT /api/pathology/specimens/:id/state (server-authoritative state machine)' });

});


    return router;
}
