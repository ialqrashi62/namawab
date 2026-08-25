// filepath: namaweb/branding_router.js
// Tenant branding — colors, logo, facility name, contact info.
// Public GET for branding (read-only); admin-only PUT.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const DEFAULT_BRANDING = {
    primary_color: '#0f766e',
    secondary_color: '#14b8a6',
    accent_color: '#f59e0b',
    facility_name_en: 'NamaMedical',
    facility_name_ar: 'ناما ميديكال',
    tagline_en: 'Comprehensive Hospital Platform',
    tagline_ar: 'منصة مستشفى شاملة'
};

// GET /api/branding — public, no auth required (used by frontend before login)
router.get('/', async (req, res) => {
    try {
        const r = await db.query(`SELECT * FROM tenant_branding LIMIT 1`);
        const b = r.rows[0] || { ...DEFAULT_BRANDING };
        res.json({ ok: true, branding: b, default: r.rows.length === 0 });
    } catch (err) {
        console.error('GET /api/branding', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// PUT /api/branding — admin updates branding (creates row if none)
router.put('/', requireAuth, requireTenantScope, requireRole('admin', 'owner'), async (req, res) => {
    try {
        const fields = ['logo_url', 'favicon_url', 'primary_color', 'secondary_color', 'accent_color',
                        'facility_name_en', 'facility_name_ar', 'tagline_en', 'tagline_ar',
                        'contact_email', 'contact_phone', 'website', 'address_en', 'address_ar', 'custom_css'];
        const updates = [];
        const params = [req.tenantId];
        for (const f of fields) {
            if (req.body[f] !== undefined) {
                params.push(req.body[f]);
                updates.push(`${f} = $${params.length}`);
            }
        }
        if (updates.length === 0) return res.status(400).json({ error: 'no_fields_to_update' });
        const sql = `
            INSERT INTO tenant_branding (tenant_id, ${fields.join(',')}, updated_at)
            VALUES ($1, ${fields.map((_, i) => `$${i + 2}`).join(',')}, NOW())
            ON CONFLICT (tenant_id) DO UPDATE SET ${updates.join(', ')}, updated_at = NOW()
            RETURNING *
        `;
        // Build values list for INSERT (use NULL for missing)
        const insertVals = fields.map(f => req.body[f] !== undefined ? req.body[f] : null);
        const r = await db.query(`
            INSERT INTO tenant_branding (tenant_id, ${fields.map((f, i) => `${f}`).join(',')}, updated_at)
            VALUES ($1, ${fields.map((_, i) => `$${i + 2}`).join(',')}, NOW())
            ON CONFLICT (tenant_id) DO UPDATE SET ${updates.join(', ')}, updated_at = NOW()
            RETURNING *
        `, [req.tenantId, ...insertVals]);
        res.json({ ok: true, branding: r.rows[0] });
    } catch (err) {
        console.error('PUT /api/branding', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', defaults: DEFAULT_BRANDING, timestamp: new Date().toISOString() });
});

module.exports = router;