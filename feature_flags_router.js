// filepath: namaweb/feature_flags_router.js
// Feature flags per tenant. Gradual rollout (rollout_pct), config JSONB.
'use strict';

const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const KNOWN_FLAGS = [
    { key: 'cds.drug_allergy',        description: 'Drug-allergy interaction alerts', default: true },
    { key: 'cds.sepsis_qsofa',         description: 'Sepsis qSOFA early warning', default: true },
    { key: 'cds.aki',                 description: 'AKI creatinine trend detection', default: true },
    { key: 'lab.critical_alerts',     description: 'Critical lab value notifications', default: true },
    { key: 'patient_portal.enabled',  description: 'Patient self-service portal', default: true },
    { key: 'telehealth.enabled',      description: 'Video consultation sessions', default: false },
    { key: 'pwa.install_prompt',      description: 'Mobile PWA install prompt', default: true },
    { key: 'notifications.sse',       description: 'Real-time SSE notifications', default: true },
    { key: 'audit.trail_enforced',    description: 'Audit trail on all mutations', default: true }
];

// GET /api/feature-flags — list all flags with current state
router.get('/', requireAuth, requireTenantScope, requireRole('admin', 'doctor', 'nurse'), async (req, res) => {
    try {
        const r = await db.query(`SELECT flag_key, enabled, config, rollout_pct, description, updated_at FROM feature_flags WHERE tenant_id = $1`, [req.tenantId]);
        const current = {};
        for (const row of r.rows) current[row.flag_key] = row;
        // Compute effective state (enabled AND in rollout)
        const effective = {};
        const hash = crypto.createHash('sha1').update(`${req.tenantId}:${req.userId}`).digest();
        const userBucket = parseInt(hash.toString('hex').slice(0, 4), 16) % 100;
        for (const def of KNOWN_FLAGS) {
            const stored = current[def.key];
            const enabled = stored ? stored.enabled : def.default;
            const rollout = stored ? stored.rollout_pct : 100;
            const inRollout = userBucket < rollout;
            effective[def.key] = {
                enabled: enabled && inRollout,
                config: stored?.config || {},
                rollout_pct: rollout,
                in_user_rollout: inRollout,
                description: stored?.description || def.description
            };
        }
        res.json({ ok: true, total: KNOWN_FLAGS.length, flags: effective, user_bucket: userBucket });
    } catch (err) {
        console.error('GET /api/feature-flags', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// POST /api/feature-flags — toggle a flag (admin/owner only)
router.post('/', requireAuth, requireTenantScope, requireRole('admin', 'owner'), async (req, res) => {
    try {
        const { flag_key, enabled, config, rollout_pct, description } = req.body;
        if (!flag_key) return res.status(400).json({ error: 'missing_flag_key' });
        const known = KNOWN_FLAGS.find(f => f.key === flag_key);
        if (!known) return res.status(400).json({ error: 'unknown_flag', known: KNOWN_FLAGS.map(f => f.key) });
        const r = await db.query(`
            INSERT INTO feature_flags (tenant_id, flag_key, enabled, config, rollout_pct, description, created_by, updated_at)
            VALUES ($1,$2,$3,$4,$5,$6,$7,NOW())
            ON CONFLICT (tenant_id, flag_key) DO UPDATE SET
                enabled = EXCLUDED.enabled, config = EXCLUDED.config,
                rollout_pct = EXCLUDED.rollout_pct, description = EXCLUDED.description,
                updated_at = NOW()
            RETURNING flag_key, enabled, rollout_pct
        `, [req.tenantId, flag_key, !!enabled, JSON.stringify(config || {}), Math.min(Math.max(rollout_pct || 100, 0), 100), description || known.description, req.userId]);
        res.json({ ok: true, ...r.rows[0] });
    } catch (err) {
        console.error('POST /api/feature-flags', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// GET /api/feature-flags/catalog — list all known flags
router.get('/catalog', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, flags: KNOWN_FLAGS });
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', known_flags: KNOWN_FLAGS.length, timestamp: new Date().toISOString() });
});

module.exports = router;