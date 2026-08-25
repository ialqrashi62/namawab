// filepath: namaweb/hub_router.js
// Cross-dept Hub API: aggregated stats, all 62 dept health, summary
// Pattern: nm-router-middleware
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// All 62 dept names
const ALL_DEPTS = [
    'family_medicine', 'geriatrics', 'dental', 'ophthalmology', 'ent',
    'sports_medicine', 'neurology', 'orthopedics', 'surgery',
    'allergy', 'anesthesia', 'audiology', 'burn_unit', 'cardiac_rehab',
    'ccu', 'chaplaincy', 'cicu', 'ctu', 'dermatology', 'dialysis',
    'epilepsy', 'fetal_medicine', 'genetics', 'headache', 'hematology',
    'icu', 'immunology', 'infection_control', 'infectious_disease',
    'ivf', 'maternal_fetal', 'memory_clinic', 'movement', 'movement_disorders',
    'multiple_sclerosis', 'neonatology', 'neuro_oncology', 'neurosurgery',
    'nicu', 'nuclear_medicine', 'nutrition', 'occupational_therapy',
    'pain_management', 'palliative_care', 'pathology', 'physiotherapy',
    'picu', 'plastic_surgery', 'psychiatry', 'pulmonary_rehab', 'radiology',
    'rehabilitation', 'sleep_medicine', 'social_work', 'speech_therapy',
    'stroke_unit', 'thoracic_surgery', 'transplant', 'trauma_surgery',
    'urology', 'vascular_surgery', 'wound_care', 'cardiology', 'oncology'
];

