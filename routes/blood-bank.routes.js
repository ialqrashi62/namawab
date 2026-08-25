const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeBloodBankV2Router({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, e13RequireTenant, e13Respond }) {
    const router = express.Router();
router.get('/api/blood-bank/units', requireAuth, requireRole('bloodbank', 'lab', 'nursing', 'doctor'), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e13RequireTenant(req);

        const { status, blood_type } = req.query;

        const params = [tenantId]; const conds = ['tenant_id = $1'];

        if (status) { params.push(String(status)); conds.push(`status=$${params.length}`); }

        if (blood_type) { params.push(String(blood_type)); conds.push(`blood_type=$${params.length}`); }

        const q = `SELECT * FROM blood_bank_units WHERE ${conds.join(' AND ')} ORDER BY id DESC`;

        res.json((await pool.query(q, params)).rows);

    } catch (e) { e13Respond(res, e); }

});

router.post('/api/blood-bank/units', requireAuth, requireRole('bloodbank', 'lab'), requireTenantScope, (req, res) => {

    res.status(410).json({ error: 'Deprecated. Use POST /api/bloodbank/units (validated, tenant-stamped).' });

});

router.put('/api/blood-bank/units/:id', requireAuth, requireRole('bloodbank', 'lab'), requireTenantScope, (req, res) => {

    res.status(410).json({ error: 'Deprecated. Use /api/bloodbank/units/:id/discard|recall or /api/bloodbank/transfuse.' });

});

router.get('/api/blood-bank/donors', requireAuth, requireRole('bloodbank', 'lab'), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e13RequireTenant(req);

        res.json((await pool.query('SELECT * FROM blood_bank_donors WHERE tenant_id=$1 ORDER BY id DESC', [tenantId])).rows);

    } catch (e) { e13Respond(res, e); }

});

router.post('/api/blood-bank/donors', requireAuth, requireRole('bloodbank', 'lab'), requireTenantScope, (req, res) => {

    res.status(410).json({ error: 'Deprecated. Use POST /api/bloodbank/donors (tenant-stamped).' });

});

router.post('/api/blood-bank/crossmatch', requireAuth, requireRole('bloodbank', 'lab', 'doctor'), requireTenantScope, (req, res) => {

    res.status(410).json({ error: 'Deprecated. Use POST /api/bloodbank/crossmatch (server-side ABO/Rh compatibility).' });

});

router.get('/api/blood-bank/crossmatch', requireAuth, requireRole('bloodbank', 'lab', 'doctor', 'nursing'), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e13RequireTenant(req);

        res.json((await pool.query('SELECT * FROM blood_bank_crossmatch WHERE tenant_id=$1 ORDER BY id DESC', [tenantId])).rows);

    } catch (e) { e13Respond(res, e); }

});

router.get('/api/blood-bank/transfusions', requireAuth, requireRole('bloodbank', 'lab', 'nursing', 'doctor'), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e13RequireTenant(req);

        res.json((await pool.query('SELECT * FROM blood_bank_transfusions WHERE tenant_id=$1 ORDER BY id DESC', [tenantId])).rows);

    } catch (e) { e13Respond(res, e); }

});

router.get('/api/blood-bank/stats', requireAuth, requireRole('bloodbank', 'lab', 'nursing', 'doctor'), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e13RequireTenant(req);

        const total = (await pool.query("SELECT COUNT(*)::int as cnt FROM blood_bank_units WHERE status='Available' AND tenant_id=$1", [tenantId])).rows[0].cnt;

        // F4-FIX (legacy): added lower bound >= CURRENT_DATE so already-expired units are excluded from "Expiring Soon".

        const expiring = (await pool.query("SELECT COUNT(*)::int as cnt FROM blood_bank_units WHERE status='Available' AND tenant_id=$1 AND expiry_date <> '' AND expiry_date >= CURRENT_DATE::TEXT AND expiry_date <= (CURRENT_DATE + INTERVAL '7 days')::TEXT", [tenantId])).rows[0].cnt;

        const todayTransfusions = (await pool.query("SELECT COUNT(*)::int as cnt FROM blood_bank_transfusions WHERE tenant_id=$1 AND created_at::date = CURRENT_DATE", [tenantId])).rows[0].cnt;

        const byType = (await pool.query("SELECT blood_type, rh_factor, COUNT(*)::int as cnt FROM blood_bank_units WHERE status='Available' AND tenant_id=$1 GROUP BY blood_type, rh_factor ORDER BY blood_type", [tenantId])).rows;

        const totalDonors = (await pool.query('SELECT COUNT(*)::int as cnt FROM blood_bank_donors WHERE tenant_id=$1', [tenantId])).rows[0].cnt;

        const pendingCrossmatch = (await pool.query("SELECT COUNT(*)::int as cnt FROM blood_bank_crossmatch WHERE result='Pending' AND tenant_id=$1", [tenantId])).rows[0].cnt;

        res.json({ total, expiring, todayTransfusions, byType, totalDonors, pendingCrossmatch });

    } catch (e) { e13Respond(res, e); }

});

router.put('/api/blood-bank/crossmatch/:id', requireAuth, requireRole('bloodbank', 'lab'), requireTenantScope, (req, res) => {

    res.status(410).json({ error: 'Deprecated. Use PUT /api/bloodbank/crossmatch/:id/validate (server-side ABO/Rh).' });

});

router.post('/api/blood-bank/transfusions', requireAuth, requireRole('bloodbank', 'nursing', 'doctor'), requireTenantScope, (req, res) => {

    res.status(410).json({ error: 'Deprecated. Use POST /api/bloodbank/transfuse (transactional, ABO/Rh + expiry checked).' });

});


    return router;
}
