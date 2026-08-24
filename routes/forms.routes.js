const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function FormsRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }) {
    const router = express.Router();
router.get('/api/forms', requireAuth, async (req, res) => {

    try { res.json((await pool.query('SELECT * FROM form_templates WHERE is_active=1 ORDER BY id DESC')).rows); }

    catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/forms', requireAuth, async (req, res) => {

    try {

        const { template_name, department, form_fields } = req.body;

        const result = await pool.query('INSERT INTO form_templates (template_name, department, form_fields, created_by) VALUES ($1,$2,$3,$4) RETURNING id',

            [template_name || '', department || '', form_fields || '[]', req.session.user.name || '']);

        res.json((await pool.query('SELECT * FROM form_templates WHERE id=$1', [result.rows[0].id])).rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.delete('/api/forms/:id', requireAuth, async (req, res) => {

    try { await pool.query('UPDATE form_templates SET is_active=0 WHERE id=$1', [req.params.id]); res.json({ success: true }); }

    catch (e) { res.status(500).json({ error: 'Server error' }); }

});


    return router;
}
