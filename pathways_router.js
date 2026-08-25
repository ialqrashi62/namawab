'use strict';
// Wave 82 — Clinical Pathways: bilingual pathway catalog + step templates
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true,
        version: '1.0.0',
        module: 'pathways',
        endpoints: [
            'GET /pathways',
            'GET /pathways/:id',
            'POST /pathways',
            'PUT /pathways/:id',
            'DELETE /pathways/:id',
            'GET /pathways/by-department',
            'GET /pathways/:id/validate-steps',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

function validateSteps(steps) {
    if (!Array.isArray(steps)) return { valid: false, error: 'steps_must_be_array' };
    if (steps.length === 0) return { valid: false, error: 'steps_cannot_be_empty' };
    const required = ['order','name','type'];
    for (let i = 0; i < steps.length; i++) {
        const s = steps[i];
        for (const k of required) {
            if (!(k in s)) return { valid: false, error: `step_${i}_missing_${k}` };
        }
        if (typeof s.order !== 'number' || s.order < 1) return { valid: false, error: `step_${i}_order_invalid` };
        if (typeof s.name !== 'string' || !s.name.trim()) return { valid: false, error: `step_${i}_name_empty` };
        const validTypes = ['assessment','lab','imaging','medication','procedure','consult','education','discharge','milestone'];
        if (!validTypes.includes(s.type)) return { valid: false, error: `step_${i}_invalid_type`, valid_types: validTypes };
    }
    return { valid: true };
}

router.get('/pathways', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { department, active, code, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM clinical_pathways WHERE tenant_id = $1`;
        if (department) { sql += ` AND department = $${params.length + 1}`; params.push(department); }
        if (code) { sql += ` AND code = $${params.length + 1}`; params.push(code); }
        if (active !== undefined) { sql += ` AND active = $${params.length + 1}`; params.push(active === 'true'); }
        sql += ` ORDER BY department, code LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/pathways/:id', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const r = await db.query(`SELECT * FROM clinical_pathways WHERE tenant_id = $1 AND id = $2`, [req.tenantId, req.params.id]);
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'pathway_not_found' });
        res.json({ ok: true, pathway: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/pathways', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { code, name_en, name_ar, department, steps, description, version = '1.0', active = true } = req.body;
        if (!code) return res.status(400).json({ ok: false, error: 'code_required' });
        if (!name_en && !name_ar) return res.status(400).json({ ok: false, error: 'name_en_or_name_ar_required' });
        if (!department) return res.status(400).json({ ok: false, error: 'department_required' });

        const v = validateSteps(steps);
        if (!v.valid) return res.status(400).json({ ok: false, error: v.error, valid_types: v.valid_types });

        const r = await db.query(
            `INSERT INTO clinical_pathways (tenant_id, code, name_en, name_ar, department, steps, description, version, active, created_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [req.tenantId, code, name_en || null, name_ar || null, department, JSON.stringify(steps),
             description || null, version, active, req.user?.id || null]
        );
        res.status(201).json({ ok: true, pathway: r.rows[0] });
    } catch (e) {
        if (/duplicate/i.test(e.message)) return res.status(409).json({ ok: false, error: 'pathway_code_already_exists' });
        res.status(500).json({ ok: false, error: e.message });
    }
});

router.put('/pathways/:id', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const allowed = ['name_en','name_ar','department','description','version','active'];
        const sets = [];
        const params = [req.tenantId, req.params.id];
        let i = 3;
        for (const k of allowed) {
            if (k in req.body) { sets.push(`${k} = $${i++}`); params.push(req.body[k]); }
        }
        if ('steps' in req.body) {
            const v = validateSteps(req.body.steps);
            if (!v.valid) return res.status(400).json({ ok: false, error: v.error });
            sets.push(`steps = $${i++}`); params.push(JSON.stringify(req.body.steps));
        }
        if (!sets.length) return res.status(400).json({ ok: false, error: 'no_fields' });
        sets.push(`updated_at = NOW()`);
        const r = await db.query(
            `UPDATE clinical_pathways SET ${sets.join(', ')} WHERE tenant_id = $1 AND id = $2 RETURNING *`,
            params
        );
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'pathway_not_found' });
        res.json({ ok: true, pathway: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.delete('/pathways/:id', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const r = await db.query(
            `UPDATE clinical_pathways SET active = false, updated_at = NOW() WHERE tenant_id = $1 AND id = $2 RETURNING *`,
            [req.tenantId, req.params.id]
        );
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'pathway_not_found' });
        res.json({ ok: true, soft_deleted: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/pathways/by-department', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT department, COUNT(*) AS pathway_count, COUNT(*) FILTER (WHERE active = true) AS active_count,
                    array_agg(code ORDER BY code) AS codes
             FROM clinical_pathways WHERE tenant_id = $1 GROUP BY department ORDER BY department`,
            [req.tenantId]
        );
        res.json({ ok: true, departments: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/pathways/:id/validate-steps', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT steps FROM clinical_pathways WHERE tenant_id = $1 AND id = $2`,
            [req.tenantId, req.params.id]
        );
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'pathway_not_found' });
        let steps;
        try { steps = typeof r.rows[0].steps === 'string' ? JSON.parse(r.rows[0].steps) : r.rows[0].steps; }
        catch (e) { return res.status(500).json({ ok: false, error: 'invalid_json_steps' }); }
        const v = validateSteps(steps);
        res.json({ ok: true, valid: v.valid, error: v.error || null, step_count: Array.isArray(steps) ? steps.length : 0 });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT COUNT(*) AS total_pathways, COUNT(*) FILTER (WHERE active = true) AS active,
                    COUNT(DISTINCT department) AS unique_departments, COUNT(DISTINCT code) AS unique_codes
             FROM clinical_pathways WHERE tenant_id = $1`,
            [req.tenantId]
        );
        res.json({ ok: true, summary: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
