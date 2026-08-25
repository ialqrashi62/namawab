'use strict';
// Wave 121 — Tenant catalog overrides (custom pricing for lab tests, radiology, services)
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const VALID_OVERRIDE_TYPE = ['service','lab_test','radiology_study'];

function priceVariance(customPrice, baselinePrice) {
    if (customPrice === undefined || customPrice === null || baselinePrice === undefined || baselinePrice === null) return null;
    const diff = parseFloat(customPrice) - parseFloat(baselinePrice);
    return {
        absolute: Math.round(diff * 100) / 100,
        percent: parseFloat(baselinePrice) > 0 ? Math.round((diff / parseFloat(baselinePrice)) * 1000) / 10 : null
    };
}

function priceValidity(customPrice) {
    if (customPrice === undefined || customPrice === null) return 'unset';
    if (parseFloat(customPrice) < 0) return 'invalid';
    if (parseFloat(customPrice) === 0) return 'free';
    return 'set';
}

function bulkSavings(overrideCount, avgSavings) {
    if (!overrideCount || overrideCount === 0) return 0;
    return Math.round(overrideCount * (avgSavings || 0) * 100) / 100;
}

function taxInclusive(price, rate) {
    if (price === undefined || price === null) return null;
    const r = parseFloat(rate || 0.15);
    return Math.round(parseFloat(price) * (1 + r) * 100) / 100;
}

