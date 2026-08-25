// filepath: namaweb/onboarding_router.js
// Tenant onboarding wizard endpoints.
// Multi-step: facility_type → facility_name → modules → admin user → complete
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const FACILITY_TYPES = [
    'medical_city', 'general_hospital', 'tertiary_hospital', 'specialized_hospital',
    'polyclinic', 'phc', 'specialty_center', 'diagnostic_center',
    'rehabilitation_center', 'dialysis_center', 'dental_center',
    'mental_health_center', 'home_healthcare_unit', 'mobile_clinic',
    'virtual_clinic', 'health_unit'
];

const TOTAL_STEPS = 5;

// GET /api/onboarding/state
router.get('/state', requireAuth, requireTenantScope, requireRole('admin', 'owner'), async (req, res) => {
    try {
        const r = await db.query(`SELECT * FROM tenant_onboarding WHERE tenant_id = $1`, [req.tenantId]);
        const row = r.rows[0] || null;
        res.json({
            ok: true,
            tenant_id: req.tenantId,
            total_steps: TOTAL_STEPS,
            current_step: row?.step || 1,
            completed: row?.completed || false,
            state: row
        });
    } catch (err) {
        console.error('GET /api/onboarding/state', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// POST /api/onboarding/facility
// Step 1: set facility type + name
router.post('/facility', requireAuth, requireTenantScope, requireRole('admin', 'owner'), async (req, res) => {
    try {
        const { facility_type, facility_name, facility_name_ar, branch_id } = req.body;
        if (!facility_type) return res.status(400).json({ error: 'missing_facility_type', valid: FACILITY_TYPES });
        if (!FACILITY_TYPES.includes(facility_type)) return res.status(400).json({ error: 'invalid_facility_type', valid: FACILITY_TYPES });
        await db.query(`
            INSERT INTO tenant_onboarding (tenant_id, step, facility_type, facility_name, facility_name_ar, branch_id, updated_at)
            VALUES ($1, 2, $2, $3, $4, $5, NOW())
            ON CONFLICT (tenant_id) DO UPDATE SET
                step = 2, facility_type = EXCLUDED.facility_type,
                facility_name = EXCLUDED.facility_name, facility_name_ar = EXCLUDED.facility_name_ar,
                branch_id = EXCLUDED.branch_id, updated_at = NOW()
        `, [req.tenantId, facility_type, facility_name || '', facility_name_ar || '', branch_id || null]);
        res.json({ ok: true, step: 2, next: 'modules' });
    } catch (err) {
        console.error('POST /api/onboarding/facility', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// POST /api/onboarding/modules
// Step 2: enable specific clinical modules
router.post('/modules', requireAuth, requireTenantScope, requireRole('admin', 'owner'), async (req, res) => {
    try {
        const { modules } = req.body;
        if (!Array.isArray(modules)) return res.status(400).json({ error: 'modules_must_be_array' });
        await db.query(`
            INSERT INTO tenant_onboarding (tenant_id, step, modules_enabled, updated_at)
            VALUES ($1, 3, $2, NOW())
            ON CONFLICT (tenant_id) DO UPDATE SET
                step = 3, modules_enabled = EXCLUDED.modules_enabled, updated_at = NOW()
        `, [req.tenantId, JSON.stringify(modules)]);
        res.json({ ok: true, step: 3, next: 'admin_user', modules_count: modules.length });
    } catch (err) {
        console.error('POST /api/onboarding/modules', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// POST /api/onboarding/admin
// Step 3: designate admin user (optional — first user created during tenant init)
router.post('/admin', requireAuth, requireTenantScope, requireRole('admin', 'owner'), async (req, res) => {
    try {
        const { admin_user_id } = req.body;
        if (!admin_user_id) return res.status(400).json({ error: 'missing_admin_user_id' });
        await db.query(`
            INSERT INTO tenant_onboarding (tenant_id, step, admin_user_id, updated_at)
            VALUES ($1, 4, $2, NOW())
            ON CONFLICT (tenant_id) DO UPDATE SET
                step = 4, admin_user_id = EXCLUDED.admin_user_id, updated_at = NOW()
        `, [req.tenantId, admin_user_id]);
        res.json({ ok: true, step: 4, next: 'complete' });
    } catch (err) {
        console.error('POST /api/onboarding/admin', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// POST /api/onboarding/complete
// Step 5: finalize onboarding
router.post('/complete', requireAuth, requireTenantScope, requireRole('admin', 'owner'), async (req, res) => {
    try {
        const r = await db.query(`
            UPDATE tenant_onboarding SET step = 5, completed = TRUE, completed_at = NOW(), updated_at = NOW()
            WHERE tenant_id = $1 RETURNING *
        `, [req.tenantId]);
        if (r.rows.length === 0) {
            // Create if not exists
            await db.query(`
                INSERT INTO tenant_onboarding (tenant_id, step, completed, completed_at)
                VALUES ($1, 5, TRUE, NOW())
            `, [req.tenantId]);
        }
        res.json({ ok: true, completed: true, step: 5, message: '🎉 Onboarding complete. Tenant is fully configured.' });
    } catch (err) {
        console.error('POST /api/onboarding/complete', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// GET /api/onboarding/catalog
// Return available facility types + recommended modules per type
router.get('/catalog', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true,
        facility_types: FACILITY_TYPES,
        recommended_modules: {
            'medical_city': ['cardiology', 'surgery', 'oncology', 'pediatrics', 'icu', 'er'],
            'general_hospital': ['cardiology', 'surgery', 'pediatrics', 'er'],
            'dental_center': ['dental', 'imaging'],
            'dialysis_center': ['dialysis', 'nephrology'],
            'mental_health_center': ['psychiatry', 'psychology'],
            'rehabilitation_center': ['physiotherapy', 'occupational_therapy'],
            'default': ['family_medicine']
        }
    });
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', total_steps: TOTAL_STEPS, facility_types: FACILITY_TYPES, timestamp: new Date().toISOString() });
});

module.exports = router;