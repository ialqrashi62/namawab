// filepath: namaweb/saas_billing_router.js
// SaaS subscription + plan management + tenant billing overview.
// Read-mostly. Tenant-scoped.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// ============================================================
// GET /api/saas-billing/plans — public catalog (no auth required)
// ============================================================
router.get('/plans', async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, code, name, name_ar, description, price_sar, billing_period,
                   max_users, max_patients, features
            FROM plans
            WHERE active = TRUE
            ORDER BY price_sar ASC
        `);
        res.json({ ok: true, plans: r.rows, currency: 'SAR' });
    } catch (err) {
        console.error('GET /api/saas-billing/plans', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// ============================================================
// GET /api/saas-billing/tenant/overview — current tenant's subscription status
// ============================================================
router.get('/tenant/overview', requireAuth, requireTenantScope, requireRole('admin', 'owner'), async (req, res) => {
    try {
        // Current plan assignment
        const subRes = await db.query(`
            SELECT s.id, s.plan_id, s.status, s.started_at, s.expires_at, s.billing_cycle,
                   p.code, p.name, p.name_ar, p.price_sar, p.max_users, p.max_patients, p.features
            FROM saas_billing_subscriptions s
            LEFT JOIN plans p ON p.id = s.plan_id
            WHERE s.tenant_id = $1
            ORDER BY s.started_at DESC LIMIT 1
        `, [req.tenantId]);

        // Current usage
        const usageRes = await db.query(`
            SELECT
                (SELECT COUNT(*) FROM users WHERE tenant_id = $1) as users_count,
                (SELECT COUNT(*) FROM patients WHERE tenant_id = $1) as patients_count,
                (SELECT COUNT(*) FROM appointments WHERE tenant_id = $1 AND appt_date >= date_trunc('month', CURRENT_DATE)) as monthly_appointments
        `, [req.tenantId]);

        // Last 5 invoices
        const invRes = await db.query(`
            SELECT id, invoice_number, amount, vat, total, status, issued_at, paid_at
            FROM invoices
            WHERE tenant_id = $1
            ORDER BY issued_at DESC LIMIT 5
        `, [req.tenantId]);

        const sub = subRes.rows[0] || null;
        const usage = usageRes.rows[0];

        res.json({
            ok: true,
            tenant_id: req.tenantId,
            subscription: sub ? {
                id: sub.id,
                plan_code: sub.code,
                plan_name: sub.name,
                plan_name_ar: sub.name_ar,
                status: sub.status,
                started_at: sub.started_at,
                expires_at: sub.expires_at,
                billing_cycle: sub.billing_cycle,
                price_sar: sub.price_sar,
                features: sub.features
            } : null,
            usage: {
                users: +usage.users_count,
                patients: +usage.patients_count,
                monthly_appointments: +usage.monthly_appointments,
                users_limit: sub?.max_users,
                patients_limit: sub?.max_patients
            },
            utilization: sub ? {
                users_pct: sub.max_users ? +((usage.users_count / sub.max_users) * 100).toFixed(1) : null,
                patients_pct: sub.max_patients ? +((usage.patients_count / sub.max_patients) * 100).toFixed(1) : null
            } : null,
            recent_invoices: invRes.rows
        });
    } catch (err) {
        console.error('GET /api/saas-billing/tenant/overview', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// ============================================================
// POST /api/saas-billing/tenant/subscribe
// Body: { plan_code }
// Activates a plan for the current tenant.
// ============================================================
router.post('/tenant/subscribe', requireAuth, requireTenantScope, requireRole('admin', 'owner'), async (req, res) => {
    try {
        const { plan_code } = req.body;
        if (!plan_code) return res.status(400).json({ error: 'missing_plan_code' });
        const planRes = await db.query(`SELECT * FROM plans WHERE code = $1 AND active = TRUE`, [plan_code]);
        if (planRes.rows.length === 0) return res.status(404).json({ error: 'plan_not_found' });
        const plan = planRes.rows[0];
        // Cancel any active sub
        await db.query(`UPDATE saas_billing_subscriptions SET status = 'cancelled', expires_at = NOW() WHERE tenant_id = $1 AND status = 'active'`, [req.tenantId]);
        // Create new sub
        const subRes = await db.query(`
            INSERT INTO saas_billing_subscriptions (tenant_id, plan_id, status, started_at, expires_at, billing_cycle)
            VALUES ($1, $2, 'active', NOW(), NOW() + INTERVAL '30 days', 'monthly')
            RETURNING id, status, started_at, expires_at
        `, [req.tenantId, plan.id]);
        // Assign plan to tenant
        try {
            await db.query(`
                INSERT INTO tenant_plan_assignments (tenant_id, plan_id, assigned_at, assigned_by)
                VALUES ($1, $2, NOW(), $3)
                ON CONFLICT (tenant_id, plan_id) DO NOTHING
            `, [req.tenantId, plan.id, req.userId]);
        } catch (e) { /* table may not exist */ }
        res.status(201).json({ ok: true, subscription_id: subRes.rows[0].id, plan: { code: plan.code, name: plan.name, price_sar: plan.price_sar } });
    } catch (err) {
        console.error('POST /api/saas-billing/tenant/subscribe', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// ============================================================
// GET /api/saas-billing/invoices
// ============================================================
router.get('/invoices', requireAuth, requireTenantScope, requireRole('admin', 'owner'), async (req, res) => {
    try {
        const limit = Math.min(+req.query.limit || 20, 100);
        const r = await db.query(`
            SELECT id, invoice_number, amount, vat, total, status, issued_at, paid_at, due_date
            FROM invoices WHERE tenant_id = $1
            ORDER BY issued_at DESC LIMIT $2
        `, [req.tenantId, limit]);
        res.json({ ok: true, total: r.rows.length, invoices: r.rows });
    } catch (err) {
        console.error('GET /api/saas-billing/invoices', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// ============================================================
// GET /api/saas-billing/entitlements — what this tenant can access
// ============================================================
router.get('/entitlements', requireAuth, requireTenantScope, (req, res) => {
    try {
        // Try plan_entitlements table
        db.query(`
            SELECT pe.feature_key, pe.feature_value, p.code as plan_code
            FROM plan_entitlements pe
            JOIN plans p ON p.id = pe.plan_id
            JOIN tenant_plan_assignments tpa ON tpa.plan_id = p.id
            WHERE tpa.tenant_id = $1 AND p.active = TRUE
        `, [req.tenantId]).then(r => {
            res.json({ ok: true, entitlements: r.rows });
        }).catch(() => {
            // Fallback: return default module list
            res.json({ ok: true, entitlements: [
                { feature_key: 'core.clinical', feature_value: true, plan_code: 'default' },
                { feature_key: 'core.appointments', feature_value: true, plan_code: 'default' },
                { feature_key: 'core.patient_portal', feature_value: true, plan_code: 'default' }
            ], note: 'Default entitlements (plan_entitlements table may not be seeded)' });
        });
    } catch (err) {
        console.error('GET /api/saas-billing/entitlements', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// ============================================================
// GET /api/saas-billing/health
// ============================================================
router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true,
        version: '1.0.0',
        endpoints: ['plans (public)', 'tenant/overview', 'tenant/subscribe', 'invoices', 'entitlements'],
        currency: 'SAR',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;