// ============================================================
// GET /api/hub/overview
// Returns aggregated stats across all depts
// ============================================================
router.get('/overview', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const tid = req.tenantId;
        // Count assessments per dept
        const stats = await db.query(`
            SELECT dept, COUNT(*) as cnt
            FROM (
                SELECT 'family_medicine' as dept FROM family_medicine_assessments WHERE tenant_id = $1
                UNION ALL SELECT 'allergy' FROM allergy_assessments WHERE tenant_id = $1
                UNION ALL SELECT 'anesthesia' FROM anesthesia_assessments WHERE tenant_id = $1
                UNION ALL SELECT 'audiology' FROM audiology_assessments WHERE tenant_id = $1
                UNION ALL SELECT 'burn_unit' FROM burn_unit_assessments WHERE tenant_id = $1
                UNION ALL SELECT 'cardiac_rehab' FROM cardiac_rehab_assessments WHERE tenant_id = $1
                UNION ALL SELECT 'ccu' FROM ccu_assessments WHERE tenant_id = $1
                UNION ALL SELECT 'dermatology' FROM dermatology_assessments WHERE tenant_id = $1
                UNION ALL SELECT 'epilepsy' FROM epilepsy_assessments WHERE tenant_id = $1
                UNION ALL SELECT 'hematology' FROM hematology_assessments WHERE tenant_id = $1
                UNION ALL SELECT 'icu' FROM icu_assessments WHERE tenant_id = $1
                UNION ALL SELECT 'immunology' FROM immunology_assessments WHERE tenant_id = $1
                UNION ALL SELECT 'infectious_disease' FROM infectious_disease_assessments WHERE tenant_id = $1
                UNION ALL SELECT 'neurology' FROM neurology_assessments WHERE tenant_id = $1
                UNION ALL SELECT 'nutrition' FROM nutrition_assessments WHERE tenant_id = $1
                UNION ALL SELECT 'oncology' FROM oncology_assessments WHERE tenant_id = $1
                UNION ALL SELECT 'orthopedics' FROM orthopedics_assessments WHERE tenant_id = $1
                UNION ALL SELECT 'pediatrics' FROM pediatrics_assessments WHERE tenant_id = $1
                UNION ALL SELECT 'psychiatry' FROM psychiatry_assessments WHERE tenant_id = $1
                UNION ALL SELECT 'radiology' FROM radiology_assessments WHERE tenant_id = $1
                UNION ALL SELECT 'surgery' FROM surgery_assessments WHERE tenant_id = $1
            ) all_depts
            GROUP BY dept
            ORDER BY cnt DESC
        `, [tid]);

        const depts = {};
        for (const row of stats.rows) {
            depts[row.dept] = parseInt(row.cnt);
        }
        // Fill in zeros for depts with no assessments
        for (const dept of ALL_DEPTS) {
            if (!depts[dept]) depts[dept] = 0;
        }
        const total = Object.values(depts).reduce((a, b) => a + b, 0);
        res.json({
            ok: true,
            total_assessments: total,
            by_dept: depts,
            total_depts: ALL_DEPTS.length,
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        console.error('GET /api/hub/overview', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// ============================================================
// GET /api/hub/depts
// Returns list of all 62 depts with metadata
// ============================================================
router.get('/depts', async (req, res) => {
    const depts = ALL_DEPTS.map(d => ({
        code: d,
        path: `/api/${d}/health`,
        page: `/departments/${d}.html`
    }));
    res.json({ ok: true, total: depts.length, depts });
});

// ============================================================
// GET /api/hub/health
// Hub health endpoint
// ============================================================
router.get('/health', (req, res) => {
    res.json({
        ok: true,
        version: '1.0.0',
        total_depts: ALL_DEPTS.length,
        timestamp: new Date().toISOString()
    });
});

// ============================================================
// GET /api/hub/activity
// Recent assessments across all depts
// ============================================================
router.get('/activity', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const tid = req.tenantId;
        const limit = Math.min(+req.query.limit || 20, 100);
        const result = await db.query(`
            SELECT 'family_medicine' as dept, id, engine_name, score, risk_level, created_at
            FROM family_medicine_assessments WHERE tenant_id = $1
            UNION ALL
            SELECT 'allergy' as dept, id, engine_name, score, risk_level, created_at
            FROM allergy_assessments WHERE tenant_id = $1
            UNION ALL
            SELECT 'cardiology' as dept, id, engine_name, score, risk_level, created_at
            FROM cardiology_assessments WHERE tenant_id = $1
            UNION ALL
            SELECT 'surgery' as dept, id, engine_name, score, risk_level, created_at
            FROM surgery_assessments WHERE tenant_id = $1
            UNION ALL
            SELECT 'oncology' as dept, id, engine_name, score, risk_level, created_at
            FROM oncology_assessments WHERE tenant_id = $1
            ORDER BY created_at DESC
            LIMIT $2
        `, [tid, limit]);
        res.json({
            ok: true,
            total: result.rows.length,
            activity: result.rows
        });
    } catch (err) {
        console.error('GET /api/hub/activity', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// ============================================================
// GET /api/hub/settings — Get user settings
// ============================================================
router.get('/settings', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const result = await db.query(`
            SELECT setting_key, setting_value, updated_at
            FROM hub_user_settings
            WHERE tenant_id = $1 AND user_id = $2
        `, [req.tenantId, req.userId]);
        const settings = {};
        for (const row of result.rows) {
            settings[row.setting_key] = row.setting_value;
        }
        res.json({ ok: true, settings });
    } catch (err) {
        console.error('GET /api/hub/settings', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// ============================================================
// PUT /api/hub/settings/:key — Set a setting
// ============================================================
router.put('/settings/:key', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { key } = req.params;
        const value = req.body || {};
        await db.query(`
            INSERT INTO hub_user_settings (tenant_id, user_id, setting_key, setting_value, updated_at)
            VALUES ($1, $2, $3, $4, NOW())
            ON CONFLICT (tenant_id, user_id, setting_key)
            DO UPDATE SET setting_value = EXCLUDED.setting_value, updated_at = NOW()
        `, [req.tenantId, req.userId, key, JSON.stringify(value)]);
        res.json({ ok: true, key, value });
    } catch (err) {
        console.error('PUT /api/hub/settings', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// ============================================================
// GET /api/hub/favorites — Get user favorites
// ============================================================
router.get('/favorites', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const result = await db.query(`
            SELECT dept_code, created_at
            FROM hub_favorites
            WHERE tenant_id = $1 AND user_id = $2
            ORDER BY created_at DESC
        `, [req.tenantId, req.userId]);
        res.json({ ok: true, favorites: result.rows });
    } catch (err) {
        console.error('GET /api/hub/favorites', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// ============================================================
// POST /api/hub/favorites/:dept — Add favorite
// ============================================================
router.post('/favorites/:dept', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { dept } = req.params;
        await db.query(`
            INSERT INTO hub_favorites (tenant_id, user_id, dept_code)
            VALUES ($1, $2, $3)
            ON CONFLICT (tenant_id, user_id, dept_code) DO NOTHING
        `, [req.tenantId, req.userId, dept]);
        res.status(201).json({ ok: true, dept });
    } catch (err) {
        console.error('POST /api/hub/favorites', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// ============================================================
// DELETE /api/hub/favorites/:dept — Remove favorite
// ============================================================
router.delete('/favorites/:dept', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { dept } = req.params;
        await db.query(`
            DELETE FROM hub_favorites
            WHERE tenant_id = $1 AND user_id = $2 AND dept_code = $3
        `, [req.tenantId, req.userId, dept]);
        res.json({ ok: true, dept });
    } catch (err) {
        console.error('DELETE /api/hub/favorites', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

module.exports = router;
