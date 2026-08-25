const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeCssdRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, e16, e16BeginTenantTx, e16RequireTenant }) {
    const router = express.Router();
router.get('/api/cssd/instruments', requireAuth, requireRole('cssd', 'nursing', 'surgery'), requireTenantScope, async (req, res) => {

    try {

        const t = e16RequireTenant(req);

        if (!t.ok) return res.status(403).json({ error: 'Tenant scope required' });

        res.json((await pool.query('SELECT * FROM cssd_instrument_sets WHERE tenant_id=$1 ORDER BY id', [t.tenantId])).rows);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/cssd/instruments', requireAuth, requireRole('cssd', 'nursing', 'surgery'), requireTenantScope, async (req, res) => {

    try {

        const t = e16RequireTenant(req);

        if (!t.ok) return res.status(403).json({ error: 'Tenant scope required' });

        const { set_name, set_name_ar, set_code, category, instrument_count, instruments_list, department } = req.body;

        const r = await pool.query('INSERT INTO cssd_instrument_sets (set_name,set_name_ar,set_code,category,instrument_count,instruments_list,department,tenant_id,facility_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *',

            [set_name, set_name_ar, set_code, category, instrument_count || 0, instruments_list, department, t.tenantId, t.facilityId || null]);

        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_CSSD_INSTRUMENT_SET', 'CSSD', `Created set ${set_name}`, req.ip);

        res.json(r.rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/cssd/cycles', requireAuth, requireRole('cssd', 'nursing', 'surgery'), requireTenantScope, async (req, res) => {

    try {

        const t = e16RequireTenant(req);

        if (!t.ok) return res.status(403).json({ error: 'Tenant scope required' });

        res.json((await pool.query('SELECT * FROM cssd_sterilization_cycles WHERE tenant_id=$1 ORDER BY start_time DESC', [t.tenantId])).rows);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/cssd/cycles', requireAuth, requireRole('cssd', 'nursing', 'surgery'), requireTenantScope, async (req, res) => {

    try {

        const t = e16RequireTenant(req);

        if (!t.ok) return res.status(403).json({ error: 'Tenant scope required' });

        const { cycle_number, machine_name, cycle_type, temperature, pressure, duration_minutes, operator } = req.body;

        // BI result starts Pending and is recorded ONLY via PUT /api/cssd/cycles/:id/bi-result (anti-spoof).

        const r = await pool.query('INSERT INTO cssd_sterilization_cycles (cycle_number,machine_name,cycle_type,temperature,pressure,duration_minutes,operator,status,bi_test_result,tenant_id,facility_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *',

            [cycle_number, machine_name, cycle_type || 'Steam Autoclave', temperature, pressure, duration_minutes, operator, 'running', 'Pending', t.tenantId, t.facilityId || null]);

        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_CSSD_CYCLE', 'CSSD', `Started cycle ${cycle_number}`, req.ip);

        res.json(r.rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.put('/api/cssd/cycles/:id', requireAuth, requireRole('cssd', 'nursing', 'surgery'), requireTenantScope, async (req, res) => {

    // HARDENED (E16): server-side cycle state machine + tenant scope. BI/CI results are NOT

    // accepted here (anti-spoof) — use PUT /api/cssd/cycles/:id/bi-result. Release for sterile

    // issue is the separate fail-CLOSED gate PUT /api/cssd/cycles/:id/release.

    try {

        const t = e16RequireTenant(req);

        if (!t.ok) return res.status(403).json({ error: 'Tenant scope required' });

        const cycleId = e16.e16IntId(req.params.id);

        if (cycleId === null) return res.status(404).json({ error: 'Cycle not found' });

        const target = String(req.body.status || '').toLowerCase();

        if (!target) return res.status(422).json({ error: 'status required' });

        const client = await e16BeginTenantTx(t.tenantId);

        try {

            const cyc = (await client.query('SELECT id, status FROM cssd_sterilization_cycles WHERE id=$1 AND tenant_id=$2 FOR UPDATE', [cycleId, t.tenantId])).rows[0];

            if (!cyc) { await client.query('ROLLBACK'); client.release(); return res.status(404).json({ error: 'Cycle not found' }); }

            if (!e16.canTransitionCycle(String(cyc.status || '').toLowerCase(), target)) {

                await client.query('ROLLBACK'); client.release();

                return res.status(409).json({ error: `Invalid cycle transition ${cyc.status} -> ${target}` });

            }

            const endStamp = (target === 'completed') ? new Date().toISOString() : null;

            const r = (await client.query('UPDATE cssd_sterilization_cycles SET status=$1, end_time=COALESCE($2,end_time) WHERE id=$3 AND tenant_id=$4 RETURNING *', [target, endStamp, cycleId, t.tenantId])).rows[0];

            await client.query('COMMIT'); client.release();

            logAudit(req.session.user?.id, req.session.user?.display_name, 'UPDATE_CSSD_CYCLE_STATUS', 'CSSD', `Cycle #${cycleId}: ${cyc.status} -> ${target}`, req.ip);

            res.json(r);

        } catch (e) { try { await client.query('ROLLBACK'); } catch (_) {} client.release(); throw e; }

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/cssd/load-items', requireAuth, requireRole('cssd', 'nursing', 'surgery'), requireTenantScope, async (req, res) => {

    try {

        const t = e16RequireTenant(req);

        if (!t.ok) return res.status(403).json({ error: 'Tenant scope required' });

        const cycleId = e16.e16IntId(req.body.cycle_id);

        const setId = e16.e16IntId(req.body.set_id);

        const { set_name, barcode } = req.body;

        const r = await pool.query('INSERT INTO cssd_load_items (cycle_id,set_id,set_name,barcode,tenant_id,facility_id) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *', [cycleId, setId, set_name, barcode, t.tenantId, t.facilityId || null]);

        if (setId) await pool.query("UPDATE cssd_instrument_sets SET status='In Sterilization' WHERE id=$1 AND tenant_id=$2", [setId, t.tenantId]);

        res.json(r.rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/cssd/load-items/:cycleId', requireAuth, requireRole('cssd', 'nursing', 'surgery'), requireTenantScope, async (req, res) => {

    try {

        const t = e16RequireTenant(req);

        if (!t.ok) return res.status(403).json({ error: 'Tenant scope required' });

        const cycleId = e16.e16IntId(req.params.cycleId);

        res.json((await pool.query('SELECT * FROM cssd_load_items WHERE cycle_id=$1 AND tenant_id=$2', [cycleId, t.tenantId])).rows);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/cssd/batches', requireAuth, requireRole('cssd', 'nursing', 'surgery'), requireTenantScope, async (req, res) => {

    try {

        // cssd_batches schema provisioned out-of-band (route_level_ddl_batch_b); no DDL in handler

        const t = e16RequireTenant(req);

        if (!t.ok) return res.status(403).json({ error: 'Tenant scope required' });

        res.json((await pool.query('SELECT * FROM cssd_batches WHERE tenant_id=$1 ORDER BY created_at DESC', [t.tenantId])).rows);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/cssd/batches', requireAuth, requireRole('cssd', 'nursing', 'surgery'), requireTenantScope, async (req, res) => {

    try {

        const t = e16RequireTenant(req);

        if (!t.ok) return res.status(403).json({ error: 'Tenant scope required' });

        const { batch_number, items, department, method, temperature, operator } = req.body;

        // status server-set to 'processing'; completion goes through the hardened PUT (no client status).

        const r = await pool.query('INSERT INTO cssd_batches (batch_number,items,department,method,temperature,operator,status,tenant_id,facility_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *', [batch_number, items, department, method, temperature, operator, 'processing', t.tenantId, t.facilityId || null]);

        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_CSSD_BATCH', 'CSSD', `Started batch ${batch_number}`, req.ip);

        res.json(r.rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.put('/api/cssd/batches/:id', requireAuth, requireRole('cssd', 'nursing', 'surgery'), requireTenantScope, async (req, res) => {

    try {

        const t = e16RequireTenant(req);

        if (!t.ok) return res.status(403).json({ error: 'Tenant scope required' });

        const batchId = e16.e16IntId(req.params.id);

        if (batchId === null) return res.status(404).json({ error: 'Batch not found' });

        const targetStatus = String(req.body.status || '');

        if (!['processing', 'completed', 'failed'].includes(targetStatus)) return res.status(422).json({ error: 'Invalid status' });

        // state machine: read current status (tenant-scoped) before update

        const BATCH_TRANSITIONS = { processing: ['completed', 'failed'], completed: [], failed: [] };

        const check = (await pool.query('SELECT id, status FROM cssd_batches WHERE id=$1 AND tenant_id=$2', [batchId, t.tenantId])).rows[0];

        if (!check) return res.status(404).json({ error: 'Batch not found' });

        const currentStatus = String(check.status || '').toLowerCase();

        const allowed = (BATCH_TRANSITIONS[currentStatus] || []).includes(targetStatus);

        if (!allowed) return res.status(409).json({ error: `Invalid batch transition ${currentStatus} -> ${targetStatus}` });

        const r = await pool.query('UPDATE cssd_batches SET status=$1 WHERE id=$2 AND tenant_id=$3 RETURNING *', [targetStatus, batchId, t.tenantId]);

        logAudit(req.session.user?.id, req.session.user?.display_name, 'UPDATE_CSSD_BATCH', 'CSSD', `Batch #${batchId} -> ${status}`, req.ip);

        res.json(r.rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.put('/api/cssd/cycles/:id/bi-result', requireAuth, requireRole('cssd', 'nursing', 'surgery'), requireTenantScope, async (req, res) => {

    try {

        const t = e16RequireTenant(req);

        if (!t.ok) return res.status(403).json({ error: 'Tenant scope required' });

        const cycleId = e16.e16IntId(req.params.id);

        if (cycleId === null) return res.status(404).json({ error: 'Cycle not found' });

        const bi = e16.normIndicator(req.body.bi_test_result);     // normalised server-side

        const ci = e16.normIndicator(req.body.ci_result);

        if (bi === null) return res.status(422).json({ error: 'bi_test_result required' });

        const client = await e16BeginTenantTx(t.tenantId);

        try {

            const cyc = (await client.query('SELECT id, status FROM cssd_sterilization_cycles WHERE id=$1 AND tenant_id=$2 FOR UPDATE', [cycleId, t.tenantId])).rows[0];

            if (!cyc) { await client.query('ROLLBACK'); client.release(); return res.status(404).json({ error: 'Cycle not found' }); }

            const r = (await client.query(

                'UPDATE cssd_sterilization_cycles SET bi_test_result=$1, ci_result=$2, bi_indicator_lot=$3, bi_result_recorded_at=now(), bi_result_by=$4 WHERE id=$5 AND tenant_id=$6 RETURNING *',

                [bi, ci || '', String(req.body.bi_indicator_lot || ''), req.session.user?.display_name || '', cycleId, t.tenantId])).rows[0];

            await client.query('COMMIT'); client.release();

            logAudit(req.session.user?.id, req.session.user?.display_name, 'CSSD_BI_RESULT', 'CSSD', `Cycle #${cycleId} BI=${bi} CI=${ci || 'n/a'}`, req.ip);

            res.json(r);

        } catch (e) { try { await client.query('ROLLBACK'); } catch (_) {} client.release(); throw e; }

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.put('/api/cssd/cycles/:id/release', requireAuth, requireRole('cssd', 'nursing', 'surgery'), requireTenantScope, async (req, res) => {

    try {

        const t = e16RequireTenant(req);

        if (!t.ok) return res.status(403).json({ error: 'Tenant scope required' });

        const cycleId = e16.e16IntId(req.params.id);

        if (cycleId === null) return res.status(404).json({ error: 'Cycle not found' });

        const client = await e16BeginTenantTx(t.tenantId);

        try {

            const cyc = (await client.query('SELECT * FROM cssd_sterilization_cycles WHERE id=$1 AND tenant_id=$2 FOR UPDATE', [cycleId, t.tenantId])).rows[0];

            if (!cyc) { await client.query('ROLLBACK'); client.release(); return res.status(404).json({ error: 'Cycle not found' }); }

            // require the cycle to be completed AND BI passed (engine is authoritative, fail-closed)

            const gate = e16.canIssueSterileLoad(String(cyc.status || '').toLowerCase(), cyc.bi_test_result, cyc.ci_result);

            if (!gate.allowed) {

                await client.query('ROLLBACK'); client.release();

                return res.status(409).json({ error: 'Sterile release blocked', reason: gate.reason });

            }

            await client.query('UPDATE cssd_sterilization_cycles SET released_for_issue=1 WHERE id=$1 AND tenant_id=$2', [cycleId, t.tenantId]);

            // promote this cycle's trays to sterile (only those still in_cycle/packed)

            await client.query("UPDATE cssd_trays SET status='sterile', sterilized_at=now() WHERE cycle_id=$1 AND tenant_id=$2 AND status IN ('packed','in_cycle')", [cycleId, t.tenantId]);

            await client.query('COMMIT'); client.release();

            logAudit(req.session.user?.id, req.session.user?.display_name, 'CSSD_RELEASE_STERILE', 'CSSD', `Cycle #${cycleId} released for issue (BI passed)`, req.ip);

            res.json({ success: true, released: true });

        } catch (e) { try { await client.query('ROLLBACK'); } catch (_) {} client.release(); throw e; }

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/cssd/trays', requireAuth, requireRole('cssd', 'nursing', 'surgery'), requireTenantScope, async (req, res) => {

    try {

        const t = e16RequireTenant(req);

        if (!t.ok) return res.status(403).json({ error: 'Tenant scope required' });

        res.json((await pool.query('SELECT * FROM cssd_trays WHERE tenant_id=$1 ORDER BY id DESC LIMIT 500', [t.tenantId])).rows);

    } catch (e) {

        if (e.code === '42P01' || e.code === '42703') return res.json([]);

        res.status(500).json({ error: 'Server error' });

    }

});

router.post('/api/cssd/trays', requireAuth, requireRole('cssd', 'nursing', 'surgery'), requireTenantScope, async (req, res) => {

    try {

        const t = e16RequireTenant(req);

        if (!t.ok) return res.status(403).json({ error: 'Tenant scope required' });

        const r = (await pool.query(

            'INSERT INTO cssd_trays (tray_code, set_id, cycle_id, department, status, notes, created_by, tenant_id, facility_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *',

            [String(req.body.tray_code || ''), e16.e16IntId(req.body.set_id), e16.e16IntId(req.body.cycle_id), String(req.body.department || ''), 'packed', String(req.body.notes || ''), req.session.user?.display_name || '', t.tenantId, t.facilityId || null])).rows[0];

        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_CSSD_TRAY', 'CSSD', `Created tray ${r.tray_code} (#${r.id})`, req.ip);

        res.json(r);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.put('/api/cssd/trays/:id/issue', requireAuth, requireRole('cssd', 'nursing', 'surgery'), requireTenantScope, async (req, res) => {

    try {

        const t = e16RequireTenant(req);

        if (!t.ok) return res.status(403).json({ error: 'Tenant scope required' });

        const trayId = e16.e16IntId(req.params.id);

        if (trayId === null) return res.status(404).json({ error: 'Tray not found' });

        const client = await e16BeginTenantTx(t.tenantId);

        try {

            const tray = (await client.query('SELECT id, status, cycle_id FROM cssd_trays WHERE id=$1 AND tenant_id=$2 FOR UPDATE', [trayId, t.tenantId])).rows[0];

            if (!tray) { await client.query('ROLLBACK'); client.release(); return res.status(404).json({ error: 'Tray not found' }); }

            if (tray.status !== 'sterile') {

                await client.query('ROLLBACK'); client.release();

                return res.status(409).json({ error: 'Tray not sterile-released', status: tray.status });

            }

            // defence-in-depth: re-confirm the parent cycle BI gate still holds at issue time

            if (!tray.cycle_id) {

                // cycle deleted (ON DELETE SET NULL) — a tray without a verifiable cycle must not be issued

                await client.query('ROLLBACK'); client.release();

                return res.status(409).json({ error: 'cycle_missing' });

            }

            {

                const cyc = (await client.query('SELECT status, bi_test_result, ci_result, released_for_issue FROM cssd_sterilization_cycles WHERE id=$1 AND tenant_id=$2', [tray.cycle_id, t.tenantId])).rows[0];

                const gate = cyc ? e16.canIssueSterileLoad(String(cyc.status || '').toLowerCase(), cyc.bi_test_result, cyc.ci_result) : { allowed: false, reason: 'cycle_missing' };

                if (!gate.allowed || !cyc.released_for_issue) {

                    await client.query('ROLLBACK'); client.release();

                    return res.status(409).json({ error: 'Sterile issue blocked', reason: gate.reason || 'not_released' });

                }

            }

            const r = (await client.query(

                "UPDATE cssd_trays SET status='issued', issued_to=$1, issued_at=now(), used_in_surgery_id=$2 WHERE id=$3 AND tenant_id=$4 RETURNING *",

                [String(req.body.issued_to || ''), e16.e16IntId(req.body.used_in_surgery_id), trayId, t.tenantId])).rows[0];

            await client.query('COMMIT'); client.release();

            logAudit(req.session.user?.id, req.session.user?.display_name, 'CSSD_ISSUE_TRAY', 'CSSD', `Issued sterile tray #${trayId} to ${req.body.issued_to || 'n/a'}`, req.ip);

            res.json(r);

        } catch (e) { try { await client.query('ROLLBACK'); } catch (_) {} client.release(); throw e; }

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});


    return router;
}