function taxExclusive(priceWithVat, rate) {
    if (priceWithVat === undefined || priceWithVat === null) return null;
    const r = parseFloat(rate || 0.15);
    return Math.round((parseFloat(priceWithVat) / (1 + r)) * 100) / 100;
}

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true,
        version: '1.0.0',
        module: 'tenant-overrides',
        endpoints: [
            'GET /lab/overrides',
            'POST /lab/overrides',
            'GET /radiology/overrides',
            'POST /radiology/overrides',
            'GET /service/overrides',
            'POST /service/overrides',
            'GET /overrides/summary',
            'GET /price-variance',
            'GET /tax-inclusive',
            'GET /tax-exclusive',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

// ===== LAB TEST OVERRIDES =====
router.get('/lab/overrides', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { test_id, is_active, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM tenant_lab_test_overrides WHERE tenant_id = $1`;
        if (test_id) { sql += ` AND test_id = $${params.length + 1}`; params.push(parseInt(test_id)); }
        if (is_active !== undefined) { sql += ` AND is_active = $${params.length + 1}`; params.push(parseInt(is_active)); }
        sql += ` ORDER BY test_id LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/lab/overrides', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { test_id, custom_price, is_active } = req.body;
        if (!test_id) return res.status(400).json({ ok: false, error: 'test_id_required' });
        if (custom_price !== undefined && custom_price < 0) return res.status(400).json({ ok: false, error: 'invalid_custom_price' });

        const r = await db.query(
            `INSERT INTO tenant_lab_test_overrides (tenant_id, test_id, custom_price, is_active)
             VALUES ($1,$2,$3,$4) RETURNING *`,
            [req.tenantId, parseInt(test_id), custom_price ?? null, is_active === undefined ? 1 : (is_active ? 1 : 0)]
        );
        res.status(201).json({ ok: true, override: r.rows[0], computed: { price_validity: priceValidity(custom_price), tax_inclusive_15pct: taxInclusive(custom_price, 0.15) } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== RADIOLOGY OVERRIDES =====
router.get('/radiology/overrides', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { radiology_id, is_active, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM tenant_radiology_overrides WHERE tenant_id = $1`;
        if (radiology_id) { sql += ` AND radiology_id = $${params.length + 1}`; params.push(parseInt(radiology_id)); }
        if (is_active !== undefined) { sql += ` AND is_active = $${params.length + 1}`; params.push(parseInt(is_active)); }
        sql += ` ORDER BY radiology_id LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/radiology/overrides', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { radiology_id, custom_price, custom_template, is_active } = req.body;
        if (!radiology_id) return res.status(400).json({ ok: false, error: 'radiology_id_required' });
        if (custom_price !== undefined && custom_price < 0) return res.status(400).json({ ok: false, error: 'invalid_custom_price' });

        const r = await db.query(
            `INSERT INTO tenant_radiology_overrides (tenant_id, radiology_id, custom_price, custom_template, is_active)
             VALUES ($1,$2,$3,$4,$5) RETURNING *`,
            [req.tenantId, parseInt(radiology_id), custom_price ?? null, custom_template || null,
             is_active === undefined ? 1 : (is_active ? 1 : 0)]
        );
        res.status(201).json({ ok: true, override: r.rows[0], computed: { price_validity: priceValidity(custom_price), tax_inclusive_15pct: taxInclusive(custom_price, 0.15) } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== SERVICE OVERRIDES =====
router.get('/service/overrides', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { service_id, is_active, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM tenant_service_overrides WHERE tenant_id = $1`;
        if (service_id) { sql += ` AND service_id = $${params.length + 1}`; params.push(parseInt(service_id)); }
        if (is_active !== undefined) { sql += ` AND is_active = $${params.length + 1}`; params.push(parseInt(is_active)); }
        sql += ` ORDER BY service_id LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/service/overrides', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { service_id, custom_price, is_active } = req.body;
        if (!service_id) return res.status(400).json({ ok: false, error: 'service_id_required' });
        if (custom_price !== undefined && custom_price < 0) return res.status(400).json({ ok: false, error: 'invalid_custom_price' });

        const r = await db.query(
            `INSERT INTO tenant_service_overrides (tenant_id, service_id, custom_price, is_active)
             VALUES ($1,$2,$3,$4) RETURNING *`,
            [req.tenantId, parseInt(service_id), custom_price ?? null, is_active === undefined ? 1 : (is_active ? 1 : 0)]
        );
        res.status(201).json({ ok: true, override: r.rows[0], computed: { price_validity: priceValidity(custom_price), tax_inclusive_15pct: taxInclusive(custom_price, 0.15) } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== SUMMARY =====
router.get('/overrides/summary', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const lab = await db.query(`SELECT COUNT(*) AS count, AVG(custom_price) AS avg_price FROM tenant_lab_test_overrides WHERE tenant_id = $1 AND is_active = 1`, [req.tenantId]);
        const rad = await db.query(`SELECT COUNT(*) AS count, AVG(custom_price) AS avg_price FROM tenant_radiology_overrides WHERE tenant_id = $1 AND is_active = 1`, [req.tenantId]);
        const svc = await db.query(`SELECT COUNT(*) AS count, AVG(custom_price) AS avg_price FROM tenant_service_overrides WHERE tenant_id = $1 AND is_active = 1`, [req.tenantId]);
        res.json({
            ok: true,
            lab_overrides: { count: parseInt(lab.rows[0].count), avg_price: parseFloat(lab.rows[0].avg_price || 0) },
            radiology_overrides: { count: parseInt(rad.rows[0].count), avg_price: parseFloat(rad.rows[0].avg_price || 0) },
            service_overrides: { count: parseInt(svc.rows[0].count), avg_price: parseFloat(svc.rows[0].avg_price || 0) }
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== UTILITIES =====
router.get('/price-variance', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { custom_price, baseline_price } = req.query;
        if (custom_price === undefined || baseline_price === undefined) return res.status(400).json({ ok: false, error: 'both_prices_required' });
        res.json({ ok: true, variance: priceVariance(parseFloat(custom_price), parseFloat(baseline_price)) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/tax-inclusive', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { price, rate } = req.query;
        if (price === undefined) return res.status(400).json({ ok: false, error: 'price_required' });
        res.json({ ok: true, net_price: parseFloat(price), vat_rate: parseFloat(rate || 0.15), gross_price: taxInclusive(price, rate) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/tax-exclusive', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { price_with_vat, rate } = req.query;
        if (price_with_vat === undefined) return res.status(400).json({ ok: false, error: 'price_with_vat_required' });
        res.json({ ok: true, gross_price: parseFloat(price_with_vat), vat_rate: parseFloat(rate || 0.15), net_price: taxExclusive(price_with_vat, rate) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const lab = await db.query(`SELECT is_active, COUNT(*) AS count FROM tenant_lab_test_overrides WHERE tenant_id = $1 GROUP BY is_active`, [req.tenantId]);
        const rad = await db.query(`SELECT is_active, COUNT(*) AS count FROM tenant_radiology_overrides WHERE tenant_id = $1 GROUP BY is_active`, [req.tenantId]);
        const svc = await db.query(`SELECT is_active, COUNT(*) AS count FROM tenant_service_overrides WHERE tenant_id = $1 GROUP BY is_active`, [req.tenantId]);
        res.json({ ok: true, lab_overrides: lab.rows, radiology_overrides: rad.rows, service_overrides: svc.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
